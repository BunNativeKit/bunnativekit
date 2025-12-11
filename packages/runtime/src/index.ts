/**
 * Load and execute pre-built native modules at runtime.
 * Supports FFI/NAPI bindings with optional subprocess isolation.
 * @module
 */

import type {
    ModuleManifest,
    LoadedModule,
    LoadOptions,
    IsolationMode,
    ErrorMode,
    BindingMethod,
    FFISymbolDef,
} from "@bunnativekit/types";
import { loadModuleManifest, resolveIsolationMode } from "@bunnativekit/schema";
import { loadModule as loadNativeModule } from "@bunnativekit/loader";
import { createIsolatedProcess, type IsolatedProcess } from "@bunnativekit/isolation";
import { isDev, getCurrentPlatformArch } from "@bunnativekit/platform";
import { getLogger } from "@bunnativekit/debug";
import { existsSync } from "fs";
import { join } from "path";

// types

export interface RuntimeLoadOptions extends LoadOptions {
    module: string;
    /** Skip manifest and load library directly */
    skipManifest?: boolean;
    /** Required when skipManifest is true */
    libraryPath?: string;
    /** Required when skipManifest is true */
    symbols?: Record<string, FFISymbolDef>;
}

export interface RuntimeModule<T extends Record<string, unknown> = Record<string, unknown>>
    extends LoadedModule<T> {
    readonly manifest: ModuleManifest | null;
}

// event emitter

type EventHandler<T> = (data: T) => void;

class ModuleEventEmitter {
    private handlers = new Map<string, Set<EventHandler<any>>>();

    on(event: string, handler: EventHandler<any>): void {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }
        this.handlers.get(event)!.add(handler);
    }

    off(event: string, handler: EventHandler<any>): void {
        this.handlers.get(event)?.delete(handler);
    }

    emit(event: string, data: any): void {
        for (const handler of this.handlers.get(event) ?? []) {
            try {
                handler(data);
            } catch (error) {
                console.error(`Event handler error:`, error);
            }
        }
    }
}

// module loader

const logger = getLogger();

/** Load a native module from path or manifest */
export async function loadModule<T extends Record<string, unknown> = Record<string, unknown>>(
    options: RuntimeLoadOptions
): Promise<RuntimeModule<T>> {
    const {
        module: modulePath,
        onError = "throw",
        isolation,
        timeout = 30000,
        skipManifest = false,
        libraryPath,
        symbols,
        debug,
    } = options;

    let manifest: ModuleManifest | null = null;
    let libPath: string;
    let binding: BindingMethod = "ffi";
    let moduleSymbols: Record<string, FFISymbolDef> = {};

    // Load manifest if not skipping
    if (!skipManifest) {
        manifest = await loadModuleManifest(modulePath);
        binding = manifest.binding?.prefer ?? "ffi";
        moduleSymbols = manifest.symbols ?? {};

        // Find library path
        const platformArch = getCurrentPlatformArch();
        const prebuiltPath = manifest.prebuilt?.[platformArch];

        if (prebuiltPath) {
            libPath = join(modulePath, prebuiltPath);
        } else {
            throw new Error(`No prebuilt binary for ${platformArch}`);
        }
    } else {
        if (!libraryPath) {
            throw new Error("libraryPath required when skipManifest is true");
        }
        libPath = libraryPath;
        moduleSymbols = symbols ?? {};
    }

    // Check library exists
    if (!existsSync(libPath)) {
        throw new Error(`Library not found: ${libPath}`);
    }

    // Determine isolation mode
    const resolvedIsolation = resolveIsolationMode(
        isolation ?? manifest?.isolation?.required ? "subprocess" : "auto",
        isDev()
    );

    const events = new ModuleEventEmitter();

    // Create the module based on isolation mode
    if (resolvedIsolation === "subprocess") {
        return createIsolatedModule<T>(
            libPath,
            binding,
            moduleSymbols,
            manifest,
            onError,
            timeout,
            events,
            debug?.enabled ?? false
        );
    } else {
        return createDirectModule<T>(
            libPath,
            binding,
            moduleSymbols,
            manifest,
            events,
            debug?.enabled ?? false
        );
    }
}

// direct module (no isolation)

function createDirectModule<T extends Record<string, unknown>>(
    libPath: string,
    binding: BindingMethod,
    symbols: Record<string, FFISymbolDef>,
    manifest: ModuleManifest | null,
    events: ModuleEventEmitter,
    debug: boolean
): RuntimeModule<T> {
    const mod = loadNativeModule({
        path: libPath,
        binding,
        ffiSymbols: binding === "ffi" ? symbols : undefined,
        debug,
    });

    logger.info("runtime", `Loaded module directly: ${manifest?.name ?? libPath}`);

    return {
        name: manifest?.name ?? "unknown",
        path: libPath,
        binding,
        isolated: false,
        manifest,

        async call(fn, ...args) {
            try {
                const result = mod.call(fn as string, ...args);
                events.emit("exit", { type: "success", data: result });
                return result as any;
            } catch (error) {
                events.emit("error", error);
                events.emit("exit", { type: "error", data: error });
                throw error;
            }
        },

        async close() {
            mod.close();
        },

        async restart() {
            // Direct modules can't restart
            throw new Error("Cannot restart direct module");
        },

        on: (event, handler) => events.on(event, handler),
    };
}

// isolated module (subprocess)

async function createIsolatedModule<T extends Record<string, unknown>>(
    libPath: string,
    binding: BindingMethod,
    symbols: Record<string, FFISymbolDef>,
    manifest: ModuleManifest | null,
    onError: ErrorMode,
    timeout: number,
    events: ModuleEventEmitter,
    debug: boolean
): Promise<RuntimeModule<T>> {
    const process = createIsolatedProcess({
        modulePath: libPath,
        binding,
        symbols,
        timeout,
        onError,
        debug,
    });

    // Wire up events
    process.on("error", (error) => events.emit("error", error));
    process.on("death", (code) => events.emit("death", code));
    process.on("exit", (evt) => events.emit("exit", evt));

    await process.start();

    logger.info("runtime", `Loaded module in subprocess: ${manifest?.name ?? libPath}`);

    return {
        name: manifest?.name ?? "unknown",
        path: libPath,
        binding,
        isolated: true,
        manifest,

        async call(fn, ...args) {
            return process.call(fn as string, ...args) as any;
        },

        async close() {
            await process.shutdown();
        },

        async restart() {
            await process.restart();
        },

        on: (event, handler) => events.on(event, handler),
    };
}

// re-exports

export { defineModule, defineConfig } from "@bunnativekit/types";
export type {
    ModuleManifest,
    ProjectConfig,
    LoadedModule,
    LoadOptions,
    FFISymbolDef,
} from "@bunnativekit/types";

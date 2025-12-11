/**
 * Worker subprocess that loads native modules and handles IPC calls.
 * Auto-loads modules from environment variables on startup.
 * @module
 */

import type { FFITypeString, FFISymbolDef } from "@bunnativekit/types";
import { dlopen, FFIType as BunFFIType } from "bun:ffi";

// ipc types

interface IPCRequest {
    id: number;
    type: "call";
    fn: string;
    args: unknown[];
}

interface IPCResponse {
    id: number;
    type: "result" | "error";
    value?: unknown;
    error?: string;
}

interface IPCLifecycle {
    type: "ready" | "shutdown";
    pid?: number;
}

interface IPCLoadModule {
    type: "load";
    id: number;
    path: string;
    symbols: Record<string, { args: FFITypeString[]; returns: FFITypeString }>;
}

type IPCMessage = IPCRequest | IPCResponse | IPCLifecycle | IPCLoadModule;

// state

interface LoadedModule {
    path: string;
    lib: ReturnType<typeof dlopen>;
    symbols: Record<string, Function>;
}

const loadedModules = new Map<string, LoadedModule>();
let defaultModulePath: string | null = null;

// ipc

function send(message: IPCResponse | IPCLifecycle): void {
    if (process.send) {
        process.send(message);
    } else {
        console.log(JSON.stringify(message)); // fallback for testing
    }
}

function handleMessage(message: IPCMessage): void {
    switch (message.type) {
        case "call":
            handleCall(message);
            break;

        case "load":
            handleLoadModule(message);
            break;

        case "shutdown":
            handleShutdown();
            break;

        default:
            break;
    }
}

// function calls

async function handleCall(message: IPCRequest): Promise<void> {
    const { id, fn: fnName, args } = message;

    try {
        let mod: LoadedModule | undefined;

        if (defaultModulePath) {
            mod = loadedModules.get(defaultModulePath);
        }

        if (!mod) {
            mod = loadedModules.values().next().value;
        }

        if (!mod) {
            throw new Error("No module loaded. Ensure module is configured correctly.");
        }

        const fn = mod.symbols[fnName];
        if (!fn) {
            const available = Object.keys(mod.symbols).join(", ");
            throw new Error(`Function not found: ${fnName}. Available: ${available || "none"}`);
        }

        const result = fn(...args);

        const resolvedResult = result instanceof Promise ? await result : result;

        send({
            type: "result",
            id,
            value: resolvedResult,
        });
    } catch (error) {
        send({
            type: "error",
            id,
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

// module loading

function loadModuleInternal(
    modulePath: string,
    symbolDefs: Record<string, { args: FFITypeString[]; returns: FFITypeString }>
): LoadedModule {
    const symbols: Record<string, any> = {};

    for (const [name, def] of Object.entries(symbolDefs)) {
        symbols[name] = {
            args: def.args.map(convertFFIType),
            returns: convertFFIType(def.returns),
        };
    }

    const lib = dlopen(modulePath, symbols);

    const loaded: LoadedModule = {
        path: modulePath,
        lib,
        symbols: lib.symbols as Record<string, Function>,
    };

    loadedModules.set(modulePath, loaded);

    return loaded;
}

function handleLoadModule(message: IPCLoadModule): void {
    const { id, path: modulePath, symbols: symbolDefs } = message;

    try {
        const loaded = loadModuleInternal(modulePath, symbolDefs);

        send({
            type: "result",
            id,
            value: Object.keys(loaded.symbols),
        });
    } catch (error) {
        send({
            type: "error",
            id,
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

/** Auto-load module from env vars on startup */
function loadFromEnvironment(): boolean {
    const modulePath = process.env.BNK_MODULE_PATH;
    const binding = process.env.BNK_BINDING;
    const symbolsJson = process.env.BNK_SYMBOLS;
    const debug = process.env.BNK_DEBUG === "1";

    if (!modulePath) {
        if (debug) {
            console.error("[worker] No BNK_MODULE_PATH set");
        }
        return false;
    }

    if (binding !== "ffi") {
        if (debug) {
            console.error(`[worker] Unsupported binding: ${binding}`);
        }
        return false;
    }

    try {
        const symbols = symbolsJson ? JSON.parse(symbolsJson) : {};

        const normalizedSymbols: Record<string, { args: FFITypeString[]; returns: FFITypeString }> = {};
        for (const [name, def] of Object.entries(symbols)) {
            const symDef = def as FFISymbolDef;
            normalizedSymbols[name] = {
                args: symDef.args,
                returns: symDef.returns,
            };
        }

        loadModuleInternal(modulePath, normalizedSymbols);
        defaultModulePath = modulePath;

        if (debug) {
            console.error(`[worker] Loaded module: ${modulePath}`);
            console.error(`[worker] Symbols: ${Object.keys(normalizedSymbols).join(", ")}`);
        }

        return true;
    } catch (error) {
        if (debug) {
            console.error(`[worker] Failed to load module: ${error}`);
        }
        return false;
    }
}

function convertFFIType(type: FFITypeString): BunFFIType {
    const mapping: Record<string, BunFFIType> = {
        void: BunFFIType.void,
        bool: BunFFIType.bool,
        char: BunFFIType.char,
        i8: BunFFIType.i8,
        i16: BunFFIType.i16,
        i32: BunFFIType.i32,
        i64: BunFFIType.i64,
        u8: BunFFIType.u8,
        u16: BunFFIType.u16,
        u32: BunFFIType.u32,
        u64: BunFFIType.u64,
        f32: BunFFIType.f32,
        f64: BunFFIType.f64,
        ptr: BunFFIType.ptr,
        cstring: BunFFIType.cstring,
        buffer: BunFFIType.ptr,
        function: BunFFIType.function,
        i64_fast: BunFFIType.i64_fast,
        u64_fast: BunFFIType.u64_fast,
    };

    return mapping[type] ?? BunFFIType.void;
}

// shutdown

function handleShutdown(): void {
    for (const [path, mod] of loadedModules) {
        try {
            mod.lib.close();
        } catch { } // ignore close errors
    }

    loadedModules.clear();
    defaultModulePath = null;

    process.exit(0);
}

// error handling

process.on("uncaughtException", (error) => {
    console.error("[worker] Uncaught exception:", error);
    send({
        type: "error",
        id: -1,
        error: `Uncaught exception: ${error.message}`,
    });
    setTimeout(() => process.exit(1), 100); // give time for error to be sent
});

process.on("unhandledRejection", (reason) => {
    console.error("[worker] Unhandled rejection:", reason);
    send({
        type: "error",
        id: -1,
        error: `Unhandled rejection: ${reason}`,
    });
});

process.on("SIGTERM", () => {
    handleShutdown();
});

process.on("SIGINT", () => {
    handleShutdown();
});

// main

process.on("message", (message: IPCMessage) => {
    handleMessage(message);
});

loadFromEnvironment();

send({ type: "ready", pid: process.pid });

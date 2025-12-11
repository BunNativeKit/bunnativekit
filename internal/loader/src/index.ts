/**
 * Native module loading via FFI, NAPI, and Bun's cc runtime compiler.
 * Provides unified interface for all binding methods.
 * @module
 */

import { dlopen, FFIType, ptr, read, type Pointer } from "bun:ffi";
import { existsSync } from "fs";
import type { FFISymbolDef, FFITypeString, BindingMethod } from "@bunnativekit/types";
import { getLogger, getTracer } from "@bunnativekit/debug";

// type conversion

/** Convert FFITypeString to bun:ffi FFIType */
function toFFIType(type: FFITypeString): FFIType {
    const typeMap: Record<FFITypeString, FFIType> = {
        void: FFIType.void,
        bool: FFIType.bool,
        char: FFIType.char,
        i8: FFIType.i8,
        i16: FFIType.i16,
        i32: FFIType.i32,
        i64: FFIType.i64,
        u8: FFIType.u8,
        u16: FFIType.u16,
        u32: FFIType.u32,
        u64: FFIType.u64,
        f32: FFIType.f32,
        f64: FFIType.f64,
        ptr: FFIType.ptr,
        cstring: FFIType.cstring,
        buffer: FFIType.ptr,
        function: FFIType.function,
        i64_fast: FFIType.i64_fast,
        u64_fast: FFIType.u64_fast,
    };
    return typeMap[type] ?? FFIType.void;
}

/** Convert symbol definitions to dlopen format */
function symbolsToFFI(
    symbols: Record<string, FFISymbolDef>
): Record<string, { args: FFIType[]; returns: FFIType }> {
    const result: Record<string, { args: FFIType[]; returns: FFIType }> = {};

    for (const [name, def] of Object.entries(symbols)) {
        const symbolName = def.symbol || name;
        result[symbolName] = {
            args: def.args.map(toFFIType),
            returns: toFFIType(def.returns),
        };
    }

    return result;
}

// ffi loader

export interface FFILoadOptions {
    path: string;
    symbols: Record<string, FFISymbolDef>;
    debug?: boolean;
}

export interface FFILibrary {
    call<T = unknown>(name: string, ...args: unknown[]): T;
    getSymbolNames(): string[];
    close(): void;
    readonly path: string;
}

/** Load a shared library via Bun's FFI */
export function loadFFI(options: FFILoadOptions): FFILibrary {
    const { path, symbols, debug } = options;
    const logger = getLogger();
    const tracer = getTracer();

    if (!existsSync(path)) {
        throw new Error(`Library not found: ${path}`);
    }

    const ffiSymbols = symbolsToFFI(symbols);

    const handle = dlopen(path, ffiSymbols);

    // user name -> actual symbol name
    const nameMap = new Map<string, string>();
    for (const [name, def] of Object.entries(symbols)) {
        nameMap.set(name, def.symbol || name);
    }

    logger.debug("loader", `Loaded FFI library: ${path}`, {
        symbols: Object.keys(symbols),
    });

    return {
        path,

        call<T = unknown>(name: string, ...args: unknown[]): T {
            const symbolName = nameMap.get(name);
            if (!symbolName) {
                throw new Error(`Symbol not found: ${name}`);
            }

            const fn = (handle.symbols as Record<string, Function>)[symbolName];
            if (!fn) {
                throw new Error(`Symbol not loaded: ${symbolName}`);
            }

            const end = debug ? tracer.start("ffi", `call:${name}`) : undefined;

            try {
                const result = fn(...args) as T;
                end?.();
                return result;
            } catch (error) {
                end?.();
                throw error;
            }
        },

        getSymbolNames(): string[] {
            return [...nameMap.keys()];
        },

        close(): void {
            try {
                handle.close();
                logger.debug("loader", `Closed FFI library: ${path}`);
            } catch {
                // Ignore close errors
            }
        },
    };
}

// napi loader

export interface NAPILoadOptions {
    /** Path to .node file */
    path: string;
    debug?: boolean;
}

export interface NAPIModule<T = Record<string, unknown>> {
    exports: T;
    getExportNames(): string[];
    /** No-op - NAPI modules can't be unloaded */
    close(): void;
    readonly path: string;
}

/** Load a native addon (.node file) via NAPI */
export function loadNAPI<T = Record<string, unknown>>(
    options: NAPILoadOptions
): NAPIModule<T> {
    const { path, debug } = options;
    const logger = getLogger();
    const tracer = getTracer();

    if (!existsSync(path)) {
        throw new Error(`Module not found: ${path}`);
    }

    const mod: { exports: T } = { exports: {} as T };
    process.dlopen(mod, path);

    const exportNames = Object.keys(mod.exports as Record<string, unknown>);

    logger.debug("loader", `Loaded NAPI module: ${path}`, {
        exports: exportNames,
    });

    if (debug) {
        const wrapped: Record<string, unknown> = {};

        for (const [name, value] of Object.entries(mod.exports as Record<string, unknown>)) {
            if (typeof value === "function") {
                const original = value as (...args: unknown[]) => unknown;
                wrapped[name] = function (...args: unknown[]) {
                    const end = tracer.start("napi", `call:${name}`);
                    try {
                        const result = original.apply(this, args);
                        if (result instanceof Promise) {
                            return result.finally(end);
                        }
                        end();
                        return result;
                    } catch (error) {
                        end();
                        throw error;
                    }
                };
            } else {
                wrapped[name] = value;
            }
        }

        mod.exports = wrapped as T;
    }

    return {
        exports: mod.exports,
        path,

        getExportNames(): string[] {
            return exportNames;
        },

        close(): void {
            // NAPI modules can't truly be unloaded
            logger.debug("loader", `Close called on NAPI module: ${path} (no-op)`);
        },
    };
}

// cc loader

export interface CCLoadOptions {
    source: string;
    symbols: Record<string, { args: FFITypeString[]; returns: FFITypeString }>;
    flags?: string[];
    define?: Record<string, string>;
    library?: string[];
    debug?: boolean;
}

export interface CCModule {
    symbols: Record<string, (...args: unknown[]) => unknown>;
    getSymbolNames(): string[];
    close(): void;
    readonly source: string;
}

/** Compile and load C code at runtime via Bun's cc */
export function loadCC(options: CCLoadOptions): CCModule {
    const { source, symbols, flags, define, library, debug } = options;
    const logger = getLogger();
    const tracer = getTracer();

    const { cc } = require("bun:ffi"); // dynamic import - cc may not be available

    const ccSymbols: Record<string, { args: string[]; returns: string }> = {};
    for (const [name, def] of Object.entries(symbols)) {
        ccSymbols[name] = {
            args: def.args,
            returns: def.returns,
        };
    }

    const compiled = cc({
        source,
        symbols: ccSymbols,
        flags,
        define,
        library,
    });

    const symbolNames = Object.keys(symbols);

    logger.debug("loader", "Compiled CC module", { symbols: symbolNames });

    const wrappedSymbols: Record<string, (...args: unknown[]) => unknown> = {};

    for (const name of symbolNames) {
        const fn = (compiled.symbols as Record<string, Function>)[name];

        if (debug) {
            wrappedSymbols[name] = (...args: unknown[]) => {
                const end = tracer.start("cc", `call:${name}`);
                try {
                    const result = fn(...args);
                    end();
                    return result;
                } catch (error) {
                    end();
                    throw error;
                }
            };
        } else {
            wrappedSymbols[name] = fn as (...args: unknown[]) => unknown;
        }
    }

    return {
        symbols: wrappedSymbols,
        source,

        getSymbolNames(): string[] {
            return symbolNames;
        },

        close(): void {
            try {
                compiled.close();
                logger.debug("loader", "Closed CC module");
            } catch {
                // Ignore
            }
        },
    };
}

// unified loader

export interface UnifiedLoadOptions {
    /** Path to module, or C source for cc binding */
    path: string;
    binding: BindingMethod;
    /** Required for ffi binding */
    ffiSymbols?: Record<string, FFISymbolDef>;
    /** Required for cc binding */
    ccConfig?: Omit<CCLoadOptions, "source">;
    debug?: boolean;
}

export interface UnifiedModule {
    readonly binding: BindingMethod;
    readonly path: string;
    call<T = unknown>(name: string, ...args: unknown[]): T;
    getFunctions(): string[];
    close(): void;
}

/** Load a native module - auto-selects FFI, NAPI, or cc based on binding type */
export function loadModule(options: UnifiedLoadOptions): UnifiedModule {
    const { path, binding, ffiSymbols, ccConfig, debug } = options;

    switch (binding) {
        case "ffi": {
            if (!ffiSymbols) {
                throw new Error("ffiSymbols required for FFI binding");
            }

            const lib = loadFFI({ path, symbols: ffiSymbols, debug });

            return {
                binding: "ffi",
                path,
                call: (name, ...args) => lib.call(name, ...args),
                getFunctions: () => lib.getSymbolNames(),
                close: () => lib.close(),
            };
        }

        case "napi": {
            const mod = loadNAPI({ path, debug });

            return {
                binding: "napi",
                path,
                call: (name, ...args) => {
                    const fn = (mod.exports as Record<string, unknown>)[name];
                    if (typeof fn !== "function") {
                        throw new Error(`Export ${name} is not a function`);
                    }
                    return fn(...args) as any;
                },
                getFunctions: () =>
                    mod.getExportNames().filter((n) => typeof (mod.exports as any)[n] === "function"),
                close: () => mod.close(),
            };
        }

        case "cc": {
            if (!ccConfig) {
                throw new Error("ccConfig required for CC binding");
            }

            const mod = loadCC({ source: path, ...ccConfig, debug });

            return {
                binding: "cc",
                path,
                call: (name, ...args) => {
                    const fn = mod.symbols[name];
                    if (!fn) {
                        throw new Error(`Symbol not found: ${name}`);
                    }
                    return fn(...args) as any;
                },
                getFunctions: () => mod.getSymbolNames(),
                close: () => mod.close(),
            };
        }

        default:
            throw new Error(`Unknown binding method: ${binding}`);
    }
}

/**
 * Compile and execute native code (Zig, C, C++, Rust) at runtime.
 * Parses exported symbols automatically - no manual FFI definitions needed.
 *
 * @example
 * ```ts
 * const result = await jit.zig(`
 *   export fn main(a: i32, b: i32) i32 { return a + b; }
 * `, 1, 2); // 3
 * ```
 * @module
 */

import type {
    SourceLanguage,
    FFISymbolDef,
    FFITypeString,
    JITOptions,
    JITModule,
    IsolationMode,
} from "@bunnativekit/types";
import { compile } from "@bunnativekit/compiler";
import { loadModule } from "@bunnativekit/loader";
import { createIsolatedProcess } from "@bunnativekit/isolation";
import { getCacheSubdir, hashContent, generateCacheKey } from "@bunnativekit/cache";
import { getCurrentPlatform, getPlatformInfo, isDev } from "@bunnativekit/platform";
import { getLogger } from "@bunnativekit/debug";
import { existsSync } from "fs";
import { join } from "path";

// types

export interface CompileOptions extends JITOptions {
    cache?: boolean;
}

export interface InlineOptions {
    isolation?: IsolationMode;
    cache?: boolean;
}

// symbol parsing

interface ParsedSymbol {
    name: string;
    args: FFITypeString[];
    returns: FFITypeString;
}

/** Parse Zig source to extract exported function symbols */
function parseZigSymbols(source: string): Record<string, FFISymbolDef> {
    const symbols: Record<string, FFISymbolDef> = {};
    const fnRegex = /(?:export|pub)\s+fn\s+(\w+)\s*\(([^)]*)\)\s*(\w+)/g;

    let match;
    while ((match = fnRegex.exec(source)) !== null) {
        const [, name, argsStr, returnType] = match;
        if (name.startsWith("_") || name === "main") continue; // skip internal/entry

        const args: FFITypeString[] = [];
        if (argsStr.trim()) {
            const argParts = argsStr.split(",");
            for (const arg of argParts) {
                const trimmed = arg.trim();
                if (!trimmed) continue;

                const colonIdx = trimmed.indexOf(":"); // name: type or just type
                const typeStr = colonIdx >= 0 ? trimmed.slice(colonIdx + 1).trim() : trimmed;
                const ffiType = zigTypeToFFI(typeStr);
                if (ffiType) {
                    args.push(ffiType);
                }
            }
        }

        const returns = zigTypeToFFI(returnType) || "void";

        symbols[name] = { args, returns };
    }

    return symbols;
}

/** Map Zig type to FFI type */
function zigTypeToFFI(zigType: string): FFITypeString | null {
    const typeMap: Record<string, FFITypeString> = {
        void: "void",
        bool: "bool",
        i8: "i8",
        i16: "i16",
        i32: "i32",
        i64: "i64",
        u8: "u8",
        u16: "u16",
        u32: "u32",
        u64: "u64",
        f32: "f32",
        f64: "f64",
        usize: "ptr",
        isize: "ptr",
        "[*c]u8": "cstring",
        "[*:0]u8": "cstring",
        "[*]u8": "ptr",
        "*anyopaque": "ptr",
        "?*anyopaque": "ptr",
    };

    const normalized = zigType.trim();
    if (typeMap[normalized]) {
        return typeMap[normalized];
    }

    if (normalized.startsWith("*") || normalized.startsWith("[*")) return "ptr";

    // Optional pointer
    if (normalized.startsWith("?*")) {
        return "ptr";
    }

    return null;
}

/** Parse C/C++ source to extract function symbols */
function parseCSymbols(source: string): Record<string, FFISymbolDef> {
    const symbols: Record<string, FFISymbolDef> = {};
    const exportRegex = /(?:EXPORT|extern\s+"C")\s+(\w+)\s+(\w+)\s*\(([^)]*)\)/g;
    const stdRegex = /^(?!static|inline)\s*(\w+)\s+(\w+)\s*\(([^)]*)\)\s*\{/gm;

    for (const regex of [exportRegex, stdRegex]) {
        let match;
        while ((match = regex.exec(source)) !== null) {
            const [, returnType, name, argsStr] = match;
            if (name.startsWith("_") || name === "main") continue; // skip internal/entry

            const args: FFITypeString[] = [];
            if (argsStr.trim() && argsStr.trim() !== "void") {
                const argParts = argsStr.split(",");
                for (const arg of argParts) {
                    const ffiType = cTypeToFFI(arg.trim());
                    if (ffiType) {
                        args.push(ffiType);
                    }
                }
            }

            const returns = cTypeToFFI(returnType) || "void";

            symbols[name] = { args, returns };
        }
    }

    return symbols;
}

/** Map C/C++ type to FFI type */
function cTypeToFFI(cType: string): FFITypeString | null {
    let normalized = cType // strip qualifiers
        .replace(/\bconst\b/g, "")
        .replace(/\bvolatile\b/g, "")
        .replace(/\brestrict\b/g, "")
        .trim();

    const parts = normalized.split(/\s+/);
    if (parts.length > 1) {
        const last = parts[parts.length - 1]; // might be var name, not type
        if (!["*", "int", "char", "short", "long", "float", "double", "void"].includes(last) && !last.includes("*")) {
            normalized = parts.slice(0, -1).join(" ");
        }
    }

    const typeMap: Record<string, FFITypeString> = {
        void: "void",
        bool: "bool",
        _Bool: "bool",
        char: "char",
        "signed char": "i8",
        "unsigned char": "u8",
        short: "i16",
        "short int": "i16",
        "signed short": "i16",
        "unsigned short": "u16",
        int: "i32",
        "signed int": "i32",
        "unsigned int": "u32",
        "unsigned": "u32",
        long: "i64",
        "long int": "i64",
        "long long": "i64",
        "unsigned long": "u64",
        "unsigned long long": "u64",
        float: "f32",
        double: "f64",
        int8_t: "i8",
        int16_t: "i16",
        int32_t: "i32",
        int64_t: "i64",
        uint8_t: "u8",
        uint16_t: "u16",
        uint32_t: "u32",
        uint64_t: "u64",
        size_t: "ptr",
        intptr_t: "ptr",
        uintptr_t: "ptr",
    };

    if (typeMap[normalized]) {
        return typeMap[normalized];
    }

    if (normalized.includes("*")) {
        if (normalized.includes("char") && normalized.includes("*")) { // char* -> cstring
            return "cstring";
        }
        return "ptr";
    }

    return null;
}

/** Parse Rust source to extract #[no_mangle] extern "C" symbols */
function parseRustSymbols(source: string): Record<string, FFISymbolDef> {
    const symbols: Record<string, FFISymbolDef> = {};
    const fnRegex = /#\[no_mangle\]\s*(?:pub\s+)?(?:unsafe\s+)?extern\s+"C"\s+fn\s+(\w+)\s*\(([^)]*)\)(?:\s*->\s*(\w+))?/g;
    const externBlockRegex = /extern\s+"C"\s*\{([^}]+)\}/g;

    let match;
    while ((match = fnRegex.exec(source)) !== null) {
        const [, name, argsStr, returnType] = match;
        if (name.startsWith("_")) continue; // skip internal

        const args: FFITypeString[] = [];
        if (argsStr.trim()) {
            const argParts = argsStr.split(",");
            for (const arg of argParts) {
                const trimmed = arg.trim();
                if (!trimmed) continue;

                const colonIdx = trimmed.indexOf(":");
                if (colonIdx >= 0) {
                    const typeStr = trimmed.slice(colonIdx + 1).trim();
                    const ffiType = rustTypeToFFI(typeStr);
                    if (ffiType) {
                        args.push(ffiType);
                    }
                }
            }
        }

        const returns = returnType ? (rustTypeToFFI(returnType) || "void") : "void";

        symbols[name] = { args, returns };
    }

    while ((match = externBlockRegex.exec(source)) !== null) {
        const blockContent = match[1];
        const fnDeclRegex = /fn\s+(\w+)\s*\(([^)]*)\)(?:\s*->\s*(\w+))?/g;

        let fnMatch;
        while ((fnMatch = fnDeclRegex.exec(blockContent)) !== null) {
            const [, name, argsStr, returnType] = fnMatch;

            if (name.startsWith("_") || symbols[name]) continue;

            const args: FFITypeString[] = [];
            if (argsStr.trim()) {
                const argParts = argsStr.split(",");
                for (const arg of argParts) {
                    const trimmed = arg.trim();
                    if (!trimmed) continue;

                    const colonIdx = trimmed.indexOf(":");
                    if (colonIdx >= 0) {
                        const typeStr = trimmed.slice(colonIdx + 1).trim();
                        const ffiType = rustTypeToFFI(typeStr);
                        if (ffiType) {
                            args.push(ffiType);
                        }
                    }
                }
            }

            const returns = returnType ? (rustTypeToFFI(returnType) || "void") : "void";
            symbols[name] = { args, returns };
        }
    }

    return symbols;
}

/** Map Rust type to FFI type */
function rustTypeToFFI(rustType: string): FFITypeString | null {
    const typeMap: Record<string, FFITypeString> = {
        "()": "void",
        bool: "bool",
        i8: "i8",
        i16: "i16",
        i32: "i32",
        i64: "i64",
        u8: "u8",
        u16: "u16",
        u32: "u32",
        u64: "u64",
        f32: "f32",
        f64: "f64",
        isize: "ptr",
        usize: "ptr",
        c_char: "char",
        c_int: "i32",
        c_uint: "u32",
        c_long: "i64",
        c_ulong: "u64",
        c_float: "f32",
        c_double: "f64",
        c_void: "void",
    };

    const normalized = rustType.trim();
    if (typeMap[normalized]) {
        return typeMap[normalized];
    }

    if (normalized.startsWith("*const") || normalized.startsWith("*mut")) {
        if (normalized.includes("c_char") || normalized.includes("i8")) { // c_char -> cstring
            return "cstring";
        }
        return "ptr";
    }

    if (normalized.startsWith("&")) return "ptr"; // refs are ptrs

    return null;
}

/** Parse source code and extract FFI symbols */
export function parseSymbols(source: string, lang: SourceLanguage): Record<string, FFISymbolDef> {
    switch (lang) {
        case "zig":
            return parseZigSymbols(source);
        case "c":
        case "cpp":
            return parseCSymbols(source);
        case "rust":
            return parseRustSymbols(source);
        default:
            return {};
    }
}

// jit compiler

const logger = getLogger();

/** LRU cache for JIT modules - prevents memory leaks */
class LRUCache<K, V> {
    private cache = new Map<K, V>();
    private readonly maxSize: number;

    constructor(maxSize: number = 100) {
        this.maxSize = maxSize;
    }

    get(key: K): V | undefined {
        const value = this.cache.get(key);
        if (value !== undefined) {
            this.cache.delete(key); // move to end (most recently used)
            this.cache.set(key, value);
        }
        return value;
    }

    set(key: K, value: V): void {
        if (this.cache.has(key)) this.cache.delete(key); // update position

        if (this.cache.size >= this.maxSize) { // evict oldest
            const firstKey = this.cache.keys().next().value;
            if (firstKey !== undefined) {
                const oldValue = this.cache.get(firstKey);
                this.cache.delete(firstKey);
                if (oldValue && typeof (oldValue as any).close === "function") {
                    try { (oldValue as any).close(); } catch { } // free resources
                }
            }
        }

        this.cache.set(key, value);
    }

    has(key: K): boolean {
        return this.cache.has(key);
    }

    delete(key: K): boolean {
        return this.cache.delete(key);
    }

    clear(): void {
        for (const value of this.cache.values()) {
            if (value && typeof (value as any).close === "function") {
                try { (value as any).close(); } catch { } // free resources
            }
        }
        this.cache.clear();
    }

    get size(): number {
        return this.cache.size;
    }
}

const memoryCache = new LRUCache<string, JITModule>(100);

/**
 * Compile native code just-in-time. Symbols parsed from source if not provided.
 *
 * @example
 * ```ts
 * const lib = await jit.compile({ lang: "zig", source: `export fn add(a: i32, b: i32) i32 { return a + b; }` });
 * lib.call("add", 1, 2); // 3
 * ```
 */
export async function compileJIT(options: CompileOptions): Promise<JITModule> {
    const { lang, source, symbols: providedSymbols, isolation = "auto", cache = true } = options;
    const sourceHash = hashContent(source);
    const cacheKey = generateCacheKey(`jit-${lang}`, sourceHash);

    if (cache) {
        const cached = memoryCache.get(cacheKey);
        if (cached) {
            logger.debug("jit", "Using memory-cached module");
            return cached;
        }
    }

    const cacheDir = getCacheSubdir("jit");
    const platformInfo = getPlatformInfo();
    const cachedLibPath = join(cacheDir, `${cacheKey}${platformInfo.sharedExt}`);

    let libPath: string;

    if (cache && existsSync(cachedLibPath)) {
        logger.debug("jit", "Using disk-cached module");
        libPath = cachedLibPath;
    } else {
        const tempDir = getCacheSubdir("jit-temp");
        const ext = getExtension(lang);
        const sourcePath = join(tempDir, `${cacheKey}${ext}`);

        await Bun.write(sourcePath, source);

        const result = await compile(
            {
                source: sourcePath,
                language: lang,
                optimization: "speed",
                outName: cacheKey,
            },
            {
                sourceRoot: tempDir,
                outputDir: cacheDir,
            }
        );

        if (!result.success) {
            throw new Error(`JIT compilation failed: ${result.error}`);
        }

        libPath = result.outputPath!;
        logger.info("jit", `Compiled ${lang} module: ${libPath}`);
    }

    const symbols = providedSymbols || parseSymbols(source, lang);

    if (Object.keys(symbols).length === 0) {
        logger.warn("jit", "No symbols found - module will have no callable functions");
    }

    const useIsolation = isolation === "subprocess" || (isolation === "auto" && isDev());
    let module: JITModule;

    if (useIsolation && Object.keys(symbols).length > 0) {
        const proc = createIsolatedProcess({
            modulePath: libPath,
            binding: "ffi",
            symbols,
            timeout: 30000,
            onError: "throw",
        });

        await proc.start();

        module = {
            call: (fn, ...args) => proc.call(fn, ...args) as any,
            close: () => proc.shutdown(),
        };
    } else {
        const mod = loadModule({
            path: libPath,
            binding: "ffi",
            ffiSymbols: symbols,
        });

        module = {
            call: (fn, ...args) => mod.call(fn, ...args),
            close: () => mod.close(),
        };
    }

    if (cache) {
        memoryCache.set(cacheKey, module);
    }

    return module;
}

// inline execution

/** Execute inline Zig code - calls the `main` function with args */
export async function inlineZig(source: string, ...args: unknown[]): Promise<unknown> {
    return inlineExec("zig", source, args);
}

/** Execute inline C code - calls the `main` function with args */
export async function inlineC(source: string, ...args: unknown[]): Promise<unknown> {
    return inlineExec("c", source, args);
}

/** Execute inline C++ code - calls the `main` function with args */
export async function inlineCpp(source: string, ...args: unknown[]): Promise<unknown> {
    return inlineExec("cpp", source, args);
}

/** Execute inline Rust code - calls #[no_mangle] extern "C" fn main with args */
export async function inlineRust(source: string, ...args: unknown[]): Promise<unknown> {
    return inlineExec("rust", source, args);
}

async function inlineExec(
    lang: SourceLanguage,
    source: string,
    args: unknown[]
): Promise<unknown> {
    const argTypes = args.map((arg) => { // infer types from JS values
        if (typeof arg === "number") {
            return Number.isInteger(arg) ? "i32" : "f64";
        }
        if (typeof arg === "string") {
            return "cstring";
        }
        if (typeof arg === "boolean") {
            return "bool";
        }
        return "ptr";
    });

    const symbols: Record<string, FFISymbolDef> = {
        main: { args: argTypes as any, returns: "i32" }, // assume i32 return
    };

    const module = await compileJIT({
        lang,
        source,
        symbols,
        cache: true,
    });

    try {
        return module.call("main", ...args);
    } finally { } // don't close - cached
}

// tagged templates

/** Tagged template for Zig - parses symbols automatically */
export function zigTemplate(
    strings: TemplateStringsArray,
    ...values: unknown[]
): Promise<JITModule> {
    const source = strings.reduce((acc, str, i) => {
        return acc + str + (values[i] ?? "");
    }, "");

    const symbols = parseZigSymbols(source);

    return compileJIT({
        lang: "zig",
        source,
        symbols,
    });
}

/** Tagged template for C - parses symbols automatically */
export function cTemplate(
    strings: TemplateStringsArray,
    ...values: unknown[]
): Promise<JITModule> {
    const source = strings.reduce((acc, str, i) => {
        return acc + str + (values[i] ?? "");
    }, "");

    const symbols = parseCSymbols(source);

    return compileJIT({
        lang: "c",
        source,
        symbols,
    });
}

/** Tagged template for C++ - parses symbols automatically */
export function cppTemplate(
    strings: TemplateStringsArray,
    ...values: unknown[]
): Promise<JITModule> {
    const source = strings.reduce((acc, str, i) => {
        return acc + str + (values[i] ?? "");
    }, "");

    const symbols = parseCSymbols(source);

    return compileJIT({
        lang: "cpp",
        source,
        symbols,
    });
}

/** Tagged template for Rust - parses symbols automatically */
export function rustTemplate(
    strings: TemplateStringsArray,
    ...values: unknown[]
): Promise<JITModule> {
    const source = strings.reduce((acc, str, i) => {
        return acc + str + (values[i] ?? "");
    }, "");

    const symbols = parseRustSymbols(source);

    return compileJIT({
        lang: "rust",
        source,
        symbols,
    });
}

// helpers

function getExtension(lang: SourceLanguage): string {
    switch (lang) {
        case "zig":
            return ".zig";
        case "c":
            return ".c";
        case "cpp":
            return ".cpp";
        case "rust":
            return ".rs";
    }
}

// safe result wrapper

/** Result type for safe error handling */
export class SafeResult<T, E = Error> {
    private constructor(
        private readonly _value: T | undefined,
        private readonly _error: E | undefined
    ) { }

    static ok<T>(value: T): SafeResult<T, never> {
        return new SafeResult(value, undefined) as SafeResult<T, never>;
    }

    static err<E>(error: E): SafeResult<never, E> {
        return new SafeResult(undefined, error) as SafeResult<never, E>;
    }

    isOk(): this is SafeResult<T, never> {
        return this._error === undefined;
    }

    isError(): this is SafeResult<never, E> {
        return this._error !== undefined;
    }

    unwrap(): T {
        if (this._error !== undefined) {
            throw this._error;
        }
        return this._value as T;
    }

    unwrapOr(defaultValue: T): T {
        return this._error === undefined ? (this._value as T) : defaultValue;
    }

    unwrapErr(): E {
        if (this._error === undefined) {
            throw new Error("Called unwrapErr on Ok value");
        }
        return this._error;
    }

    map<U>(fn: (value: T) => U): SafeResult<U, E> {
        if (this._error !== undefined) {
            return SafeResult.err(this._error);
        }
        return SafeResult.ok(fn(this._value as T));
    }

    get value(): T | undefined {
        return this._value;
    }

    get error(): E | undefined {
        return this._error;
    }
}

/** Wrap a value or promise in a SafeResult */
export function safeUse<T>(valueOrPromise: T): SafeResult<T, Error>;
export function safeUse<T>(valueOrPromise: Promise<T>): Promise<SafeResult<T, Error>>;
export function safeUse<T>(
    valueOrPromise: T | Promise<T>
): SafeResult<T, Error> | Promise<SafeResult<T, Error>> {
    if (valueOrPromise instanceof Promise) {
        return valueOrPromise
            .then((v) => SafeResult.ok(v))
            .catch((e) => SafeResult.err(e instanceof Error ? e : new Error(String(e))));
    }
    return SafeResult.ok(valueOrPromise);
}

/** Execute Zig safely, returning a SafeResult */
export async function safeZig(source: string, ...args: unknown[]): Promise<SafeResult<unknown, Error>> {
    try {
        const result = await inlineZig(source, ...args);
        return SafeResult.ok(result);
    } catch (e) {
        return SafeResult.err(e instanceof Error ? e : new Error(String(e)));
    }
}

export async function safeC(source: string, ...args: unknown[]): Promise<SafeResult<unknown, Error>> {
    try {
        const result = await inlineC(source, ...args);
        return SafeResult.ok(result);
    } catch (e) {
        return SafeResult.err(e instanceof Error ? e : new Error(String(e)));
    }
}

export async function safeCpp(source: string, ...args: unknown[]): Promise<SafeResult<unknown, Error>> {
    try {
        const result = await inlineCpp(source, ...args);
        return SafeResult.ok(result);
    } catch (e) {
        return SafeResult.err(e instanceof Error ? e : new Error(String(e)));
    }
}

export async function safeRust(source: string, ...args: unknown[]): Promise<SafeResult<unknown, Error>> {
    try {
        const result = await inlineRust(source, ...args);
        return SafeResult.ok(result);
    } catch (e) {
        return SafeResult.err(e instanceof Error ? e : new Error(String(e)));
    }
}

// cache management

/** Clear the JIT memory cache and close all modules */
export function clearCache(): void {
    memoryCache.clear();
    logger.info("jit", "Cleared memory cache");
}

/** Get current memory cache size */
export function getCacheSize(): number {
    return memoryCache.size;
}

// exports

export const jit = {
    compile: compileJIT,
    zig: inlineZig,
    c: inlineC,
    cpp: inlineCpp,
    rust: inlineRust,
    zigTemplate,
    cTemplate,
    cppTemplate,
    rustTemplate,
    safeZig,
    safeC,
    safeCpp,
    safeRust,
    parseSymbols,
    clearCache,
    getCacheSize,
};

export default jit;

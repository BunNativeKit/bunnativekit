/**
 * Shared type definitions for BunNativeKit.
 * FFI types, platform info, module manifests, and configuration interfaces.
 * @module
 */

// ffi types

/** FFI type strings supported by bun:ffi */
export type FFITypeString =
    | "void"
    | "bool"
    | "char"
    | "i8"
    | "i16"
    | "i32"
    | "i64"
    | "u8"
    | "u16"
    | "u32"
    | "u64"
    | "f32"
    | "f64"
    | "ptr"
    | "cstring"
    | "buffer"
    | "function"
    | "i64_fast"
    | "u64_fast";

export type FFIType = FFITypeString;

/** FFI symbol definition for dlopen */
export interface FFISymbolDef {
    args: FFITypeString[];
    returns: FFITypeString;
    /** Actual symbol name if different from key */
    symbol?: string;
    description?: string;
}

/** NAPI symbol definition */
export interface NAPISymbolDef {
    async?: boolean;
    description?: string;
}

// platform types

export type TargetPlatform = "linux" | "darwin" | "windows";
export type TargetArch = "x64" | "arm64";
export type PlatformArch = `${TargetPlatform}-${TargetArch}`;

/** Platform-specific paths and extensions */
export interface PlatformInfo {
    /** e.g., ".so", ".dylib", ".dll" */
    sharedExt: string;
    napiExt: string;
    /** "lib" on unix, "" on windows */
    libPrefix: string;
    zigTarget: string;
}

// binding types

export type BindingMethod = "ffi" | "napi" | "cc";

export interface BindingConfig {
    prefer: BindingMethod;
    fallback?: BindingMethod;
}

// isolation types

export type IsolationMode = "subprocess" | "thread" | "direct" | "auto";

export interface IsolationConfig {
    mode: IsolationMode;
    /** Timeout in ms */
    timeout?: number;
    autoRestart?: boolean;
    maxRestarts?: number;
}

/** IPC message types for subprocess isolation */
export type IPCMessage =
    | { type: "ready" }
    | { type: "call"; id: string; fn: string; args: any[] }
    | { type: "result"; id: string; value: any }
    | { type: "error"; id: string; error: string }
    | { type: "shutdown" };

// error handling types

export type ErrorMode = "throw" | "null" | "event";

export interface ErrorConfig {
    mode: ErrorMode;
    /** Log errors even when not throwing */
    log?: boolean;
}

// cache types

export interface CacheConfig {
    enabled: boolean;
    /** Custom cache directory (defaults to system cache) */
    dir?: string;
    /** Max size in bytes */
    maxSize?: number;
    /** TTL in ms */
    ttl?: number;
}

// debug types

export type DebugLevel = "none" | "error" | "warn" | "info" | "debug" | "trace";

export interface DebugConfig {
    enabled?: boolean;
    level?: DebugLevel;
    tracing?: boolean;
    tracePath?: string;
    /** Capture diagnostics for debugging */
    diagnostics?: boolean;
}

// build types

export type SourceLanguage = "zig" | "c" | "cpp" | "rust";
export type OptimizationLevel = "none" | "size" | "speed" | "aggressive" | "safe";

export interface BuildConfig {
    source: string;
    outDir?: string;
    /** Filename without extension */
    outName?: string;
    language?: SourceLanguage;
    optimization?: OptimizationLevel;
    /** For cross-compilation */
    platform?: TargetPlatform;
    /** For cross-compilation */
    arch?: TargetArch;
    flags?: string[];
    includes?: string[];
    libs?: string[];
    libPaths?: string[];
}

export interface BuildResult {
    success: boolean;
    outputPath?: string;
    durationMs?: number;
    error?: string;
    stdout?: string;
    stderr?: string;
}

// module manifest (module.bnk.ts)

/** Describes a BNK native module */
export interface ModuleManifest {
    name: string;
    version: string;
    /** Source file path */
    entry: string;
    description?: string;
    author?: string;
    license?: string;
    repository?: string;

    binding?: BindingConfig;

    isolation?: {
        required?: boolean;
        /** Use worker thread instead of subprocess */
        thread?: boolean;
    };

    /** FFI symbol definitions */
    symbols?: Record<string, FFISymbolDef>;
    /** NAPI exports (when binding is napi) */
    napiExports?: Record<string, NAPISymbolDef>;
    /** Prebuilt binaries per platform */
    prebuilt?: Partial<Record<PlatformArch, string>>;

    /** Min compatible BNK version */
    minCompat?: string;
    /** Max compatible BNK version */
    maxCompat?: string;
    /** Required system binaries (e.g., "zig", "clang") */
    requiredBins?: string[];
}

// project config (bnk.config.ts)

export interface ProjectConfig {
    isolation?: IsolationMode;
    cache?: CacheConfig;
    debug?: DebugConfig;
    onError?: ErrorMode;
    /** Module paths to build */
    modules?: string[];
    build?: Partial<BuildConfig>;
}

// runtime types

/** A loaded native module */
export interface LoadedModule<T extends Record<string, unknown> = Record<string, unknown>> {
    readonly name: string;
    readonly path: string;
    readonly binding: BindingMethod;
    readonly isolated: boolean;

    call<K extends keyof T>(fn: K, ...args: Parameters<T[K] extends (...args: any[]) => any ? T[K] : never>): Promise<ReturnType<T[K] extends (...args: any[]) => any ? T[K] : never>>;
    close(): Promise<void>;
    /** Only works if isolated */
    restart(): Promise<void>;

    on(event: "error", handler: (error: Error) => void): void;
    on(event: "death", handler: (exitCode: number) => void): void;
    on(event: "exit", handler: (event: { type: "success" | "error" | "death"; data?: unknown }) => void): void;
}

export interface LoadOptions {
    onError?: ErrorMode;
    isolation?: IsolationMode;
    timeout?: number;
    debug?: DebugConfig;
}

// jit types

export interface JITOptions {
    lang: SourceLanguage;
    source: string;
    /** For type-safe calls */
    symbols?: Record<string, FFISymbolDef>;
    isolation?: IsolationMode;
    cache?: boolean;
}

export interface JITModule {
    call<T = unknown>(fn: string, ...args: unknown[]): T;
    close(): void;
}

// aot types

export interface AOTOptions {
    source: string;
    output: string;
    generateTypes?: boolean;
    watch?: boolean;
    build?: Partial<BuildConfig>;
}

export interface AOTResult {
    success: boolean;
    outputs: {
        library: string;
        types?: string;
        meta?: string;
    };
    error?: string;
}

// helper functions

/** Define a module manifest with type checking */
export function defineModule(manifest: ModuleManifest): ModuleManifest {
    return manifest;
}

/** Define project config with type checking */
export function defineConfig(config: ProjectConfig): ProjectConfig {
    return config;
}

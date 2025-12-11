/**
 * Native code compilation for Zig, C/C++, and Rust.
 * Uses Zig as the primary toolchain with cross-compilation support.
 * @module
 */

import { existsSync, mkdirSync } from "fs";
import { join, dirname, basename, isAbsolute } from "path";
import type {
    SourceLanguage,
    OptimizationLevel,
    BuildConfig,
    BuildResult,
    TargetPlatform,
    TargetArch,
} from "@bunnativekit/types";
import {
    getCurrentPlatform,
    getCurrentArch,
    getZigTarget,
    getPlatformInfo,
    isZigInstalled,
    isCrossCompile,
} from "@bunnativekit/platform";

// optimization flags

const ZIG_OPTIMIZATION: Record<OptimizationLevel, string> = {
    none: "Debug",
    size: "ReleaseSmall",
    speed: "ReleaseFast",
    aggressive: "ReleaseFast",
    safe: "ReleaseSafe",
};

const CC_OPTIMIZATION: Record<OptimizationLevel, string[]> = {
    none: ["-O0", "-g"],
    size: ["-Os"],
    speed: ["-O3"],
    aggressive: ["-O3", "-ffast-math", "-march=native"],
    safe: ["-O2"],
};

// compile options

export interface CompileOptions {
    sourceRoot: string;
    outputDir: string;
    platform?: TargetPlatform;
    arch?: TargetArch;
    force?: boolean;
    verbose?: boolean;
}

// zig compiler

export class ZigCompiler {
    async isAvailable(): Promise<boolean> {
        return isZigInstalled();
    }

    async getVersion(): Promise<string | null> {
        try {
            const proc = Bun.spawn(["zig", "version"], {
                stdout: "pipe",
                stderr: "pipe",
            });
            const stdout = await new Response(proc.stdout).text();
            const exitCode = await proc.exited;
            return exitCode === 0 ? stdout.trim() : null;
        } catch {
            return null;
        }
    }

    buildCommand(config: BuildConfig, options: CompileOptions): string[] {
        const platform = options.platform ?? getCurrentPlatform();
        const arch = options.arch ?? getCurrentArch();
        const platformInfo = getPlatformInfo(platform);
        const optimization = config.optimization ?? "speed";

        const ext = platformInfo.sharedExt;
        const outName = config.outName ?? basename(config.source, ".zig");
        const outPath = join(
            options.outputDir,
            `${platformInfo.libPrefix}${outName}${ext}`
        );

        const cmd: string[] = ["zig", "build-lib"];

        const sourcePath = isAbsolute(config.source)
            ? config.source
            : join(options.sourceRoot, config.source);
        cmd.push(sourcePath);

        cmd.push("-dynamic");

        cmd.push(`-O${ZIG_OPTIMIZATION[optimization]}`);

        if (isCrossCompile(platform, arch)) {
            const target = getZigTarget(arch, platform);
            cmd.push("-target", target);
        }

        cmd.push(`-femit-bin=${outPath}`);

        if (optimization !== "none") {
            cmd.push("-fstrip"); // strip debug symbols in release
        }

        if (config.flags) {
            cmd.push(...config.flags);
        }

        if (config.includes) {
            for (const inc of config.includes) {
                const incPath = isAbsolute(inc) ? inc : join(options.sourceRoot, inc);
                cmd.push(`-I${incPath}`);
            }
        }

        return cmd;
    }

    async compile(config: BuildConfig, options: CompileOptions): Promise<BuildResult> {
        const startTime = Date.now();

        if (!existsSync(options.outputDir)) {
            mkdirSync(options.outputDir, { recursive: true });
        }

        const cmd = this.buildCommand(config, options);

        if (options.verbose) {
            console.log(`[zig] $ ${cmd.join(" ")}`);
        }

        try {
            const proc = Bun.spawn(cmd, {
                stdout: "pipe",
                stderr: "pipe",
                cwd: options.sourceRoot,
            });

            const [stdout, stderr, exitCode] = await Promise.all([
                new Response(proc.stdout).text(),
                new Response(proc.stderr).text(),
                proc.exited,
            ]);

            const platform = options.platform ?? getCurrentPlatform();
            const platformInfo = getPlatformInfo(platform);
            const ext = platformInfo.sharedExt;
            const outName = config.outName ?? basename(config.source, ".zig");
            const outputPath = join(
                options.outputDir,
                `${platformInfo.libPrefix}${outName}${ext}`
            );

            if (exitCode !== 0) {
                return {
                    success: false,
                    error: stderr || "Compilation failed",
                    stdout,
                    stderr,
                    durationMs: Date.now() - startTime,
                };
            }

            return {
                success: true,
                outputPath,
                stdout,
                stderr,
                durationMs: Date.now() - startTime,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error),
                durationMs: Date.now() - startTime,
            };
        }
    }
}

// zig as c/c++ compiler

/** Uses Zig's bundled clang for C/C++ compilation */
export class ZigCC {
    private mode: "c" | "cpp";

    constructor(mode: "c" | "cpp" = "c") {
        this.mode = mode;
    }

    async isAvailable(): Promise<boolean> {
        return isZigInstalled();
    }

    buildCommand(config: BuildConfig, options: CompileOptions): string[] {
        const platform = options.platform ?? getCurrentPlatform();
        const arch = options.arch ?? getCurrentArch();
        const platformInfo = getPlatformInfo(platform);
        const optimization = config.optimization ?? "speed";

        const sourceExt = config.source.split(".").pop() || "";
        const ext = platformInfo.sharedExt;
        const outName = config.outName ?? basename(config.source).replace(/\.[^.]+$/, "");
        const outPath = join(
            options.outputDir,
            `${platformInfo.libPrefix}${outName}${ext}`
        );

        const cmd: string[] = ["zig", this.mode === "cpp" ? "c++" : "cc"];

        cmd.push("-shared", "-fPIC");
        cmd.push(...CC_OPTIMIZATION[optimization]);

        if (isCrossCompile(platform, arch)) {
            const target = getZigTarget(arch, platform);
            cmd.push("-target", target);
        }

        if (config.includes) {
            for (const inc of config.includes) {
                const incPath = isAbsolute(inc) ? inc : join(options.sourceRoot, inc);
                cmd.push(`-I${incPath}`);
            }
        }

        if (config.flags) {
            cmd.push(...config.flags);
        }

        cmd.push("-o", outPath);

        const sourcePath = isAbsolute(config.source)
            ? config.source
            : join(options.sourceRoot, config.source);
        cmd.push(sourcePath);

        if (config.libs) {
            for (const lib of config.libs) {
                cmd.push(`-l${lib}`);
            }
        }

        if (config.libPaths) {
            for (const path of config.libPaths) {
                cmd.push(`-L${path}`);
            }
        }

        return cmd;
    }

    async compile(config: BuildConfig, options: CompileOptions): Promise<BuildResult> {
        const startTime = Date.now();

        if (!existsSync(options.outputDir)) {
            mkdirSync(options.outputDir, { recursive: true });
        }

        const cmd = this.buildCommand(config, options);

        if (options.verbose) {
            console.log(`[zig ${this.mode}] $ ${cmd.join(" ")}`);
        }

        try {
            const proc = Bun.spawn(cmd, {
                stdout: "pipe",
                stderr: "pipe",
                cwd: options.sourceRoot,
            });

            const [stdout, stderr, exitCode] = await Promise.all([
                new Response(proc.stdout).text(),
                new Response(proc.stderr).text(),
                proc.exited,
            ]);

            const platform = options.platform ?? getCurrentPlatform();
            const platformInfo = getPlatformInfo(platform);
            const ext = platformInfo.sharedExt;
            const outName = config.outName ?? basename(config.source).replace(/\.[^.]+$/, "");
            const outputPath = join(
                options.outputDir,
                `${platformInfo.libPrefix}${outName}${ext}`
            );

            if (exitCode !== 0) {
                return {
                    success: false,
                    error: stderr || "Compilation failed",
                    stdout,
                    stderr,
                    durationMs: Date.now() - startTime,
                };
            }

            return {
                success: true,
                outputPath,
                stdout,
                stderr,
                durationMs: Date.now() - startTime,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error),
                durationMs: Date.now() - startTime,
            };
        }
    }
}

// rust compiler

export class RustCompiler {
    async isAvailable(): Promise<boolean> {
        try {
            const proc = Bun.spawn(["rustc", "--version"], {
                stdout: "pipe",
                stderr: "pipe",
            });
            const exitCode = await proc.exited;
            return exitCode === 0;
        } catch {
            return false;
        }
    }

    async getVersion(): Promise<string | null> {
        try {
            const proc = Bun.spawn(["rustc", "--version"], {
                stdout: "pipe",
                stderr: "pipe",
            });
            const stdout = await new Response(proc.stdout).text();
            const exitCode = await proc.exited;
            return exitCode === 0 ? stdout.trim() : null;
        } catch {
            return null;
        }
    }

    buildCommand(config: BuildConfig, options: CompileOptions): string[] {
        const platform = options.platform ?? getCurrentPlatform();
        const arch = options.arch ?? getCurrentArch();
        const platformInfo = getPlatformInfo(platform);
        const optimization = config.optimization ?? "speed";

        const ext = platformInfo.sharedExt;
        const outName = config.outName ?? basename(config.source, ".rs");
        const outPath = join(
            options.outputDir,
            `${platformInfo.libPrefix}${outName}${ext}`
        );

        const cmd: string[] = ["rustc"];

        const sourcePath = isAbsolute(config.source)
            ? config.source
            : join(options.sourceRoot, config.source);
        cmd.push(sourcePath);

        cmd.push("--crate-type", "cdylib"); // c-compatible shared library

        const rustOptimization: Record<OptimizationLevel, string> = {
            none: "0",
            size: "s",
            speed: "3",
            aggressive: "3",
            safe: "2",
        };
        cmd.push("-C", `opt-level=${rustOptimization[optimization]}`);

        if (optimization === "aggressive") {
            cmd.push("-C", "lto=fat"); // link-time optimization
        }

        if (isCrossCompile(platform, arch)) {
            const target = getRustTarget(arch, platform);
            cmd.push("--target", target);
        }

        cmd.push("-o", outPath);

        if (config.flags) {
            cmd.push(...config.flags);
        }

        if (config.libPaths) {
            for (const path of config.libPaths) {
                cmd.push("-L", path);
            }
        }

        if (config.libs) {
            for (const lib of config.libs) {
                cmd.push("-l", lib);
            }
        }

        return cmd;
    }

    async compile(config: BuildConfig, options: CompileOptions): Promise<BuildResult> {
        const startTime = Date.now();
        if (!(await this.isAvailable())) {
            return {
                success: false,
                error: "Rust compiler (rustc) not found. Install Rust from https://rustup.rs",
                durationMs: Date.now() - startTime,
            };
        }

        if (!existsSync(options.outputDir)) {
            mkdirSync(options.outputDir, { recursive: true });
        }

        const cmd = this.buildCommand(config, options);

        if (options.verbose) {
            console.log(`[rustc] $ ${cmd.join(" ")}`);
        }

        try {
            const proc = Bun.spawn(cmd, {
                stdout: "pipe",
                stderr: "pipe",
                cwd: options.sourceRoot,
            });

            const [stdout, stderr, exitCode] = await Promise.all([
                new Response(proc.stdout).text(),
                new Response(proc.stderr).text(),
                proc.exited,
            ]);

            const platform = options.platform ?? getCurrentPlatform();
            const platformInfo = getPlatformInfo(platform);
            const ext = platformInfo.sharedExt;
            const outName = config.outName ?? basename(config.source, ".rs");
            const outputPath = join(
                options.outputDir,
                `${platformInfo.libPrefix}${outName}${ext}`
            );

            if (exitCode !== 0) {
                return {
                    success: false,
                    error: stderr || "Rust compilation failed",
                    stdout,
                    stderr,
                    durationMs: Date.now() - startTime,
                };
            }

            return {
                success: true,
                outputPath,
                stdout,
                stderr,
                durationMs: Date.now() - startTime,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error),
                durationMs: Date.now() - startTime,
            };
        }
    }
}

function getRustTarget(arch: TargetArch, platform: TargetPlatform): string {
    const targets: Record<string, string> = {
        "x64-linux": "x86_64-unknown-linux-gnu",
        "arm64-linux": "aarch64-unknown-linux-gnu",
        "x64-darwin": "x86_64-apple-darwin",
        "arm64-darwin": "aarch64-apple-darwin",
        "x64-windows": "x86_64-pc-windows-msvc",
        "arm64-windows": "aarch64-pc-windows-msvc",
    };

    return targets[`${arch}-${platform}`] ?? "x86_64-unknown-linux-gnu";
}

// compiler factory

export type Compiler = ZigCompiler | ZigCC | RustCompiler;

export function getCompiler(language: SourceLanguage): Compiler {
    switch (language) {
        case "zig":
            return new ZigCompiler();
        case "c":
            return new ZigCC("c");
        case "cpp":
            return new ZigCC("cpp");
        case "rust":
            return new RustCompiler();
        default:
            throw new Error(`Unknown language: ${language}`);
    }
}

export async function compile(
    config: BuildConfig,
    options: CompileOptions
): Promise<BuildResult> {
    const language = config.language ?? detectLanguage(config.source);
    const compiler = getCompiler(language);
    return compiler.compile(config, options);
}

function detectLanguage(source: string): SourceLanguage {
    const ext = source.split(".").pop()?.toLowerCase();
    switch (ext) {
        case "zig":
            return "zig";
        case "c":
            return "c";
        case "cpp":
        case "cc":
        case "cxx":
            return "cpp";
        case "rs":
            return "rust";
        default:
            throw new Error(`Cannot detect language for: ${source}`);
    }
}

// default instances

export const zigCompiler = new ZigCompiler();
export const zigCC = new ZigCC("c");
export const zigCXX = new ZigCC("cpp");
export const rustCompiler = new RustCompiler();

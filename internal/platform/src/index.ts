/**
 * Platform detection, toolchain management, and cache directory utilities.
 * @module
 */

import type {
    TargetPlatform,
    TargetArch,
    PlatformArch,
    PlatformInfo,
} from "@bunnativekit/types";

// platform detection

export function getCurrentPlatform(): TargetPlatform {
    switch (process.platform) {
        case "linux":
            return "linux";
        case "darwin":
            return "darwin";
        case "win32":
            return "windows";
        default:
            throw new Error(`Unsupported platform: ${process.platform}`);
    }
}

export function getCurrentArch(): TargetArch {
    switch (process.arch) {
        case "x64":
            return "x64";
        case "arm64":
            return "arm64";
        default:
            throw new Error(`Unsupported architecture: ${process.arch}`);
    }
}

export function getCurrentPlatformArch(): PlatformArch {
    return `${getCurrentPlatform()}-${getCurrentArch()}`;
}

// platform info

export const PLATFORMS: Record<TargetPlatform, PlatformInfo> = {
    linux: {
        sharedExt: ".so",
        napiExt: ".node",
        libPrefix: "lib",
        zigTarget: "native-linux",
    },
    darwin: {
        sharedExt: ".dylib",
        napiExt: ".node",
        libPrefix: "lib",
        zigTarget: "native-macos",
    },
    windows: {
        sharedExt: ".dll",
        napiExt: ".node",
        libPrefix: "",
        zigTarget: "native-windows",
    },
};

export function getPlatformInfo(platform?: TargetPlatform): PlatformInfo {
    return PLATFORMS[platform ?? getCurrentPlatform()];
}

export function getSharedExt(platform?: TargetPlatform): string {
    return getPlatformInfo(platform).sharedExt;
}

export function getNapiExt(): string {
    return ".node";
}

export function getLibPrefix(platform?: TargetPlatform): string {
    return getPlatformInfo(platform).libPrefix;
}

// zig targets

const ZIG_TARGETS = {
    "linux-x64": "x86_64-linux",
    "linux-arm64": "aarch64-linux",
    "darwin-x64": "x86_64-darwin",
    "darwin-arm64": "aarch64-darwin",
    "windows-x64": "x86_64-windows",
    "windows-arm64": "aarch64-windows",
} as const satisfies Record<PlatformArch, string>;

export function getZigTarget(arch?: TargetArch, platform?: TargetPlatform): string {
    const key: PlatformArch = `${platform ?? getCurrentPlatform()}-${arch ?? getCurrentArch()}`;
    return ZIG_TARGETS[key];
}

export function isCrossCompile(platform?: TargetPlatform, arch?: TargetArch): boolean {
    const targetPlatform = platform ?? getCurrentPlatform();
    const targetArch = arch ?? getCurrentArch();
    return targetPlatform !== getCurrentPlatform() || targetArch !== getCurrentArch();
}

// cache directories

import { homedir } from "os";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

/** Returns ~/.cache/bunnativekit (or platform equivalent), creating it if needed */
export function getCacheDir(): string {
    const platform = getCurrentPlatform();

    let baseDir: string;

    if (process.env.XDG_CACHE_HOME) {
        baseDir = process.env.XDG_CACHE_HOME;
    } else if (platform === "darwin") {
        baseDir = join(homedir(), "Library", "Caches");
    } else if (platform === "windows") {
        baseDir = process.env.LOCALAPPDATA || join(homedir(), "AppData", "Local");
    } else {
        baseDir = join(homedir(), ".cache");
    }

    const bnkCache = join(baseDir, "bunnativekit");

    // Ensure directory exists
    if (!existsSync(bnkCache)) {
        mkdirSync(bnkCache, { recursive: true });
    }

    return bnkCache;
}

export function getCacheSubdir(subdir: string): string {
    const dir = join(getCacheDir(), subdir);
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
    return dir;
}

// toolchain detection

export async function commandExists(cmd: string): Promise<boolean> {
    try {
        const proc = Bun.spawn(["which", cmd], {
            stdout: "pipe",
            stderr: "pipe",
        });
        const exitCode = await proc.exited;
        return exitCode === 0;
    } catch {
        return false;
    }
}

export async function getCommandVersion(cmd: string, versionFlag = "--version"): Promise<string | null> {
    try {
        const proc = Bun.spawn([cmd, versionFlag], {
            stdout: "pipe",
            stderr: "pipe",
        });
        const stdout = await new Response(proc.stdout).text();
        const exitCode = await proc.exited;
        return exitCode === 0 ? stdout.trim().split("\n")[0] ?? null : null;
    } catch {
        return null;
    }
}

export async function isZigInstalled(): Promise<boolean> {
    return commandExists("zig");
}

export async function getZigVersion(): Promise<string | null> {
    return getCommandVersion("zig", "version");
}

export interface ToolchainStatus {
    zig: { installed: boolean; version: string | null };
    gdb: { installed: boolean; version: string | null };
    lldb: { installed: boolean; version: string | null };
}

export async function getToolchainStatus(): Promise<ToolchainStatus> {
    const [zigInstalled, zigVersion, gdbInstalled, gdbVersion, lldbInstalled, lldbVersion] =
        await Promise.all([
            commandExists("zig"),
            getCommandVersion("zig", "version"),
            commandExists("gdb"),
            getCommandVersion("gdb"),
            commandExists("lldb"),
            getCommandVersion("lldb"),
        ]);

    return {
        zig: { installed: zigInstalled, version: zigVersion },
        gdb: { installed: gdbInstalled, version: gdbVersion },
        lldb: { installed: lldbInstalled, version: lldbVersion },
    };
}

// environment

export function isDev(): boolean {
    return (
        process.env.NODE_ENV === "development" ||
        process.env.BNK_DEV === "1" ||
        process.env.BNK_DEV === "true"
    );
}

export function isProd(): boolean {
    return process.env.NODE_ENV === "production";
}

export function isCI(): boolean {
    return (
        process.env.CI === "true" ||
        process.env.CI === "1" ||
        !!process.env.GITHUB_ACTIONS ||
        !!process.env.GITLAB_CI ||
        !!process.env.CIRCLECI
    );
}

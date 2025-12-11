/**
 * First-time configuration: install Zig and set up environment.
 * @module
 */

import { Command } from "commander";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { colors, header, info, error, success, warn, status } from "../utils/colors";

export function createFtcfgCommand(): Command {
    return new Command("ftcfg")
        .description("First-time configuration (install Zig, etc.)")
        .option("--zig-version <version>", "Specific Zig version to install")
        .option("--skip-zig", "Skip Zig installation")
        .option("-y, --yes", "Skip confirmation prompts")
        .action(async (options) => {
            await runFtcfg(options);
        });
}

interface FtcfgOptions {
    zigVersion?: string;
    skipZig?: boolean;
    yes?: boolean;
}

async function runFtcfg(options: FtcfgOptions): Promise<void> {
    header("BunNativeKit - First-Time Configuration");

    // Check current state
    const { getToolchainStatus, getCurrentPlatform, getCurrentArch, getCacheDir } = await import(
        "@bunnativekit/platform"
    );

    const toolchain = await getToolchainStatus();
    const platform = getCurrentPlatform();
    const arch = getCurrentArch();

    console.log(colors.bold("Current Status:"));
    status("Zig", toolchain.zig.installed, toolchain.zig.version || "not installed");
    status("GDB", toolchain.gdb.installed, toolchain.gdb.version?.split("\n")[0] || "not installed");
    status("LLDB", toolchain.lldb.installed, toolchain.lldb.version || "not installed");
    console.log();

    // Install Zig if not present
    if (!options.skipZig && !toolchain.zig.installed) {
        await installZig(platform, arch, options);
    } else if (toolchain.zig.installed) {
        info("Zig is already installed.");
    }

    // Create cache directory
    const cacheDir = getCacheDir();
    if (!existsSync(cacheDir)) {
        mkdirSync(cacheDir, { recursive: true });
        success(`Created cache directory: ${cacheDir}`);
    }

    // Final check
    console.log();
    const newStatus = await getToolchainStatus();

    if (newStatus.zig.installed) {
        success("BunNativeKit is ready to use!");
        console.log();
        info("Get started:");
        console.log("  bnk init my-project    Create a new project");
        console.log("  bnk build              Build native modules");
        console.log("  bnk doctor             Check toolchain status");
    } else {
        warn("Zig installation may require manual steps.");
        info("Visit https://ziglang.org/download/ for installation instructions.");
    }

    console.log();
}

async function installZig(
    platform: string,
    arch: string,
    options: FtcfgOptions
): Promise<void> {
    info("Installing Zig...");

    // Determine installation method based on platform
    if (platform === "darwin") {
        // Try Homebrew first
        const brewExists = await checkCommand("brew");
        if (brewExists) {
            info("Using Homebrew to install Zig...");
            const proc = Bun.spawn(["brew", "install", "zig"], {
                stdout: "inherit",
                stderr: "inherit",
            });
            const exitCode = await proc.exited;
            if (exitCode === 0) {
                success("Zig installed via Homebrew");
                return;
            }
        }
    } else if (platform === "linux") {
        // Try package managers
        const aptExists = await checkCommand("apt-get");
        const pacmanExists = await checkCommand("pacman");

        if (aptExists) {
            info("Using apt to install Zig...");
            warn("Note: apt packages may be outdated. Consider manual installation for latest version.");

            if (!options.yes) {
                const proceed = await prompt("Proceed with apt installation? [y/N] ");
                if (proceed.toLowerCase() !== "y") {
                    info("Skipping apt installation.");
                    await installZigManual(platform, arch, options);
                    return;
                }
            }

            const proc = Bun.spawn(["sudo", "apt-get", "install", "-y", "zig"], {
                stdout: "inherit",
                stderr: "inherit",
            });
            const exitCode = await proc.exited;
            if (exitCode === 0) {
                success("Zig installed via apt");
                return;
            }
        } else if (pacmanExists) {
            info("Using pacman to install Zig...");
            const proc = Bun.spawn(["sudo", "pacman", "-S", "--noconfirm", "zig"], {
                stdout: "inherit",
                stderr: "inherit",
            });
            const exitCode = await proc.exited;
            if (exitCode === 0) {
                success("Zig installed via pacman");
                return;
            }
        }
    }

    // Fall back to manual installation
    await installZigManual(platform, arch, options);
}

async function installZigManual(
    platform: string,
    arch: string,
    options: FtcfgOptions
): Promise<void> {
    const version = options.zigVersion || "0.13.0";

    // Determine download URL
    const platformMap: Record<string, string> = {
        linux: "linux",
        darwin: "macos",
        windows: "windows",
    };

    const archMap: Record<string, string> = {
        x64: "x86_64",
        arm64: "aarch64",
    };

    const os = platformMap[platform] || platform;
    const cpuArch = archMap[arch] || arch;
    const ext = platform === "windows" ? "zip" : "tar.xz";

    const fileName = `zig-${os}-${cpuArch}-${version}.${ext}`;
    const downloadUrl = `https://ziglang.org/download/${version}/${fileName}`;

    info(`Downloading Zig ${version}...`);
    console.log(colors.dim(`  ${downloadUrl}`));

    const installDir = join(process.env.HOME || "~", ".local", "bin");

    if (!existsSync(installDir)) {
        mkdirSync(installDir, { recursive: true });
    }

    try {
        // Download
        const response = await fetch(downloadUrl);

        if (!response.ok) {
            error(`Download failed: ${response.status} ${response.statusText}`);
            info("Please install Zig manually from https://ziglang.org/download/");
            return;
        }

        const tarPath = join("/tmp", fileName);
        const arrayBuffer = await response.arrayBuffer();
        await Bun.write(tarPath, arrayBuffer);

        success("Download complete");

        // Extract
        info("Extracting...");

        const extractDir = "/tmp/zig-extract";
        mkdirSync(extractDir, { recursive: true });

        const extractProc = Bun.spawn(["tar", "-xf", tarPath, "-C", extractDir], {
            stdout: "pipe",
            stderr: "pipe",
        });
        await extractProc.exited;

        // Find extracted directory
        const zigDir = `zig-${os}-${cpuArch}-${version}`;
        const zigBinary = join(extractDir, zigDir, "zig");

        if (!existsSync(zigBinary)) {
            error("Extraction failed - zig binary not found");
            return;
        }

        // Copy to install directory
        const destBinary = join(installDir, "zig");
        const copyProc = Bun.spawn(["cp", zigBinary, destBinary], {
            stdout: "pipe",
            stderr: "pipe",
        });
        await copyProc.exited;

        // Make executable
        const chmodProc = Bun.spawn(["chmod", "+x", destBinary], {
            stdout: "pipe",
            stderr: "pipe",
        });
        await chmodProc.exited;

        success(`Zig installed to ${destBinary}`);

        // Check if install dir is in PATH
        const path = process.env.PATH || "";
        if (!path.includes(installDir)) {
            warn(`Add ${installDir} to your PATH:`);
            console.log(colors.dim(`  export PATH="${installDir}:$PATH"`));
        }
    } catch (err) {
        error(`Installation failed: ${err instanceof Error ? err.message : String(err)}`);
        info("Please install Zig manually from https://ziglang.org/download/");
    }
}

async function checkCommand(cmd: string): Promise<boolean> {
    try {
        const proc = Bun.spawn(["which", cmd], {
            stdout: "pipe",
            stderr: "pipe",
        });
        return (await proc.exited) === 0;
    } catch {
        return false;
    }
}

async function prompt(message: string): Promise<string> {
    process.stdout.write(message);
    const reader = Bun.stdin.stream().getReader();
    const { value } = await reader.read();
    reader.releaseLock();
    return new TextDecoder().decode(value).trim();
}

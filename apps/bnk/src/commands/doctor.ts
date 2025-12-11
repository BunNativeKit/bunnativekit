/**
 * Check toolchain status and diagnose environment issues.
 * @module
 */

import { Command } from "commander";
import { colors, header, status, info, error, warn, keyValue } from "../utils/colors";

export function createDoctorCommand(): Command {
    return new Command("doctor")
        .description("Check toolchain status")
        .option("-v, --verbose", "Show detailed information")
        .option("--json", "Output as JSON")
        .action(async (options) => {
            await runDoctor(options);
        });
}

interface DoctorOptions {
    verbose?: boolean;
    json?: boolean;
}

interface DoctorResult {
    bun: { version: string; ok: boolean };
    zig: { installed: boolean; version: string | null };
    gdb: { installed: boolean; version: string | null };
    lldb: { installed: boolean; version: string | null };
    platform: string;
    arch: string;
    cacheDir: string;
    issues: string[];
}

async function runDoctor(options: DoctorOptions): Promise<void> {
    const { getToolchainStatus, getCurrentPlatform, getCurrentArch, getCacheDir } = await import(
        "@bunnativekit/platform"
    );

    const toolchain = await getToolchainStatus();
    const platform = getCurrentPlatform();
    const arch = getCurrentArch();
    const cacheDir = getCacheDir();

    const issues: string[] = [];

    // Check Bun version
    const bunVersion = Bun.version;

    // Determine issues
    if (!toolchain.zig.installed) {
        issues.push("Zig is not installed. Run 'bnk ftcfg' to install.");
    }

    if (!toolchain.gdb.installed && !toolchain.lldb.installed) {
        issues.push("No debugger found. Install GDB or LLDB for debugging support.");
    }

    const result: DoctorResult = {
        bun: { version: bunVersion, ok: true },
        zig: toolchain.zig,
        gdb: toolchain.gdb,
        lldb: toolchain.lldb,
        platform,
        arch,
        cacheDir,
        issues,
    };

    // JSON output
    if (options.json) {
        console.log(JSON.stringify(result, null, 2));
        return;
    }

    // Pretty print
    header("BunNativeKit Doctor");

    console.log(colors.bold("Environment:"));
    keyValue("Platform", `${platform}-${arch}`);
    keyValue("Cache", cacheDir);
    console.log();

    console.log(colors.bold("Toolchain:"));

    status("Bun", true, `v${bunVersion}`);
    status("Zig", toolchain.zig.installed, toolchain.zig.version || "not installed");
    status("GDB", toolchain.gdb.installed, toolchain.gdb.version?.split("\n")[0] || "not installed");
    status("LLDB", toolchain.lldb.installed, toolchain.lldb.version || "not installed");

    console.log();

    if (issues.length > 0) {
        console.log(colors.bold("Issues:"));
        for (const issue of issues) {
            warn(issue);
        }
        console.log();
    }

    // Overall status
    const allOk = toolchain.zig.installed;

    if (allOk) {
        info("All required tools are installed.");
    } else {
        error("Some required tools are missing.");
        info("Run 'bnk ftcfg' to install missing tools.");
    }

    console.log();
}

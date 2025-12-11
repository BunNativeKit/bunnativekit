/**
 * Run scripts with optional isolation harness for native calls.
 * @module
 */

import { Command } from "commander";
import { existsSync } from "fs";
import { resolve } from "path";
import { header, info, error } from "../utils/colors";

export function createRunCommand(): Command {
    return new Command("run")
        .description("Run with isolation harness")
        .argument("<script>", "Script to run")
        .option("-i, --isolation <mode>", "Isolation mode (subprocess, thread, direct, auto)", "auto")
        .option("--no-isolation", "Run without isolation (same as --isolation direct)")
        .option("-t, --timeout <ms>", "Timeout for native calls", "30000")
        .option("-v, --verbose", "Verbose output")
        .option("--inspect", "Enable Node.js inspector")
        .allowUnknownOption(true)
        .action(async (script: string, options, command) => {
            await runScript(script, options, command.args.slice(1));
        });
}

interface RunOptions {
    isolation: string;
    timeout: string;
    verbose?: boolean;
    inspect?: boolean;
}

async function runScript(
    script: string,
    options: RunOptions,
    passthrough: string[]
): Promise<void> {
    const scriptPath = resolve(process.cwd(), script);

    if (!existsSync(scriptPath)) {
        error(`Script not found: ${scriptPath}`);
        process.exit(1);
    }

    if (options.verbose) {
        header("BunNativeKit - Run");
        info(`Script: ${scriptPath}`);
        info(`Isolation: ${options.isolation}`);
        info(`Timeout: ${options.timeout}ms`);
    }

    // Set environment variables for runtime
    const env: Record<string, string> = {
        ...process.env as Record<string, string>,
        BNK_ISOLATION_MODE: options.isolation,
        BNK_CALL_TIMEOUT: options.timeout,
    };

    if (options.verbose) {
        env.BNK_VERBOSE = "1";
    }

    // Build bun command
    const args: string[] = [];

    if (options.inspect) {
        args.push("--inspect");
    }

    args.push(scriptPath);
    args.push(...passthrough);

    // Run with bun
    const proc = Bun.spawn(["bun", ...args], {
        cwd: process.cwd(),
        env,
        stdout: "inherit",
        stderr: "inherit",
        stdin: "inherit",
    });

    const exitCode = await proc.exited;
    process.exit(exitCode);
}

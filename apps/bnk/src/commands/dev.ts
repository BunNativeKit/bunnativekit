/**
 * Development mode with file watching and auto-rebuild.
 * @module
 */

import { Command } from "commander";

export function createDevCommand(): Command {
    return new Command("dev")
        .description("Start development mode with watch")
        .option("-m, --module <path>", "Watch specific module")
        .option("-o, --output <dir>", "Output directory", ".bnk")
        .option("-v, --verbose", "Verbose output")
        .action(async (options) => {
            // dev is just build with --watch
            const { createBuildCommand } = await import("./build");
            const buildCmd = createBuildCommand();

            // Forward to build with watch enabled
            const args = ["--watch"];
            if (options.module) args.push("--module", options.module);
            if (options.output) args.push("--output", options.output);
            if (options.verbose) args.push("--verbose");

            await buildCmd.parseAsync(args, { from: "user" });
        });
}

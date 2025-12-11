#!/usr/bin/env bun
/**
 * Command-line interface for BunNativeKit.
 * @module
 */

import { Command } from "commander";
import {
    createInitCommand,
    createBuildCommand,
    createDevCommand,
    createRunCommand,
    createTestCommand,
    createInspectCommand,
    createDoctorCommand,
    createFtcfgCommand,
    createAnalyzeCommand,
} from "./commands";
import { colors } from "./utils/colors";

// Version is injected at build time, fallback to reading package.json
const VERSION = process.env.BNK_VERSION ?? "0.0.1";

const program = new Command();

program
    .name("bnk")
    .description("BunNativeKit - The native code toolkit for Bun")
    .version(VERSION, "-v, --version", "Show version")
    .configureHelp({
        sortSubcommands: true,
        subcommandTerm: (cmd) => cmd.name(),
    })
    .addHelpText("after", `
Examples:
  bnk init my-project    Create a new project
  bnk build              Build native modules
  bnk dev                Start watch mode
  bnk test               Run tests
  bnk doctor             Check toolchain status

Documentation:
  https://github.com/bunnativekit/bunnativekit
`);

// Register all commands
program.addCommand(createInitCommand());
program.addCommand(createBuildCommand());
program.addCommand(createDevCommand());
program.addCommand(createRunCommand());
program.addCommand(createTestCommand());
program.addCommand(createInspectCommand());
program.addCommand(createDoctorCommand());
program.addCommand(createFtcfgCommand());
program.addCommand(createAnalyzeCommand());

// Handle unknown commands
program.on("command:*", (operands) => {
    console.error(`${colors.red("[error]")} Unknown command: ${operands[0]}`);
    console.error(`Run 'bnk --help' for available commands.`);
    process.exit(1);
});

// Parse and execute
async function main(): Promise<void> {
    try {
        await program.parseAsync(process.argv);
    } catch (error) {
        console.error(`${colors.red("[error]")} ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
}

/** Run the CLI programmatically with the given arguments */
export async function runCLI(args: string[]): Promise<void> {
    await program.parseAsync(['node', 'bnk', ...args]);
}

// Only run main() if this file is executed directly
if (import.meta.main) {
    main();
}

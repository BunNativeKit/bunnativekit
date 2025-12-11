/**
 * Run TypeScript and native Zig tests with isolation support.
 * @module
 */

import { Command } from "commander";
import { existsSync } from "fs";
import { resolve, join } from "path";
import { colors, header, info, error, success, warn } from "../utils/colors";

export function createTestCommand(): Command {
    return new Command("test")
        .description("Run tests with isolation")
        .argument("[pattern]", "Test file pattern", "**/*.test.{ts,zig}")
        .option("-m, --module <path>", "Test specific module")
        .option("-i, --isolation <mode>", "Isolation mode", "subprocess")
        .option("-t, --timeout <ms>", "Test timeout", "30000")
        .option("-w, --watch", "Watch mode")
        .option("-v, --verbose", "Verbose output")
        .option("--native", "Run native (Zig) tests")
        .option("--ts", "Run TypeScript tests only")
        .action(async (pattern: string, options) => {
            await runTests(pattern, options);
        });
}

interface TestOptions {
    module?: string;
    isolation: string;
    timeout: string;
    watch?: boolean;
    verbose?: boolean;
    native?: boolean;
    ts?: boolean;
}

async function runTests(_pattern: string, options: TestOptions): Promise<void> {
    header("BunNativeKit - Test");

    const startTime = performance.now();

    // Determine what tests to run
    const runNative = options.native || (!options.ts && !options.native);
    const runTs = options.ts || (!options.ts && !options.native);

    let totalPassed = 0;
    let totalFailed = 0;

    // Run TypeScript tests with bun test
    if (runTs) {
        info("Running TypeScript tests...");
        console.log();

        const bunArgs = ["test"];

        if (options.watch) {
            bunArgs.push("--watch");
        }

        if (options.timeout) {
            bunArgs.push("--timeout", options.timeout);
        }

        // Set isolation mode
        const env: Record<string, string> = {
            ...process.env as Record<string, string>,
            BNK_ISOLATION_MODE: options.isolation,
        };

        const proc = Bun.spawn(["bun", ...bunArgs], {
            cwd: process.cwd(),
            env,
            stdout: "inherit",
            stderr: "inherit",
        });

        const exitCode = await proc.exited;

        if (exitCode !== 0) {
            totalFailed++;
        } else {
            totalPassed++;
        }
    }

    // Run native Zig tests
    if (runNative) {
        console.log();
        info("Running native tests...");

        // Find module paths
        let modulePaths: string[] = [];

        if (options.module) {
            modulePaths = [resolve(process.cwd(), options.module)];
        } else {
            // Load from config
            try {
                const { loadProjectConfig } = await import("@bunnativekit/schema");
                const config = await loadProjectConfig(process.cwd());

                if (config.modules && config.modules.length > 0) {
                    modulePaths = config.modules.map((m) => resolve(process.cwd(), m));
                }
            } catch {
                // Try default location
                const nativePath = resolve(process.cwd(), "native");
                if (existsSync(nativePath)) {
                    modulePaths = [nativePath];
                }
            }
        }

        for (const modulePath of modulePaths) {
            const result = await runZigTests(modulePath, options);
            if (result) {
                totalPassed++;
            } else {
                totalFailed++;
            }
        }
    }

    const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);

    console.log();
    if (totalFailed === 0) {
        success(`All tests passed in ${elapsed}s`);
    } else {
        error(`${totalFailed} test suite(s) failed, ${totalPassed} passed`);
        process.exit(1);
    }
}

async function runZigTests(modulePath: string, options: TestOptions): Promise<boolean> {
    const moduleName = modulePath.split("/").pop() || "unknown";

    // Find Zig files
    const glob = new Bun.Glob("**/*.zig");
    const zigFiles: string[] = [];

    for await (const file of glob.scan(modulePath)) {
        zigFiles.push(join(modulePath, file));
    }

    if (zigFiles.length === 0) {
        warn(`  No Zig files found in ${moduleName}`);
        return true;
    }

    info(`  Testing ${moduleName}...`);

    // Run zig test on each file
    let passed = 0;
    let failed = 0;

    for (const zigFile of zigFiles) {
        const fileName = zigFile.split("/").pop() || zigFile;

        const proc = Bun.spawn(["zig", "test", zigFile], {
            cwd: modulePath,
            stdout: options.verbose ? "inherit" : "pipe",
            stderr: options.verbose ? "inherit" : "pipe",
        });

        const exitCode = await proc.exited;

        if (exitCode === 0) {
            if (options.verbose) {
                success(`    ${fileName}`);
            }
            passed++;
        } else {
            error(`    ${fileName} - failed`);
            if (!options.verbose) {
                // Show error output
                const stderr = await new Response(proc.stderr).text();
                if (stderr) {
                    console.error(colors.dim(stderr));
                }
            }
            failed++;
        }
    }

    if (failed === 0) {
        success(`  ${passed} file(s) passed`);
        return true;
    } else {
        error(`  ${failed} file(s) failed, ${passed} passed`);
        return false;
    }
}

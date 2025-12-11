/**
 * Build native modules from Zig, C, or C++ source.
 * @module
 */

import { Command } from "commander";
import { existsSync } from "fs";
import { join, resolve } from "path";
import { colors, header, success, error, info, keyValue } from "../utils/colors";

export function createBuildCommand(): Command {
    return new Command("build")
        .description("Build native modules")
        .option("-m, --module <path>", "Build specific module")
        .option("-o, --output <dir>", "Output directory", ".bnk")
        .option("-O, --optimize <level>", "Optimization level (none, size, speed, aggressive)", "speed")
        .option("--target <target>", "Target platform-arch (e.g., linux-x64)")
        .option("-w, --watch", "Watch for changes and rebuild")
        .option("-v, --verbose", "Verbose output")
        .option("-f, --force", "Force rebuild (ignore cache)")
        .action(async (options) => {
            await runBuild(options);
        });
}

interface BuildOptions {
    module?: string;
    output: string;
    optimize: string;
    target?: string;
    watch?: boolean;
    verbose?: boolean;
    force?: boolean;
}

async function runBuild(options: BuildOptions): Promise<void> {
    header("BunNativeKit - Build");

    const startTime = performance.now();

    // Load project config
    const { loadProjectConfig } = await import("@bunnativekit/schema");
    const config = await loadProjectConfig(process.cwd());

    // Determine modules to build
    let modulePaths: string[] = [];

    if (options.module) {
        modulePaths = [resolve(process.cwd(), options.module)];
    } else if (config.modules && config.modules.length > 0) {
        modulePaths = config.modules.map((m) => resolve(process.cwd(), m));
    } else {
        // Try to find modules in common locations
        const searchPaths = ["./native", "./src/native", "."];
        for (const searchPath of searchPaths) {
            const fullPath = resolve(process.cwd(), searchPath, "module.bnk.ts");
            if (existsSync(fullPath)) {
                modulePaths.push(resolve(process.cwd(), searchPath));
                break;
            }
        }
    }

    if (modulePaths.length === 0) {
        error("No modules found to build.");
        info("Create a module.bnk.ts file or specify modules in bnk.config.ts");
        process.exit(1);
    }

    info(`Found ${modulePaths.length} module(s) to build`);

    if (options.watch) {
        await runWatchBuild(modulePaths, options);
        return;
    }

    // Build each module
    let buildCount = 0;
    let errorCount = 0;

    for (const modulePath of modulePaths) {
        const result = await buildModule(modulePath, options);
        if (result) {
            buildCount++;
        } else {
            errorCount++;
        }
    }

    const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);

    console.log();
    if (errorCount === 0) {
        success(`Built ${buildCount} module(s) in ${elapsed}s`);
    } else {
        error(`${errorCount} module(s) failed, ${buildCount} succeeded`);
        process.exit(1);
    }
}

async function buildModule(modulePath: string, options: BuildOptions): Promise<boolean> {
    const moduleName = modulePath.split("/").pop() || "unknown";

    info(`Building ${colors.bold(moduleName)}...`);

    // Check if module.bnk.ts exists
    const manifestPath = join(modulePath, "module.bnk.ts");
    if (!existsSync(manifestPath)) {
        error(`  Module manifest not found: ${manifestPath}`);
        return false;
    }

    try {
        // Load module manifest
        const { loadModuleManifest } = await import("@bunnativekit/schema");
        const manifest = await loadModuleManifest(modulePath);

        if (options.verbose) {
            keyValue("Name", manifest.name);
            keyValue("Entry", manifest.entry);
            keyValue("Binding", manifest.binding?.prefer || "ffi");
        }

        // Detect source language
        const entryPath = join(modulePath, manifest.entry);
        if (!existsSync(entryPath)) {
            error(`  Entry file not found: ${entryPath}`);
            return false;
        }

        // Build using compiler
        const { ZigCompiler } = await import("@bunnativekit/compiler");
        const compiler = new ZigCompiler();

        const isAvailable = await compiler.isAvailable();
        if (!isAvailable) {
            error("  Zig compiler not found. Run 'bnk doctor' to check toolchain.");
            return false;
        }

        const outputDir = resolve(process.cwd(), options.output);

        // Get optimization level
        type OptLevel = "none" | "size" | "speed" | "aggressive" | "safe";
        const optLevel = (["none", "size", "speed", "aggressive", "safe"].includes(options.optimize)
            ? options.optimize
            : "speed") as OptLevel;

        // Parse target if provided
        let platform: "linux" | "darwin" | "windows" | undefined;
        let arch: "x64" | "arm64" | undefined;

        if (options.target) {
            const [p, a] = options.target.split("-");
            if (["linux", "darwin", "windows"].includes(p)) {
                platform = p as "linux" | "darwin" | "windows";
            }
            if (["x64", "arm64"].includes(a)) {
                arch = a as "x64" | "arm64";
            }
        }

        // Compile
        const { compile } = await import("@bunnativekit/compiler");
        const result = await compile(
            {
                source: manifest.entry,
                outName: manifest.name,
                optimization: optLevel,
            },
            {
                sourceRoot: modulePath,
                outputDir,
                platform,
                arch,
                force: options.force,
                verbose: options.verbose,
            }
        );

        if (result.success) {
            success(`  Built: ${colors.dim(result.outputPath || "unknown")}`);
            if (options.verbose && result.durationMs) {
                keyValue("Build time", `${result.durationMs.toFixed(0)}ms`);
            }
            return true;
        } else {
            error(`  Build failed: ${result.error || "unknown error"}`);
            return false;
        }
    } catch (err) {
        error(`  ${err instanceof Error ? err.message : String(err)}`);
        return false;
    }
}

async function runWatchBuild(modulePaths: string[], options: BuildOptions): Promise<void> {
    info("Starting watch mode...");
    info("Press Ctrl+C to stop");
    console.log();

    // Initial build
    for (const modulePath of modulePaths) {
        await buildModule(modulePath, options);
    }

    // Set up file watcher
    const { watch } = await import("fs");

    for (const modulePath of modulePaths) {
        const watcher = watch(modulePath, { recursive: true }, async (_event, filename) => {
            if (!filename) return;

            // Ignore hidden files and build output
            if (filename.startsWith(".") || filename.includes(".bnk")) return;

            // Only watch source files
            const ext = filename.split(".").pop();
            if (!["zig", "c", "cpp", "h", "hpp", "ts"].includes(ext || "")) return;

            console.log();
            info(`Changed: ${filename}`);

            await buildModule(modulePath, options);
        });

        // Keep process alive
        process.on("SIGINT", () => {
            watcher.close();
            console.log();
            info("Watch mode stopped");
            process.exit(0);
        });
    }

    // Keep the process running
    await new Promise(() => { });
}

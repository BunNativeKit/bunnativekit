/**
 * Inspect native modules: symbols, memory layout, dependencies.
 * @module
 */

import { Command } from "commander";
import { existsSync } from "fs";
import { resolve, join } from "path";
import { colors, header, info, error, keyValue } from "../utils/colors";

export function createInspectCommand(): Command {
    return new Command("inspect")
        .description("Inspect a module (symbols, memory layout)")
        .argument("<module>", "Module path to inspect")
        .option("-s, --symbols", "Show exported symbols")
        .option("-m, --memory", "Show memory layout")
        .option("-d, --deps", "Show dependencies")
        .option("-a, --all", "Show all information")
        .option("--json", "Output as JSON")
        .action(async (modulePath: string, options) => {
            await runInspect(modulePath, options);
        });
}

interface InspectOptions {
    symbols?: boolean;
    memory?: boolean;
    deps?: boolean;
    all?: boolean;
    json?: boolean;
}

interface InspectResult {
    name: string;
    version: string;
    entry: string;
    binding: { prefer: string; fallback?: string };
    symbols: Record<string, { args: string[]; returns: string; description?: string }>;
    prebuilt?: Record<string, string>;
    dependencies?: string[];
    binarySize?: number;
    binaryPath?: string;
}

async function runInspect(modulePath: string, options: InspectOptions): Promise<void> {
    const fullPath = resolve(process.cwd(), modulePath);

    // Check if it's a module directory or manifest file
    let manifestPath: string;

    if (existsSync(join(fullPath, "module.bnk.ts"))) {
        manifestPath = join(fullPath, "module.bnk.ts");
    } else if (fullPath.endsWith("module.bnk.ts") && existsSync(fullPath)) {
        manifestPath = fullPath;
    } else {
        error(`Module not found: ${modulePath}`);
        info("Provide a path to a module directory containing module.bnk.ts");
        process.exit(1);
    }

    const moduleDir = manifestPath.replace("/module.bnk.ts", "");

    try {
        const { loadModuleManifest } = await import("@bunnativekit/schema");
        const manifest = await loadModuleManifest(moduleDir);

        const showAll = options.all || (!options.symbols && !options.memory && !options.deps);

        const result: InspectResult = {
            name: manifest.name,
            version: manifest.version,
            entry: manifest.entry,
            binding: manifest.binding || { prefer: "ffi" },
            symbols: manifest.symbols || {},
        };

        if (manifest.prebuilt) {
            result.prebuilt = manifest.prebuilt;
        }

        // Check for built binary
        const { getPlatformInfo } = await import("@bunnativekit/platform");
        const platformInfo = getPlatformInfo();
        const binaryName = `${platformInfo.libPrefix}${manifest.name}${platformInfo.sharedExt}`;
        const binaryPath = join(process.cwd(), ".bnk", binaryName);

        if (existsSync(binaryPath)) {
            const stat = await Bun.file(binaryPath).stat();
            result.binarySize = stat?.size;
            result.binaryPath = binaryPath;
        }

        // JSON output
        if (options.json) {
            console.log(JSON.stringify(result, null, 2));
            return;
        }

        // Pretty print
        header(`Module: ${manifest.name}`);

        keyValue("Version", manifest.version);
        keyValue("Entry", manifest.entry);
        keyValue("Binding", `${result.binding.prefer}${result.binding.fallback ? ` (fallback: ${result.binding.fallback})` : ""}`);

        if (result.binaryPath) {
            const sizeKb = result.binarySize ? (result.binarySize / 1024).toFixed(1) : "?";
            keyValue("Binary", `${result.binaryPath} (${sizeKb} KB)`);
        }

        // Symbols
        if (showAll || options.symbols) {
            console.log();
            console.log(colors.bold("Symbols:"));

            const symbolEntries = Object.entries(result.symbols);

            if (symbolEntries.length === 0) {
                console.log(colors.dim("  (no symbols defined)"));
            } else {
                for (const [name, def] of symbolEntries) {
                    const args = def.args.join(", ");
                    const sig = colors.cyan(`${name}(${args}) -> ${def.returns}`);
                    console.log(`  ${sig}`);
                    if (def.description) {
                        console.log(colors.dim(`    ${def.description}`));
                    }
                }
            }
        }

        // Prebuilts
        if ((showAll || options.deps) && result.prebuilt) {
            console.log();
            console.log(colors.bold("Prebuilt Binaries:"));

            for (const [platform, path] of Object.entries(result.prebuilt)) {
                const exists = existsSync(join(moduleDir, path));
                const status = exists ? colors.green("[ok]") : colors.red("[missing]");
                console.log(`  ${platform}: ${path} ${status}`);
            }
        }

        console.log();
    } catch (err) {
        error(`Failed to inspect module: ${err instanceof Error ? err.message : String(err)}`);
        process.exit(1);
    }
}

/**
 * Configuration and module manifest parsing for BunNativeKit projects.
 * Handles discovery, loading, validation, and merging of bnk.config.ts and module.bnk.ts files.
 * @module
 */

import { existsSync } from "fs";
import { join, dirname } from "path";
import type {
    ProjectConfig,
    ModuleManifest,
    IsolationMode,
    ErrorMode,
    CacheConfig,
    DebugConfig,
} from "@bunnativekit/types";

// defaults

export const DEFAULT_PROJECT_CONFIG: Required<ProjectConfig> = {
    isolation: "auto",
    cache: {
        enabled: true,
        dir: undefined,
        maxSize: 500 * 1024 * 1024, // 500MB
        ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    debug: {
        enabled: false,
        level: "info",
        tracing: false,
        tracePath: undefined,
        diagnostics: false,
    },
    onError: "throw",
    modules: [],
    build: {},
};

export const DEFAULT_MODULE_MANIFEST: Partial<ModuleManifest> = {
    binding: {
        prefer: "ffi",
        fallback: "napi",
    },
    isolation: {
        required: false,
        thread: false,
    },
};

// config loading

/** Load project config from bnk.config.ts */
export async function loadProjectConfig(
    searchDir: string = process.cwd()
): Promise<ProjectConfig> {
    const configPath = findConfigFile(searchDir, "bnk.config.ts");

    if (!configPath) {
        return { ...DEFAULT_PROJECT_CONFIG };
    }

    try {
        const mod = await import(configPath);
        const config = mod.default ?? mod;
        return mergeProjectConfig(config);
    } catch (error) {
        throw new Error(
            `Failed to load bnk.config.ts: ${error instanceof Error ? error.message : String(error)}`
        );
    }
}

/** Load module manifest from module.bnk.ts */
export async function loadModuleManifest(
    modulePath: string
): Promise<ModuleManifest> {
    const manifestPath = join(modulePath, "module.bnk.ts");

    if (!existsSync(manifestPath)) {
        throw new Error(`Module manifest not found: ${manifestPath}`);
    }

    try {
        const mod = await import(manifestPath);
        const manifest = mod.default ?? mod;
        return mergeModuleManifest(manifest);
    } catch (error) {
        throw new Error(
            `Failed to load module.bnk.ts: ${error instanceof Error ? error.message : String(error)}`
        );
    }
}

// config merging

/** Merge user config with defaults */
export function mergeProjectConfig(
    userConfig: Partial<ProjectConfig>
): ProjectConfig {
    return {
        isolation: userConfig.isolation ?? DEFAULT_PROJECT_CONFIG.isolation,
        cache: {
            ...DEFAULT_PROJECT_CONFIG.cache,
            ...userConfig.cache,
        },
        debug: {
            ...DEFAULT_PROJECT_CONFIG.debug,
            ...userConfig.debug,
        },
        onError: userConfig.onError ?? DEFAULT_PROJECT_CONFIG.onError,
        modules: userConfig.modules ?? DEFAULT_PROJECT_CONFIG.modules,
        build: {
            ...DEFAULT_PROJECT_CONFIG.build,
            ...userConfig.build,
        },
    };
}

/** Merge module manifest with defaults */
export function mergeModuleManifest(
    manifest: ModuleManifest
): ModuleManifest {
    return {
        ...manifest,
        binding: manifest.binding ?? DEFAULT_MODULE_MANIFEST.binding,
        isolation: manifest.isolation
            ? { ...DEFAULT_MODULE_MANIFEST.isolation, ...manifest.isolation }
            : DEFAULT_MODULE_MANIFEST.isolation,
    };
}

// config discovery

/** Walk up directories to find a config file */
export function findConfigFile(
    startDir: string,
    filename: string
): string | null {
    let current = startDir;

    while (true) {
        const configPath = join(current, filename);
        if (existsSync(configPath)) {
            return configPath;
        }

        const parent = dirname(current);
        if (parent === current) {
            // Reached root
            return null;
        }
        current = parent;
    }
}

/** Find project root (directory containing bnk.config.ts) */
export function findProjectRoot(startDir: string = process.cwd()): string | null {
    const configPath = findConfigFile(startDir, "bnk.config.ts");
    return configPath ? dirname(configPath) : null;
}

/** Recursively find all module.bnk.ts files in a directory */
export function findModules(rootDir: string): string[] {
    const modules: string[] = [];

    function scan(dir: string): void {
        const manifestPath = join(dir, "module.bnk.ts");
        if (existsSync(manifestPath)) {
            modules.push(dir);
        }

        try {
            const entries = require("fs").readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                if (
                    entry.isDirectory() &&
                    !entry.name.startsWith(".") &&
                    entry.name !== "node_modules"
                ) {
                    scan(join(dir, entry.name));
                }
            }
        } catch {
            // skip unreadable dirs
        }
    }

    scan(rootDir);
    return modules;
}

// validation

export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}

/** Validate project config */
export function validateProjectConfig(config: ProjectConfig): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const validIsolation: IsolationMode[] = ["subprocess", "thread", "direct", "auto"];
    if (config.isolation && !validIsolation.includes(config.isolation)) {
        errors.push(`Invalid isolation mode: ${config.isolation}`);
    }

    const validErrorModes: ErrorMode[] = ["throw", "null", "event"];
    if (config.onError && !validErrorModes.includes(config.onError)) {
        errors.push(`Invalid error mode: ${config.onError}`);
    }

    if (config.cache?.maxSize && config.cache.maxSize < 0) {
        errors.push("cache.maxSize must be positive");
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}

/** Validate module manifest */
export function validateModuleManifest(manifest: ModuleManifest): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!manifest.name) {
        errors.push("Module name is required");
    }

    if (!manifest.version) {
        errors.push("Module version is required");
    }

    if (!manifest.entry) {
        errors.push("Module entry point is required");
    }

    const validBindings = ["ffi", "napi"];
    if (manifest.binding?.prefer && !validBindings.includes(manifest.binding.prefer)) {
        errors.push(`Invalid binding preference: ${manifest.binding.prefer}`);
    }

    if (!manifest.symbols && !manifest.napiExports) {
        warnings.push("No symbols or exports defined");
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}

// helpers

/** Resolve 'auto' isolation mode based on dev/prod environment */
export function resolveIsolationMode(
    mode: IsolationMode,
    isDev: boolean
): "subprocess" | "thread" | "direct" {
    if (mode === "auto") {
        return isDev ? "subprocess" : "direct";
    }
    return mode as "subprocess" | "thread" | "direct";
}

#!/usr/bin/env bun
/**
 * CLI scaffolding tool for new BunNativeKit projects.
 * @module
 */

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join, resolve } from "path";

// types

type ProjectTemplate = "zig" | "c" | "cpp" | "hybrid";

interface ProjectOptions {
    name: string;
    template: ProjectTemplate;
    description?: string;
    author?: string;
}

// colors

const colors = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",
    green: "\x1b[32m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    magenta: "\x1b[35m",
};

function print(msg: string): void {
    console.log(msg);
}

function success(msg: string): void {
    console.log(`${colors.green}✓${colors.reset} ${msg}`);
}

function info(msg: string): void {
    console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`);
}

function error(msg: string): void {
    console.log(`${colors.red}✗${colors.reset} ${msg}`);
}

// templates

function getPackageJson(options: ProjectOptions): string {
    return JSON.stringify(
        {
            name: options.name,
            version: "0.1.0",
            description: options.description || `A BunNativeKit ${options.template} module`,
            author: options.author || "",
            license: "MIT",
            type: "module",
            main: "dist/index.js",
            types: "dist/index.d.ts",
            scripts: {
                build: "bnk build",
                dev: "bnk dev",
                test: "bnk test",
            },
            devDependencies: {
                "@bunnativekit/types": "workspace:*",
                bnk: "workspace:*",
                typescript: "^5.0.0",
            },
            dependencies: {
                "@bunnativekit/runtime": "workspace:*",
            },
        },
        null,
        2
    );
}

function getBnkConfig(options: ProjectOptions): string {
    return `import { defineConfig } from "@bunnativekit/types";

export default defineConfig({
    // Isolation mode: "auto" | "subprocess" | "direct"
    // auto = isolated in dev, direct in prod
    isolation: "auto",

    // Cache settings
    cache: {
        enabled: true,
    },

    // Debug settings
    debug: {
        enabled: false,
        tracing: false,
    },

    // Modules to build
    modules: ["./native"],
});
`;
}

function getModuleManifest(options: ProjectOptions): string {
    const ext = options.template === "zig" ? ".zig" : options.template === "c" ? ".c" : ".cpp";
    return `import { defineModule } from "@bunnativekit/types";

export default defineModule({
    name: "${options.name}",
    version: "0.1.0",
    description: "${options.description || "A native module"}",

    // Entry point
    entry: "lib${ext}",

    // Binding configuration
    binding: {
        prefer: "ffi",
        fallback: "napi",
    },

    // Isolation requirements
    isolation: {
        required: false,
        thread: false,
    },

    // Exported symbols
    symbols: {
        add: {
            args: ["i32", "i32"],
            returns: "i32",
            description: "Add two integers",
        },
        multiply: {
            args: ["i32", "i32"],
            returns: "i32",
            description: "Multiply two integers",
        },
    },

    // Platform-specific prebuilts (populated after build)
    prebuilt: {},

    license: "MIT",
});
`;
}

function getZigSource(): string {
    return `// Native module implementation in Zig
const std = @import("std");

/// Add two integers
export fn add(a: i32, b: i32) i32 {
    return a + b;
}

/// Multiply two integers
export fn multiply(a: i32, b: i32) i32 {
    return a * b;
}

// Tests
test "add" {
    try std.testing.expectEqual(@as(i32, 5), add(2, 3));
    try std.testing.expectEqual(@as(i32, 0), add(-1, 1));
}

test "multiply" {
    try std.testing.expectEqual(@as(i32, 6), multiply(2, 3));
    try std.testing.expectEqual(@as(i32, -6), multiply(-2, 3));
}
`;
}

function getCSource(): string {
    return `// Native module implementation in C
#include <stdint.h>

// Export symbols for shared library
#ifdef _WIN32
#define EXPORT __declspec(dllexport)
#else
#define EXPORT __attribute__((visibility("default")))
#endif

/// Add two integers
EXPORT int32_t add(int32_t a, int32_t b) {
    return a + b;
}

/// Multiply two integers
EXPORT int32_t multiply(int32_t a, int32_t b) {
    return a * b;
}
`;
}

function getCppSource(): string {
    return `// Native module implementation in C++
#include <cstdint>

// Export symbols for shared library
#ifdef _WIN32
#define EXPORT extern "C" __declspec(dllexport)
#else
#define EXPORT extern "C" __attribute__((visibility("default")))
#endif

/// Add two integers
EXPORT int32_t add(int32_t a, int32_t b) {
    return a + b;
}

/// Multiply two integers
EXPORT int32_t multiply(int32_t a, int32_t b) {
    return a * b;
}
`;
}

function getTsIndex(options: ProjectOptions): string {
    return `/**
 * ${options.name}
 * 
 * TypeScript interface for the native module
 */

import { loadModule } from "@bunnativekit/runtime";
import manifest from "./native/module.bnk";

export interface NativeModule {
    add(a: number, b: number): number;
    multiply(a: number, b: number): number;
}

let moduleInstance: Awaited<ReturnType<typeof loadModule>> | null = null;

/**
 * Load the native module
 */
export async function load(): Promise<NativeModule> {
    if (moduleInstance) {
        return moduleInstance as unknown as NativeModule;
    }

    moduleInstance = await loadModule({
        module: "./native",
        onError: "throw",
    });

    return {
        add: (a: number, b: number) => moduleInstance!.call("add", a, b) as unknown as number,
        multiply: (a: number, b: number) => moduleInstance!.call("multiply", a, b) as unknown as number,
    };
}

/**
 * Close the native module
 */
export async function close(): Promise<void> {
    if (moduleInstance) {
        await moduleInstance.close();
        moduleInstance = null;
    }
}

// Export types
export type { ModuleManifest } from "@bunnativekit/types";
`;
}

function getTsExample(options: ProjectOptions): string {
    return `/**
 * Example usage of ${options.name}
 */

import { load, close } from "./index";

async function main() {
    console.log("Loading native module...");
    
    const mod = await load();
    
    console.log("Testing add function:");
    console.log("  2 + 3 =", mod.add(2, 3));
    console.log("  -1 + 1 =", mod.add(-1, 1));
    
    console.log("\\nTesting multiply function:");
    console.log("  2 * 3 =", mod.multiply(2, 3));
    console.log("  -2 * 3 =", mod.multiply(-2, 3));
    
    await close();
    console.log("\\nModule closed successfully!");
}

main().catch(console.error);
`;
}

function getTsConfig(): string {
    return JSON.stringify(
        {
            extends: "../../tsconfig.base.json",
            compilerOptions: {
                outDir: "./dist",
                rootDir: "./src",
            },
            include: ["src/**/*", "native/**/*.ts"],
            exclude: ["node_modules", "dist"],
        },
        null,
        2
    );
}

function getGitignore(): string {
    return `# Dependencies
node_modules/

# Build outputs
dist/
.bnk/
*.so
*.dylib
*.dll

# Cache
.cache/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
`;
}

function getReadme(options: ProjectOptions): string {
    return `# ${options.name}

${options.description || "A BunNativeKit native module"}

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.0
- [Zig](https://ziglang.org) >= 0.11 (for compilation)

### Installation

\`\`\`bash
bun install
\`\`\`

### Build

\`\`\`bash
bun run build
\`\`\`

### Development

\`\`\`bash
bun run dev
\`\`\`

### Testing

\`\`\`bash
bun run test
\`\`\`

## Usage

\`\`\`typescript
import { load } from "./${options.name}";

const mod = await load();

console.log(mod.add(2, 3));      // 5
console.log(mod.multiply(2, 3)); // 6
\`\`\`

## Project Structure

\`\`\`
${options.name}/
├── native/           # Native source code
│   ├── lib.${options.template === "zig" ? "zig" : options.template === "c" ? "c" : "cpp"}      # Main implementation
│   └── module.bnk.ts # Module manifest
├── src/              # TypeScript source
│   ├── index.ts      # Main entry point
│   └── example.ts    # Usage example
├── bnk.config.ts     # BNK configuration
└── package.json
\`\`\`

## License

MIT
`;
}

// project creation

function createProject(options: ProjectOptions): void {
    const projectPath = resolve(process.cwd(), options.name);

    // Check if directory exists
    if (existsSync(projectPath)) {
        error(`Directory already exists: ${options.name}`);
        process.exit(1);
    }

    print("");
    info(`Creating ${options.template.toUpperCase()} project: ${colors.bold}${options.name}${colors.reset}`);
    print("");

    // Create directories
    mkdirSync(projectPath, { recursive: true });
    mkdirSync(join(projectPath, "native"), { recursive: true });
    mkdirSync(join(projectPath, "src"), { recursive: true });

    // Write files
    writeFileSync(join(projectPath, "package.json"), getPackageJson(options));
    success("Created package.json");

    writeFileSync(join(projectPath, "bnk.config.ts"), getBnkConfig(options));
    success("Created bnk.config.ts");

    writeFileSync(join(projectPath, "native", "module.bnk.ts"), getModuleManifest(options));
    success("Created native/module.bnk.ts");

    // Native source based on template
    const ext = options.template === "zig" ? ".zig" : options.template === "c" ? ".c" : ".cpp";
    const source =
        options.template === "zig"
            ? getZigSource()
            : options.template === "c"
                ? getCSource()
                : getCppSource();
    writeFileSync(join(projectPath, "native", `lib${ext}`), source);
    success(`Created native/lib${ext}`);

    // TypeScript files
    writeFileSync(join(projectPath, "src", "index.ts"), getTsIndex(options));
    success("Created src/index.ts");

    writeFileSync(join(projectPath, "src", "example.ts"), getTsExample(options));
    success("Created src/example.ts");

    writeFileSync(join(projectPath, "tsconfig.json"), getTsConfig());
    success("Created tsconfig.json");

    writeFileSync(join(projectPath, ".gitignore"), getGitignore());
    success("Created .gitignore");

    writeFileSync(join(projectPath, "README.md"), getReadme(options));
    success("Created README.md");

    print("");
    print(`${colors.green}${colors.bold}Project created successfully!${colors.reset}`);
    print("");
    print("Next steps:");
    print(`  ${colors.cyan}cd ${options.name}${colors.reset}`);
    print(`  ${colors.cyan}bun install${colors.reset}`);
    print(`  ${colors.cyan}bun run build${colors.reset}`);
    print("");
}

// prompts

async function prompt(question: string, defaultValue?: string): Promise<string> {
    const defaultText = defaultValue ? ` ${colors.dim}(${defaultValue})${colors.reset}` : "";
    process.stdout.write(`${question}${defaultText}: `);

    const reader = Bun.stdin.stream().getReader();
    const decoder = new TextDecoder();
    let input = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        input += decoder.decode(value);
        if (input.includes("\n")) break;
    }

    reader.releaseLock();
    const result = input.trim();
    return result || defaultValue || "";
}

async function promptSelect(question: string, options: string[]): Promise<string> {
    print(question);
    for (let i = 0; i < options.length; i++) {
        print(`  ${colors.cyan}${i + 1}${colors.reset}) ${options[i]}`);
    }

    const answer = await prompt("Select option", "1");
    const index = parseInt(answer, 10) - 1;

    if (index >= 0 && index < options.length) {
        return options[index];
    }

    return options[0];
}

// main

async function main(): Promise<void> {
    const args = process.argv.slice(2);

    print("");
    print(`${colors.bold}${colors.magenta}create-bnk${colors.reset} - Scaffold a new BunNativeKit project`);
    print("");

    // Parse arguments
    let name = args[0];
    let template: ProjectTemplate = "zig";

    // Check for --template flag
    const templateIndex = args.indexOf("--template");
    if (templateIndex !== -1 && args[templateIndex + 1]) {
        const t = args[templateIndex + 1] as ProjectTemplate;
        if (["zig", "c", "cpp", "hybrid"].includes(t)) {
            template = t;
        }
    }

    // Interactive mode if no name provided
    if (!name) {
        name = await prompt("Project name", "my-bnk-module");

        const templateChoice = await promptSelect("Select template:", [
            "zig - Zig native module (recommended)",
            "c - C native module",
            "cpp - C++ native module",
            "hybrid - TypeScript + native hybrid",
        ]);

        template = templateChoice.split(" ")[0] as ProjectTemplate;
    }

    const options: ProjectOptions = {
        name,
        template,
        description: await prompt("Description", `A ${template} native module`),
        author: await prompt("Author", process.env.USER || ""),
    };

    createProject(options);
}

main().catch((err) => {
    error(err.message);
    process.exit(1);
});

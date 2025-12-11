/**
 * Initialize a new BunNativeKit project with templates.
 * @module
 */

import { Command } from "commander";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join, basename } from "path";
import { colors, header, success, error, info, warn } from "../utils/colors";

export function createInitCommand(): Command {
    return new Command("init")
        .description("Initialize a new BNK project")
        .argument("[name]", "Project name", basename(process.cwd()))
        .option("-t, --template <template>", "Project template", "zig")
        .option("-d, --dir <dir>", "Target directory", ".")
        .option("--no-git", "Skip git initialization")
        .option("-f, --force", "Overwrite existing files")
        .action(async (name: string, options) => {
            await runInit(name, options);
        });
}

interface InitOptions {
    template: string;
    dir: string;
    git: boolean;
    force: boolean;
}

async function runInit(name: string, options: InitOptions): Promise<void> {
    header("BunNativeKit - Project Init");

    const targetDir = options.dir === "." ? process.cwd() : join(process.cwd(), options.dir);
    const projectName = name || basename(targetDir);

    info(`Creating project: ${colors.bold(projectName)}`);
    info(`Template: ${options.template}`);
    info(`Directory: ${targetDir}`);

    // Check if directory exists and has files
    if (existsSync(targetDir)) {
        const files = await Array.fromAsync(new Bun.Glob("*").scan(targetDir));
        if (files.length > 0 && !options.force) {
            error("Directory is not empty. Use --force to overwrite.");
            process.exit(1);
        }
    } else {
        mkdirSync(targetDir, { recursive: true });
    }

    // Create project structure based on template
    switch (options.template) {
        case "zig":
            await createZigProject(targetDir, projectName);
            break;
        case "c":
        case "cpp":
            await createCProject(targetDir, projectName, options.template);
            break;
        case "hybrid":
            await createHybridProject(targetDir, projectName);
            break;
        default:
            error(`Unknown template: ${options.template}`);
            info("Available templates: zig, c, cpp, hybrid");
            process.exit(1);
    }

    // Initialize git
    if (options.git) {
        try {
            const proc = Bun.spawn(["git", "init"], {
                cwd: targetDir,
                stdout: "ignore",
                stderr: "ignore",
            });
            await proc.exited;
            success("Initialized git repository");
        } catch {
            warn("Could not initialize git repository");
        }
    }

    console.log();
    success(`Project ${colors.bold(projectName)} created successfully!`);
    console.log();
    info("Next steps:");
    console.log(`  cd ${options.dir === "." ? "." : options.dir}`);
    console.log("  bun install");
    console.log("  bnk build");
    console.log();
}

async function createZigProject(dir: string, name: string): Promise<void> {
    // Create directories
    mkdirSync(join(dir, "native"), { recursive: true });
    mkdirSync(join(dir, "src"), { recursive: true });

    // package.json
    writeFileSync(
        join(dir, "package.json"),
        JSON.stringify(
            {
                name,
                version: "0.1.0",
                type: "module",
                main: "./src/index.ts",
                scripts: {
                    build: "bnk build",
                    dev: "bnk dev",
                    test: "bnk test",
                },
                dependencies: {
                    "@bunnativekit/runtime": "latest",
                },
                devDependencies: {
                    "@bunnativekit/types": "latest",
                    "@types/bun": "latest",
                },
            },
            null,
            2
        )
    );
    success("Created package.json");

    // bnk.config.ts
    writeFileSync(
        join(dir, "bnk.config.ts"),
        `import { defineConfig } from "@bunnativekit/types";

export default defineConfig({
    isolation: "auto",
    modules: ["./native"],
});
`
    );
    success("Created bnk.config.ts");

    // module.bnk.ts
    writeFileSync(
        join(dir, "native", "module.bnk.ts"),
        `import { defineModule } from "@bunnativekit/types";

export default defineModule({
    name: "${name}",
    version: "0.1.0",
    entry: "lib.zig",
    binding: {
        prefer: "ffi",
        fallback: "napi",
    },
    symbols: {
        add: {
            args: ["i32", "i32"],
            returns: "i32",
            description: "Add two integers",
        },
    },
});
`
    );
    success("Created native/module.bnk.ts");

    // lib.zig
    writeFileSync(
        join(dir, "native", "lib.zig"),
        `const std = @import("std");

export fn add(a: i32, b: i32) callconv(.C) i32 {
    return a + b;
}

test "add" {
    try std.testing.expect(add(1, 2) == 3);
}
`
    );
    success("Created native/lib.zig");

    // src/index.ts
    writeFileSync(
        join(dir, "src", "index.ts"),
        `import { loadModule } from "@bunnativekit/runtime";

const mod = await loadModule("${name}");

const result = mod.add(1, 2);
console.log("1 + 2 =", result);
`
    );
    success("Created src/index.ts");

    // .gitignore
    writeFileSync(
        join(dir, ".gitignore"),
        `node_modules/
.bnk/
dist/
*.log
`
    );
    success("Created .gitignore");
}

async function createCProject(dir: string, name: string, lang: string): Promise<void> {
    // Create directories
    mkdirSync(join(dir, "native"), { recursive: true });
    mkdirSync(join(dir, "src"), { recursive: true });

    const ext = lang === "cpp" ? "cpp" : "c";
    const entryFile = `lib.${ext}`;

    // package.json
    writeFileSync(
        join(dir, "package.json"),
        JSON.stringify(
            {
                name,
                version: "0.1.0",
                type: "module",
                main: "./src/index.ts",
                scripts: {
                    build: "bnk build",
                    dev: "bnk dev",
                    test: "bnk test",
                },
                dependencies: {
                    "@bunnativekit/runtime": "latest",
                },
                devDependencies: {
                    "@bunnativekit/types": "latest",
                    "@types/bun": "latest",
                },
            },
            null,
            2
        )
    );
    success("Created package.json");

    // bnk.config.ts
    writeFileSync(
        join(dir, "bnk.config.ts"),
        `import { defineConfig } from "@bunnativekit/types";

export default defineConfig({
    isolation: "auto",
    modules: ["./native"],
});
`
    );
    success("Created bnk.config.ts");

    // module.bnk.ts
    writeFileSync(
        join(dir, "native", "module.bnk.ts"),
        `import { defineModule } from "@bunnativekit/types";

export default defineModule({
    name: "${name}",
    version: "0.1.0",
    entry: "${entryFile}",
    binding: {
        prefer: "ffi",
        fallback: "napi",
    },
    symbols: {
        add: {
            args: ["i32", "i32"],
            returns: "i32",
            description: "Add two integers",
        },
    },
});
`
    );
    success("Created native/module.bnk.ts");

    // lib.c or lib.cpp
    if (lang === "cpp") {
        writeFileSync(
            join(dir, "native", entryFile),
            `extern "C" {

int add(int a, int b) {
    return a + b;
}

}
`
        );
    } else {
        writeFileSync(
            join(dir, "native", entryFile),
            `int add(int a, int b) {
    return a + b;
}
`
        );
    }
    success(`Created native/${entryFile}`);

    // src/index.ts
    writeFileSync(
        join(dir, "src", "index.ts"),
        `import { loadModule } from "@bunnativekit/runtime";

const mod = await loadModule("${name}");

const result = mod.add(1, 2);
console.log("1 + 2 =", result);
`
    );
    success("Created src/index.ts");

    // .gitignore
    writeFileSync(
        join(dir, ".gitignore"),
        `node_modules/
.bnk/
dist/
*.log
`
    );
    success("Created .gitignore");
}

async function createHybridProject(dir: string, name: string): Promise<void> {
    // Create directories
    mkdirSync(join(dir, "native", "zig"), { recursive: true });
    mkdirSync(join(dir, "native", "cpp"), { recursive: true });
    mkdirSync(join(dir, "src"), { recursive: true });

    // package.json
    writeFileSync(
        join(dir, "package.json"),
        JSON.stringify(
            {
                name,
                version: "0.1.0",
                type: "module",
                main: "./src/index.ts",
                scripts: {
                    build: "bnk build",
                    dev: "bnk dev",
                    test: "bnk test",
                },
                dependencies: {
                    "@bunnativekit/runtime": "latest",
                },
                devDependencies: {
                    "@bunnativekit/types": "latest",
                    "@types/bun": "latest",
                },
            },
            null,
            2
        )
    );
    success("Created package.json");

    // bnk.config.ts
    writeFileSync(
        join(dir, "bnk.config.ts"),
        `import { defineConfig } from "@bunnativekit/types";

export default defineConfig({
    isolation: "auto",
    modules: ["./native/zig", "./native/cpp"],
});
`
    );
    success("Created bnk.config.ts");

    // Zig module
    writeFileSync(
        join(dir, "native", "zig", "module.bnk.ts"),
        `import { defineModule } from "@bunnativekit/types";

export default defineModule({
    name: "${name}-zig",
    version: "0.1.0",
    entry: "lib.zig",
    binding: { prefer: "ffi" },
    symbols: {
        add: { args: ["i32", "i32"], returns: "i32" },
    },
});
`
    );
    writeFileSync(
        join(dir, "native", "zig", "lib.zig"),
        `export fn add(a: i32, b: i32) callconv(.C) i32 {
    return a + b;
}
`
    );
    success("Created native/zig/");

    // C++ module
    writeFileSync(
        join(dir, "native", "cpp", "module.bnk.ts"),
        `import { defineModule } from "@bunnativekit/types";

export default defineModule({
    name: "${name}-cpp",
    version: "0.1.0",
    entry: "lib.cpp",
    binding: { prefer: "ffi" },
    symbols: {
        multiply: { args: ["i32", "i32"], returns: "i32" },
    },
});
`
    );
    writeFileSync(
        join(dir, "native", "cpp", "lib.cpp"),
        `extern "C" {

int multiply(int a, int b) {
    return a * b;
}

}
`
    );
    success("Created native/cpp/");

    // src/index.ts
    writeFileSync(
        join(dir, "src", "index.ts"),
        `import { loadModule } from "@bunnativekit/runtime";

const zigMod = await loadModule("${name}-zig");
const cppMod = await loadModule("${name}-cpp");

console.log("1 + 2 =", zigMod.add(1, 2));
console.log("3 * 4 =", cppMod.multiply(3, 4));
`
    );
    success("Created src/index.ts");

    // .gitignore
    writeFileSync(
        join(dir, ".gitignore"),
        `node_modules/
.bnk/
dist/
*.log
`
    );
    success("Created .gitignore");
}

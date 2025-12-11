#!/usr/bin/env bun

import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const WORKSPACE_ROOT = import.meta.dir.replace("/scripts", "");
const AUTO_YES = process.argv.includes("--yes") || process.argv.includes("-y");
const FORCE_PUBLISH = process.argv.includes("--force") || process.argv.includes("-f");

interface PackageJson {
    name: string;
    version: string;
    private?: boolean;
    publishConfig?: {
        access?: string;
    };
    [key: string]: unknown;
}

interface PackageInfo {
    path: string;
    pkgJson: PackageJson;
    hasChanges: boolean;
    newVersion?: string;
}

function readJson(path: string): PackageJson {
    return JSON.parse(readFileSync(path, "utf-8"));
}

function writeJson(path: string, data: PackageJson): void {
    writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
}

function bumpPatchVersion(version: string): string {
    const [major, minor, patch] = version.split(".").map(Number);
    return `${major}.${minor}.${patch + 1}`;
}

function findAllPackages(): string[] {
    const dirs: string[] = [];

    for (const category of ["packages", "apps", "internal"]) {
        const categoryPath = join(WORKSPACE_ROOT, category);
        if (!existsSync(categoryPath)) continue;

        for (const name of readdirSync(categoryPath)) {
            const pkgPath = join(categoryPath, name);
            const pkgJsonPath = join(pkgPath, "package.json");

            if (existsSync(pkgJsonPath)) {
                dirs.push(join(category, name));
            }
        }
    }

    return dirs;
}

function getChangedFiles(): Set<string> {
    const changed = new Set<string>();

    // Get modified tracked files
    const diffResult = Bun.spawnSync(["git", "diff", "--name-only", "HEAD"], {
        cwd: WORKSPACE_ROOT,
        stdout: "pipe",
    });

    if (diffResult.exitCode === 0) {
        const files = diffResult.stdout.toString().trim().split("\n").filter(Boolean);
        files.forEach(f => changed.add(f));
    }

    // Get staged files
    const stagedResult = Bun.spawnSync(["git", "diff", "--name-only", "--cached"], {
        cwd: WORKSPACE_ROOT,
        stdout: "pipe",
    });

    if (stagedResult.exitCode === 0) {
        const files = stagedResult.stdout.toString().trim().split("\n").filter(Boolean);
        files.forEach(f => changed.add(f));
    }

    // Get untracked files
    const untrackedResult = Bun.spawnSync(["git", "ls-files", "--others", "--exclude-standard"], {
        cwd: WORKSPACE_ROOT,
        stdout: "pipe",
    });

    if (untrackedResult.exitCode === 0) {
        const files = untrackedResult.stdout.toString().trim().split("\n").filter(Boolean);
        files.forEach(f => changed.add(f));
    }

    return changed;
}

function isPublishable(pkgJson: PackageJson): boolean {
    if (pkgJson.private) return false;
    return pkgJson.publishConfig?.access === "public";
}

function getPackageInfo(pkgDir: string, changedFiles: Set<string>): PackageInfo {
    const pkgPath = join(WORKSPACE_ROOT, pkgDir);
    const pkgJsonPath = join(pkgPath, "package.json");
    const pkgJson = readJson(pkgJsonPath);

    // Check if any files in this package changed
    const hasChanges = Array.from(changedFiles).some(file => file.startsWith(pkgDir + "/"));

    return {
        path: pkgPath,
        pkgJson,
        hasChanges,
        newVersion: hasChanges ? bumpPatchVersion(pkgJson.version) : undefined,
    };
}

async function promptConfirmation(): Promise<boolean> {
    if (AUTO_YES) return true;

    process.stdout.write("Proceed with publish? [y/N] ");

    for await (const line of console) {
        const answer = line.trim().toLowerCase();
        if (answer === "y" || answer === "yes") return true;
        if (answer === "n" || answer === "no" || answer === "") return false;
        process.stdout.write("Please answer y or n: ");
    }

    return false;
}

async function main() {
    const allPackages = findAllPackages();
    console.log(`Found ${allPackages.length} packages`);

    const changedFiles = getChangedFiles();
    console.log(`Detected ${changedFiles.size} changed files`);

    const packages = allPackages.map(dir => getPackageInfo(dir, changedFiles));
    const publishable = packages.filter(p => isPublishable(p.pkgJson));
    const toBump = FORCE_PUBLISH ? publishable : publishable.filter(p => p.hasChanges);

    if (toBump.length === 0) {
        const message = FORCE_PUBLISH
            ? "No publishable packages found."
            : "No packages with changes detected. Nothing to publish.";
        console.log(message);
        return;
    }

    if (FORCE_PUBLISH) {
        console.log("Force publish mode - all publishable packages will be published:");
        for (const pkg of toBump) {
            console.log(`~ ${pkg.pkgJson.name}@${pkg.pkgJson.version}`);
        }
    } else {
        console.log("Packages to bump:");
        for (const pkg of toBump) {
            console.log(`~ ${pkg.pkgJson.name}: ${pkg.pkgJson.version} -> ${pkg.newVersion}`);
        }
    }
    console.log();

    if (!FORCE_PUBLISH) {
        console.log("Bumping versions...");
        for (const pkg of toBump) {
            const pkgJsonPath = join(pkg.path, "package.json");
            pkg.pkgJson.version = pkg.newVersion!;
            writeJson(pkgJsonPath, pkg.pkgJson);
            console.log(`+ ${pkg.pkgJson.name}@${pkg.newVersion}`);
        }
        console.log();
    }

    console.log("Building packages...");
    const buildResult = Bun.spawnSync(["bun", "run", "build"], {
        cwd: WORKSPACE_ROOT,
        stdout: "inherit",
        stderr: "inherit",
    });

    if (buildResult.exitCode !== 0) {
        console.error("\n[error] Build failed!");
        process.exit(1);
    }
    console.log();

    console.log("Will publish:");
    for (const pkg of toBump) {
        const version = pkg.newVersion || pkg.pkgJson.version;
        console.log(`bun publish --access public`);
        console.log(`|${pkg.pkgJson.name}@${version}`);
        console.log(`|cwd: ${pkg.path}\n`);
    }

    const confirmed = await promptConfirmation();
    if (!confirmed) {
        console.log("Publish cancelled");
        process.exit(0);
    }

    console.log("Publishing...");
    let published = 0;
    let failed = 0;

    for (const pkg of toBump) {
        console.log(`~Publishing ${pkg.pkgJson.name}...`);

        const result = Bun.spawnSync(["bun", "publish", "--access", "public"], {
            cwd: pkg.path,
            stdout: "pipe",
            stderr: "pipe",
        });

        if (result.exitCode === 0) {
            console.log(`+ ${pkg.pkgJson.name}@${pkg.pkgJson.version}`);
            published++;
        } else {
            console.error(`! Failed: ${pkg.pkgJson.name}`);
            console.error(result.stderr.toString());
            failed++;
        }
        console.log();
    }

    // Summary
    console.log(`Done publishing ${published} package(s)`);
    if (failed > 0) {
        console.error(`Warning: ${failed} package(s) failed`);
        process.exit(1);
    }
}

main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});

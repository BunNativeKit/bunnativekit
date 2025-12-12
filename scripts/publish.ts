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
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    publishConfig?: {
        access?: string;
    };
    [key: string]: unknown;
}

interface PackageInfo {
    path: string;
    dir: string;
    pkgJson: PackageJson;
    hasChanges: boolean;
}

function readJson(path: string): PackageJson {
    return JSON.parse(readFileSync(path, "utf-8"));
}

/**
 * Priority order for package categories.
 * Lower number = published first.
 * internal packages should be published before packages, which should be published before apps.
 */
const CATEGORY_PRIORITY: Record<string, number> = {
    internal: 0,
    packages: 1,
    apps: 2,
};

function findAllPackages(): string[] {
    const dirs: string[] = [];

    // Collect packages in priority order: internal -> packages -> apps
    for (const category of ["internal", "packages", "apps"]) {
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

/**
 * Get all workspace dependencies from a package.json (dependencies that use "workspace:*")
 */
function getWorkspaceDeps(pkgJson: PackageJson): string[] {
    const deps: string[] = [];
    const allDeps = {
        ...pkgJson.dependencies,
        ...pkgJson.peerDependencies,
    };

    for (const [name, version] of Object.entries(allDeps)) {
        if (version.startsWith("workspace:")) {
            deps.push(name);
        }
    }

    return deps;
}

/**
 * Topologically sort packages so dependencies are published before dependents.
 * Uses Kahn's algorithm for topological sorting.
 */
function topologicalSort(packages: PackageInfo[]): PackageInfo[] {
    // Create a map of package name to package info
    const packageMap = new Map<string, PackageInfo>();
    for (const pkg of packages) {
        packageMap.set(pkg.pkgJson.name, pkg);
    }

    // Build adjacency list and in-degree count
    // Edge from A -> B means A depends on B (B must be published first)
    const inDegree = new Map<string, number>();
    const dependents = new Map<string, string[]>(); // package -> packages that depend on it

    for (const pkg of packages) {
        const name = pkg.pkgJson.name;
        if (!inDegree.has(name)) {
            inDegree.set(name, 0);
        }
        if (!dependents.has(name)) {
            dependents.set(name, []);
        }
    }

    // Calculate in-degrees based on workspace dependencies
    for (const pkg of packages) {
        const name = pkg.pkgJson.name;
        const deps = getWorkspaceDeps(pkg.pkgJson);

        for (const dep of deps) {
            // Only count if the dependency is in our publishable set
            if (packageMap.has(dep)) {
                inDegree.set(name, (inDegree.get(name) || 0) + 1);
                dependents.get(dep)!.push(name);
            }
        }
    }

    // Start with packages that have no dependencies (in-degree = 0)
    // Sort by category priority first, then alphabetically for deterministic order
    const queue: PackageInfo[] = packages
        .filter(pkg => inDegree.get(pkg.pkgJson.name) === 0)
        .sort((a, b) => {
            const catA = a.dir.split("/")[0];
            const catB = b.dir.split("/")[0];
            const priorityDiff = (CATEGORY_PRIORITY[catA] ?? 99) - (CATEGORY_PRIORITY[catB] ?? 99);
            if (priorityDiff !== 0) return priorityDiff;
            return a.pkgJson.name.localeCompare(b.pkgJson.name);
        });

    const sorted: PackageInfo[] = [];

    while (queue.length > 0) {
        const pkg = queue.shift()!;
        sorted.push(pkg);

        // For each package that depends on this one, decrement its in-degree
        const deps = dependents.get(pkg.pkgJson.name) || [];
        const readyToAdd: PackageInfo[] = [];

        for (const depName of deps) {
            const newDegree = (inDegree.get(depName) || 0) - 1;
            inDegree.set(depName, newDegree);

            if (newDegree === 0) {
                const depPkg = packageMap.get(depName);
                if (depPkg) {
                    readyToAdd.push(depPkg);
                }
            }
        }

        // Sort newly ready packages by category priority then name
        readyToAdd.sort((a, b) => {
            const catA = a.dir.split("/")[0];
            const catB = b.dir.split("/")[0];
            const priorityDiff = (CATEGORY_PRIORITY[catA] ?? 99) - (CATEGORY_PRIORITY[catB] ?? 99);
            if (priorityDiff !== 0) return priorityDiff;
            return a.pkgJson.name.localeCompare(b.pkgJson.name);
        });

        queue.push(...readyToAdd);
    }

    // Check for cycles
    if (sorted.length !== packages.length) {
        const remaining = packages.filter(p => !sorted.includes(p));
        console.error("Circular dependency detected among packages:");
        for (const pkg of remaining) {
            const deps = getWorkspaceDeps(pkg.pkgJson).filter(d => packageMap.has(d));
            console.error(`${pkg.pkgJson.name} -> [${deps.join(", ")}]`);
        }
        throw new Error("Cannot publish due to circular dependencies");
    }

    return sorted;
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
        dir: pkgDir,
        pkgJson,
        hasChanges
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

    if (publishable.length === 0) {
        const message = FORCE_PUBLISH
            ? "No publishable packages found."
            : "No packages with changes detected. Nothing to publish.";
        console.log(message);
        return;
    }

    // Sort packages topologically so dependencies are published first
    const sortedPackages = topologicalSort(publishable);

    console.log("Packages to publish:");
    for (const pkg of sortedPackages) {
        console.log(`  ${pkg.pkgJson.name}@${pkg.pkgJson.version}`);
    }

    console.log("Building packages...");
    const buildResult = Bun.spawnSync(["bun", "run", "build"], {
        cwd: WORKSPACE_ROOT,
        stdout: "inherit",
        stderr: "inherit",
    });

    if (buildResult.exitCode !== 0) {
        console.error("Build failed!");
        process.exit(1);
    }

    const confirmed = await promptConfirmation();
    if (!confirmed) {
        console.log("Publish cancelled");
        process.exit(0);
    }

    let published = 0;
    let failed = 0;

    for (const pkg of sortedPackages) {
        const result = Bun.spawnSync(["bun", "publish", "--access", "public"], {
            cwd: pkg.path,
            stdout: "pipe",
            stderr: "pipe",
        });

        if (result.exitCode === 0) {
            console.log(`Published ${pkg.pkgJson.name}@${pkg.pkgJson.version}`);
            published++;
        } else {
            console.error(`Failed ${pkg.pkgJson.name}: ${result.stderr.toString().trim()}`);
            failed++;
        }
    }

    console.log(`Published ${published} packages${failed > 0 ? `, ${failed} failed` : ""}`);
    if (failed > 0) process.exit(1);
}

main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});

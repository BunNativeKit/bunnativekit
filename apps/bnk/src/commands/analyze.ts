/**
 * Analyze logs, traces, crash dumps, and memory usage.
 * @module
 */

import { Command } from "commander";
import { existsSync, readFileSync, readdirSync } from "fs";
import { join, resolve } from "path";
import { colors, header, info, error, success, warn, keyValue } from "../utils/colors";

export function createAnalyzeCommand(): Command {
    return new Command("analyze")
        .description("Analyze logs, traces, stacks, memory")
        .argument("[path]", "Path to trace/log file or directory")
        .option("-t, --type <type>", "Analysis type (trace, log, crash, memory)")
        .option("-f, --format <format>", "Output format (text, json, chrome)", "text")
        .option("--last", "Analyze the most recent file")
        .option("-v, --verbose", "Verbose output")
        .action(async (path: string | undefined, options) => {
            await runAnalyze(path, options);
        });
}

interface AnalyzeOptions {
    type?: string;
    format: string;
    last?: boolean;
    verbose?: boolean;
}

async function runAnalyze(inputPath: string | undefined, options: AnalyzeOptions): Promise<void> {
    header("BunNativeKit - Analyze");

    // Determine what to analyze
    let targetPath: string;

    if (inputPath) {
        targetPath = resolve(process.cwd(), inputPath);
    } else if (options.last) {
        // Find most recent file in cache
        const { getCacheSubdir } = await import("@bunnativekit/platform");
        const traceDir = getCacheSubdir("traces");

        const files = readdirSync(traceDir)
            .map((f) => ({
                name: f,
                path: join(traceDir, f),
                mtime: Bun.file(join(traceDir, f)).lastModified,
            }))
            .sort((a, b) => b.mtime - a.mtime);

        if (files.length === 0) {
            error("No trace files found.");
            info("Run with --verbose to generate traces, then analyze them.");
            process.exit(1);
        }

        targetPath = files[0].path;
        info(`Analyzing most recent: ${files[0].name}`);
    } else {
        // Look in common locations
        const searchPaths = [
            ".bnk/trace.json",
            ".bnk/crash.log",
            "trace.json",
            "crash.log",
        ];

        const found = searchPaths.find((p) => existsSync(resolve(process.cwd(), p)));

        if (!found) {
            error("No file specified and no trace/log files found.");
            info("Usage: bnk analyze <path>");
            info("       bnk analyze --last");
            process.exit(1);
        }

        targetPath = resolve(process.cwd(), found);
        info(`Found: ${found}`);
    }

    if (!existsSync(targetPath)) {
        error(`File not found: ${targetPath}`);
        process.exit(1);
    }

    // Detect file type
    const fileName = targetPath.split("/").pop() || "";
    let fileType = options.type;

    if (!fileType) {
        if (fileName.endsWith(".json")) {
            fileType = "trace";
        } else if (fileName.includes("crash") || fileName.includes("core")) {
            fileType = "crash";
        } else if (fileName.endsWith(".log")) {
            fileType = "log";
        } else {
            fileType = "trace";
        }
    }

    console.log();

    switch (fileType) {
        case "trace":
            await analyzeTrace(targetPath, options);
            break;
        case "log":
            await analyzeLog(targetPath, options);
            break;
        case "crash":
            await analyzeCrash(targetPath, options);
            break;
        case "memory":
            await analyzeMemory(targetPath, options);
            break;
        default:
            error(`Unknown analysis type: ${fileType}`);
            info("Supported types: trace, log, crash, memory");
            process.exit(1);
    }
}

interface TraceEvent {
    name: string;
    cat?: string;
    ph: string;
    ts: number;
    dur?: number;
    pid?: number;
    tid?: number;
    args?: Record<string, unknown>;
}

async function analyzeTrace(path: string, options: AnalyzeOptions): Promise<void> {
    info("Analyzing trace...");

    try {
        const content = readFileSync(path, "utf-8");
        const data = JSON.parse(content);

        // Chrome DevTools trace format
        const events: TraceEvent[] = Array.isArray(data) ? data : data.traceEvents || [];

        if (events.length === 0) {
            warn("No trace events found.");
            return;
        }

        // Analyze events
        const stats = {
            totalEvents: events.length,
            categories: new Map<string, number>(),
            durations: new Map<string, number[]>(),
            errors: 0,
        };

        for (const event of events) {
            // Count by category
            const cat = event.cat || "uncategorized";
            stats.categories.set(cat, (stats.categories.get(cat) || 0) + 1);

            // Collect durations for complete events
            if (event.ph === "X" && event.dur !== undefined) {
                const durs = stats.durations.get(event.name) || [];
                durs.push(event.dur);
                stats.durations.set(event.name, durs);
            }

            // Count errors
            if (event.name.toLowerCase().includes("error")) {
                stats.errors++;
            }
        }

        // Output
        if (options.format === "json") {
            console.log(JSON.stringify({
                totalEvents: stats.totalEvents,
                categories: Object.fromEntries(stats.categories),
                errors: stats.errors,
            }, null, 2));
            return;
        }

        console.log(colors.bold("Trace Summary:"));
        keyValue("Total Events", String(stats.totalEvents));
        keyValue("Errors", String(stats.errors));
        console.log();

        console.log(colors.bold("Categories:"));
        for (const [cat, count] of stats.categories) {
            keyValue(cat, String(count));
        }
        console.log();

        // Slowest operations
        if (stats.durations.size > 0) {
            console.log(colors.bold("Slowest Operations:"));

            const avgDurations = Array.from(stats.durations.entries())
                .map(([name, durs]) => ({
                    name,
                    avg: durs.reduce((a, b) => a + b, 0) / durs.length / 1000, // convert to ms
                    count: durs.length,
                }))
                .sort((a, b) => b.avg - a.avg)
                .slice(0, 10);

            for (const op of avgDurations) {
                console.log(`  ${op.name}: ${op.avg.toFixed(2)}ms avg (${op.count} calls)`);
            }
        }

        console.log();
        success("Trace analysis complete.");

        // Hint about Chrome DevTools
        info("To view in Chrome DevTools:");
        console.log("  1. Open chrome://tracing");
        console.log(`  2. Load: ${path}`);
    } catch (err) {
        error(`Failed to parse trace: ${err instanceof Error ? err.message : String(err)}`);
    }
}

async function analyzeLog(path: string, options: AnalyzeOptions): Promise<void> {
    info("Analyzing log...");

    try {
        const content = readFileSync(path, "utf-8");
        const lines = content.split("\n").filter((l) => l.trim());

        const stats = {
            totalLines: lines.length,
            errors: 0,
            warnings: 0,
            patterns: new Map<string, number>(),
        };

        for (const line of lines) {
            const lower = line.toLowerCase();

            if (lower.includes("error") || lower.includes("[e]")) {
                stats.errors++;
            }
            if (lower.includes("warn") || lower.includes("[w]")) {
                stats.warnings++;
            }

            // Extract patterns (simplified)
            const match = line.match(/\[(\w+)\]/);
            if (match) {
                const pattern = match[1];
                stats.patterns.set(pattern, (stats.patterns.get(pattern) || 0) + 1);
            }
        }

        if (options.format === "json") {
            console.log(JSON.stringify({
                totalLines: stats.totalLines,
                errors: stats.errors,
                warnings: stats.warnings,
                patterns: Object.fromEntries(stats.patterns),
            }, null, 2));
            return;
        }

        console.log(colors.bold("Log Summary:"));
        keyValue("Total Lines", String(stats.totalLines));
        keyValue("Errors", stats.errors > 0 ? colors.red(String(stats.errors)) : "0");
        keyValue("Warnings", stats.warnings > 0 ? colors.yellow(String(stats.warnings)) : "0");
        console.log();

        if (stats.patterns.size > 0) {
            console.log(colors.bold("Log Categories:"));
            for (const [pattern, count] of stats.patterns) {
                keyValue(pattern, String(count));
            }
        }

        console.log();
        success("Log analysis complete.");
    } catch (err) {
        error(`Failed to parse log: ${err instanceof Error ? err.message : String(err)}`);
    }
}

async function analyzeCrash(path: string, options: AnalyzeOptions): Promise<void> {
    info("Analyzing crash dump...");

    try {
        const content = readFileSync(path, "utf-8");

        // Look for common crash patterns
        const hasSignal = content.includes("signal") || content.includes("SIGSEGV") || content.includes("SIGABRT");
        const hasBacktrace = content.includes("backtrace") || content.includes("stack trace") || content.includes("#0");
        const hasAssertion = content.includes("assertion") || content.includes("assert");

        if (options.format === "json") {
            console.log(JSON.stringify({
                hasSignal,
                hasBacktrace,
                hasAssertion,
                size: content.length,
            }, null, 2));
            return;
        }

        console.log(colors.bold("Crash Analysis:"));
        keyValue("Signal detected", hasSignal ? "yes" : "no");
        keyValue("Backtrace present", hasBacktrace ? "yes" : "no");
        keyValue("Assertion failure", hasAssertion ? "yes" : "no");
        console.log();

        // Extract key lines
        const lines = content.split("\n");
        const keyLines = lines.filter((l) =>
            l.includes("error") ||
            l.includes("panic") ||
            l.includes("signal") ||
            l.includes("assertion") ||
            l.match(/^#\d+/)
        ).slice(0, 20);

        if (keyLines.length > 0) {
            console.log(colors.bold("Key Information:"));
            for (const line of keyLines) {
                console.log(colors.dim(`  ${line.trim()}`));
            }
        }

        console.log();
        success("Crash analysis complete.");
    } catch (err) {
        error(`Failed to analyze crash: ${err instanceof Error ? err.message : String(err)}`);
    }
}

interface MemoryStats {
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
    arrayBuffers: number;
}

interface AllocationInfo {
    type: string;
    size: number;
    count: number;
}

async function analyzeMemory(path: string, options: AnalyzeOptions): Promise<void> {
    const { existsSync, readFileSync, readdirSync, statSync } = await import("fs");

    // If path is a process ID, get live memory info
    if (/^\d+$/.test(path)) {
        await analyzeLiveProcess(parseInt(path, 10), options);
        return;
    }

    // Otherwise analyze a heap dump or memory log file
    if (!existsSync(path)) {
        error(`Path not found: ${path}`);
        return;
    }

    const stats = statSync(path);

    if (stats.isDirectory()) {
        // Analyze multiple memory files in directory
        const files = readdirSync(path).filter(f =>
            f.endsWith('.heapsnapshot') ||
            f.endsWith('.mem') ||
            f.endsWith('.memlog')
        );

        if (files.length === 0) {
            warn("No memory files found in directory.");
            info("Looking for: .heapsnapshot, .mem, .memlog files");
            return;
        }

        for (const file of files) {
            console.log();
            info(`Analyzing: ${file}`);
            await analyzeMemoryFile(join(path, file), options);
        }
    } else {
        await analyzeMemoryFile(path, options);
    }
}

async function analyzeLiveProcess(pid: number, options: AnalyzeOptions): Promise<void> {
    const { existsSync, readFileSync } = await import("fs");

    info(`Analyzing live process: ${pid}`);

    // Check if process exists (Linux)
    const procPath = `/proc/${pid}`;
    if (!existsSync(procPath)) {
        error(`Process ${pid} not found or /proc not available`);
        return;
    }

    try {
        // Read memory stats from /proc
        const statmPath = `${procPath}/statm`;
        const statusPath = `${procPath}/status`;
        const mapsPath = `${procPath}/maps`;

        const pageSize = 4096; // Typically 4KB pages

        // Parse statm for memory pages
        if (existsSync(statmPath)) {
            const statm = readFileSync(statmPath, "utf-8").trim().split(/\s+/);
            const [size, resident, shared, text, , data] = statm.map(Number);

            console.log();
            console.log(colors.bold("Process Memory (from /proc/statm):"));
            keyValue("Virtual Memory", formatBytes(size * pageSize));
            keyValue("Resident Set", formatBytes(resident * pageSize));
            keyValue("Shared Memory", formatBytes(shared * pageSize));
            keyValue("Text (Code)", formatBytes(text * pageSize));
            keyValue("Data + Stack", formatBytes(data * pageSize));
        }

        // Parse status for more details
        if (existsSync(statusPath)) {
            const status = readFileSync(statusPath, "utf-8");
            const vmPeak = status.match(/VmPeak:\s+(\d+)\s+kB/)?.[1];
            const vmRSS = status.match(/VmRSS:\s+(\d+)\s+kB/)?.[1];
            const vmData = status.match(/VmData:\s+(\d+)\s+kB/)?.[1];
            const vmStk = status.match(/VmStk:\s+(\d+)\s+kB/)?.[1];
            const threads = status.match(/Threads:\s+(\d+)/)?.[1];

            console.log();
            console.log(colors.bold("Process Status:"));
            if (vmPeak) keyValue("Peak Virtual Memory", formatBytes(parseInt(vmPeak) * 1024));
            if (vmRSS) keyValue("Resident Set Size", formatBytes(parseInt(vmRSS) * 1024));
            if (vmData) keyValue("Data Segment", formatBytes(parseInt(vmData) * 1024));
            if (vmStk) keyValue("Stack Size", formatBytes(parseInt(vmStk) * 1024));
            if (threads) keyValue("Thread Count", threads);
        }

        // Analyze memory maps for shared libraries
        if (existsSync(mapsPath) && options.verbose) {
            const maps = readFileSync(mapsPath, "utf-8");
            const sharedLibs = new Map<string, number>();

            for (const line of maps.split("\n")) {
                const match = line.match(/^([0-9a-f]+)-([0-9a-f]+)\s+\S+\s+\S+\s+\S+\s+\S+\s+(.+)$/);
                if (match) {
                    const [, start, end, path] = match;
                    if (path && path.includes(".so")) {
                        const size = parseInt(end, 16) - parseInt(start, 16);
                        const current = sharedLibs.get(path) || 0;
                        sharedLibs.set(path, current + size);
                    }
                }
            }

            if (sharedLibs.size > 0) {
                console.log();
                console.log(colors.bold("Loaded Shared Libraries:"));
                const sorted = [...sharedLibs.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
                for (const [lib, size] of sorted) {
                    console.log(`  ${colors.dim(formatBytes(size).padStart(10))}  ${lib}`);
                }
            }
        }

        if (options.format === "json") {
            // Re-read and output as JSON
            const statm = existsSync(statmPath) ? readFileSync(statmPath, "utf-8").trim().split(/\s+/).map(Number) : [];
            console.log(JSON.stringify({
                pid,
                virtualMemory: statm[0] ? statm[0] * pageSize : 0,
                residentSet: statm[1] ? statm[1] * pageSize : 0,
                sharedMemory: statm[2] ? statm[2] * pageSize : 0,
            }, null, 2));
        }

        console.log();
        success("Memory analysis complete.");
    } catch (err) {
        error(`Failed to analyze process: ${err instanceof Error ? err.message : String(err)}`);
    }
}

async function analyzeMemoryFile(filePath: string, options: AnalyzeOptions): Promise<void> {
    const { readFileSync, statSync } = await import("fs");

    try {
        const stats = statSync(filePath);
        const content = readFileSync(filePath, "utf-8");

        console.log(colors.bold("Memory File Analysis:"));
        keyValue("File", filePath);
        keyValue("Size", formatBytes(stats.size));

        if (filePath.endsWith(".heapsnapshot")) {
            // Parse V8 heap snapshot
            try {
                const snapshot = JSON.parse(content);
                const nodeCount = snapshot.nodes?.length / snapshot.snapshot?.meta?.node_fields?.length || 0;
                const edgeCount = snapshot.edges?.length / snapshot.snapshot?.meta?.edge_fields?.length || 0;

                console.log();
                console.log(colors.bold("Heap Snapshot:"));
                keyValue("Node Count", nodeCount.toLocaleString());
                keyValue("Edge Count", edgeCount.toLocaleString());

                if (snapshot.snapshot?.meta) {
                    keyValue("Root Index", String(snapshot.snapshot.root_index || 0));
                }
            } catch {
                warn("Could not parse heap snapshot as JSON");
            }
        } else if (filePath.endsWith(".memlog")) {
            // Parse custom memory log format
            const lines = content.split("\n");
            const allocations = new Map<string, { count: number; totalSize: number }>();

            for (const line of lines) {
                const match = line.match(/^(\w+)\s+(\d+)\s+bytes/);
                if (match) {
                    const [, type, size] = match;
                    const current = allocations.get(type) || { count: 0, totalSize: 0 };
                    current.count++;
                    current.totalSize += parseInt(size, 10);
                    allocations.set(type, current);
                }
            }

            if (allocations.size > 0) {
                console.log();
                console.log(colors.bold("Allocations by Type:"));
                const sorted = [...allocations.entries()].sort((a, b) => b[1].totalSize - a[1].totalSize);
                for (const [type, { count, totalSize }] of sorted) {
                    console.log(`  ${type}: ${count} allocations, ${formatBytes(totalSize)}`);
                }
            }
        } else {
            // Generic analysis
            const lineCount = content.split("\n").length;
            keyValue("Lines", lineCount.toLocaleString());

            // Look for common patterns
            const allocPattern = content.match(/alloc|malloc|new/gi);
            const freePattern = content.match(/free|delete|dealloc/gi);

            if (allocPattern || freePattern) {
                console.log();
                console.log(colors.bold("Pattern Analysis:"));
                if (allocPattern) keyValue("Allocation mentions", allocPattern.length.toString());
                if (freePattern) keyValue("Free mentions", freePattern.length.toString());
            }
        }

        if (options.format === "json") {
            console.log(JSON.stringify({
                file: filePath,
                size: stats.size,
            }, null, 2));
        }

        console.log();
        success("File analysis complete.");
    } catch (err) {
        error(`Failed to analyze file: ${err instanceof Error ? err.message : String(err)}`);
    }
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}


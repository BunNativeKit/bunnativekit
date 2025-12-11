/**
 * Logging, Chrome DevTools tracing, and Linux process diagnostics.
 * @module
 */

import type { DebugLevel, DebugConfig } from "@bunnativekit/types";
import { getCurrentPlatform } from "@bunnativekit/platform";
import { existsSync, readFileSync, mkdirSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";

// logger

const LOG_LEVELS: Record<DebugLevel, number> = {
    none: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};

export interface LoggerConfig {
    level: DebugLevel;
    prefix?: string;
    timestamps?: boolean;
}

export class Logger {
    private config: LoggerConfig;
    private levelNum: number;

    constructor(config: Partial<LoggerConfig> = {}) {
        this.config = {
            level: config.level ?? "info",
            prefix: config.prefix ?? "[BNK]",
            timestamps: config.timestamps ?? true,
        };
        this.levelNum = LOG_LEVELS[this.config.level];
    }

    private format(level: DebugLevel, category: string, message: string): string {
        const parts: string[] = [];

        if (this.config.timestamps) {
            parts.push(`[${new Date().toISOString()}]`);
        }

        parts.push(this.config.prefix ?? "");
        parts.push(`[${level.toUpperCase()}]`);
        parts.push(`[${category}]`);
        parts.push(message);

        return parts.join(" ");
    }

    private log(level: DebugLevel, category: string, message: string, data?: unknown): void {
        if (LOG_LEVELS[level] > this.levelNum) return;

        const formatted = this.format(level, category, message);

        switch (level) {
            case "error":
                console.error(formatted, data ?? "");
                break;
            case "warn":
                console.warn(formatted, data ?? "");
                break;
            default:
                console.log(formatted, data ?? "");
        }
    }

    error(category: string, message: string, data?: unknown): void {
        this.log("error", category, message, data);
    }

    warn(category: string, message: string, data?: unknown): void {
        this.log("warn", category, message, data);
    }

    info(category: string, message: string, data?: unknown): void {
        this.log("info", category, message, data);
    }

    debug(category: string, message: string, data?: unknown): void {
        this.log("debug", category, message, data);
    }

    trace(category: string, message: string, data?: unknown): void {
        this.log("trace", category, message, data);
    }
}

// tracer (chrome devtools format)

export interface TraceEvent {
    name: string;
    cat: string;
    ph: "B" | "E" | "X" | "i";
    ts: number;
    dur?: number;
    pid: number;
    tid: number;
    args?: Record<string, unknown>;
}

export interface TracerConfig {
    enabled: boolean;
    outputPath?: string;
    maxEvents?: number;
}

export class Tracer {
    private events: TraceEvent[] = [];
    private config: TracerConfig;
    private startTime: bigint;

    constructor(config: Partial<TracerConfig> = {}) {
        this.config = {
            enabled: config.enabled ?? false,
            outputPath: config.outputPath,
            maxEvents: config.maxEvents ?? 10000,
        };
        this.startTime = process.hrtime.bigint();
    }

    get enabled(): boolean {
        return this.config.enabled;
    }

    private getTimestamp(): number {
        const now = process.hrtime.bigint();
        return Number(now - this.startTime) / 1000; // Microseconds
    }

    event(
        name: string,
        category: string,
        phase: TraceEvent["ph"],
        args?: Record<string, unknown>
    ): void {
        if (!this.config.enabled) return;

        if (this.events.length >= this.config.maxEvents!) {
            this.events.shift();
        }

        this.events.push({
            name,
            cat: category,
            ph: phase,
            ts: this.getTimestamp(),
            pid: process.pid,
            tid: 0,
            args,
        });
    }

    /** Start a duration trace, returns a function to end it */
    start(category: string, name: string, args?: Record<string, unknown>): () => void {
        if (!this.config.enabled) return () => { };

        const startTs = this.getTimestamp();
        this.event(name, category, "B", args);

        return () => {
            const endTs = this.getTimestamp();
            this.events.push({
                name,
                cat: category,
                ph: "E",
                ts: endTs,
                dur: endTs - startTs,
                pid: process.pid,
                tid: 0,
                args,
            });
        };
    }

    getEvents(): TraceEvent[] {
        return [...this.events];
    }

    clear(): void {
        this.events = [];
        this.startTime = process.hrtime.bigint();
    }

    /** Write events to configured output path */
    flush(): void {
        if (!this.config.outputPath || this.events.length === 0) return;

        const dir = dirname(this.config.outputPath);
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
        }

        const output = JSON.stringify({ traceEvents: this.events }, null, 2);
        writeFileSync(this.config.outputPath, output);
    }
}

// process diagnostics (linux-specific)

export interface ProcessState {
    alive: boolean;
    state: string;
    stateDescription: string;
    threadCount: number;
    waitChannel?: string;
    rssBytes: number;
    vmsBytes: number;
}

export interface ThreadInfo {
    tid: number;
    name: string;
    state: string;
    waitChannel?: string;
}

const STATE_DESCRIPTIONS: Record<string, string> = {
    R: "Running - actively executing on CPU",
    S: "Sleeping - interruptible sleep",
    D: "Disk sleep - uninterruptible I/O wait",
    T: "Stopped - stopped by signal",
    Z: "Zombie - terminated but not reaped",
    t: "Tracing stop - stopped by debugger",
};

export class ProcessDiagnostics {
    private platform = getCurrentPlatform();

    isSupported(): boolean {
        return this.platform === "linux";
    }

    isAlive(pid: number): boolean {
        if (!this.isSupported()) return false;
        return existsSync(`/proc/${pid}`);
    }

    getState(pid: number): ProcessState | null {
        if (!this.isSupported() || !this.isAlive(pid)) return null;

        try {
            const stat = readFileSync(`/proc/${pid}/stat`, "utf8");
            const parts = stat.split(" ");
            const state = parts[2] || "?";
            const threadCount = parseInt(parts[19] || "1", 10);

            let waitChannel: string | undefined;
            try {
                waitChannel = readFileSync(`/proc/${pid}/wchan`, "utf8").trim();
                if (waitChannel === "0" || waitChannel === "") {
                    waitChannel = undefined;
                }
            } catch { }

            let rssBytes = 0;
            let vmsBytes = 0;
            try {
                const statm = readFileSync(`/proc/${pid}/statm`, "utf8").split(" ");
                const pageSize = 4096;
                vmsBytes = parseInt(statm[0] || "0", 10) * pageSize;
                rssBytes = parseInt(statm[1] || "0", 10) * pageSize;
            } catch { }

            return {
                alive: true,
                state,
                stateDescription: STATE_DESCRIPTIONS[state] || `Unknown: ${state}`,
                threadCount,
                waitChannel,
                rssBytes,
                vmsBytes,
            };
        } catch {
            return null;
        }
    }

    getThreads(pid: number): ThreadInfo[] {
        if (!this.isSupported()) return [];

        const threads: ThreadInfo[] = [];
        const taskDir = `/proc/${pid}/task`;

        if (!existsSync(taskDir)) return threads;

        try {
            const tids = readdirSync(taskDir);

            for (const tidStr of tids) {
                try {
                    const tid = parseInt(tidStr, 10);
                    const stat = readFileSync(`${taskDir}/${tid}/stat`, "utf8");
                    const parts = stat.split(" ");
                    const state = parts[2] || "?";

                    let name = "unknown";
                    try {
                        name = readFileSync(`${taskDir}/${tid}/comm`, "utf8").trim();
                    } catch { }

                    let waitChannel: string | undefined;
                    try {
                        waitChannel = readFileSync(`${taskDir}/${tid}/wchan`, "utf8").trim();
                        if (waitChannel === "0" || waitChannel === "") {
                            waitChannel = undefined;
                        }
                    } catch { }

                    threads.push({ tid, name, state, waitChannel });
                } catch { }
            }
        } catch { }

        return threads;
    }
}

// global instances

let globalLogger: Logger | null = null;
let globalTracer: Tracer | null = null;
let globalDiagnostics: ProcessDiagnostics | null = null;

export function getLogger(config?: Partial<LoggerConfig>): Logger {
    if (!globalLogger || config) {
        globalLogger = new Logger(config);
    }
    return globalLogger;
}

export function getTracer(config?: Partial<TracerConfig>): Tracer {
    if (!globalTracer || config) {
        globalTracer = new Tracer(config);
    }
    return globalTracer;
}

export function getDiagnostics(): ProcessDiagnostics {
    if (!globalDiagnostics) {
        globalDiagnostics = new ProcessDiagnostics();
    }
    return globalDiagnostics;
}

/** Initialize logger and tracer from a config object */
export function initDebug(config: DebugConfig): { logger: Logger; tracer: Tracer } {
    const logger = new Logger({ level: config.level ?? "info" });
    const tracer = new Tracer({
        enabled: config.tracing ?? false,
        outputPath: config.tracePath,
    });

    globalLogger = logger;
    globalTracer = tracer;

    return { logger, tracer };
}

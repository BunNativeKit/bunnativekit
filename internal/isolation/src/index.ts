/**
 * Subprocess isolation for safe native module execution.
 * Runs native code in separate processes with IPC communication.
 * @module
 */

import { join, dirname } from "path";
import type { ErrorMode, FFISymbolDef, BindingMethod } from "@bunnativekit/types";
import { getLogger, getDiagnostics } from "@bunnativekit/debug";

// ipc protocol

export interface IPCRequest {
    id: number;
    type: "call";
    fn: string;
    args: unknown[];
}

export interface IPCResponse {
    id: number;
    type: "result" | "error";
    value?: unknown;
    error?: string;
}

export interface IPCLifecycle {
    type: "ready" | "shutdown";
    pid?: number;
}

export type IPCMessage = IPCRequest | IPCResponse | IPCLifecycle;

// event emitter

export type EventHandler<T> = (data: T) => void;

export class EventEmitter<Events extends object> {
    private handlers = new Map<keyof Events, Set<EventHandler<any>>>();

    on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): void {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }
        this.handlers.get(event)!.add(handler);
    }

    off<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): void {
        this.handlers.get(event)?.delete(handler);
    }

    emit<K extends keyof Events>(event: K, data: Events[K]): void {
        for (const handler of this.handlers.get(event) ?? []) {
            try {
                handler(data);
            } catch (error) {
                console.error(`Event handler error for ${String(event)}:`, error);
            }
        }
    }

    removeAllListeners(): void {
        this.handlers.clear();
    }
}

// isolated process

export interface IsolatedProcessConfig {
    modulePath: string;
    binding: BindingMethod;
    /** Required when binding is 'ffi' */
    symbols?: Record<string, FFISymbolDef>;
    /** In milliseconds, defaults to 30s */
    timeout?: number;
    onError?: ErrorMode;
    debug?: boolean;
}

export interface IsolatedProcessEvents {
    ready: void;
    error: Error;
    death: number;
    exit: { type: "success" | "error" | "death"; data?: unknown };
}

const WORKER_SCRIPT = join(dirname(import.meta.path), "worker.ts");

/** Runs native code in an isolated subprocess with IPC */
export class IsolatedProcess extends EventEmitter<IsolatedProcessEvents> {
    private config: Required<IsolatedProcessConfig>;
    private proc: ReturnType<typeof Bun.spawn> | null = null;
    private pendingCalls = new Map<
        number,
        { resolve: (value: unknown) => void; reject: (error: Error) => void }
    >();
    private nextCallId = 0;
    private ready = false;
    private readyPromise: Promise<void>;
    private resolveReady: () => void = () => { };
    private logger = getLogger();
    private diagnostics = getDiagnostics();

    constructor(config: IsolatedProcessConfig) {
        super();
        this.config = {
            timeout: 30000,
            onError: "throw",
            debug: false,
            symbols: {},
            ...config,
        };

        this.readyPromise = new Promise((resolve) => {
            this.resolveReady = resolve;
        });
    }

    async start(): Promise<void> {
        if (this.proc) return;

        this.proc = Bun.spawn({
            cmd: ["bun", "run", WORKER_SCRIPT],
            stdout: this.config.debug ? "inherit" : "pipe",
            stderr: this.config.debug ? "inherit" : "pipe",
            env: {
                ...process.env,
                BNK_MODULE_PATH: this.config.modulePath,
                BNK_BINDING: this.config.binding,
                BNK_SYMBOLS: JSON.stringify(this.config.symbols),
                BNK_DEBUG: this.config.debug ? "1" : "0",
            },
            ipc: (message: IPCMessage) => {
                this.handleMessage(message);
            },
        });

        if (!this.proc.pid) {
            throw new Error("Failed to spawn subprocess");
        }

        this.diagnostics.isSupported() &&
            this.diagnostics.isAlive(this.proc.pid);

        this.proc.exited.then((exitCode) => {
            this.handleExit(exitCode);
        });

        await this.readyPromise;

        this.logger.debug("isolation", `Process started: ${this.proc.pid}`);
    }

    async call<T = unknown>(fn: string, ...args: unknown[]): Promise<T> {
        if (!this.proc || !this.ready) {
            throw new Error("Process not ready");
        }

        const id = this.nextCallId++;

        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                this.pendingCalls.delete(id);
                const error = new Error(`Call to ${fn} timed out after ${this.config.timeout}ms`);

                if (this.config.onError === "throw") {
                    reject(error);
                } else if (this.config.onError === "null") {
                    resolve(null as T);
                } else {
                    this.emit("error", error);
                    resolve(undefined as T);
                }
            }, this.config.timeout);

            this.pendingCalls.set(id, {
                resolve: (value) => {
                    clearTimeout(timeoutId);
                    resolve(value as T);
                },
                reject: (error) => {
                    clearTimeout(timeoutId);
                    if (this.config.onError === "throw") {
                        reject(error);
                    } else if (this.config.onError === "null") {
                        resolve(null as T);
                    } else {
                        this.emit("error", error);
                        resolve(undefined as T);
                    }
                },
            });

            const request: IPCRequest = { id, type: "call", fn, args };
            this.proc!.send(request);
        });
    }

    async shutdown(): Promise<void> {
        if (!this.proc) return;

        try {
            this.proc.send({ type: "shutdown" } as IPCLifecycle);
        } catch {
            // process may already be dead
        }

        setTimeout(() => {
            try {
                this.proc?.kill("SIGKILL");
            } catch { }
        }, 1000); // kill after grace period

        this.cleanup();
    }

    async restart(): Promise<void> {
        await this.shutdown();
        this.ready = false;
        this.readyPromise = new Promise((resolve) => {
            this.resolveReady = resolve;
        });
        await this.start();
    }

    isAlive(): boolean {
        return this.proc !== null && this.ready;
    }

    private handleMessage(message: IPCMessage): void {
        if (message.type === "ready") {
            this.ready = true;
            this.resolveReady();
            this.emit("ready", undefined as void);
        } else if (message.type === "result" || message.type === "error") {
            const pending = this.pendingCalls.get(message.id);
            if (pending) {
                this.pendingCalls.delete(message.id);
                if (message.type === "result") {
                    pending.resolve(message.value);
                    this.emit("exit", { type: "success", data: message.value });
                } else {
                    pending.reject(new Error(message.error));
                    this.emit("exit", { type: "error", data: message.error });
                }
            }
        }
    }

    private handleExit(exitCode: number): void {
        this.logger.debug("isolation", `Process exited: ${exitCode}`);

        for (const [id, pending] of this.pendingCalls) {
            pending.reject(new Error(`Process exited with code ${exitCode}`));
        }
        this.pendingCalls.clear();

        if (exitCode !== 0) {
            this.emit("death", exitCode);
            this.emit("exit", { type: "death", data: exitCode });
        }

        this.cleanup();
    }

    private cleanup(): void {
        this.proc = null;
        this.ready = false;
    }
}

// embedded worker script

/** Inline worker script for spawned subprocesses */
export const WORKER_SCRIPT_CONTENT = `
import { loadModule } from "@bunnativekit/loader";

async function main() {
  const modulePath = process.env.BNK_MODULE_PATH!;
  const binding = process.env.BNK_BINDING as "ffi" | "napi" | "cc";
  const symbols = JSON.parse(process.env.BNK_SYMBOLS || "{}");
  const debug = process.env.BNK_DEBUG === "1";

  // Load the module
  const mod = loadModule({
    path: modulePath,
    binding,
    ffiSymbols: binding === "ffi" ? symbols : undefined,
    debug,
  });

  process.send?.({ type: "ready", pid: process.pid });

  process.on("message", async (msg: any) => {
    if (msg.type === "call") {
      try {
        const result = mod.call(msg.fn, ...msg.args);
        process.send?.({ id: msg.id, type: "result", value: result });
      } catch (error) {
        process.send?.({
          id: msg.id,
          type: "error",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    } else if (msg.type === "shutdown") {
      mod.close();
      process.exit(0);
    }
  });

  process.on("SIGTERM", () => {
    mod.close();
    process.exit(0);
  });
}

if (process.send) {
  main().catch((error) => {
    console.error("Worker error:", error);
    process.exit(1);
  });
}
`;

// factory

export function createIsolatedProcess(
    config: IsolatedProcessConfig
): IsolatedProcess {
    return new IsolatedProcess(config);
}

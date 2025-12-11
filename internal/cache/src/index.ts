/**
 * Build and runtime caching for compiled native modules.
 * Tracks source hashes to avoid redundant recompilation.
 * @module
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { getCacheDir, getCacheSubdir } from "@bunnativekit/platform";

export { getCacheDir, getCacheSubdir } from "@bunnativekit/platform";

// hash utilities

/** Generate a 16-char SHA256 hash from content */
export function hashContent(content: string | Buffer): string {
    const hasher = new Bun.CryptoHasher("sha256");
    hasher.update(content);
    return hasher.digest("hex").slice(0, 16); // 16 chars is plenty for uniqueness
}

/** Generate a 16-char SHA256 hash from a file */
export async function hashFile(path: string): Promise<string> {
    const file = Bun.file(path);
    const content = await file.arrayBuffer();
    return hashContent(Buffer.from(content));
}

/** Generate a cache key from module name and content hash */
export function generateCacheKey(moduleName: string, contentHash: string): string {
    return `${moduleName}-${contentHash}`;
}

// types

export interface CacheEntry {
    key: string;
    source: string;
    hash: string;
    path: string;
    createdAt: number;
    /** Updated on read - used for LRU eviction */
    accessedAt: number;
    meta?: Record<string, unknown>;
}

export interface CacheManifest {
    version: number;
    entries: Record<string, CacheEntry>;
}

// build cache

/** Manages cached build artifacts with LRU eviction */
export class BuildCache {
    private dir: string;
    private manifest: CacheManifest;
    private manifestPath: string;

    constructor(subdir = "build") {
        this.dir = getCacheSubdir(subdir);
        this.manifestPath = join(this.dir, "manifest.json");
        this.manifest = this.loadManifest();
    }

    // manifest i/o

    private loadManifest(): CacheManifest {
        if (existsSync(this.manifestPath)) {
            try {
                const data = readFileSync(this.manifestPath, "utf-8");
                return JSON.parse(data);
            } catch {
                // corrupted manifest, start fresh
            }
        }
        return { version: 1, entries: {} };
    }

    private saveManifest(): void {
        writeFileSync(this.manifestPath, JSON.stringify(this.manifest, null, 2));
    }

    // cache operations

    /** Returns null if entry doesn't exist or file was deleted */
    get(key: string): CacheEntry | null {
        const entry = this.manifest.entries[key];
        if (!entry) return null;

        if (!existsSync(entry.path)) {
            delete this.manifest.entries[key];
            this.saveManifest();
            return null;
        }

        entry.accessedAt = Date.now();
        this.saveManifest();

        return entry;
    }

    has(key: string): boolean {
        return this.get(key) !== null;
    }

    getPath(key: string): string | null {
        const entry = this.get(key);
        return entry?.path ?? null;
    }

    /** Copy file to cache and track in manifest */
    set(
        key: string,
        sourcePath: string,
        hash: string,
        meta?: Record<string, unknown>
    ): CacheEntry {
        const ext = sourcePath.split(".").pop() || "";
        const cachedPath = join(this.dir, `${key}.${ext}`);

        const content = readFileSync(sourcePath);
        writeFileSync(cachedPath, content);

        const entry: CacheEntry = {
            key,
            source: sourcePath,
            hash,
            path: cachedPath,
            createdAt: Date.now(),
            accessedAt: Date.now(),
            meta,
        };

        this.manifest.entries[key] = entry;
        this.saveManifest();

        return entry;
    }

    /** Store raw content directly in cache */
    setContent(
        key: string,
        content: Buffer,
        ext: string,
        source: string,
        meta?: Record<string, unknown>
    ): CacheEntry {
        const cachedPath = join(this.dir, `${key}.${ext}`);
        writeFileSync(cachedPath, content);

        const entry: CacheEntry = {
            key,
            source,
            hash: hashContent(content),
            path: cachedPath,
            createdAt: Date.now(),
            accessedAt: Date.now(),
            meta,
        };

        this.manifest.entries[key] = entry;
        this.saveManifest();

        return entry;
    }

    delete(key: string): boolean {
        const entry = this.manifest.entries[key];
        if (!entry) return false;

        try {
            if (existsSync(entry.path)) {
                unlinkSync(entry.path);
            }
        } catch {
            // ignore deletion errors
        }

        delete this.manifest.entries[key];
        this.saveManifest();
        return true;
    }

    clear(): void {
        for (const key of Object.keys(this.manifest.entries)) {
            this.delete(key);
        }
    }

    stats(): { entries: number; totalSize: number } {
        let totalSize = 0;
        let entries = 0;

        for (const entry of Object.values(this.manifest.entries)) {
            if (existsSync(entry.path)) {
                try {
                    const stat = statSync(entry.path);
                    totalSize += stat.size;
                    entries++;
                } catch {
                    // skip inaccessible files
                }
            }
        }

        return { entries, totalSize };
    }

    /** Remove oldest entries until under size limit (LRU) */
    prune(maxSize: number): number {
        const entries = Object.values(this.manifest.entries)
            .filter((e) => existsSync(e.path))
            .sort((a, b) => a.accessedAt - b.accessedAt); // oldest first

        let currentSize = 0;
        let pruned = 0;

        for (const entry of entries) {
            try {
                const stat = statSync(entry.path);
                currentSize += stat.size;
            } catch {
                // skip
            }
        }

        for (const entry of entries) {
            if (currentSize <= maxSize) break;

            try {
                const stat = statSync(entry.path);
                this.delete(entry.key);
                currentSize -= stat.size;
                pruned++;
            } catch {
                // skip
            }
        }

        return pruned;
    }
}

// memory cache

/** In-memory cache with TTL and LRU eviction */
export class MemoryCache<T> {
    private cache = new Map<string, { value: T; timestamp: number }>();
    private maxSize: number;
    private ttl: number;

    constructor(options: { maxSize?: number; ttl?: number } = {}) {
        this.maxSize = options.maxSize ?? 100;
        this.ttl = options.ttl ?? 60000; // 1 minute default
    }

    get(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() - entry.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.value;
    }

    set(key: string, value: T): void {
        if (this.cache.size >= this.maxSize) {
            // evict oldest entry
            const oldest = [...this.cache.entries()].sort(
                (a, b) => a[1].timestamp - b[1].timestamp
            )[0];
            if (oldest) {
                this.cache.delete(oldest[0]);
            }
        }

        this.cache.set(key, { value, timestamp: Date.now() });
    }

    has(key: string): boolean {
        return this.get(key) !== null;
    }

    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    size(): number {
        return this.cache.size;
    }
}

// unified cache

/** Two-tier cache: memory (L1) + disk (L2) */
export class UnifiedCache {
    private memory: MemoryCache<string>;
    private disk: BuildCache;

    constructor(subdir = "unified") {
        this.memory = new MemoryCache({ maxSize: 50, ttl: 300000 }); // 5 min TTL
        this.disk = new BuildCache(subdir);
    }

    /** Check memory first, then disk. Promotes disk hits to memory. */
    get(key: string): string | null {
        const memResult = this.memory.get(key);
        if (memResult) return memResult;

        const diskPath = this.disk.getPath(key);
        if (diskPath) {
            this.memory.set(key, diskPath); // promote to L1
            return diskPath;
        }

        return null;
    }

    /** Store in both memory and disk */
    set(key: string, sourcePath: string, hash: string, meta?: Record<string, unknown>): string {
        const entry = this.disk.set(key, sourcePath, hash, meta);
        this.memory.set(key, entry.path);
        return entry.path;
    }

    has(key: string): boolean {
        return this.memory.has(key) || this.disk.has(key);
    }

    clear(): void {
        this.memory.clear();
        this.disk.clear();
    }
}

// default instances

let defaultBuildCache: BuildCache | null = null;
let defaultUnifiedCache: UnifiedCache | null = null;

/** Get or create the default BuildCache instance */
export function getBuildCache(): BuildCache {
    if (!defaultBuildCache) {
        defaultBuildCache = new BuildCache();
    }
    return defaultBuildCache;
}

/** Get or create the default UnifiedCache instance */
export function getUnifiedCache(): UnifiedCache {
    if (!defaultUnifiedCache) {
        defaultUnifiedCache = new UnifiedCache();
    }
    return defaultUnifiedCache;
}

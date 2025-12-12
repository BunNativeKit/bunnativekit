/**
 * Zig toolchain acquisition and management.
 * Downloads, caches, and provides Zig binaries for cross-platform builds.
 * @module
 */
import { createHash } from "crypto";
import {
    chmodSync,
    cpSync,
    existsSync,
    mkdirSync,
    mkdtempSync,
    readdirSync,
    renameSync,
    readFileSync,
    rmSync,
    statSync,
    writeFileSync,
} from "fs";
import { tmpdir } from "os";
import { basename, dirname, join } from "path";
import { z } from "zod";
import type {
    PlatformArch,
    TargetArch,
    TargetPlatform,
} from "@bunnativekit/types";
import {
    commandExists,
    getCacheDir,
    getCurrentPlatformArch,
    getZigVersion,
} from "@bunnativekit/platform";

// schemas

const PLATFORM_KEY_SCHEMA = z.enum([
    "x86_64-linux",
    "aarch64-linux",
    "x86_64-darwin",
    "aarch64-darwin",
    "x86_64-windows",
    "aarch64-windows",
]);

const SHA256_REGEX = /^[a-f0-9]{64}$/i;
const SEMVER_REGEX = /^\d+\.\d+\.\d+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const ZigSourceSchema = z.object({
    url: z.url(),
    sha256: z.string().regex(SHA256_REGEX, "sha256 must be a 64 character hex string"),
    version: z.string(),
});

const ZigPlatformSourceSchema = z
    .record(PLATFORM_KEY_SCHEMA, z.unknown())
    .transform((tupleMap) => {
        const cleaned: Partial<Record<ZigTuple, ZigSource>> = {};
        for (const [tuple, value] of Object.entries(tupleMap) as [ZigTuple, unknown][]) {
            if (!value || typeof value !== "object") {
                continue;
            }
            const candidate = value as Record<string, unknown> & { broken?: boolean };
            if (candidate.broken === true || candidate.sha256 == null) {
                continue;
            }
            const parsed = ZigSourceSchema.safeParse(value);
            if (parsed.success) {
                cleaned[tuple] = parsed.data;
            }
        }
        return cleaned;
    });

const ZigMasterSchema = z
    .object({ latest: ZigPlatformSourceSchema })
    .catchall(ZigPlatformSourceSchema)
    .superRefine((value, ctx) => {
        for (const key of Object.keys(value)) {
            if (key === "latest") {
                continue;
            }

            if (!DATE_REGEX.test(key)) {
                ctx.addIssue({
                    path: [key],
                    code: "custom",
                    message: `Master key "${key}" must be a YYYY-MM-DD date`,
                });
            }
        }
    });

export const ZigSourcesSchema = z
    .object({ master: ZigMasterSchema })
    .catchall(ZigPlatformSourceSchema)
    .superRefine((value, ctx) => {
        for (const key of Object.keys(value)) {
            if (key === "master") {
                continue;
            }

            if (!SEMVER_REGEX.test(key)) {
                ctx.addIssue({
                    path: [key],
                    code: "custom",
                    message: `Invalid version key "${key}": expected semver`,
                });
            }
        }
    });

export type ZigSources = z.infer<typeof ZigSourcesSchema>;
export type ZigPlatformSources = z.infer<typeof ZigPlatformSourceSchema>;
export type ZigSource = z.infer<typeof ZigSourceSchema>;
export type ZigTuple = z.infer<typeof PLATFORM_KEY_SCHEMA>;
export type ZigChannel = "release" | "master";

const ZIG_SOURCES_URL = "https://cdn.jsdelivr.net/gh/mitchellh/zig-overlay@main/sources.json";

// source fetching

/** Fetch available Zig versions from the upstream overlay */
export async function fetchZigSources(): Promise<ZigSources> {
    const res = await fetch(ZIG_SOURCES_URL);

    if (!res.ok) {
        throw new Error(
            `Failed to fetch Zig sources from ${ZIG_SOURCES_URL}: ${res.status} ${res.statusText}`
        );
    }

    const payload = await res.json();
    return ZigSourcesSchema.parse(payload);
}

// platform mapping

const PLATFORM_ARCH_TO_ZIG: Record<PlatformArch, ZigTuple> = {
    "linux-x64": "x86_64-linux",
    "linux-arm64": "aarch64-linux",
    "darwin-x64": "x86_64-darwin",
    "darwin-arm64": "aarch64-darwin",
    "windows-x64": "x86_64-windows",
    "windows-arm64": "aarch64-windows",
};

const ZIG_TO_PLATFORM_ARCH = Object.entries(PLATFORM_ARCH_TO_ZIG).reduce(
    (acc, [platformArch, zigTuple]) => {
        acc[zigTuple as ZigTuple] = platformArch as PlatformArch;
        return acc;
    },
    {} as Record<ZigTuple, PlatformArch>
);

const WINDOWS_TUPLES: Set<ZigTuple> = new Set(["x86_64-windows", "aarch64-windows"]);

// utilities

function hostZigTuple(): ZigTuple {
    const platformArch = getCurrentPlatformArch();
    const tuple = PLATFORM_ARCH_TO_ZIG[platformArch];
    if (!tuple) {
        throw new Error(`Unsupported host tuple: ${platformArch}`);
    }
    return tuple;
}

function parseZigTuple(tuple: ZigTuple): { platform: TargetPlatform; arch: TargetArch } {
    const platformArch = ZIG_TO_PLATFORM_ARCH[tuple];
    const [platform, arch] = platformArch.split("-") as [TargetPlatform, TargetArch];
    return { platform, arch };
}

function ensureDir(path: string): void {
    if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
    }
}

function semverCompareDesc(a: string, b: string): number {
    const pa = a.split(".").map(Number);
    const pb = b.split(".").map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const diff = (pb[i] ?? 0) - (pa[i] ?? 0);
        if (diff !== 0) {
            return diff;
        }
    }
    return 0;
}

async function sha256File(path: string): Promise<string> {
    const file = Bun.file(path);
    const buffer = await file.arrayBuffer();
    const hash = createHash("sha256");
    hash.update(Buffer.from(buffer));
    return hash.digest("hex");
}

function detectArchiveExtension(
    url: string
): ".tar.gz" | ".tgz" | ".tar.xz" | ".txz" | ".gz" | ".xz" | ".zip" {
    const lower = url.toLowerCase();
    if (lower.endsWith(".tar.gz")) return ".tar.gz";
    if (lower.endsWith(".tgz")) return ".tgz";
    if (lower.endsWith(".tar.xz")) return ".tar.xz";
    if (lower.endsWith(".txz")) return ".txz";
    if (lower.endsWith(".zip")) return ".zip";
    if (lower.endsWith(".gz")) return ".gz";
    if (lower.endsWith(".xz")) return ".xz";
    throw new Error(`Unsupported archive extension for ${url}`);
}

async function runExtraction(cmd: string[], cwd: string): Promise<void> {
    const proc = Bun.spawn({
        cmd,
        cwd,
        stderr: "inherit",
        stdin: "inherit",
        stdout: "ignore",
    });
    const exited = await proc.exited;
    if (exited !== 0) {
        throw new Error(`Failed to run ${cmd.join(" ")}`);
    }
}

function firstDirChild(pathname: string): string {
    const entries = readdirSync(pathname);
    for (const entry of entries) {
        const full = join(pathname, entry);
        if (statSync(full).isDirectory()) {
            return full;
        }
    }
    return pathname;
}

function moveIntoPlace(payloadDir: string, installDir: string): void {
    ensureDir(dirname(installDir));
    try {
        renameSync(payloadDir, installDir);
        return;
    } catch (error) {
        const err = error as NodeJS.ErrnoException;
        if (err.code !== "EXDEV") {
            throw err;
        }
    }

    if (existsSync(installDir)) {
        rmSync(installDir, { recursive: true, force: true });
    }
    cpSync(payloadDir, installDir, { recursive: true });
    rmSync(payloadDir, { recursive: true, force: true });
}

// install verification

const SIGNATURE_FILE = ".bnk-zig.sha256";

function readInstallSignature(installDir: string): string | null {
    try {
        return readFileSync(join(installDir, SIGNATURE_FILE), "utf8").trim();
    } catch {
        return null;
    }
}

function recordInstallSignature(installDir: string, sha256: string): void {
    writeFileSync(join(installDir, SIGNATURE_FILE), `${sha256}\n`, "utf8");
}

function verifyInstallSignature(installDir: string, sha256: string): boolean {
    const recorded = readInstallSignature(installDir);
    if (!recorded) {
        return false;
    }
    return recorded.toLowerCase() === sha256.toLowerCase();
}

function zigBinaryName(tuple: ZigTuple): string {
    return WINDOWS_TUPLES.has(tuple) ? "zig.exe" : "zig";
}

function chmodIfNeeded(binaryPath: string, tuple: ZigTuple): void {
    if (!WINDOWS_TUPLES.has(tuple)) {
        chmodSync(binaryPath, 0o755);
    }
}

// types

export interface ZigReleaseRequest {
    useMaster?: boolean;
    channel?: ZigChannel;
    version?: string | "latest";
    tuples?: ZigTuple[];
}

export interface ZigAcquisitionOptions extends ZigReleaseRequest {
    allowSystemZig?: boolean;
    forceDownload?: boolean;
    forceInstall?: boolean;
    installRoot?: string;
    temporaryRoot?: string;
    persist?: boolean;
    tmpDir?: string;
}

export interface ZigDistribution {
    tuple: ZigTuple;
    platform: TargetPlatform;
    arch: TargetArch;
    url: string;
    sha256: string;
    version: string;
    channel: ZigChannel;
}

export interface ZigBinary {
    tuple: ZigTuple;
    platform: TargetPlatform;
    arch: TargetArch;
    version: string;
    channel: ZigChannel;
    url: string;
    sha256: string;
    installDir: string;
    binPath: string;
    source: "system" | "persistent" | "temporary";
}

export interface ZigEnsureResult {
    channel: ZigChannel;
    version: string;
    binaries: ZigBinary[];
}

export interface ZigToolchainManagerOptions {
    defaultChannel?: ZigChannel;
    defaultVersion?: string | "latest";
    defaultTuples?: ZigTuple[];
    installRoot?: string;
    temporaryRoot?: string;
    fetchUrl?: string;
}

interface ReleaseResolution {
    channel: ZigChannel;
    version: string;
    tuples: ZigDistribution[];
}

/** Manages Zig toolchain acquisition, caching, and version resolution */
export class ZigToolchainManager {
    private sources?: ZigSources;
    private readonly defaults: {
        defaultChannel: ZigChannel;
        defaultVersion: string | "latest";
        defaultTuples: ZigTuple[];
        installRoot: string;
        temporaryRoot: string;
        fetchUrl: string;
    };

    constructor(options: ZigToolchainManagerOptions = {}) {
        this.defaults = {
            defaultChannel: options.defaultChannel ?? "release",
            defaultVersion: options.defaultVersion ?? "latest",
            defaultTuples: options.defaultTuples ?? [],
            installRoot: options.installRoot ?? join(getCacheDir(), "zig-toolchains"),
            temporaryRoot: options.temporaryRoot ?? join(getCacheDir(), "zig-temp"),
            fetchUrl: options.fetchUrl ?? ZIG_SOURCES_URL,
        };
        ensureDir(this.defaults.installRoot);
        ensureDir(this.defaults.temporaryRoot);
    }

    protected getHostTuple(): ZigTuple {
        return hostZigTuple();
    }

    protected getInstallRoot(): string {
        ensureDir(this.defaults.installRoot);
        return this.defaults.installRoot;
    }

    protected getTemporaryRoot(): string {
        ensureDir(this.defaults.temporaryRoot);
        return this.defaults.temporaryRoot;
    }

    async fetchSources(force = false): Promise<ZigSources> {
        if (!force && this.sources) {
            return this.sources;
        }

        const res = await fetch(this.defaults.fetchUrl);
        if (!res.ok) {
            throw new Error(
                `Failed to fetch Zig sources from ${this.defaults.fetchUrl}: ${res.status} ${res.statusText}`
            );
        }
        const payload = await res.json();
        this.sources = ZigSourcesSchema.parse(payload);
        return this.sources;
    }

    async resolveDistributions(request?: ZigReleaseRequest): Promise<ZigDistribution[]> {
        const resolution = await this.resolveRelease(request);
        return resolution.tuples;
    }

    async ensure(options?: ZigAcquisitionOptions): Promise<ZigEnsureResult> {
        const persist = options?.persist ?? false;
        const forceInstall = options?.forceInstall ?? false;
        const allowSystemInput = options?.allowSystemZig ?? true;
        const allowSystem = !persist && !forceInstall && allowSystemInput;
        const resolution = await this.resolveRelease(options);
        const binaries: ZigBinary[] = [];

        if (allowSystem) {
            const systemZig = await this.detectSystemZig();
            if (systemZig) {
                binaries.push({
                    ...systemZig,
                    channel: resolution.channel,
                    sha256: systemZig.sha256,
                    url: systemZig.url,
                });
                return { channel: resolution.channel, version: systemZig.version, binaries };
            }
        }

        const root = persist
            ? options?.installRoot ?? this.getInstallRoot()
            : options?.temporaryRoot ?? this.getTemporaryRoot();
        ensureDir(root);

        for (const tuple of resolution.tuples) {
            const installDir = join(root, tuple.version, tuple.tuple);
            const binary = await this.installDistribution(tuple, installDir, {
                forceDownload: options?.forceDownload ?? false,
                tmpDir: options?.tmpDir,
                source: persist ? "persistent" : "temporary",
            });
            binaries.push(binary);
        }

        return { channel: resolution.channel, version: resolution.version, binaries };
    }

    async detectSystemZig(): Promise<ZigBinary & { version: string; url: string; sha256: string } | null> {
        if (!(await commandExists("zig"))) {
            return null;
        }

        const version = (await getZigVersion()) ?? "unknown";
        const tuple = this.getHostTuple();
        const { platform, arch } = parseZigTuple(tuple);
        const path = Bun.which("zig") ?? "zig";
        return {
            tuple,
            platform,
            arch,
            version,
            channel: "release",
            url: "system://zig",
            sha256: "",
            installDir: dirname(path),
            binPath: path,
            source: "system",
        };
    }

    async ensureBinary(options?: ZigAcquisitionOptions): Promise<ZigBinary> {
        const result = await this.ensure(options);
        const binary = result.binaries[0];
        if (!binary) {
            throw new Error("Failed to acquire Zig binary");
        }
        return binary;
    }

    async promoteTemporaryBinary(
        binary: ZigBinary,
        options?: Omit<ZigAcquisitionOptions, "tuples" | "version" | "channel" | "persist" | "allowSystemZig">
    ): Promise<ZigBinary> {
        if (binary.source !== "temporary") {
            return binary;
        }
        const result = await this.ensure({
            ...options,
            persist: true,
            allowSystemZig: false,
            version: binary.version,
            channel: binary.channel,
            tuples: [binary.tuple],
        });
        const persistent = result.binaries[0];
        if (!persistent) {
            throw new Error("Failed to install persistent Zig binary");
        }
        return persistent;
    }

    private async resolveRelease(request?: ZigReleaseRequest): Promise<ReleaseResolution> {
        const sources = await this.fetchSources();
        const channel = request?.useMaster || request?.channel === "master" ? "master" : this.defaults.defaultChannel;
        const requestedVersion = request?.version ?? this.defaults.defaultVersion;
        const tuples = this.normalizeTuples(request?.tuples);
        const tupleSources: ZigDistribution[] = [];

        if (channel === "release") {
            const releaseVersion = this.resolveReleaseVersion(sources, requestedVersion);
            const record = sources[releaseVersion] as ZigPlatformSources | undefined;
            if (!record) {
                throw new Error(`Zig release ${releaseVersion} not found`);
            }
            for (const tuple of tuples) {
                const source = record[tuple];
                if (!source) {
                    throw new Error(`Tuple ${tuple} missing in release ${releaseVersion}`);
                }
                const { platform, arch } = parseZigTuple(tuple);
                tupleSources.push({
                    tuple,
                    platform,
                    arch,
                    url: source.url,
                    sha256: source.sha256,
                    version: source.version,
                    channel,
                });
            }
            return { channel, version: releaseVersion, tuples: tupleSources };
        }

        const masterEntryKey = requestedVersion === "latest" ? "latest" : requestedVersion;
        const masterRecord = sources.master[masterEntryKey];
        if (!masterRecord) {
            throw new Error(`Zig master build ${masterEntryKey} not found`);
        }
        const resolvedVersion = masterRecord[tuples[0]]?.version || "unknown";
        for (const tuple of tuples) {
            const source = masterRecord[tuple];
            if (!source) {
                throw new Error(`Tuple ${tuple} missing in master build ${masterEntryKey}`);
            }
            const { platform, arch } = parseZigTuple(tuple);
            tupleSources.push({
                tuple,
                platform,
                arch,
                url: source.url,
                sha256: source.sha256,
                version: source.version,
                channel,
            });
        }
        return { channel, version: resolvedVersion, tuples: tupleSources };
    }

    private normalizeTuples(userTuples?: ZigTuple[]): ZigTuple[] {
        if (userTuples && userTuples.length > 0) {
            return Array.from(new Set(userTuples));
        }
        if (this.defaults.defaultTuples.length > 0) {
            return this.defaults.defaultTuples;
        }
        return [this.getHostTuple()];
    }

    private resolveReleaseVersion(sources: ZigSources, requested: string | "latest"): string {
        if (requested !== "latest") {
            if (!sources[requested]) {
                throw new Error(`Zig release ${requested} not found`);
            }
            return requested;
        }
        const releaseVersions = Object.keys(sources).filter((key) => key !== "master" && SEMVER_REGEX.test(key));
        if (releaseVersions.length === 0) {
            throw new Error("No Zig releases found in sources");
        }
        releaseVersions.sort(semverCompareDesc);
        return releaseVersions[0];
    }

    private async installDistribution(
        dist: ZigDistribution,
        installDir: string,
        options: { forceDownload: boolean; tmpDir?: string; source: "persistent" | "temporary" }
    ): Promise<ZigBinary> {
        const binPath = join(installDir, zigBinaryName(dist.tuple));

        if (existsSync(installDir)) {
            const signatureValid = verifyInstallSignature(installDir, dist.sha256);
            if (!options.forceDownload && signatureValid && existsSync(binPath)) {
                return {
                    tuple: dist.tuple,
                    platform: dist.platform,
                    arch: dist.arch,
                    version: dist.version,
                    channel: dist.channel,
                    url: dist.url,
                    sha256: dist.sha256,
                    installDir,
                    binPath,
                    source: options.source,
                };
            }

            rmSync(installDir, { recursive: true, force: true });
        }

        const tempRoot = options.tmpDir ?? tmpdir();
        const workDir = mkdtempSync(join(tempRoot, "bnk-zig-"));

        try {
            const archivePath = join(workDir, basename(new URL(dist.url).pathname));
            await this.downloadArchive(dist.url, archivePath);
            const digest = await sha256File(archivePath);
            if (digest.toLowerCase() !== dist.sha256.toLowerCase()) {
                throw new Error(`Checksum mismatch for ${dist.url}`);
            }
            const extractDir = join(workDir, "extract");
            ensureDir(extractDir);
            await this.extractArchive(archivePath, extractDir);
            const payloadDir = firstDirChild(extractDir);
            moveIntoPlace(payloadDir, installDir);
            const binPath = join(installDir, zigBinaryName(dist.tuple));
            chmodIfNeeded(binPath, dist.tuple);
            recordInstallSignature(installDir, dist.sha256);
            return {
                tuple: dist.tuple,
                platform: dist.platform,
                arch: dist.arch,
                version: dist.version,
                channel: dist.channel,
                url: dist.url,
                sha256: dist.sha256,
                installDir,
                binPath,
                source: options.source,
            };
        } finally {
            rmSync(workDir, { recursive: true, force: true });
        }
    }

    private async downloadArchive(url: string, destination: string): Promise<void> {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Failed to download ${url}: ${res.status} ${res.statusText}`);
        }
        const blob = await res.blob();
        await Bun.write(destination, blob);
    }

    private async extractArchive(archivePath: string, dest: string): Promise<void> {
        const ext = detectArchiveExtension(archivePath);
        if (ext === ".tar.gz" || ext === ".tgz" || ext === ".gz") {
            await runExtraction(["tar", "-xzf", archivePath, "-C", dest], process.cwd());
        } else if (ext === ".tar.xz" || ext === ".txz" || ext === ".xz") {
            await runExtraction(["tar", "-xJf", archivePath, "-C", dest], process.cwd());
        } else if (ext === ".zip") {
            await runExtraction(["unzip", "-o", archivePath, "-d", dest], process.cwd());
        } else {
            throw new Error(`unsupported archive type: ${ext}`);
        }
    }
}


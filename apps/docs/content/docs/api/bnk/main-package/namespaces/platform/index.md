---
title: Overview
---

# platform

Platform detection, toolchain management, and cache directory utilities.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [ToolchainStatus](./interfaces/ToolchainStatus.md) | - |

## Variables

### PLATFORMS

```ts
const PLATFORMS: Record<TargetPlatform, PlatformInfo>;
```

Defined in: [internal/platform/src/index.ts:45](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/platform/src/index.ts#L45)

## Functions

| Function | Description |
| ------ | ------ |
| [commandExists](./functions/commandExists.md) | - |
| [getCacheDir](./functions/getCacheDir.md) | Returns ~/.cache/bunnativekit (or platform equivalent), creating it if needed |
| [getCacheSubdir](./functions/getCacheSubdir.md) | - |
| [getCommandVersion](./functions/getCommandVersion.md) | - |
| [getCurrentArch](./functions/getCurrentArch.md) | - |
| [getCurrentPlatform](./functions/getCurrentPlatform.md) | - |
| [getCurrentPlatformArch](./functions/getCurrentPlatformArch.md) | - |
| [getLibPrefix](./functions/getLibPrefix.md) | - |
| [getNapiExt](./functions/getNapiExt.md) | - |
| [getPlatformInfo](./functions/getPlatformInfo.md) | - |
| [getSharedExt](./functions/getSharedExt.md) | - |
| [getToolchainStatus](./functions/getToolchainStatus.md) | - |
| [getZigTarget](./functions/getZigTarget.md) | - |
| [getZigVersion](./functions/getZigVersion.md) | - |
| [isCI](./functions/isCI.md) | - |
| [isCrossCompile](./functions/isCrossCompile.md) | - |
| [isDev](./functions/isDev.md) | - |
| [isProd](./functions/isProd.md) | - |
| [isZigInstalled](./functions/isZigInstalled.md) | - |

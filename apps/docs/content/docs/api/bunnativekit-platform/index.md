---
title: Overview
---

# @bunnativekit/platform

Platform detection, toolchain management, and cache directory utilities.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [ToolchainStatus](interfaces/ToolchainStatus) | - |

## Variables

### PLATFORMS

```ts
const PLATFORMS: Record<TargetPlatform, PlatformInfo>;
```

Defined in: index.ts:45

## Functions

| Function | Description |
| ------ | ------ |
| [commandExists](functions/commandExists) | - |
| [getCacheDir](functions/getCacheDir) | Returns ~/.cache/bunnativekit (or platform equivalent), creating it if needed |
| [getCacheSubdir](functions/getCacheSubdir) | - |
| [getCommandVersion](functions/getCommandVersion) | - |
| [getCurrentArch](functions/getCurrentArch) | - |
| [getCurrentPlatform](functions/getCurrentPlatform) | - |
| [getCurrentPlatformArch](functions/getCurrentPlatformArch) | - |
| [getLibPrefix](functions/getLibPrefix) | - |
| [getNapiExt](functions/getNapiExt) | - |
| [getPlatformInfo](functions/getPlatformInfo) | - |
| [getSharedExt](functions/getSharedExt) | - |
| [getToolchainStatus](functions/getToolchainStatus) | - |
| [getZigTarget](functions/getZigTarget) | - |
| [getZigVersion](functions/getZigVersion) | - |
| [isCI](functions/isCI) | - |
| [isCrossCompile](functions/isCrossCompile) | - |
| [isDev](functions/isDev) | - |
| [isProd](functions/isProd) | - |
| [isZigInstalled](functions/isZigInstalled) | - |

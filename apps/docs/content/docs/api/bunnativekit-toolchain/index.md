---
title: Overview
---

# @bunnativekit/toolchain

Zig toolchain acquisition and management.
Downloads, caches, and provides Zig binaries for cross-platform builds.

## Classes

| Class | Description |
| ------ | ------ |
| [ZigToolchainManager](./classes/ZigToolchainManager.md) | Manages Zig toolchain acquisition, caching, and version resolution |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [ZigAcquisitionOptions](./interfaces/ZigAcquisitionOptions.md) | - |
| [ZigBinary](./interfaces/ZigBinary.md) | - |
| [ZigDistribution](./interfaces/ZigDistribution.md) | - |
| [ZigEnsureResult](./interfaces/ZigEnsureResult.md) | - |
| [ZigReleaseRequest](./interfaces/ZigReleaseRequest.md) | - |
| [ZigToolchainManagerOptions](./interfaces/ZigToolchainManagerOptions.md) | - |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [ZigChannel](./type-aliases/ZigChannel.md) | - |
| [ZigPlatformSources](./type-aliases/ZigPlatformSources.md) | - |
| [ZigSource](./type-aliases/ZigSource.md) | - |
| [ZigSources](./type-aliases/ZigSources.md) | - |
| [ZigTuple](./type-aliases/ZigTuple.md) | - |

## Variables

### ZigSourcesSchema

```ts
const ZigSourcesSchema: ZodObject<{
  master: ZodObject<{
     latest: ZodPipe<ZodRecord<ZodEnum<{
        aarch64-darwin: "aarch64-darwin";
        aarch64-linux: "aarch64-linux";
        aarch64-windows: "aarch64-windows";
        x86_64-darwin: "x86_64-darwin";
        x86_64-linux: "x86_64-linux";
        x86_64-windows: "x86_64-windows";
      }>, ZodUnknown>, ZodTransform<Partial<Record<
        | "x86_64-linux"
        | "aarch64-linux"
        | "x86_64-darwin"
        | "aarch64-darwin"
        | "x86_64-windows"
        | "aarch64-windows", {
        sha256: string;
        url: string;
        version: string;
      }>>, Record<
        | "x86_64-linux"
        | "aarch64-linux"
        | "x86_64-darwin"
        | "aarch64-darwin"
        | "x86_64-windows"
       | "aarch64-windows", unknown>>>;
   }, $catchall<ZodPipe<ZodRecord<ZodEnum<{
     aarch64-darwin: "aarch64-darwin";
     aarch64-linux: "aarch64-linux";
     aarch64-windows: "aarch64-windows";
     x86_64-darwin: "x86_64-darwin";
     x86_64-linux: "x86_64-linux";
     x86_64-windows: "x86_64-windows";
   }>, ZodUnknown>, ZodTransform<Partial<Record<
     | "x86_64-linux"
     | "aarch64-linux"
     | "x86_64-darwin"
     | "aarch64-darwin"
     | "x86_64-windows"
     | "aarch64-windows", {
     sha256: string;
     url: string;
     version: string;
   }>>, Record<
     | "x86_64-linux"
     | "aarch64-linux"
     | "x86_64-darwin"
     | "aarch64-darwin"
     | "x86_64-windows"
    | "aarch64-windows", unknown>>>>>;
}, $catchall<ZodPipe<ZodRecord<ZodEnum<{
  aarch64-darwin: "aarch64-darwin";
  aarch64-linux: "aarch64-linux";
  aarch64-windows: "aarch64-windows";
  x86_64-darwin: "x86_64-darwin";
  x86_64-linux: "x86_64-linux";
  x86_64-windows: "x86_64-windows";
}>, ZodUnknown>, ZodTransform<Partial<Record<
  | "x86_64-linux"
  | "aarch64-linux"
  | "x86_64-darwin"
  | "aarch64-darwin"
  | "x86_64-windows"
  | "aarch64-windows", {
  sha256: string;
  url: string;
  version: string;
}>>, Record<
  | "x86_64-linux"
  | "aarch64-linux"
  | "x86_64-darwin"
  | "aarch64-darwin"
  | "x86_64-windows"
| "aarch64-windows", unknown>>>>>;
```

Defined in: [internal/toolchain/src/index.ts:95](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L95)

## Functions

| Function | Description |
| ------ | ------ |
| [fetchZigSources](./functions/fetchZigSources.md) | Fetch available Zig versions from the upstream overlay |

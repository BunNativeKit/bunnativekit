---
title: Overview
---

# @bunnativekit/toolchain

## Classes

| Class | Description |
| ------ | ------ |
| [ZigToolchainManager](classes/ZigToolchainManager) | - |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [ZigAcquisitionOptions](interfaces/ZigAcquisitionOptions) | - |
| [ZigBinary](interfaces/ZigBinary) | - |
| [ZigDistribution](interfaces/ZigDistribution) | - |
| [ZigEnsureResult](interfaces/ZigEnsureResult) | - |
| [ZigReleaseRequest](interfaces/ZigReleaseRequest) | - |
| [ZigToolchainManagerOptions](interfaces/ZigToolchainManagerOptions) | - |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [ZigChannel](type-aliases/ZigChannel) | - |
| [ZigPlatformSources](type-aliases/ZigPlatformSources) | - |
| [ZigSource](type-aliases/ZigSource) | - |
| [ZigSources](type-aliases/ZigSources) | - |
| [ZigTuple](type-aliases/ZigTuple) | - |

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

Defined in: internal/toolchain/src/index.ts:88

## Functions

| Function | Description |
| ------ | ------ |
| [fetchZigSources](functions/fetchZigSources) | - |

---
title: Overview
---

# @bunnativekit/types

Shared type definitions for BunNativeKit.
FFI types, platform info, module manifests, and configuration interfaces.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [AOTOptions](./interfaces/AOTOptions.md) | - |
| [AOTResult](./interfaces/AOTResult.md) | - |
| [BindingConfig](./interfaces/BindingConfig.md) | - |
| [BuildConfig](./interfaces/BuildConfig.md) | - |
| [BuildResult](./interfaces/BuildResult.md) | - |
| [CacheConfig](./interfaces/CacheConfig.md) | - |
| [DebugConfig](./interfaces/DebugConfig.md) | - |
| [ErrorConfig](./interfaces/ErrorConfig.md) | - |
| [FFISymbolDef](./interfaces/FFISymbolDef.md) | FFI symbol definition for dlopen |
| [IsolationConfig](./interfaces/IsolationConfig.md) | - |
| [JITModule](./interfaces/JITModule.md) | - |
| [JITOptions](./interfaces/JITOptions.md) | - |
| [LoadedModule](./interfaces/LoadedModule.md) | A loaded native module |
| [LoadOptions](./interfaces/LoadOptions.md) | - |
| [ModuleManifest](./interfaces/ModuleManifest.md) | Describes a BNK native module |
| [NAPISymbolDef](./interfaces/NAPISymbolDef.md) | NAPI symbol definition |
| [PlatformInfo](./interfaces/PlatformInfo.md) | Platform-specific paths and extensions |
| [ProjectConfig](./interfaces/ProjectConfig.md) | - |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [BindingMethod](./type-aliases/BindingMethod.md) | - |
| [DebugLevel](./type-aliases/DebugLevel.md) | - |
| [ErrorMode](./type-aliases/ErrorMode.md) | - |
| [FFIType](./type-aliases/FFIType.md) | - |
| [FFITypeString](./type-aliases/FFITypeString.md) | FFI type strings supported by bun:ffi |
| [IPCMessage](./type-aliases/IPCMessage.md) | IPC message types for subprocess isolation |
| [IsolationMode](./type-aliases/IsolationMode.md) | - |
| [OptimizationLevel](./type-aliases/OptimizationLevel.md) | - |
| [PlatformArch](./type-aliases/PlatformArch.md) | - |
| [SourceLanguage](./type-aliases/SourceLanguage.md) | - |
| [TargetArch](./type-aliases/TargetArch.md) | - |
| [TargetPlatform](./type-aliases/TargetPlatform.md) | - |

## Functions

| Function | Description |
| ------ | ------ |
| [defineConfig](./functions/defineConfig.md) | Define project config with type checking |
| [defineModule](./functions/defineModule.md) | Define a module manifest with type checking |

---
title: Overview
---

# @bunnativekit/types

Shared type definitions for BunNativeKit.
FFI types, platform info, module manifests, and configuration interfaces.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [AOTOptions](interfaces/AOTOptions) | - |
| [AOTResult](interfaces/AOTResult) | - |
| [BindingConfig](interfaces/BindingConfig) | - |
| [BuildConfig](interfaces/BuildConfig) | - |
| [BuildResult](interfaces/BuildResult) | - |
| [CacheConfig](interfaces/CacheConfig) | - |
| [DebugConfig](interfaces/DebugConfig) | - |
| [ErrorConfig](interfaces/ErrorConfig) | - |
| [FFISymbolDef](interfaces/FFISymbolDef) | FFI symbol definition for dlopen |
| [IsolationConfig](interfaces/IsolationConfig) | - |
| [JITModule](interfaces/JITModule) | - |
| [JITOptions](interfaces/JITOptions) | - |
| [LoadedModule](interfaces/LoadedModule) | A loaded native module |
| [LoadOptions](interfaces/LoadOptions) | - |
| [ModuleManifest](interfaces/ModuleManifest) | Describes a BNK native module |
| [NAPISymbolDef](interfaces/NAPISymbolDef) | NAPI symbol definition |
| [PlatformInfo](interfaces/PlatformInfo) | Platform-specific paths and extensions |
| [ProjectConfig](interfaces/ProjectConfig) | - |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [BindingMethod](type-aliases/BindingMethod) | - |
| [DebugLevel](type-aliases/DebugLevel) | - |
| [ErrorMode](type-aliases/ErrorMode) | - |
| [FFIType](type-aliases/FFIType) | - |
| [FFITypeString](type-aliases/FFITypeString) | FFI type strings supported by bun:ffi |
| [IPCMessage](type-aliases/IPCMessage) | IPC message types for subprocess isolation |
| [IsolationMode](type-aliases/IsolationMode) | - |
| [OptimizationLevel](type-aliases/OptimizationLevel) | - |
| [PlatformArch](type-aliases/PlatformArch) | - |
| [SourceLanguage](type-aliases/SourceLanguage) | - |
| [TargetArch](type-aliases/TargetArch) | - |
| [TargetPlatform](type-aliases/TargetPlatform) | - |

## Functions

| Function | Description |
| ------ | ------ |
| [defineConfig](functions/defineConfig) | Define project config with type checking |
| [defineModule](functions/defineModule) | Define a module manifest with type checking |

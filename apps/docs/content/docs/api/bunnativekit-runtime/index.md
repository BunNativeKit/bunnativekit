---
title: Overview
---

# @bunnativekit/runtime

Load and execute pre-built native modules at runtime.
Supports FFI/NAPI bindings with optional subprocess isolation.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [FFISymbolDef](interfaces/FFISymbolDef) | FFI symbol definition for dlopen |
| [LoadedModule](interfaces/LoadedModule) | A loaded native module |
| [LoadOptions](interfaces/LoadOptions) | - |
| [ModuleManifest](interfaces/ModuleManifest) | Describes a BNK native module |
| [ProjectConfig](interfaces/ProjectConfig) | - |
| [RuntimeLoadOptions](interfaces/RuntimeLoadOptions) | - |
| [RuntimeModule](interfaces/RuntimeModule) | A loaded native module |

## Functions

| Function | Description |
| ------ | ------ |
| [defineConfig](functions/defineConfig) | Define project config with type checking |
| [defineModule](functions/defineModule) | Define a module manifest with type checking |
| [loadModule](functions/loadModule) | Load a native module from path or manifest |

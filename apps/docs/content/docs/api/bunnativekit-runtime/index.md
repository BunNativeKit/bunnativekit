---
title: Overview
---

# @bunnativekit/runtime

Load and execute pre-built native modules at runtime.
Supports FFI/NAPI bindings with optional subprocess isolation.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [FFISymbolDef](./interfaces/FFISymbolDef.md) | FFI symbol definition for dlopen |
| [LoadedModule](./interfaces/LoadedModule.md) | A loaded native module |
| [LoadOptions](./interfaces/LoadOptions.md) | - |
| [ModuleManifest](./interfaces/ModuleManifest.md) | Describes a BNK native module |
| [ProjectConfig](./interfaces/ProjectConfig.md) | - |
| [RuntimeLoadOptions](./interfaces/RuntimeLoadOptions.md) | - |
| [RuntimeModule](./interfaces/RuntimeModule.md) | A loaded native module |

## Functions

| Function | Description |
| ------ | ------ |
| [defineConfig](./functions/defineConfig.md) | Define project config with type checking |
| [defineModule](./functions/defineModule.md) | Define a module manifest with type checking |
| [loadModule](./functions/loadModule.md) | Load a native module from path or manifest |

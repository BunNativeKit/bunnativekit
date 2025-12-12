---
title: Overview
---

# @bunnativekit/loader

Native module loading via FFI, NAPI, and Bun's cc runtime compiler.
Provides unified interface for all binding methods.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [CCLoadOptions](./interfaces/CCLoadOptions.md) | - |
| [CCModule](./interfaces/CCModule.md) | - |
| [FFILibrary](./interfaces/FFILibrary.md) | - |
| [FFILoadOptions](./interfaces/FFILoadOptions.md) | - |
| [NAPILoadOptions](./interfaces/NAPILoadOptions.md) | - |
| [NAPIModule](./interfaces/NAPIModule.md) | - |
| [UnifiedLoadOptions](./interfaces/UnifiedLoadOptions.md) | - |
| [UnifiedModule](./interfaces/UnifiedModule.md) | - |

## Functions

| Function | Description |
| ------ | ------ |
| [loadCC](./functions/loadCC.md) | Compile and load C code at runtime via Bun's cc |
| [loadFFI](./functions/loadFFI.md) | Load a shared library via Bun's FFI |
| [loadModule](./functions/loadModule.md) | Load a native module - auto-selects FFI, NAPI, or cc based on binding type |
| [loadNAPI](./functions/loadNAPI.md) | Load a native addon (.node file) via NAPI |

---
title: Overview
---

# @bunnativekit/loader

Native module loading via FFI, NAPI, and Bun's cc runtime compiler.
Provides unified interface for all binding methods.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [CCLoadOptions](interfaces/CCLoadOptions) | - |
| [CCModule](interfaces/CCModule) | - |
| [FFILibrary](interfaces/FFILibrary) | - |
| [FFILoadOptions](interfaces/FFILoadOptions) | - |
| [NAPILoadOptions](interfaces/NAPILoadOptions) | - |
| [NAPIModule](interfaces/NAPIModule) | - |
| [UnifiedLoadOptions](interfaces/UnifiedLoadOptions) | - |
| [UnifiedModule](interfaces/UnifiedModule) | - |

## Functions

| Function | Description |
| ------ | ------ |
| [loadCC](functions/loadCC) | Compile and load C code at runtime via Bun's cc |
| [loadFFI](functions/loadFFI) | Load a shared library via Bun's FFI |
| [loadModule](functions/loadModule) | Load a native module - auto-selects FFI, NAPI, or cc based on binding type |
| [loadNAPI](functions/loadNAPI) | Load a native addon (.node file) via NAPI |

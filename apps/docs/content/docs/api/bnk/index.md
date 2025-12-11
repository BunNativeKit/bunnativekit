---
title: Overview
---

# bnk

## Modules

| Module | Description |
| ------ | ------ |
| [cli](cli/index) | Command-line interface for BunNativeKit. |
| [commands](commands/index) | CLI command exports for the bnk tool. |
| [commands/analyze](commands/analyze/index) | Analyze logs, traces, crash dumps, and memory usage. |
| [commands/build](commands/build/index) | Build native modules from Zig, C, or C++ source. |
| [commands/dev](commands/dev/index) | Development mode with file watching and auto-rebuild. |
| [commands/doctor](commands/doctor/index) | Check toolchain status and diagnose environment issues. |
| [commands/ftcfg](commands/ftcfg/index) | First-time configuration: install Zig and set up environment. |
| [commands/init](commands/init/index) | Initialize a new BunNativeKit project with templates. |
| [commands/inspect](commands/inspect/index) | Inspect native modules: symbols, memory layout, dependencies. |
| [commands/run](commands/run/index) | Run scripts with optional isolation harness for native calls. |
| [commands/test](commands/test/index) | Run TypeScript and native Zig tests with isolation support. |
| [index](index/index) | Main monolithic package exporting all BunNativeKit APIs. Use via CLI (`bunx bnk`) or as a library. |
| [utils](utils/index) | CLI utility exports. |
| [utils/colors](utils/colors/index) | Terminal color utilities using Bun.color for styled CLI output. |

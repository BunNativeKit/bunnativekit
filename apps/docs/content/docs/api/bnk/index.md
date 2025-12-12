---
title: Overview
---

# bnk

## Modules

| Module | Description |
| ------ | ------ |
| [cli](./cli/index.md) | Command-line interface for BunNativeKit. |
| [commands](./commands/index.md) | CLI command exports for the bnk tool. |
| [commands/analyze](./commands/analyze/index.md) | Analyze logs, traces, crash dumps, and memory usage. |
| [commands/build](./commands/build/index.md) | Build native modules from Zig, C, or C++ source. |
| [commands/dev](./commands/dev/index.md) | Development mode with file watching and auto-rebuild. |
| [commands/doctor](./commands/doctor/index.md) | Check toolchain status and diagnose environment issues. |
| [commands/ftcfg](./commands/ftcfg/index.md) | First-time configuration: install Zig and set up environment. |
| [commands/init](./commands/init/index.md) | Initialize a new BunNativeKit project with templates. |
| [commands/inspect](./commands/inspect/index.md) | Inspect native modules: symbols, memory layout, dependencies. |
| [commands/run](./commands/run/index.md) | Run scripts with optional isolation harness for native calls. |
| [commands/test](./commands/test/index.md) | Run TypeScript and native Zig tests with isolation support. |
| [index](./main-package/index.md) | Main monolithic package exporting all BunNativeKit APIs. Use via CLI (`bunx bnk`) or as a library. |
| [utils](./utils/index.md) | CLI utility exports. |
| [utils/colors](./utils/colors/index.md) | Terminal color utilities using Bun.color for styled CLI output. |

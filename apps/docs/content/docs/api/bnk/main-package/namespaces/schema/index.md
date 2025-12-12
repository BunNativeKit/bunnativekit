---
title: Overview
---

# schema

Configuration and module manifest parsing for BunNativeKit projects.
Handles discovery, loading, validation, and merging of bnk.config.ts and module.bnk.ts files.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [ValidationResult](./interfaces/ValidationResult.md) | - |

## Variables

### DEFAULT\_MODULE\_MANIFEST

```ts
const DEFAULT_MODULE_MANIFEST: Partial<ModuleManifest>;
```

Defined in: [internal/schema/src/index.ts:40](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/schema/src/index.ts#L40)

***

### DEFAULT\_PROJECT\_CONFIG

```ts
const DEFAULT_PROJECT_CONFIG: Required<ProjectConfig>;
```

Defined in: [internal/schema/src/index.ts:20](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/schema/src/index.ts#L20)

## Functions

| Function | Description |
| ------ | ------ |
| [findConfigFile](./functions/findConfigFile.md) | Walk up directories to find a config file |
| [findModules](./functions/findModules.md) | Recursively find all module.bnk.ts files in a directory |
| [findProjectRoot](./functions/findProjectRoot.md) | Find project root (directory containing bnk.config.ts) |
| [loadModuleManifest](./functions/loadModuleManifest.md) | Load module manifest from module.bnk.ts |
| [loadProjectConfig](./functions/loadProjectConfig.md) | Load project config from bnk.config.ts |
| [mergeModuleManifest](./functions/mergeModuleManifest.md) | Merge module manifest with defaults |
| [mergeProjectConfig](./functions/mergeProjectConfig.md) | Merge user config with defaults |
| [resolveIsolationMode](./functions/resolveIsolationMode.md) | Resolve 'auto' isolation mode based on dev/prod environment |
| [validateModuleManifest](./functions/validateModuleManifest.md) | Validate module manifest |
| [validateProjectConfig](./functions/validateProjectConfig.md) | Validate project config |

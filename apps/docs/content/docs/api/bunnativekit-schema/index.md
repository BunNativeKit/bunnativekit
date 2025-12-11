---
title: Overview
---

# @bunnativekit/schema

Configuration and module manifest parsing for BunNativeKit projects.
Handles discovery, loading, validation, and merging of bnk.config.ts and module.bnk.ts files.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [ValidationResult](interfaces/ValidationResult) | - |

## Variables

### DEFAULT\_MODULE\_MANIFEST

```ts
const DEFAULT_MODULE_MANIFEST: Partial<ModuleManifest>;
```

Defined in: index.ts:40

***

### DEFAULT\_PROJECT\_CONFIG

```ts
const DEFAULT_PROJECT_CONFIG: Required<ProjectConfig>;
```

Defined in: index.ts:20

## Functions

| Function | Description |
| ------ | ------ |
| [findConfigFile](functions/findConfigFile) | Walk up directories to find a config file |
| [findModules](functions/findModules) | Recursively find all module.bnk.ts files in a directory |
| [findProjectRoot](functions/findProjectRoot) | Find project root (directory containing bnk.config.ts) |
| [loadModuleManifest](functions/loadModuleManifest) | Load module manifest from module.bnk.ts |
| [loadProjectConfig](functions/loadProjectConfig) | Load project config from bnk.config.ts |
| [mergeModuleManifest](functions/mergeModuleManifest) | Merge module manifest with defaults |
| [mergeProjectConfig](functions/mergeProjectConfig) | Merge user config with defaults |
| [resolveIsolationMode](functions/resolveIsolationMode) | Resolve 'auto' isolation mode based on dev/prod environment |
| [validateModuleManifest](functions/validateModuleManifest) | Validate module manifest |
| [validateProjectConfig](functions/validateProjectConfig) | Validate project config |

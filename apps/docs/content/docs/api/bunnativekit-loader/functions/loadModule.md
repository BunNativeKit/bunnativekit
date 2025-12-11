---
title: LoadModule
---

# Function: loadModule()

```ts
function loadModule(options): UnifiedModule;
```

Defined in: index.ts:326

Load a native module - auto-selects FFI, NAPI, or cc based on binding type

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`UnifiedLoadOptions`](../interfaces/UnifiedLoadOptions) |

## Returns

[`UnifiedModule`](../interfaces/UnifiedModule)

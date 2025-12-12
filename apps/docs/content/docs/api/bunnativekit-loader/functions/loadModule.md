---
title: LoadModule
---

# Function: loadModule()

```ts
function loadModule(options): UnifiedModule;
```

Defined in: [index.ts:326](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L326)

Load a native module - auto-selects FFI, NAPI, or cc based on binding type

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`UnifiedLoadOptions`](../interfaces/UnifiedLoadOptions.md) |

## Returns

[`UnifiedModule`](../interfaces/UnifiedModule.md)

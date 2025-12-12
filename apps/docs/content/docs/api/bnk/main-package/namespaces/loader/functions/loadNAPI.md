---
title: LoadNAPI
---

# Function: loadNAPI()

```ts
function loadNAPI<T>(options): NAPIModule<T>;
```

Defined in: [internal/loader/src/index.ts:154](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L154)

Load a native addon (.node file) via NAPI

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `Record`\<`string`, `unknown`\> |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`NAPILoadOptions`](../interfaces/NAPILoadOptions.md) |

## Returns

[`NAPIModule`](../interfaces/NAPIModule.md)\<`T`\>

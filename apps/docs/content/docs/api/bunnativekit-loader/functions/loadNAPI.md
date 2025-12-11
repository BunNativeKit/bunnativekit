---
title: LoadNAPI
---

# Function: loadNAPI()

```ts
function loadNAPI<T>(options): NAPIModule<T>;
```

Defined in: index.ts:154

Load a native addon (.node file) via NAPI

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `Record`\<`string`, `unknown`\> |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`NAPILoadOptions`](../interfaces/NAPILoadOptions) |

## Returns

[`NAPIModule`](../interfaces/NAPIModule)\<`T`\>

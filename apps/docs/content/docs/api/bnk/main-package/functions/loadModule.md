---
title: LoadModule
---

# Function: loadModule()

```ts
function loadModule<T>(options): Promise<RuntimeModule<T>>;
```

Defined in: [packages/runtime/src/index.ts:75](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/runtime/src/index.ts#L75)

Load a native module from path or manifest

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`RuntimeLoadOptions`](../interfaces/RuntimeLoadOptions.md) |

## Returns

`Promise`\<[`RuntimeModule`](../interfaces/RuntimeModule.md)\<`T`\>\>

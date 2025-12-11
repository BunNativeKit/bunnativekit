---
title: LoadModule
---

# Function: loadModule()

```ts
function loadModule<T>(options): Promise<RuntimeModule<T>>;
```

Defined in: runtime/src/index.ts:75

Load a native module from path or manifest

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`RuntimeLoadOptions`](../interfaces/RuntimeLoadOptions) |

## Returns

`Promise`\<[`RuntimeModule`](../interfaces/RuntimeModule)\<`T`\>\>

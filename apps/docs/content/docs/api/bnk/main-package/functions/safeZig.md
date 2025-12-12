---
title: SafeZig
---

# Function: safeZig()

```ts
function safeZig(source, ...args): Promise<SafeResult<unknown, Error>>;
```

Defined in: [packages/jit/src/index.ts:734](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/jit/src/index.ts#L734)

Execute Zig safely, returning a SafeResult

## Parameters

| Parameter | Type |
| ------ | ------ |
| `source` | `string` |
| ...`args` | `unknown`[] |

## Returns

`Promise`\<[`SafeResult`](../classes/SafeResult.md)\<`unknown`, `Error`\>\>

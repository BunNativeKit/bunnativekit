---
title: SafeZig
---

# Function: safeZig()

```ts
function safeZig(source, ...args): Promise<SafeResult<unknown, Error>>;
```

Defined in: jit/src/index.ts:734

Execute Zig safely, returning a SafeResult

## Parameters

| Parameter | Type |
| ------ | ------ |
| `source` | `string` |
| ...`args` | `unknown`[] |

## Returns

`Promise`\<[`SafeResult`](../classes/SafeResult)\<`unknown`, `Error`\>\>

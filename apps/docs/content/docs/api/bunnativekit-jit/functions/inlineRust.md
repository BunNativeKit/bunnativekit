---
title: InlineRust
---

# Function: inlineRust()

```ts
function inlineRust(source, ...args): Promise<unknown>;
```

Defined in: jit/src/index.ts:533

Execute inline Rust code - calls #[no_mangle] extern "C" fn main with args

## Parameters

| Parameter | Type |
| ------ | ------ |
| `source` | `string` |
| ...`args` | `unknown`[] |

## Returns

`Promise`\<`unknown`\>

---
title: InlineRust
---

# Function: inlineRust()

```ts
function inlineRust(source, ...args): Promise<unknown>;
```

Defined in: [packages/jit/src/index.ts:533](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/jit/src/index.ts#L533)

Execute inline Rust code - calls #[no_mangle] extern "C" fn main with args

## Parameters

| Parameter | Type |
| ------ | ------ |
| `source` | `string` |
| ...`args` | `unknown`[] |

## Returns

`Promise`\<`unknown`\>

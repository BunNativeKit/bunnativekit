---
title: CompileJIT
---

# Function: compileJIT()

```ts
function compileJIT(options): Promise<JITModule>;
```

Defined in: [jit/src/index.ts:421](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/jit/src/index.ts#L421)

Compile native code just-in-time. Symbols parsed from source if not provided.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`CompileOptions`](../interfaces/CompileOptions.md) |

## Returns

`Promise`\<`JITModule`\>

## Example

```ts
const lib = await jit.compile({ lang: "zig", source: `export fn add(a: i32, b: i32) i32 { return a + b; }` });
lib.call("add", 1, 2); // 3
```

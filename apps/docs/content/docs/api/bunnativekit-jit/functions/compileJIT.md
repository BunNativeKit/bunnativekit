---
title: CompileJIT
---

# Function: compileJIT()

```ts
function compileJIT(options): Promise<JITModule>;
```

Defined in: jit/src/index.ts:421

Compile native code just-in-time. Symbols parsed from source if not provided.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`CompileOptions`](../interfaces/CompileOptions) |

## Returns

`Promise`\<`JITModule`\>

## Example

```ts
const lib = await jit.compile({ lang: "zig", source: `export fn add(a: i32, b: i32) i32 { return a + b; }` });
lib.call("add", 1, 2); // 3
```

---
title: ParseSymbols
---

# Function: parseSymbols()

```ts
function parseSymbols(source, lang): Record<string, FFISymbolDef>;
```

Defined in: [packages/jit/src/index.ts:335](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/jit/src/index.ts#L335)

Parse source code and extract FFI symbols

## Parameters

| Parameter | Type |
| ------ | ------ |
| `source` | `string` |
| `lang` | [`SourceLanguage`](../type-aliases/SourceLanguage.md) |

## Returns

`Record`\<`string`, [`FFISymbolDef`](../interfaces/FFISymbolDef.md)\>

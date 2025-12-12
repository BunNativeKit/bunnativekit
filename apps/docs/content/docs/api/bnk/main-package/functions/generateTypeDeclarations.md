---
title: GenerateTypeDeclarations
---

# Function: generateTypeDeclarations()

```ts
function generateTypeDeclarations(moduleName, symbols): string;
```

Defined in: [packages/aot/src/index.ts:154](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/aot/src/index.ts#L154)

Generate TypeScript declarations from symbol definitions

## Parameters

| Parameter | Type |
| ------ | ------ |
| `moduleName` | `string` |
| `symbols` | `Record`\<`string`, [`FFISymbolDef`](../interfaces/FFISymbolDef.md)\> |

## Returns

`string`

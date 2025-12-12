---
title: CppTemplate
---

# Function: cppTemplate()

```ts
function cppTemplate(strings, ...values): Promise<JITModule>;
```

Defined in: [packages/jit/src/index.ts:610](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/jit/src/index.ts#L610)

Tagged template for C++ - parses symbols automatically

## Parameters

| Parameter | Type |
| ------ | ------ |
| `strings` | `TemplateStringsArray` |
| ...`values` | `unknown`[] |

## Returns

`Promise`\<[`JITModule`](../interfaces/JITModule.md)\>

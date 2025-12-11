---
title: Overview
---

# @bunnativekit/aot

Pre-compile native modules with automatic TypeScript declaration generation.
Supports watch mode, cross-compilation, and build caching.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [AOTCompileOptions](interfaces/AOTCompileOptions) | - |

## Variables

### aot

```ts
const aot: {
  compile: (options) => Promise<AOTResult>;
  generateTypes: (moduleName, symbols) => string;
};
```

Defined in: aot/src/index.ts:277

#### Type Declaration

##### compile()

```ts
compile: (options) => Promise<AOTResult> = compileAOT;
```

Compile native code ahead-of-time with TypeScript declarations

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AOTCompileOptions`](interfaces/AOTCompileOptions) |

###### Returns

`Promise`\<`AOTResult`\>

##### generateTypes()

```ts
generateTypes: (moduleName, symbols) => string = generateTypeDeclarations;
```

Generate TypeScript declarations from symbol definitions

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `moduleName` | `string` |
| `symbols` | `Record`\<`string`, `FFISymbolDef`\> |

###### Returns

`string`

## Functions

| Function | Description |
| ------ | ------ |
| [compileAOT](functions/compileAOT) | Compile native code ahead-of-time with TypeScript declarations |
| [generateTypeDeclarations](functions/generateTypeDeclarations) | Generate TypeScript declarations from symbol definitions |

## References

### default

Renames and re-exports [aot](#aot)

---
title: Overview
---

# compiler

Native code compilation for Zig, C/C++, and Rust.
Uses Zig as the primary toolchain with cross-compilation support.

## Classes

| Class | Description |
| ------ | ------ |
| [RustCompiler](./classes/RustCompiler.md) | - |
| [ZigCC](./classes/ZigCC.md) | Uses Zig's bundled clang for C/C++ compilation |
| [ZigCompiler](./classes/ZigCompiler.md) | - |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [CompileOptions](./interfaces/CompileOptions.md) | - |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [Compiler](./type-aliases/Compiler.md) | - |

## Variables

### rustCompiler

```ts
const rustCompiler: RustCompiler;
```

Defined in: [internal/compiler/src/index.ts:544](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/compiler/src/index.ts#L544)

***

### zigCC

```ts
const zigCC: ZigCC;
```

Defined in: [internal/compiler/src/index.ts:542](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/compiler/src/index.ts#L542)

***

### zigCompiler

```ts
const zigCompiler: ZigCompiler;
```

Defined in: [internal/compiler/src/index.ts:541](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/compiler/src/index.ts#L541)

***

### zigCXX

```ts
const zigCXX: ZigCC;
```

Defined in: [internal/compiler/src/index.ts:543](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/compiler/src/index.ts#L543)

## Functions

| Function | Description |
| ------ | ------ |
| [compile](./functions/compile.md) | - |
| [getCompiler](./functions/getCompiler.md) | - |

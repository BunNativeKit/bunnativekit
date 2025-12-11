---
title: Overview
---

# @bunnativekit/compiler

Native code compilation for Zig, C/C++, and Rust.
Uses Zig as the primary toolchain with cross-compilation support.

## Classes

| Class | Description |
| ------ | ------ |
| [RustCompiler](classes/RustCompiler) | - |
| [ZigCC](classes/ZigCC) | Uses Zig's bundled clang for C/C++ compilation |
| [ZigCompiler](classes/ZigCompiler) | - |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [CompileOptions](interfaces/CompileOptions) | - |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [Compiler](type-aliases/Compiler) | - |

## Variables

### rustCompiler

```ts
const rustCompiler: RustCompiler;
```

Defined in: index.ts:544

***

### zigCC

```ts
const zigCC: ZigCC;
```

Defined in: index.ts:542

***

### zigCompiler

```ts
const zigCompiler: ZigCompiler;
```

Defined in: index.ts:541

***

### zigCXX

```ts
const zigCXX: ZigCC;
```

Defined in: index.ts:543

## Functions

| Function | Description |
| ------ | ------ |
| [compile](functions/compile) | - |
| [getCompiler](functions/getCompiler) | - |

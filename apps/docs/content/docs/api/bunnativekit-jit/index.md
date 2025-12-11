---
title: Overview
---

# @bunnativekit/jit

Compile and execute native code (Zig, C, C++, Rust) at runtime.
Parses exported symbols automatically - no manual FFI definitions needed.

## Example

```ts
const result = await jit.zig(`
  export fn main(a: i32, b: i32) i32 { return a + b; }
`, 1, 2); // 3
```

## Classes

| Class | Description |
| ------ | ------ |
| [SafeResult](classes/SafeResult) | Result type for safe error handling |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [CompileOptions](interfaces/CompileOptions) | - |
| [InlineOptions](interfaces/InlineOptions) | - |

## Variables

### jit

```ts
const jit: {
  c: (source, ...args) => Promise<unknown>;
  clearCache: () => void;
  compile: (options) => Promise<JITModule>;
  cpp: (source, ...args) => Promise<unknown>;
  cppTemplate: (strings, ...values) => Promise<JITModule>;
  cTemplate: (strings, ...values) => Promise<JITModule>;
  getCacheSize: () => number;
  parseSymbols: (source, lang) => Record<string, FFISymbolDef>;
  rust: (source, ...args) => Promise<unknown>;
  rustTemplate: (strings, ...values) => Promise<JITModule>;
  safeC: (source, ...args) => Promise<SafeResult<unknown, Error>>;
  safeCpp: (source, ...args) => Promise<SafeResult<unknown, Error>>;
  safeRust: (source, ...args) => Promise<SafeResult<unknown, Error>>;
  safeZig: (source, ...args) => Promise<SafeResult<unknown, Error>>;
  zig: (source, ...args) => Promise<unknown>;
  zigTemplate: (strings, ...values) => Promise<JITModule>;
};
```

Defined in: jit/src/index.ts:785

#### Type Declaration

##### c()

```ts
c: (source, ...args) => Promise<unknown> = inlineC;
```

Execute inline C code - calls the `main` function with args

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `source` | `string` |
| ...`args` | `unknown`[] |

###### Returns

`Promise`\<`unknown`\>

##### clearCache()

```ts
clearCache: () => void;
```

Clear the JIT memory cache and close all modules

###### Returns

`void`

##### compile()

```ts
compile: (options) => Promise<JITModule> = compileJIT;
```

Compile native code just-in-time. Symbols parsed from source if not provided.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`CompileOptions`](interfaces/CompileOptions) |

###### Returns

`Promise`\<`JITModule`\>

###### Example

```ts
const lib = await jit.compile({ lang: "zig", source: `export fn add(a: i32, b: i32) i32 { return a + b; }` });
lib.call("add", 1, 2); // 3
```

##### cpp()

```ts
cpp: (source, ...args) => Promise<unknown> = inlineCpp;
```

Execute inline C++ code - calls the `main` function with args

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `source` | `string` |
| ...`args` | `unknown`[] |

###### Returns

`Promise`\<`unknown`\>

##### cppTemplate()

```ts
cppTemplate: (strings, ...values) => Promise<JITModule>;
```

Tagged template for C++ - parses symbols automatically

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `strings` | `TemplateStringsArray` |
| ...`values` | `unknown`[] |

###### Returns

`Promise`\<`JITModule`\>

##### cTemplate()

```ts
cTemplate: (strings, ...values) => Promise<JITModule>;
```

Tagged template for C - parses symbols automatically

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `strings` | `TemplateStringsArray` |
| ...`values` | `unknown`[] |

###### Returns

`Promise`\<`JITModule`\>

##### getCacheSize()

```ts
getCacheSize: () => number;
```

Get current memory cache size

###### Returns

`number`

##### parseSymbols()

```ts
parseSymbols: (source, lang) => Record<string, FFISymbolDef>;
```

Parse source code and extract FFI symbols

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `source` | `string` |
| `lang` | `SourceLanguage` |

###### Returns

`Record`\<`string`, `FFISymbolDef`\>

##### rust()

```ts
rust: (source, ...args) => Promise<unknown> = inlineRust;
```

Execute inline Rust code - calls #[no_mangle] extern "C" fn main with args

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `source` | `string` |
| ...`args` | `unknown`[] |

###### Returns

`Promise`\<`unknown`\>

##### rustTemplate()

```ts
rustTemplate: (strings, ...values) => Promise<JITModule>;
```

Tagged template for Rust - parses symbols automatically

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `strings` | `TemplateStringsArray` |
| ...`values` | `unknown`[] |

###### Returns

`Promise`\<`JITModule`\>

##### safeC()

```ts
safeC: (source, ...args) => Promise<SafeResult<unknown, Error>>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `source` | `string` |
| ...`args` | `unknown`[] |

###### Returns

`Promise`\<[`SafeResult`](classes/SafeResult)\<`unknown`, `Error`\>\>

##### safeCpp()

```ts
safeCpp: (source, ...args) => Promise<SafeResult<unknown, Error>>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `source` | `string` |
| ...`args` | `unknown`[] |

###### Returns

`Promise`\<[`SafeResult`](classes/SafeResult)\<`unknown`, `Error`\>\>

##### safeRust()

```ts
safeRust: (source, ...args) => Promise<SafeResult<unknown, Error>>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `source` | `string` |
| ...`args` | `unknown`[] |

###### Returns

`Promise`\<[`SafeResult`](classes/SafeResult)\<`unknown`, `Error`\>\>

##### safeZig()

```ts
safeZig: (source, ...args) => Promise<SafeResult<unknown, Error>>;
```

Execute Zig safely, returning a SafeResult

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `source` | `string` |
| ...`args` | `unknown`[] |

###### Returns

`Promise`\<[`SafeResult`](classes/SafeResult)\<`unknown`, `Error`\>\>

##### zig()

```ts
zig: (source, ...args) => Promise<unknown> = inlineZig;
```

Execute inline Zig code - calls the `main` function with args

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `source` | `string` |
| ...`args` | `unknown`[] |

###### Returns

`Promise`\<`unknown`\>

##### zigTemplate()

```ts
zigTemplate: (strings, ...values) => Promise<JITModule>;
```

Tagged template for Zig - parses symbols automatically

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `strings` | `TemplateStringsArray` |
| ...`values` | `unknown`[] |

###### Returns

`Promise`\<`JITModule`\>

## Functions

| Function | Description |
| ------ | ------ |
| [clearCache](functions/clearCache) | Clear the JIT memory cache and close all modules |
| [compileJIT](functions/compileJIT) | Compile native code just-in-time. Symbols parsed from source if not provided. |
| [cppTemplate](functions/cppTemplate) | Tagged template for C++ - parses symbols automatically |
| [cTemplate](functions/cTemplate) | Tagged template for C - parses symbols automatically |
| [getCacheSize](functions/getCacheSize) | Get current memory cache size |
| [inlineC](functions/inlineC) | Execute inline C code - calls the `main` function with args |
| [inlineCpp](functions/inlineCpp) | Execute inline C++ code - calls the `main` function with args |
| [inlineRust](functions/inlineRust) | Execute inline Rust code - calls #[no_mangle] extern "C" fn main with args |
| [inlineZig](functions/inlineZig) | Execute inline Zig code - calls the `main` function with args |
| [parseSymbols](functions/parseSymbols) | Parse source code and extract FFI symbols |
| [rustTemplate](functions/rustTemplate) | Tagged template for Rust - parses symbols automatically |
| [safeC](functions/safeC) | - |
| [safeCpp](functions/safeCpp) | - |
| [safeRust](functions/safeRust) | - |
| [safeUse](functions/safeUse) | Wrap a value or promise in a SafeResult |
| [safeZig](functions/safeZig) | Execute Zig safely, returning a SafeResult |
| [zigTemplate](functions/zigTemplate) | Tagged template for Zig - parses symbols automatically |

## References

### default

Renames and re-exports [jit](#jit)

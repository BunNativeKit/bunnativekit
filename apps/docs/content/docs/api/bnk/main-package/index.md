---
title: Overview
---

# index

Main monolithic package exporting all BunNativeKit APIs.
Use via CLI (`bunx bnk`) or as a library.

## Namespaces

| Namespace | Description |
| ------ | ------ |
| [cache](./namespaces/cache/index.md) | Build and runtime caching for compiled native modules. Tracks source hashes to avoid redundant recompilation. |
| [compiler](./namespaces/compiler/index.md) | Native code compilation for Zig, C/C++, and Rust. Uses Zig as the primary toolchain with cross-compilation support. |
| [debug](./namespaces/debug/index.md) | Logging, Chrome DevTools tracing, and Linux process diagnostics. |
| [isolation](./namespaces/isolation/index.md) | Subprocess isolation for safe native module execution. Runs native code in separate processes with IPC communication. |
| [loader](./namespaces/loader/index.md) | Native module loading via FFI, NAPI, and Bun's cc runtime compiler. Provides unified interface for all binding methods. |
| [platform](./namespaces/platform/index.md) | Platform detection, toolchain management, and cache directory utilities. |
| [schema](./namespaces/schema/index.md) | Configuration and module manifest parsing for BunNativeKit projects. Handles discovery, loading, validation, and merging of bnk.config.ts and module.bnk.ts files. |
| [toolchain](./namespaces/toolchain/index.md) | Zig toolchain acquisition and management. Downloads, caches, and provides Zig binaries for cross-platform builds. |

## Classes

| Class | Description |
| ------ | ------ |
| [SafeResult](./classes/SafeResult.md) | Result type for safe error handling |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [AOTCompileOptions](./interfaces/AOTCompileOptions.md) | - |
| [AOTOptions](./interfaces/AOTOptions.md) | - |
| [AOTResult](./interfaces/AOTResult.md) | - |
| [BindingConfig](./interfaces/BindingConfig.md) | - |
| [BuildConfig](./interfaces/BuildConfig.md) | - |
| [BuildResult](./interfaces/BuildResult.md) | - |
| [CacheConfig](./interfaces/CacheConfig.md) | - |
| [CompileOptions](./interfaces/CompileOptions.md) | - |
| [DebugConfig](./interfaces/DebugConfig.md) | - |
| [ErrorConfig](./interfaces/ErrorConfig.md) | - |
| [FFISymbolDef](./interfaces/FFISymbolDef.md) | FFI symbol definition for dlopen |
| [InlineOptions](./interfaces/InlineOptions.md) | - |
| [IsolationConfig](./interfaces/IsolationConfig.md) | - |
| [JITModule](./interfaces/JITModule.md) | - |
| [JITOptions](./interfaces/JITOptions.md) | - |
| [LoadedModule](./interfaces/LoadedModule.md) | A loaded native module |
| [LoadOptions](./interfaces/LoadOptions.md) | - |
| [ModuleManifest](./interfaces/ModuleManifest.md) | Describes a BNK native module |
| [NAPISymbolDef](./interfaces/NAPISymbolDef.md) | NAPI symbol definition |
| [PlatformInfo](./interfaces/PlatformInfo.md) | Platform-specific paths and extensions |
| [ProjectConfig](./interfaces/ProjectConfig.md) | - |
| [RuntimeLoadOptions](./interfaces/RuntimeLoadOptions.md) | - |
| [RuntimeModule](./interfaces/RuntimeModule.md) | A loaded native module |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [BindingMethod](./type-aliases/BindingMethod.md) | - |
| [DebugLevel](./type-aliases/DebugLevel.md) | - |
| [ErrorMode](./type-aliases/ErrorMode.md) | - |
| [FFIType](./type-aliases/FFIType.md) | - |
| [FFITypeString](./type-aliases/FFITypeString.md) | FFI type strings supported by bun:ffi |
| [IPCMessage](./type-aliases/IPCMessage.md) | IPC message types for subprocess isolation |
| [IsolationMode](./type-aliases/IsolationMode.md) | - |
| [OptimizationLevel](./type-aliases/OptimizationLevel.md) | - |
| [PlatformArch](./type-aliases/PlatformArch.md) | - |
| [SourceLanguage](./type-aliases/SourceLanguage.md) | - |
| [TargetArch](./type-aliases/TargetArch.md) | - |
| [TargetPlatform](./type-aliases/TargetPlatform.md) | - |

## Variables

### aot

```ts
const aot: {
  compile: (options) => Promise<AOTResult>;
  generateTypes: (moduleName, symbols) => string;
};
```

Defined in: [packages/aot/src/index.ts:277](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/aot/src/index.ts#L277)

#### Type Declaration

##### compile()

```ts
compile: (options) => Promise<AOTResult> = compileAOT;
```

Compile native code ahead-of-time with TypeScript declarations

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`AOTCompileOptions`](./interfaces/AOTCompileOptions.md) |

###### Returns

`Promise`\<[`AOTResult`](./interfaces/AOTResult.md)\>

##### generateTypes()

```ts
generateTypes: (moduleName, symbols) => string = generateTypeDeclarations;
```

Generate TypeScript declarations from symbol definitions

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `moduleName` | `string` |
| `symbols` | `Record`\<`string`, [`FFISymbolDef`](./interfaces/FFISymbolDef.md)\> |

###### Returns

`string`

***

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

Defined in: [packages/jit/src/index.ts:785](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/jit/src/index.ts#L785)

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
| `options` | [`CompileOptions`](./interfaces/CompileOptions.md) |

###### Returns

`Promise`\<[`JITModule`](./interfaces/JITModule.md)\>

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

`Promise`\<[`JITModule`](./interfaces/JITModule.md)\>

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

`Promise`\<[`JITModule`](./interfaces/JITModule.md)\>

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
| `lang` | [`SourceLanguage`](./type-aliases/SourceLanguage.md) |

###### Returns

`Record`\<`string`, [`FFISymbolDef`](./interfaces/FFISymbolDef.md)\>

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

`Promise`\<[`JITModule`](./interfaces/JITModule.md)\>

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

`Promise`\<[`SafeResult`](./classes/SafeResult.md)\<`unknown`, `Error`\>\>

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

`Promise`\<[`SafeResult`](./classes/SafeResult.md)\<`unknown`, `Error`\>\>

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

`Promise`\<[`SafeResult`](./classes/SafeResult.md)\<`unknown`, `Error`\>\>

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

`Promise`\<[`SafeResult`](./classes/SafeResult.md)\<`unknown`, `Error`\>\>

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

`Promise`\<[`JITModule`](./interfaces/JITModule.md)\>

## Functions

| Function | Description |
| ------ | ------ |
| [clearCache](./functions/clearCache.md) | Clear the JIT memory cache and close all modules |
| [compileAOT](./functions/compileAOT.md) | Compile native code ahead-of-time with TypeScript declarations |
| [compileJIT](./functions/compileJIT.md) | Compile native code just-in-time. Symbols parsed from source if not provided. |
| [cppTemplate](./functions/cppTemplate.md) | Tagged template for C++ - parses symbols automatically |
| [cTemplate](./functions/cTemplate.md) | Tagged template for C - parses symbols automatically |
| [defineConfig](./functions/defineConfig.md) | Define project config with type checking |
| [defineModule](./functions/defineModule.md) | Define a module manifest with type checking |
| [generateTypeDeclarations](./functions/generateTypeDeclarations.md) | Generate TypeScript declarations from symbol definitions |
| [getCacheSize](./functions/getCacheSize.md) | Get current memory cache size |
| [inlineC](./functions/inlineC.md) | Execute inline C code - calls the `main` function with args |
| [inlineCpp](./functions/inlineCpp.md) | Execute inline C++ code - calls the `main` function with args |
| [inlineRust](./functions/inlineRust.md) | Execute inline Rust code - calls #[no_mangle] extern "C" fn main with args |
| [inlineZig](./functions/inlineZig.md) | Execute inline Zig code - calls the `main` function with args |
| [loadModule](./functions/loadModule.md) | Load a native module from path or manifest |
| [parseSymbols](./functions/parseSymbols.md) | Parse source code and extract FFI symbols |
| [rustTemplate](./functions/rustTemplate.md) | Tagged template for Rust - parses symbols automatically |
| [safeC](./functions/safeC.md) | - |
| [safeCpp](./functions/safeCpp.md) | - |
| [safeRust](./functions/safeRust.md) | - |
| [safeUse](./functions/safeUse.md) | Wrap a value or promise in a SafeResult |
| [safeZig](./functions/safeZig.md) | Execute Zig safely, returning a SafeResult |
| [zigTemplate](./functions/zigTemplate.md) | Tagged template for Zig - parses symbols automatically |

## References

### runCLI

Re-exports [runCLI](../cli/functions/runCLI.md)

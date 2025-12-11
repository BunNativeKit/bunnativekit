---
title: RustCompiler
---

# Class: RustCompiler

Defined in: index.ts:322

## Constructors

### Constructor

```ts
new RustCompiler(): RustCompiler;
```

#### Returns

`RustCompiler`

## Methods

### buildCommand()

```ts
buildCommand(config, options): string[];
```

Defined in: index.ts:350

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `BuildConfig` |
| `options` | [`CompileOptions`](../interfaces/CompileOptions) |

#### Returns

`string`[]

***

### compile()

```ts
compile(config, options): Promise<BuildResult>;
```

Defined in: index.ts:411

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `BuildConfig` |
| `options` | [`CompileOptions`](../interfaces/CompileOptions) |

#### Returns

`Promise`\<`BuildResult`\>

***

### getVersion()

```ts
getVersion(): Promise<string | null>;
```

Defined in: index.ts:336

#### Returns

`Promise`\<`string` \| `null`\>

***

### isAvailable()

```ts
isAvailable(): Promise<boolean>;
```

Defined in: index.ts:323

#### Returns

`Promise`\<`boolean`\>

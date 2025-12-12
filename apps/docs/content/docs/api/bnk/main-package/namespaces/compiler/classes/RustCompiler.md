---
title: RustCompiler
---

# Class: RustCompiler

Defined in: [internal/compiler/src/index.ts:322](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/compiler/src/index.ts#L322)

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

Defined in: [internal/compiler/src/index.ts:350](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/compiler/src/index.ts#L350)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`BuildConfig`](../../../interfaces/BuildConfig.md) |
| `options` | [`CompileOptions`](../interfaces/CompileOptions.md) |

#### Returns

`string`[]

***

### compile()

```ts
compile(config, options): Promise<BuildResult>;
```

Defined in: [internal/compiler/src/index.ts:411](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/compiler/src/index.ts#L411)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`BuildConfig`](../../../interfaces/BuildConfig.md) |
| `options` | [`CompileOptions`](../interfaces/CompileOptions.md) |

#### Returns

`Promise`\<[`BuildResult`](../../../interfaces/BuildResult.md)\>

***

### getVersion()

```ts
getVersion(): Promise<string | null>;
```

Defined in: [internal/compiler/src/index.ts:336](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/compiler/src/index.ts#L336)

#### Returns

`Promise`\<`string` \| `null`\>

***

### isAvailable()

```ts
isAvailable(): Promise<boolean>;
```

Defined in: [internal/compiler/src/index.ts:323](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/compiler/src/index.ts#L323)

#### Returns

`Promise`\<`boolean`\>

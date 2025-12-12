---
title: ZigCompiler
---

# Class: ZigCompiler

Defined in: [internal/compiler/src/index.ts:57](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/compiler/src/index.ts#L57)

## Constructors

### Constructor

```ts
new ZigCompiler(): ZigCompiler;
```

#### Returns

`ZigCompiler`

## Methods

### buildCommand()

```ts
buildCommand(config, options): string[];
```

Defined in: [internal/compiler/src/index.ts:76](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/compiler/src/index.ts#L76)

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

Defined in: [internal/compiler/src/index.ts:125](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/compiler/src/index.ts#L125)

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

Defined in: [internal/compiler/src/index.ts:62](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/compiler/src/index.ts#L62)

#### Returns

`Promise`\<`string` \| `null`\>

***

### isAvailable()

```ts
isAvailable(): Promise<boolean>;
```

Defined in: [internal/compiler/src/index.ts:58](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/compiler/src/index.ts#L58)

#### Returns

`Promise`\<`boolean`\>

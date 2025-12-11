---
title: ZigCompiler
---

# Class: ZigCompiler

Defined in: index.ts:57

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

Defined in: index.ts:76

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

Defined in: index.ts:125

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

Defined in: index.ts:62

#### Returns

`Promise`\<`string` \| `null`\>

***

### isAvailable()

```ts
isAvailable(): Promise<boolean>;
```

Defined in: index.ts:58

#### Returns

`Promise`\<`boolean`\>

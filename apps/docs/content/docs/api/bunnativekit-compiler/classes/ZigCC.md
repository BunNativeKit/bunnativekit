---
title: ZigCC
---

# Class: ZigCC

Defined in: index.ts:190

Uses Zig's bundled clang for C/C++ compilation

## Constructors

### Constructor

```ts
new ZigCC(mode): ZigCC;
```

Defined in: index.ts:193

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `mode` | `"c"` \| `"cpp"` | `"c"` |

#### Returns

`ZigCC`

## Methods

### buildCommand()

```ts
buildCommand(config, options): string[];
```

Defined in: index.ts:201

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

Defined in: index.ts:258

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `BuildConfig` |
| `options` | [`CompileOptions`](../interfaces/CompileOptions) |

#### Returns

`Promise`\<`BuildResult`\>

***

### isAvailable()

```ts
isAvailable(): Promise<boolean>;
```

Defined in: index.ts:197

#### Returns

`Promise`\<`boolean`\>

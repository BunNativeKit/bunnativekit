---
title: ZigCC
---

# Class: ZigCC

Defined in: [index.ts:190](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/compiler/src/index.ts#L190)

Uses Zig's bundled clang for C/C++ compilation

## Constructors

### Constructor

```ts
new ZigCC(mode): ZigCC;
```

Defined in: [index.ts:193](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/compiler/src/index.ts#L193)

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

Defined in: [index.ts:201](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/compiler/src/index.ts#L201)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `BuildConfig` |
| `options` | [`CompileOptions`](../interfaces/CompileOptions.md) |

#### Returns

`string`[]

***

### compile()

```ts
compile(config, options): Promise<BuildResult>;
```

Defined in: [index.ts:258](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/compiler/src/index.ts#L258)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `BuildConfig` |
| `options` | [`CompileOptions`](../interfaces/CompileOptions.md) |

#### Returns

`Promise`\<`BuildResult`\>

***

### isAvailable()

```ts
isAvailable(): Promise<boolean>;
```

Defined in: [index.ts:197](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/compiler/src/index.ts#L197)

#### Returns

`Promise`\<`boolean`\>

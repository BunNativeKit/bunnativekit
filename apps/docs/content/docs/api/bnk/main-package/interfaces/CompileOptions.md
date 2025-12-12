---
title: CompileOptions
---

# Interface: CompileOptions

Defined in: [packages/jit/src/index.ts:33](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/jit/src/index.ts#L33)

## Extends

- [`JITOptions`](./JITOptions.md)

## Properties

### cache?

```ts
optional cache: boolean;
```

Defined in: [packages/jit/src/index.ts:34](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/jit/src/index.ts#L34)

#### Overrides

[`JITOptions`](./JITOptions.md).[`cache`](./JITOptions.md#cache)

***

### isolation?

```ts
optional isolation: IsolationMode;
```

Defined in: [packages/types/src/index.ts:240](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L240)

#### Inherited from

[`JITOptions`](./JITOptions.md).[`isolation`](./JITOptions.md#isolation)

***

### lang

```ts
lang: SourceLanguage;
```

Defined in: [packages/types/src/index.ts:236](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L236)

#### Inherited from

[`JITOptions`](./JITOptions.md).[`lang`](./JITOptions.md#lang)

***

### source

```ts
source: string;
```

Defined in: [packages/types/src/index.ts:237](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L237)

#### Inherited from

[`JITOptions`](./JITOptions.md).[`source`](./JITOptions.md#source)

***

### symbols?

```ts
optional symbols: Record<string, FFISymbolDef>;
```

Defined in: [packages/types/src/index.ts:239](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L239)

For type-safe calls

#### Inherited from

[`JITOptions`](./JITOptions.md).[`symbols`](./JITOptions.md#symbols)

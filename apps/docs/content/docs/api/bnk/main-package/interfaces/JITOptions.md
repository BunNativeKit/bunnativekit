---
title: JITOptions
---

# Interface: JITOptions

Defined in: [packages/types/src/index.ts:235](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L235)

## Extended by

- [`CompileOptions`](./CompileOptions.md)

## Properties

### cache?

```ts
optional cache: boolean;
```

Defined in: [packages/types/src/index.ts:241](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L241)

***

### isolation?

```ts
optional isolation: IsolationMode;
```

Defined in: [packages/types/src/index.ts:240](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L240)

***

### lang

```ts
lang: SourceLanguage;
```

Defined in: [packages/types/src/index.ts:236](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L236)

***

### source

```ts
source: string;
```

Defined in: [packages/types/src/index.ts:237](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L237)

***

### symbols?

```ts
optional symbols: Record<string, FFISymbolDef>;
```

Defined in: [packages/types/src/index.ts:239](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L239)

For type-safe calls

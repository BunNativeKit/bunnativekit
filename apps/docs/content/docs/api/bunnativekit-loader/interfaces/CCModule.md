---
title: CCModule
---

# Interface: CCModule

Defined in: [index.ts:228](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L228)

## Properties

### source

```ts
readonly source: string;
```

Defined in: [index.ts:232](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L232)

***

### symbols

```ts
symbols: Record<string, (...args) => unknown>;
```

Defined in: [index.ts:229](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L229)

## Methods

### close()

```ts
close(): void;
```

Defined in: [index.ts:231](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L231)

#### Returns

`void`

***

### getSymbolNames()

```ts
getSymbolNames(): string[];
```

Defined in: [index.ts:230](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L230)

#### Returns

`string`[]

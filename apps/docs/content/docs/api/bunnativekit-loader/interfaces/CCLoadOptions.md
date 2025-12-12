---
title: CCLoadOptions
---

# Interface: CCLoadOptions

Defined in: [index.ts:219](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L219)

## Properties

### debug?

```ts
optional debug: boolean;
```

Defined in: [index.ts:225](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L225)

***

### define?

```ts
optional define: Record<string, string>;
```

Defined in: [index.ts:223](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L223)

***

### flags?

```ts
optional flags: string[];
```

Defined in: [index.ts:222](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L222)

***

### library?

```ts
optional library: string[];
```

Defined in: [index.ts:224](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L224)

***

### source

```ts
source: string;
```

Defined in: [index.ts:220](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L220)

***

### symbols

```ts
symbols: Record<string, {
  args: FFITypeString[];
  returns: FFITypeString;
}>;
```

Defined in: [index.ts:221](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L221)

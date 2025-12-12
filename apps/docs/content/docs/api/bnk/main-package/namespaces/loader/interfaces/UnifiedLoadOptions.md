---
title: UnifiedLoadOptions
---

# Interface: UnifiedLoadOptions

Defined in: [internal/loader/src/index.ts:306](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L306)

## Properties

### binding

```ts
binding: BindingMethod;
```

Defined in: [internal/loader/src/index.ts:309](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L309)

***

### ccConfig?

```ts
optional ccConfig: Omit<CCLoadOptions, "source">;
```

Defined in: [internal/loader/src/index.ts:313](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L313)

Required for cc binding

***

### debug?

```ts
optional debug: boolean;
```

Defined in: [internal/loader/src/index.ts:314](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L314)

***

### ffiSymbols?

```ts
optional ffiSymbols: Record<string, FFISymbolDef>;
```

Defined in: [internal/loader/src/index.ts:311](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L311)

Required for ffi binding

***

### path

```ts
path: string;
```

Defined in: [internal/loader/src/index.ts:308](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L308)

Path to module, or C source for cc binding

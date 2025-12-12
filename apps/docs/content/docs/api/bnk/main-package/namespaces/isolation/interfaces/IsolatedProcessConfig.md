---
title: IsolatedProcessConfig
---

# Interface: IsolatedProcessConfig

Defined in: [internal/isolation/src/index.ts:69](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L69)

## Properties

### binding

```ts
binding: BindingMethod;
```

Defined in: [internal/isolation/src/index.ts:71](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L71)

***

### debug?

```ts
optional debug: boolean;
```

Defined in: [internal/isolation/src/index.ts:77](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L77)

***

### modulePath

```ts
modulePath: string;
```

Defined in: [internal/isolation/src/index.ts:70](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L70)

***

### onError?

```ts
optional onError: ErrorMode;
```

Defined in: [internal/isolation/src/index.ts:76](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L76)

***

### symbols?

```ts
optional symbols: Record<string, FFISymbolDef>;
```

Defined in: [internal/isolation/src/index.ts:73](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L73)

Required when binding is 'ffi'

***

### timeout?

```ts
optional timeout: number;
```

Defined in: [internal/isolation/src/index.ts:75](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L75)

In milliseconds, defaults to 30s

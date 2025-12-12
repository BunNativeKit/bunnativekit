---
title: RuntimeLoadOptions
---

# Interface: RuntimeLoadOptions

Defined in: [runtime/src/index.ts:26](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/runtime/src/index.ts#L26)

## Extends

- [`LoadOptions`](./LoadOptions.md)

## Properties

### debug?

```ts
optional debug: DebugConfig;
```

Defined in: [types/src/index.ts:230](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L230)

#### Inherited from

[`LoadOptions`](./LoadOptions.md).[`debug`](./LoadOptions.md#debug)

***

### isolation?

```ts
optional isolation: IsolationMode;
```

Defined in: [types/src/index.ts:228](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L228)

#### Inherited from

[`LoadOptions`](./LoadOptions.md).[`isolation`](./LoadOptions.md#isolation)

***

### libraryPath?

```ts
optional libraryPath: string;
```

Defined in: [runtime/src/index.ts:31](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/runtime/src/index.ts#L31)

Required when skipManifest is true

***

### module

```ts
module: string;
```

Defined in: [runtime/src/index.ts:27](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/runtime/src/index.ts#L27)

***

### onError?

```ts
optional onError: ErrorMode;
```

Defined in: [types/src/index.ts:227](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L227)

#### Inherited from

[`LoadOptions`](./LoadOptions.md).[`onError`](./LoadOptions.md#onerror)

***

### skipManifest?

```ts
optional skipManifest: boolean;
```

Defined in: [runtime/src/index.ts:29](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/runtime/src/index.ts#L29)

Skip manifest and load library directly

***

### symbols?

```ts
optional symbols: Record<string, FFISymbolDef>;
```

Defined in: [runtime/src/index.ts:33](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/runtime/src/index.ts#L33)

Required when skipManifest is true

***

### timeout?

```ts
optional timeout: number;
```

Defined in: [types/src/index.ts:229](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L229)

#### Inherited from

[`LoadOptions`](./LoadOptions.md).[`timeout`](./LoadOptions.md#timeout)

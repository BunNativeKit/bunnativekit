---
title: FFILibrary
---

# Interface: FFILibrary

Defined in: [internal/loader/src/index.ts:65](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L65)

## Properties

### path

```ts
readonly path: string;
```

Defined in: [internal/loader/src/index.ts:69](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L69)

## Methods

### call()

```ts
call<T>(name, ...args): T;
```

Defined in: [internal/loader/src/index.ts:66](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L66)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| ...`args` | `unknown`[] |

#### Returns

`T`

***

### close()

```ts
close(): void;
```

Defined in: [internal/loader/src/index.ts:68](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L68)

#### Returns

`void`

***

### getSymbolNames()

```ts
getSymbolNames(): string[];
```

Defined in: [internal/loader/src/index.ts:67](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L67)

#### Returns

`string`[]

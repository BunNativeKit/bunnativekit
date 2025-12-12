---
title: SafeResult
---

# Class: SafeResult\<T, E\>

Defined in: [jit/src/index.ts:663](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/jit/src/index.ts#L663)

Result type for safe error handling

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | - |
| `E` | `Error` |

## Accessors

### error

#### Get Signature

```ts
get error(): E | undefined;
```

Defined in: [jit/src/index.ts:714](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/jit/src/index.ts#L714)

##### Returns

`E` \| `undefined`

***

### value

#### Get Signature

```ts
get value(): T | undefined;
```

Defined in: [jit/src/index.ts:710](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/jit/src/index.ts#L710)

##### Returns

`T` \| `undefined`

## Methods

### isError()

```ts
isError(): this is SafeResult<never, E>;
```

Defined in: [jit/src/index.ts:681](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/jit/src/index.ts#L681)

#### Returns

`this is SafeResult<never, E>`

***

### isOk()

```ts
isOk(): this is SafeResult<T, never>;
```

Defined in: [jit/src/index.ts:677](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/jit/src/index.ts#L677)

#### Returns

`this is SafeResult<T, never>`

***

### map()

```ts
map<U>(fn): SafeResult<U, E>;
```

Defined in: [jit/src/index.ts:703](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/jit/src/index.ts#L703)

#### Type Parameters

| Type Parameter |
| ------ |
| `U` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | (`value`) => `U` |

#### Returns

`SafeResult`\<`U`, `E`\>

***

### unwrap()

```ts
unwrap(): T;
```

Defined in: [jit/src/index.ts:685](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/jit/src/index.ts#L685)

#### Returns

`T`

***

### unwrapErr()

```ts
unwrapErr(): E;
```

Defined in: [jit/src/index.ts:696](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/jit/src/index.ts#L696)

#### Returns

`E`

***

### unwrapOr()

```ts
unwrapOr(defaultValue): T;
```

Defined in: [jit/src/index.ts:692](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/jit/src/index.ts#L692)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `defaultValue` | `T` |

#### Returns

`T`

***

### err()

```ts
static err<E>(error): SafeResult<never, E>;
```

Defined in: [jit/src/index.ts:673](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/jit/src/index.ts#L673)

#### Type Parameters

| Type Parameter |
| ------ |
| `E` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `E` |

#### Returns

`SafeResult`\<`never`, `E`\>

***

### ok()

```ts
static ok<T>(value): SafeResult<T, never>;
```

Defined in: [jit/src/index.ts:669](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/jit/src/index.ts#L669)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `T` |

#### Returns

`SafeResult`\<`T`, `never`\>

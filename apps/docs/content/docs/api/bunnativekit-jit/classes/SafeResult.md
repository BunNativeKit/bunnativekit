---
title: SafeResult
---

# Class: SafeResult\<T, E\>

Defined in: jit/src/index.ts:663

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

Defined in: jit/src/index.ts:714

##### Returns

`E` \| `undefined`

***

### value

#### Get Signature

```ts
get value(): T | undefined;
```

Defined in: jit/src/index.ts:710

##### Returns

`T` \| `undefined`

## Methods

### isError()

```ts
isError(): this is SafeResult<never, E>;
```

Defined in: jit/src/index.ts:681

#### Returns

`this is SafeResult<never, E>`

***

### isOk()

```ts
isOk(): this is SafeResult<T, never>;
```

Defined in: jit/src/index.ts:677

#### Returns

`this is SafeResult<T, never>`

***

### map()

```ts
map<U>(fn): SafeResult<U, E>;
```

Defined in: jit/src/index.ts:703

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

Defined in: jit/src/index.ts:685

#### Returns

`T`

***

### unwrapErr()

```ts
unwrapErr(): E;
```

Defined in: jit/src/index.ts:696

#### Returns

`E`

***

### unwrapOr()

```ts
unwrapOr(defaultValue): T;
```

Defined in: jit/src/index.ts:692

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

Defined in: jit/src/index.ts:673

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

Defined in: jit/src/index.ts:669

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

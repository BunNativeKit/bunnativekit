---
title: SafeUse
---

# Function: safeUse()

## Call Signature

```ts
function safeUse<T>(valueOrPromise): SafeResult<T, Error>;
```

Defined in: jit/src/index.ts:720

Wrap a value or promise in a SafeResult

### Type Parameters

| Type Parameter |
| ------ |
| `T` |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `valueOrPromise` | `T` |

### Returns

[`SafeResult`](../classes/SafeResult)\<`T`, `Error`\>

## Call Signature

```ts
function safeUse<T>(valueOrPromise): Promise<SafeResult<T, Error>>;
```

Defined in: jit/src/index.ts:721

Wrap a value or promise in a SafeResult

### Type Parameters

| Type Parameter |
| ------ |
| `T` |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `valueOrPromise` | `Promise`\<`T`\> |

### Returns

`Promise`\<[`SafeResult`](../classes/SafeResult)\<`T`, `Error`\>\>

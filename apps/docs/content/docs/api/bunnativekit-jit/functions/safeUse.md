---
title: SafeUse
---

# Function: safeUse()

## Call Signature

```ts
function safeUse<T>(valueOrPromise): SafeResult<T, Error>;
```

Defined in: [jit/src/index.ts:720](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/jit/src/index.ts#L720)

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

[`SafeResult`](../classes/SafeResult.md)\<`T`, `Error`\>

## Call Signature

```ts
function safeUse<T>(valueOrPromise): Promise<SafeResult<T, Error>>;
```

Defined in: [jit/src/index.ts:721](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/jit/src/index.ts#L721)

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

`Promise`\<[`SafeResult`](../classes/SafeResult.md)\<`T`, `Error`\>\>

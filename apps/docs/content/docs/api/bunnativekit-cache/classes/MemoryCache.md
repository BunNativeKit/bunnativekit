---
title: MemoryCache
---

# Class: MemoryCache\<T\>

Defined in: [cache/src/index.ts:248](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L248)

In-memory cache with TTL and LRU eviction

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Constructors

### Constructor

```ts
new MemoryCache<T>(options): MemoryCache<T>;
```

Defined in: [cache/src/index.ts:253](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L253)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | \{ `maxSize?`: `number`; `ttl?`: `number`; \} |
| `options.maxSize?` | `number` |
| `options.ttl?` | `number` |

#### Returns

`MemoryCache`\<`T`\>

## Methods

### clear()

```ts
clear(): void;
```

Defined in: [cache/src/index.ts:292](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L292)

#### Returns

`void`

***

### delete()

```ts
delete(key): boolean;
```

Defined in: [cache/src/index.ts:288](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L288)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

#### Returns

`boolean`

***

### get()

```ts
get(key): T | null;
```

Defined in: [cache/src/index.ts:258](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L258)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

#### Returns

`T` \| `null`

***

### has()

```ts
has(key): boolean;
```

Defined in: [cache/src/index.ts:284](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L284)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

#### Returns

`boolean`

***

### set()

```ts
set(key, value): void;
```

Defined in: [cache/src/index.ts:270](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L270)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `value` | `T` |

#### Returns

`void`

***

### size()

```ts
size(): number;
```

Defined in: [cache/src/index.ts:296](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L296)

#### Returns

`number`

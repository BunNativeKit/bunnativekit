---
title: MemoryCache
---

# Class: MemoryCache\<T\>

Defined in: cache/src/index.ts:248

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

Defined in: cache/src/index.ts:253

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

Defined in: cache/src/index.ts:292

#### Returns

`void`

***

### delete()

```ts
delete(key): boolean;
```

Defined in: cache/src/index.ts:288

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

Defined in: cache/src/index.ts:258

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

Defined in: cache/src/index.ts:284

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

Defined in: cache/src/index.ts:270

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

Defined in: cache/src/index.ts:296

#### Returns

`number`

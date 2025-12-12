---
title: BuildCache
---

# Class: BuildCache

Defined in: [internal/cache/src/index.ts:55](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L55)

Manages cached build artifacts with LRU eviction

## Constructors

### Constructor

```ts
new BuildCache(subdir): BuildCache;
```

Defined in: [internal/cache/src/index.ts:60](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L60)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `subdir` | `string` | `"build"` |

#### Returns

`BuildCache`

## Methods

### clear()

```ts
clear(): void;
```

Defined in: [internal/cache/src/index.ts:185](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L185)

#### Returns

`void`

***

### delete()

```ts
delete(key): boolean;
```

Defined in: [internal/cache/src/index.ts:168](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L168)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

#### Returns

`boolean`

***

### get()

```ts
get(key): CacheEntry | null;
```

Defined in: [internal/cache/src/index.ts:87](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L87)

Returns null if entry doesn't exist or file was deleted

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

#### Returns

[`CacheEntry`](../interfaces/CacheEntry.md) \| `null`

***

### getPath()

```ts
getPath(key): string | null;
```

Defined in: [internal/cache/src/index.ts:107](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L107)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

#### Returns

`string` \| `null`

***

### has()

```ts
has(key): boolean;
```

Defined in: [internal/cache/src/index.ts:103](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L103)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

#### Returns

`boolean`

***

### prune()

```ts
prune(maxSize): number;
```

Defined in: [internal/cache/src/index.ts:211](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L211)

Remove oldest entries until under size limit (LRU)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `maxSize` | `number` |

#### Returns

`number`

***

### set()

```ts
set(
   key, 
   sourcePath, 
   hash, 
   meta?): CacheEntry;
```

Defined in: [internal/cache/src/index.ts:113](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L113)

Copy file to cache and track in manifest

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `sourcePath` | `string` |
| `hash` | `string` |
| `meta?` | `Record`\<`string`, `unknown`\> |

#### Returns

[`CacheEntry`](../interfaces/CacheEntry.md)

***

### setContent()

```ts
setContent(
   key, 
   content, 
   ext, 
   source, 
   meta?): CacheEntry;
```

Defined in: [internal/cache/src/index.ts:142](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L142)

Store raw content directly in cache

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `content` | `Buffer` |
| `ext` | `string` |
| `source` | `string` |
| `meta?` | `Record`\<`string`, `unknown`\> |

#### Returns

[`CacheEntry`](../interfaces/CacheEntry.md)

***

### stats()

```ts
stats(): {
  entries: number;
  totalSize: number;
};
```

Defined in: [internal/cache/src/index.ts:191](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L191)

#### Returns

```ts
{
  entries: number;
  totalSize: number;
}
```

##### entries

```ts
entries: number;
```

##### totalSize

```ts
totalSize: number;
```

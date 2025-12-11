---
title: BuildCache
---

# Class: BuildCache

Defined in: cache/src/index.ts:55

Manages cached build artifacts with LRU eviction

## Constructors

### Constructor

```ts
new BuildCache(subdir): BuildCache;
```

Defined in: cache/src/index.ts:60

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

Defined in: cache/src/index.ts:185

#### Returns

`void`

***

### delete()

```ts
delete(key): boolean;
```

Defined in: cache/src/index.ts:168

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

Defined in: cache/src/index.ts:87

Returns null if entry doesn't exist or file was deleted

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

#### Returns

[`CacheEntry`](../interfaces/CacheEntry) \| `null`

***

### getPath()

```ts
getPath(key): string | null;
```

Defined in: cache/src/index.ts:107

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

Defined in: cache/src/index.ts:103

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

Defined in: cache/src/index.ts:211

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

Defined in: cache/src/index.ts:113

Copy file to cache and track in manifest

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `sourcePath` | `string` |
| `hash` | `string` |
| `meta?` | `Record`\<`string`, `unknown`\> |

#### Returns

[`CacheEntry`](../interfaces/CacheEntry)

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

Defined in: cache/src/index.ts:142

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

[`CacheEntry`](../interfaces/CacheEntry)

***

### stats()

```ts
stats(): {
  entries: number;
  totalSize: number;
};
```

Defined in: cache/src/index.ts:191

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

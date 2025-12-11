---
title: UnifiedCache
---

# Class: UnifiedCache

Defined in: cache/src/index.ts:304

Two-tier cache: memory (L1) + disk (L2)

## Constructors

### Constructor

```ts
new UnifiedCache(subdir): UnifiedCache;
```

Defined in: cache/src/index.ts:308

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `subdir` | `string` | `"unified"` |

#### Returns

`UnifiedCache`

## Methods

### clear()

```ts
clear(): void;
```

Defined in: cache/src/index.ts:338

#### Returns

`void`

***

### get()

```ts
get(key): string | null;
```

Defined in: cache/src/index.ts:314

Check memory first, then disk. Promotes disk hits to memory.

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

Defined in: cache/src/index.ts:334

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

#### Returns

`boolean`

***

### set()

```ts
set(
   key, 
   sourcePath, 
   hash, 
   meta?): string;
```

Defined in: cache/src/index.ts:328

Store in both memory and disk

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `sourcePath` | `string` |
| `hash` | `string` |
| `meta?` | `Record`\<`string`, `unknown`\> |

#### Returns

`string`

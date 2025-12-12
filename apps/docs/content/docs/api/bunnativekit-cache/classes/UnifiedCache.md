---
title: UnifiedCache
---

# Class: UnifiedCache

Defined in: [cache/src/index.ts:304](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L304)

Two-tier cache: memory (L1) + disk (L2)

## Constructors

### Constructor

```ts
new UnifiedCache(subdir): UnifiedCache;
```

Defined in: [cache/src/index.ts:308](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L308)

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

Defined in: [cache/src/index.ts:338](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L338)

#### Returns

`void`

***

### get()

```ts
get(key): string | null;
```

Defined in: [cache/src/index.ts:314](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L314)

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

Defined in: [cache/src/index.ts:334](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L334)

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

Defined in: [cache/src/index.ts:328](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/cache/src/index.ts#L328)

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

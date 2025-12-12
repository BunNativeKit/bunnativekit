---
title: Overview
---

# cache

Build and runtime caching for compiled native modules.
Tracks source hashes to avoid redundant recompilation.

## Classes

| Class | Description |
| ------ | ------ |
| [BuildCache](./classes/BuildCache.md) | Manages cached build artifacts with LRU eviction |
| [MemoryCache](./classes/MemoryCache.md) | In-memory cache with TTL and LRU eviction |
| [UnifiedCache](./classes/UnifiedCache.md) | Two-tier cache: memory (L1) + disk (L2) |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [CacheEntry](./interfaces/CacheEntry.md) | - |
| [CacheManifest](./interfaces/CacheManifest.md) | - |

## Functions

| Function | Description |
| ------ | ------ |
| [generateCacheKey](./functions/generateCacheKey.md) | Generate a cache key from module name and content hash |
| [getBuildCache](./functions/getBuildCache.md) | Get or create the default BuildCache instance |
| [getUnifiedCache](./functions/getUnifiedCache.md) | Get or create the default UnifiedCache instance |
| [hashContent](./functions/hashContent.md) | Generate a 16-char SHA256 hash from content |
| [hashFile](./functions/hashFile.md) | Generate a 16-char SHA256 hash from a file |

## References

### getCacheDir

Re-exports [getCacheDir](../platform/functions/getCacheDir.md)

***

### getCacheSubdir

Re-exports [getCacheSubdir](../platform/functions/getCacheSubdir.md)

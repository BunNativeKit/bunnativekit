---
title: Overview
---

# @bunnativekit/cache

Build and runtime caching for compiled native modules.
Tracks source hashes to avoid redundant recompilation.

## Classes

| Class | Description |
| ------ | ------ |
| [BuildCache](classes/BuildCache) | Manages cached build artifacts with LRU eviction |
| [MemoryCache](classes/MemoryCache) | In-memory cache with TTL and LRU eviction |
| [UnifiedCache](classes/UnifiedCache) | Two-tier cache: memory (L1) + disk (L2) |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [CacheEntry](interfaces/CacheEntry) | - |
| [CacheManifest](interfaces/CacheManifest) | - |

## Functions

| Function | Description |
| ------ | ------ |
| [generateCacheKey](functions/generateCacheKey) | Generate a cache key from module name and content hash |
| [getBuildCache](functions/getBuildCache) | Get or create the default BuildCache instance |
| [getCacheDir](functions/getCacheDir) | Returns ~/.cache/bunnativekit (or platform equivalent), creating it if needed |
| [getCacheSubdir](functions/getCacheSubdir) | - |
| [getUnifiedCache](functions/getUnifiedCache) | Get or create the default UnifiedCache instance |
| [hashContent](functions/hashContent) | Generate a 16-char SHA256 hash from content |
| [hashFile](functions/hashFile) | Generate a 16-char SHA256 hash from a file |

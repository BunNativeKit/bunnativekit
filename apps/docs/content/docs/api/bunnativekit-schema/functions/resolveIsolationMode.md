---
title: ResolveIsolationMode
---

# Function: resolveIsolationMode()

```ts
function resolveIsolationMode(mode, isDev): "subprocess" | "thread" | "direct";
```

Defined in: index.ts:263

Resolve 'auto' isolation mode based on dev/prod environment

## Parameters

| Parameter | Type |
| ------ | ------ |
| `mode` | `IsolationMode` |
| `isDev` | `boolean` |

## Returns

`"subprocess"` \| `"thread"` \| `"direct"`

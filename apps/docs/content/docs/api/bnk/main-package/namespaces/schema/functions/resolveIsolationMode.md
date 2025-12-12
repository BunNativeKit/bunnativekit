---
title: ResolveIsolationMode
---

# Function: resolveIsolationMode()

```ts
function resolveIsolationMode(mode, isDev): "subprocess" | "thread" | "direct";
```

Defined in: [internal/schema/src/index.ts:263](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/schema/src/index.ts#L263)

Resolve 'auto' isolation mode based on dev/prod environment

## Parameters

| Parameter | Type |
| ------ | ------ |
| `mode` | [`IsolationMode`](../../../type-aliases/IsolationMode.md) |
| `isDev` | `boolean` |

## Returns

`"subprocess"` \| `"thread"` \| `"direct"`

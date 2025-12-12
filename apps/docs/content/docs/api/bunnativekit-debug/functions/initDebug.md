---
title: InitDebug
---

# Function: initDebug()

```ts
function initDebug(config): {
  logger: Logger;
  tracer: Tracer;
};
```

Defined in: [index.ts:352](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/debug/src/index.ts#L352)

Initialize logger and tracer from a config object

## Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `DebugConfig` |

## Returns

```ts
{
  logger: Logger;
  tracer: Tracer;
}
```

### logger

```ts
logger: Logger;
```

### tracer

```ts
tracer: Tracer;
```

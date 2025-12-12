---
title: ProcessDiagnostics
---

# Class: ProcessDiagnostics

Defined in: [internal/debug/src/index.ts:232](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/debug/src/index.ts#L232)

## Constructors

### Constructor

```ts
new ProcessDiagnostics(): ProcessDiagnostics;
```

#### Returns

`ProcessDiagnostics`

## Methods

### getState()

```ts
getState(pid): ProcessState | null;
```

Defined in: [internal/debug/src/index.ts:244](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/debug/src/index.ts#L244)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pid` | `number` |

#### Returns

[`ProcessState`](../interfaces/ProcessState.md) \| `null`

***

### getThreads()

```ts
getThreads(pid): ThreadInfo[];
```

Defined in: [internal/debug/src/index.ts:284](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/debug/src/index.ts#L284)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pid` | `number` |

#### Returns

[`ThreadInfo`](../interfaces/ThreadInfo.md)[]

***

### isAlive()

```ts
isAlive(pid): boolean;
```

Defined in: [internal/debug/src/index.ts:239](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/debug/src/index.ts#L239)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pid` | `number` |

#### Returns

`boolean`

***

### isSupported()

```ts
isSupported(): boolean;
```

Defined in: [internal/debug/src/index.ts:235](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/debug/src/index.ts#L235)

#### Returns

`boolean`

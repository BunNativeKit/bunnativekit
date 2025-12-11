---
title: ProcessDiagnostics
---

# Class: ProcessDiagnostics

Defined in: index.ts:232

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

Defined in: index.ts:244

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pid` | `number` |

#### Returns

[`ProcessState`](../interfaces/ProcessState) \| `null`

***

### getThreads()

```ts
getThreads(pid): ThreadInfo[];
```

Defined in: index.ts:284

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pid` | `number` |

#### Returns

[`ThreadInfo`](../interfaces/ThreadInfo)[]

***

### isAlive()

```ts
isAlive(pid): boolean;
```

Defined in: index.ts:239

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

Defined in: index.ts:235

#### Returns

`boolean`

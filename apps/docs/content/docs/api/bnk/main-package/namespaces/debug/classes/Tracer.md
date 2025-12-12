---
title: Tracer
---

# Class: Tracer

Defined in: [internal/debug/src/index.ts:113](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/debug/src/index.ts#L113)

## Constructors

### Constructor

```ts
new Tracer(config): Tracer;
```

Defined in: [internal/debug/src/index.ts:118](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/debug/src/index.ts#L118)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `Partial`\<[`TracerConfig`](../interfaces/TracerConfig.md)\> |

#### Returns

`Tracer`

## Accessors

### enabled

#### Get Signature

```ts
get enabled(): boolean;
```

Defined in: [internal/debug/src/index.ts:127](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/debug/src/index.ts#L127)

##### Returns

`boolean`

## Methods

### clear()

```ts
clear(): void;
```

Defined in: [internal/debug/src/index.ts:185](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/debug/src/index.ts#L185)

#### Returns

`void`

***

### event()

```ts
event(
   name, 
   category, 
   phase, 
   args?): void;
```

Defined in: [internal/debug/src/index.ts:136](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/debug/src/index.ts#L136)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `category` | `string` |
| `phase` | `"B"` \| `"E"` \| `"X"` \| `"i"` |
| `args?` | `Record`\<`string`, `unknown`\> |

#### Returns

`void`

***

### flush()

```ts
flush(): void;
```

Defined in: [internal/debug/src/index.ts:191](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/debug/src/index.ts#L191)

Write events to configured output path

#### Returns

`void`

***

### getEvents()

```ts
getEvents(): TraceEvent[];
```

Defined in: [internal/debug/src/index.ts:181](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/debug/src/index.ts#L181)

#### Returns

[`TraceEvent`](../interfaces/TraceEvent.md)[]

***

### start()

```ts
start(
   category, 
   name, 
   args?): () => void;
```

Defined in: [internal/debug/src/index.ts:160](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/debug/src/index.ts#L160)

Start a duration trace, returns a function to end it

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `category` | `string` |
| `name` | `string` |
| `args?` | `Record`\<`string`, `unknown`\> |

#### Returns

```ts
(): void;
```

##### Returns

`void`

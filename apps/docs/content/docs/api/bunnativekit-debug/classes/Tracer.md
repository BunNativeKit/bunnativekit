---
title: Tracer
---

# Class: Tracer

Defined in: index.ts:113

## Constructors

### Constructor

```ts
new Tracer(config): Tracer;
```

Defined in: index.ts:118

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `Partial`\<[`TracerConfig`](../interfaces/TracerConfig)\> |

#### Returns

`Tracer`

## Accessors

### enabled

#### Get Signature

```ts
get enabled(): boolean;
```

Defined in: index.ts:127

##### Returns

`boolean`

## Methods

### clear()

```ts
clear(): void;
```

Defined in: index.ts:185

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

Defined in: index.ts:136

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

Defined in: index.ts:191

Write events to configured output path

#### Returns

`void`

***

### getEvents()

```ts
getEvents(): TraceEvent[];
```

Defined in: index.ts:181

#### Returns

[`TraceEvent`](../interfaces/TraceEvent)[]

***

### start()

```ts
start(
   category, 
   name, 
   args?): () => void;
```

Defined in: index.ts:160

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

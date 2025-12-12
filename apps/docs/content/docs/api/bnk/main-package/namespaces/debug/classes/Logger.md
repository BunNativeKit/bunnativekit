---
title: Logger
---

# Class: Logger

Defined in: [internal/debug/src/index.ts:28](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/debug/src/index.ts#L28)

## Constructors

### Constructor

```ts
new Logger(config): Logger;
```

Defined in: [internal/debug/src/index.ts:32](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/debug/src/index.ts#L32)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `Partial`\<[`LoggerConfig`](../interfaces/LoggerConfig.md)\> |

#### Returns

`Logger`

## Methods

### debug()

```ts
debug(
   category, 
   message, 
   data?): void;
```

Defined in: [internal/debug/src/index.ts:85](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/debug/src/index.ts#L85)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `category` | `string` |
| `message` | `string` |
| `data?` | `unknown` |

#### Returns

`void`

***

### error()

```ts
error(
   category, 
   message, 
   data?): void;
```

Defined in: [internal/debug/src/index.ts:73](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/debug/src/index.ts#L73)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `category` | `string` |
| `message` | `string` |
| `data?` | `unknown` |

#### Returns

`void`

***

### info()

```ts
info(
   category, 
   message, 
   data?): void;
```

Defined in: [internal/debug/src/index.ts:81](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/debug/src/index.ts#L81)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `category` | `string` |
| `message` | `string` |
| `data?` | `unknown` |

#### Returns

`void`

***

### trace()

```ts
trace(
   category, 
   message, 
   data?): void;
```

Defined in: [internal/debug/src/index.ts:89](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/debug/src/index.ts#L89)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `category` | `string` |
| `message` | `string` |
| `data?` | `unknown` |

#### Returns

`void`

***

### warn()

```ts
warn(
   category, 
   message, 
   data?): void;
```

Defined in: [internal/debug/src/index.ts:77](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/debug/src/index.ts#L77)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `category` | `string` |
| `message` | `string` |
| `data?` | `unknown` |

#### Returns

`void`

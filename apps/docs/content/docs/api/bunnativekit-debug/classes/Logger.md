---
title: Logger
---

# Class: Logger

Defined in: index.ts:28

## Constructors

### Constructor

```ts
new Logger(config): Logger;
```

Defined in: index.ts:32

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `Partial`\<[`LoggerConfig`](../interfaces/LoggerConfig)\> |

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

Defined in: index.ts:85

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

Defined in: index.ts:73

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

Defined in: index.ts:81

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

Defined in: index.ts:89

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

Defined in: index.ts:77

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `category` | `string` |
| `message` | `string` |
| `data?` | `unknown` |

#### Returns

`void`

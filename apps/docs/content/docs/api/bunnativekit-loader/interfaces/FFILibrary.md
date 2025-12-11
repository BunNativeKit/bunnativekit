---
title: FFILibrary
---

# Interface: FFILibrary

Defined in: index.ts:65

## Properties

### path

```ts
readonly path: string;
```

Defined in: index.ts:69

## Methods

### call()

```ts
call<T>(name, ...args): T;
```

Defined in: index.ts:66

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| ...`args` | `unknown`[] |

#### Returns

`T`

***

### close()

```ts
close(): void;
```

Defined in: index.ts:68

#### Returns

`void`

***

### getSymbolNames()

```ts
getSymbolNames(): string[];
```

Defined in: index.ts:67

#### Returns

`string`[]

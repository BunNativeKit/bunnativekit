---
title: UnifiedModule
---

# Interface: UnifiedModule

Defined in: index.ts:317

## Properties

### binding

```ts
readonly binding: BindingMethod;
```

Defined in: index.ts:318

***

### path

```ts
readonly path: string;
```

Defined in: index.ts:319

## Methods

### call()

```ts
call<T>(name, ...args): T;
```

Defined in: index.ts:320

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

Defined in: index.ts:322

#### Returns

`void`

***

### getFunctions()

```ts
getFunctions(): string[];
```

Defined in: index.ts:321

#### Returns

`string`[]

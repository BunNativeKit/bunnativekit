---
title: UnifiedModule
---

# Interface: UnifiedModule

Defined in: [index.ts:317](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L317)

## Properties

### binding

```ts
readonly binding: BindingMethod;
```

Defined in: [index.ts:318](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L318)

***

### path

```ts
readonly path: string;
```

Defined in: [index.ts:319](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L319)

## Methods

### call()

```ts
call<T>(name, ...args): T;
```

Defined in: [index.ts:320](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L320)

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

Defined in: [index.ts:322](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L322)

#### Returns

`void`

***

### getFunctions()

```ts
getFunctions(): string[];
```

Defined in: [index.ts:321](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L321)

#### Returns

`string`[]

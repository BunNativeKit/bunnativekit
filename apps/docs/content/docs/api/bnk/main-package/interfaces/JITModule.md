---
title: JITModule
---

# Interface: JITModule

Defined in: [packages/types/src/index.ts:244](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L244)

## Methods

### call()

```ts
call<T>(fn, ...args): T;
```

Defined in: [packages/types/src/index.ts:245](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L245)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | `string` |
| ...`args` | `unknown`[] |

#### Returns

`T`

***

### close()

```ts
close(): void;
```

Defined in: [packages/types/src/index.ts:246](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L246)

#### Returns

`void`

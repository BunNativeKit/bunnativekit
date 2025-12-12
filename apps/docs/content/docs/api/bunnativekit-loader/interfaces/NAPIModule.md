---
title: NAPIModule
---

# Interface: NAPIModule\<T\>

Defined in: [index.ts:145](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L145)

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `Record`\<`string`, `unknown`\> |

## Properties

### exports

```ts
exports: T;
```

Defined in: [index.ts:146](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L146)

***

### path

```ts
readonly path: string;
```

Defined in: [index.ts:150](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L150)

## Methods

### close()

```ts
close(): void;
```

Defined in: [index.ts:149](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L149)

No-op - NAPI modules can't be unloaded

#### Returns

`void`

***

### getExportNames()

```ts
getExportNames(): string[];
```

Defined in: [index.ts:147](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/loader/src/index.ts#L147)

#### Returns

`string`[]

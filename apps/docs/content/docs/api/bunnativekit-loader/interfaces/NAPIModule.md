---
title: NAPIModule
---

# Interface: NAPIModule\<T\>

Defined in: index.ts:145

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `Record`\<`string`, `unknown`\> |

## Properties

### exports

```ts
exports: T;
```

Defined in: index.ts:146

***

### path

```ts
readonly path: string;
```

Defined in: index.ts:150

## Methods

### close()

```ts
close(): void;
```

Defined in: index.ts:149

No-op - NAPI modules can't be unloaded

#### Returns

`void`

***

### getExportNames()

```ts
getExportNames(): string[];
```

Defined in: index.ts:147

#### Returns

`string`[]

---
title: RuntimeLoadOptions
---

# Interface: RuntimeLoadOptions

Defined in: runtime/src/index.ts:26

## Extends

- [`LoadOptions`](LoadOptions)

## Properties

### debug?

```ts
optional debug: DebugConfig;
```

Defined in: types/src/index.ts:230

#### Inherited from

[`LoadOptions`](LoadOptions).[`debug`](LoadOptions#debug)

***

### isolation?

```ts
optional isolation: IsolationMode;
```

Defined in: types/src/index.ts:228

#### Inherited from

[`LoadOptions`](LoadOptions).[`isolation`](LoadOptions#isolation)

***

### libraryPath?

```ts
optional libraryPath: string;
```

Defined in: runtime/src/index.ts:31

Required when skipManifest is true

***

### module

```ts
module: string;
```

Defined in: runtime/src/index.ts:27

***

### onError?

```ts
optional onError: ErrorMode;
```

Defined in: types/src/index.ts:227

#### Inherited from

[`LoadOptions`](LoadOptions).[`onError`](LoadOptions#onerror)

***

### skipManifest?

```ts
optional skipManifest: boolean;
```

Defined in: runtime/src/index.ts:29

Skip manifest and load library directly

***

### symbols?

```ts
optional symbols: Record<string, FFISymbolDef>;
```

Defined in: runtime/src/index.ts:33

Required when skipManifest is true

***

### timeout?

```ts
optional timeout: number;
```

Defined in: types/src/index.ts:229

#### Inherited from

[`LoadOptions`](LoadOptions).[`timeout`](LoadOptions#timeout)

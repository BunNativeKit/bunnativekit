---
title: CompileOptions
---

# Interface: CompileOptions

Defined in: jit/src/index.ts:33

## Extends

- `JITOptions`

## Properties

### cache?

```ts
optional cache: boolean;
```

Defined in: jit/src/index.ts:34

#### Overrides

```ts
JITOptions.cache
```

***

### isolation?

```ts
optional isolation: IsolationMode;
```

Defined in: types/src/index.ts:240

#### Inherited from

```ts
JITOptions.isolation
```

***

### lang

```ts
lang: SourceLanguage;
```

Defined in: types/src/index.ts:236

#### Inherited from

```ts
JITOptions.lang
```

***

### source

```ts
source: string;
```

Defined in: types/src/index.ts:237

#### Inherited from

```ts
JITOptions.source
```

***

### symbols?

```ts
optional symbols: Record<string, FFISymbolDef>;
```

Defined in: types/src/index.ts:239

For type-safe calls

#### Inherited from

```ts
JITOptions.symbols
```

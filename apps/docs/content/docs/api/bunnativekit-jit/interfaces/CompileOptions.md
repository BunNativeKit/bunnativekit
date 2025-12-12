---
title: CompileOptions
---

# Interface: CompileOptions

Defined in: [jit/src/index.ts:33](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/jit/src/index.ts#L33)

## Extends

- `JITOptions`

## Properties

### cache?

```ts
optional cache: boolean;
```

Defined in: [jit/src/index.ts:34](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/jit/src/index.ts#L34)

#### Overrides

```ts
JITOptions.cache
```

***

### isolation?

```ts
optional isolation: IsolationMode;
```

Defined in: [types/src/index.ts:240](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L240)

#### Inherited from

```ts
JITOptions.isolation
```

***

### lang

```ts
lang: SourceLanguage;
```

Defined in: [types/src/index.ts:236](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L236)

#### Inherited from

```ts
JITOptions.lang
```

***

### source

```ts
source: string;
```

Defined in: [types/src/index.ts:237](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L237)

#### Inherited from

```ts
JITOptions.source
```

***

### symbols?

```ts
optional symbols: Record<string, FFISymbolDef>;
```

Defined in: [types/src/index.ts:239](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L239)

For type-safe calls

#### Inherited from

```ts
JITOptions.symbols
```

---
title: UnifiedLoadOptions
---

# Interface: UnifiedLoadOptions

Defined in: index.ts:306

## Properties

### binding

```ts
binding: BindingMethod;
```

Defined in: index.ts:309

***

### ccConfig?

```ts
optional ccConfig: Omit<CCLoadOptions, "source">;
```

Defined in: index.ts:313

Required for cc binding

***

### debug?

```ts
optional debug: boolean;
```

Defined in: index.ts:314

***

### ffiSymbols?

```ts
optional ffiSymbols: Record<string, FFISymbolDef>;
```

Defined in: index.ts:311

Required for ffi binding

***

### path

```ts
path: string;
```

Defined in: index.ts:308

Path to module, or C source for cc binding

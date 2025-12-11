---
title: IsolatedProcessConfig
---

# Interface: IsolatedProcessConfig

Defined in: index.ts:69

## Properties

### binding

```ts
binding: BindingMethod;
```

Defined in: index.ts:71

***

### debug?

```ts
optional debug: boolean;
```

Defined in: index.ts:77

***

### modulePath

```ts
modulePath: string;
```

Defined in: index.ts:70

***

### onError?

```ts
optional onError: ErrorMode;
```

Defined in: index.ts:76

***

### symbols?

```ts
optional symbols: Record<string, FFISymbolDef>;
```

Defined in: index.ts:73

Required when binding is 'ffi'

***

### timeout?

```ts
optional timeout: number;
```

Defined in: index.ts:75

In milliseconds, defaults to 30s

---
title: CCLoadOptions
---

# Interface: CCLoadOptions

Defined in: index.ts:219

## Properties

### debug?

```ts
optional debug: boolean;
```

Defined in: index.ts:225

***

### define?

```ts
optional define: Record<string, string>;
```

Defined in: index.ts:223

***

### flags?

```ts
optional flags: string[];
```

Defined in: index.ts:222

***

### library?

```ts
optional library: string[];
```

Defined in: index.ts:224

***

### source

```ts
source: string;
```

Defined in: index.ts:220

***

### symbols

```ts
symbols: Record<string, {
  args: FFITypeString[];
  returns: FFITypeString;
}>;
```

Defined in: index.ts:221

---
title: ZigReleaseRequest
---

# Interface: ZigReleaseRequest

Defined in: internal/toolchain/src/index.ts:278

## Extended by

- [`ZigAcquisitionOptions`](ZigAcquisitionOptions)

## Properties

### channel?

```ts
optional channel: ZigChannel;
```

Defined in: internal/toolchain/src/index.ts:280

***

### tuples?

```ts
optional tuples: (
  | "x86_64-linux"
  | "aarch64-linux"
  | "x86_64-darwin"
  | "aarch64-darwin"
  | "x86_64-windows"
  | "aarch64-windows")[];
```

Defined in: internal/toolchain/src/index.ts:282

***

### useMaster?

```ts
optional useMaster: boolean;
```

Defined in: internal/toolchain/src/index.ts:279

***

### version?

```ts
optional version: string;
```

Defined in: internal/toolchain/src/index.ts:281

---
title: ZigReleaseRequest
---

# Interface: ZigReleaseRequest

Defined in: [internal/toolchain/src/index.ts:296](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L296)

## Extended by

- [`ZigAcquisitionOptions`](./ZigAcquisitionOptions.md)

## Properties

### channel?

```ts
optional channel: ZigChannel;
```

Defined in: [internal/toolchain/src/index.ts:298](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L298)

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

Defined in: [internal/toolchain/src/index.ts:300](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L300)

***

### useMaster?

```ts
optional useMaster: boolean;
```

Defined in: [internal/toolchain/src/index.ts:297](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L297)

***

### version?

```ts
optional version: string;
```

Defined in: [internal/toolchain/src/index.ts:299](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L299)

---
title: ZigAcquisitionOptions
---

# Interface: ZigAcquisitionOptions

Defined in: [internal/toolchain/src/index.ts:303](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L303)

## Extends

- [`ZigReleaseRequest`](./ZigReleaseRequest.md)

## Properties

### allowSystemZig?

```ts
optional allowSystemZig: boolean;
```

Defined in: [internal/toolchain/src/index.ts:304](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L304)

***

### channel?

```ts
optional channel: ZigChannel;
```

Defined in: [internal/toolchain/src/index.ts:298](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L298)

#### Inherited from

[`ZigReleaseRequest`](./ZigReleaseRequest.md).[`channel`](./ZigReleaseRequest.md#channel)

***

### forceDownload?

```ts
optional forceDownload: boolean;
```

Defined in: [internal/toolchain/src/index.ts:305](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L305)

***

### forceInstall?

```ts
optional forceInstall: boolean;
```

Defined in: [internal/toolchain/src/index.ts:306](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L306)

***

### installRoot?

```ts
optional installRoot: string;
```

Defined in: [internal/toolchain/src/index.ts:307](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L307)

***

### persist?

```ts
optional persist: boolean;
```

Defined in: [internal/toolchain/src/index.ts:309](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L309)

***

### temporaryRoot?

```ts
optional temporaryRoot: string;
```

Defined in: [internal/toolchain/src/index.ts:308](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L308)

***

### tmpDir?

```ts
optional tmpDir: string;
```

Defined in: [internal/toolchain/src/index.ts:310](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L310)

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

#### Inherited from

[`ZigReleaseRequest`](./ZigReleaseRequest.md).[`tuples`](./ZigReleaseRequest.md#tuples)

***

### useMaster?

```ts
optional useMaster: boolean;
```

Defined in: [internal/toolchain/src/index.ts:297](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L297)

#### Inherited from

[`ZigReleaseRequest`](./ZigReleaseRequest.md).[`useMaster`](./ZigReleaseRequest.md#usemaster)

***

### version?

```ts
optional version: string;
```

Defined in: [internal/toolchain/src/index.ts:299](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L299)

#### Inherited from

[`ZigReleaseRequest`](./ZigReleaseRequest.md).[`version`](./ZigReleaseRequest.md#version)

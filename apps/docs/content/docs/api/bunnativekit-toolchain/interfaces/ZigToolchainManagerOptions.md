---
title: ZigToolchainManagerOptions
---

# Interface: ZigToolchainManagerOptions

Defined in: internal/toolchain/src/index.ts:324

## Properties

### defaultChannel?

```ts
optional defaultChannel: ZigChannel;
```

Defined in: internal/toolchain/src/index.ts:325

***

### defaultTuples?

```ts
optional defaultTuples: (
  | "x86_64-linux"
  | "aarch64-linux"
  | "x86_64-darwin"
  | "aarch64-darwin"
  | "x86_64-windows"
  | "aarch64-windows")[];
```

Defined in: internal/toolchain/src/index.ts:327

***

### defaultVersion?

```ts
optional defaultVersion: string;
```

Defined in: internal/toolchain/src/index.ts:326

***

### fetchUrl?

```ts
optional fetchUrl: string;
```

Defined in: internal/toolchain/src/index.ts:330

***

### installRoot?

```ts
optional installRoot: string;
```

Defined in: internal/toolchain/src/index.ts:328

***

### temporaryRoot?

```ts
optional temporaryRoot: string;
```

Defined in: internal/toolchain/src/index.ts:329

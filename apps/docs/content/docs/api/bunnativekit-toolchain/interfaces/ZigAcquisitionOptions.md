---
title: ZigAcquisitionOptions
---

# Interface: ZigAcquisitionOptions

Defined in: internal/toolchain/src/index.ts:285

## Extends

- [`ZigReleaseRequest`](ZigReleaseRequest)

## Properties

### allowSystemZig?

```ts
optional allowSystemZig: boolean;
```

Defined in: internal/toolchain/src/index.ts:286

***

### channel?

```ts
optional channel: ZigChannel;
```

Defined in: internal/toolchain/src/index.ts:280

#### Inherited from

[`ZigReleaseRequest`](ZigReleaseRequest).[`channel`](ZigReleaseRequest#channel)

***

### forceDownload?

```ts
optional forceDownload: boolean;
```

Defined in: internal/toolchain/src/index.ts:287

***

### forceInstall?

```ts
optional forceInstall: boolean;
```

Defined in: internal/toolchain/src/index.ts:288

***

### installRoot?

```ts
optional installRoot: string;
```

Defined in: internal/toolchain/src/index.ts:289

***

### persist?

```ts
optional persist: boolean;
```

Defined in: internal/toolchain/src/index.ts:291

***

### temporaryRoot?

```ts
optional temporaryRoot: string;
```

Defined in: internal/toolchain/src/index.ts:290

***

### tmpDir?

```ts
optional tmpDir: string;
```

Defined in: internal/toolchain/src/index.ts:292

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

#### Inherited from

[`ZigReleaseRequest`](ZigReleaseRequest).[`tuples`](ZigReleaseRequest#tuples)

***

### useMaster?

```ts
optional useMaster: boolean;
```

Defined in: internal/toolchain/src/index.ts:279

#### Inherited from

[`ZigReleaseRequest`](ZigReleaseRequest).[`useMaster`](ZigReleaseRequest#usemaster)

***

### version?

```ts
optional version: string;
```

Defined in: internal/toolchain/src/index.ts:281

#### Inherited from

[`ZigReleaseRequest`](ZigReleaseRequest).[`version`](ZigReleaseRequest#version)

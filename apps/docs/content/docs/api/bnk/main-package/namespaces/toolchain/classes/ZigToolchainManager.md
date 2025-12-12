---
title: ZigToolchainManager
---

# Class: ZigToolchainManager

Defined in: [internal/toolchain/src/index.ts:358](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L358)

Manages Zig toolchain acquisition, caching, and version resolution

## Constructors

### Constructor

```ts
new ZigToolchainManager(options): ZigToolchainManager;
```

Defined in: [internal/toolchain/src/index.ts:369](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L369)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`ZigToolchainManagerOptions`](../interfaces/ZigToolchainManagerOptions.md) |

#### Returns

`ZigToolchainManager`

## Methods

### detectSystemZig()

```ts
detectSystemZig(): Promise<
  | ZigBinary & {
  sha256: string;
  url: string;
  version: string;
}
| null>;
```

Defined in: [internal/toolchain/src/index.ts:456](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L456)

#### Returns

`Promise`\<
  \| [`ZigBinary`](../interfaces/ZigBinary.md) & \{
  `sha256`: `string`;
  `url`: `string`;
  `version`: `string`;
\}
  \| `null`\>

***

### ensure()

```ts
ensure(options?): Promise<ZigEnsureResult>;
```

Defined in: [internal/toolchain/src/index.ts:417](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L417)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`ZigAcquisitionOptions`](../interfaces/ZigAcquisitionOptions.md) |

#### Returns

`Promise`\<[`ZigEnsureResult`](../interfaces/ZigEnsureResult.md)\>

***

### ensureBinary()

```ts
ensureBinary(options?): Promise<ZigBinary>;
```

Defined in: [internal/toolchain/src/index.ts:479](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L479)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`ZigAcquisitionOptions`](../interfaces/ZigAcquisitionOptions.md) |

#### Returns

`Promise`\<[`ZigBinary`](../interfaces/ZigBinary.md)\>

***

### fetchSources()

```ts
fetchSources(force): Promise<{
[key: string]: Partial<Record<
  | "x86_64-linux"
  | "aarch64-linux"
  | "x86_64-darwin"
  | "aarch64-darwin"
  | "x86_64-windows"
  | "aarch64-windows", {
  sha256: string;
  url: string;
  version: string;
}>>;
  master: {
   [key: string]: Partial<Record<
     | "x86_64-linux"
     | "aarch64-linux"
     | "x86_64-darwin"
     | "aarch64-darwin"
     | "x86_64-windows"
     | "aarch64-windows", {
     sha256: string;
     url: string;
     version: string;
   }>>;
     latest: Partial<Record<
        | "x86_64-linux"
        | "aarch64-linux"
        | "x86_64-darwin"
        | "aarch64-darwin"
        | "x86_64-windows"
        | "aarch64-windows", {
        sha256: string;
        url: string;
        version: string;
     }>>;
  };
}>;
```

Defined in: [internal/toolchain/src/index.ts:396](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L396)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `force` | `boolean` | `false` |

#### Returns

`Promise`\<\{
\[`key`: `string`\]: `Partial`\<`Record`\<
  \| `"x86_64-linux"`
  \| `"aarch64-linux"`
  \| `"x86_64-darwin"`
  \| `"aarch64-darwin"`
  \| `"x86_64-windows"`
  \| `"aarch64-windows"`, \{
  `sha256`: `string`;
  `url`: `string`;
  `version`: `string`;
\}\>\>;
  `master`: \{
   \[`key`: `string`\]: `Partial`\<`Record`\<
     \| `"x86_64-linux"`
     \| `"aarch64-linux"`
     \| `"x86_64-darwin"`
     \| `"aarch64-darwin"`
     \| `"x86_64-windows"`
     \| `"aarch64-windows"`, \{
     `sha256`: `string`;
     `url`: `string`;
     `version`: `string`;
   \}\>\>;
     `latest`: `Partial`\<`Record`\<
        \| `"x86_64-linux"`
        \| `"aarch64-linux"`
        \| `"x86_64-darwin"`
        \| `"aarch64-darwin"`
        \| `"x86_64-windows"`
        \| `"aarch64-windows"`, \{
        `sha256`: `string`;
        `url`: `string`;
        `version`: `string`;
     \}\>\>;
  \};
\}\>

***

### getHostTuple()

```ts
protected getHostTuple(): 
  | "x86_64-linux"
  | "aarch64-linux"
  | "x86_64-darwin"
  | "aarch64-darwin"
  | "x86_64-windows"
  | "aarch64-windows";
```

Defined in: [internal/toolchain/src/index.ts:382](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L382)

#### Returns

  \| `"x86_64-linux"`
  \| `"aarch64-linux"`
  \| `"x86_64-darwin"`
  \| `"aarch64-darwin"`
  \| `"x86_64-windows"`
  \| `"aarch64-windows"`

***

### getInstallRoot()

```ts
protected getInstallRoot(): string;
```

Defined in: [internal/toolchain/src/index.ts:386](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L386)

#### Returns

`string`

***

### getTemporaryRoot()

```ts
protected getTemporaryRoot(): string;
```

Defined in: [internal/toolchain/src/index.ts:391](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L391)

#### Returns

`string`

***

### promoteTemporaryBinary()

```ts
promoteTemporaryBinary(binary, options?): Promise<ZigBinary>;
```

Defined in: [internal/toolchain/src/index.ts:488](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L488)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `binary` | [`ZigBinary`](../interfaces/ZigBinary.md) |
| `options?` | `Omit`\<[`ZigAcquisitionOptions`](../interfaces/ZigAcquisitionOptions.md), `"version"` \| `"tuples"` \| `"channel"` \| `"persist"` \| `"allowSystemZig"`\> |

#### Returns

`Promise`\<[`ZigBinary`](../interfaces/ZigBinary.md)\>

***

### resolveDistributions()

```ts
resolveDistributions(request?): Promise<ZigDistribution[]>;
```

Defined in: [internal/toolchain/src/index.ts:412](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L412)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `request?` | [`ZigReleaseRequest`](../interfaces/ZigReleaseRequest.md) |

#### Returns

`Promise`\<[`ZigDistribution`](../interfaces/ZigDistribution.md)[]\>

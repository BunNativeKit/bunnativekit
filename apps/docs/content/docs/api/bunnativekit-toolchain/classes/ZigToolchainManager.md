---
title: ZigToolchainManager
---

# Class: ZigToolchainManager

Defined in: internal/toolchain/src/index.ts:339

## Constructors

### Constructor

```ts
new ZigToolchainManager(options): ZigToolchainManager;
```

Defined in: internal/toolchain/src/index.ts:350

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`ZigToolchainManagerOptions`](../interfaces/ZigToolchainManagerOptions) |

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

Defined in: internal/toolchain/src/index.ts:437

#### Returns

`Promise`\<
  \| [`ZigBinary`](../interfaces/ZigBinary) & \{
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

Defined in: internal/toolchain/src/index.ts:398

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`ZigAcquisitionOptions`](../interfaces/ZigAcquisitionOptions) |

#### Returns

`Promise`\<[`ZigEnsureResult`](../interfaces/ZigEnsureResult)\>

***

### ensureBinary()

```ts
ensureBinary(options?): Promise<ZigBinary>;
```

Defined in: internal/toolchain/src/index.ts:460

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`ZigAcquisitionOptions`](../interfaces/ZigAcquisitionOptions) |

#### Returns

`Promise`\<[`ZigBinary`](../interfaces/ZigBinary)\>

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

Defined in: internal/toolchain/src/index.ts:377

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

Defined in: internal/toolchain/src/index.ts:363

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

Defined in: internal/toolchain/src/index.ts:367

#### Returns

`string`

***

### getTemporaryRoot()

```ts
protected getTemporaryRoot(): string;
```

Defined in: internal/toolchain/src/index.ts:372

#### Returns

`string`

***

### promoteTemporaryBinary()

```ts
promoteTemporaryBinary(binary, options?): Promise<ZigBinary>;
```

Defined in: internal/toolchain/src/index.ts:469

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `binary` | [`ZigBinary`](../interfaces/ZigBinary) |
| `options?` | `Omit`\<[`ZigAcquisitionOptions`](../interfaces/ZigAcquisitionOptions), `"version"` \| `"tuples"` \| `"channel"` \| `"persist"` \| `"allowSystemZig"`\> |

#### Returns

`Promise`\<[`ZigBinary`](../interfaces/ZigBinary)\>

***

### resolveDistributions()

```ts
resolveDistributions(request?): Promise<ZigDistribution[]>;
```

Defined in: internal/toolchain/src/index.ts:393

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `request?` | [`ZigReleaseRequest`](../interfaces/ZigReleaseRequest) |

#### Returns

`Promise`\<[`ZigDistribution`](../interfaces/ZigDistribution)[]\>

---
title: ModuleManifest
---

# Interface: ModuleManifest

Defined in: [types/src/index.ts:162](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L162)

Describes a BNK native module

## Properties

### author?

```ts
optional author: string;
```

Defined in: [types/src/index.ts:168](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L168)

***

### binding?

```ts
optional binding: BindingConfig;
```

Defined in: [types/src/index.ts:172](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L172)

***

### description?

```ts
optional description: string;
```

Defined in: [types/src/index.ts:167](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L167)

***

### entry

```ts
entry: string;
```

Defined in: [types/src/index.ts:166](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L166)

Source file path

***

### isolation?

```ts
optional isolation: {
  required?: boolean;
  thread?: boolean;
};
```

Defined in: [types/src/index.ts:174](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L174)

#### required?

```ts
optional required: boolean;
```

#### thread?

```ts
optional thread: boolean;
```

Use worker thread instead of subprocess

***

### license?

```ts
optional license: string;
```

Defined in: [types/src/index.ts:169](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L169)

***

### maxCompat?

```ts
optional maxCompat: string;
```

Defined in: [types/src/index.ts:190](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L190)

Max compatible BNK version

***

### minCompat?

```ts
optional minCompat: string;
```

Defined in: [types/src/index.ts:188](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L188)

Min compatible BNK version

***

### name

```ts
name: string;
```

Defined in: [types/src/index.ts:163](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L163)

***

### napiExports?

```ts
optional napiExports: Record<string, NAPISymbolDef>;
```

Defined in: [types/src/index.ts:183](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L183)

NAPI exports (when binding is napi)

***

### prebuilt?

```ts
optional prebuilt: Partial<Record<
  | "linux-x64"
  | "linux-arm64"
  | "darwin-x64"
  | "darwin-arm64"
  | "windows-x64"
| "windows-arm64", string>>;
```

Defined in: [types/src/index.ts:185](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L185)

Prebuilt binaries per platform

***

### repository?

```ts
optional repository: string;
```

Defined in: [types/src/index.ts:170](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L170)

***

### requiredBins?

```ts
optional requiredBins: string[];
```

Defined in: [types/src/index.ts:192](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L192)

Required system binaries (e.g., "zig", "clang")

***

### symbols?

```ts
optional symbols: Record<string, FFISymbolDef>;
```

Defined in: [types/src/index.ts:181](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L181)

FFI symbol definitions

***

### version

```ts
version: string;
```

Defined in: [types/src/index.ts:164](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L164)

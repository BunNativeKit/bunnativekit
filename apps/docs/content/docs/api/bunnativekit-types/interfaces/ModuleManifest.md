---
title: ModuleManifest
---

# Interface: ModuleManifest

Defined in: index.ts:162

Describes a BNK native module

## Properties

### author?

```ts
optional author: string;
```

Defined in: index.ts:168

***

### binding?

```ts
optional binding: BindingConfig;
```

Defined in: index.ts:172

***

### description?

```ts
optional description: string;
```

Defined in: index.ts:167

***

### entry

```ts
entry: string;
```

Defined in: index.ts:166

Source file path

***

### isolation?

```ts
optional isolation: {
  required?: boolean;
  thread?: boolean;
};
```

Defined in: index.ts:174

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

Defined in: index.ts:169

***

### maxCompat?

```ts
optional maxCompat: string;
```

Defined in: index.ts:190

Max compatible BNK version

***

### minCompat?

```ts
optional minCompat: string;
```

Defined in: index.ts:188

Min compatible BNK version

***

### name

```ts
name: string;
```

Defined in: index.ts:163

***

### napiExports?

```ts
optional napiExports: Record<string, NAPISymbolDef>;
```

Defined in: index.ts:183

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

Defined in: index.ts:185

Prebuilt binaries per platform

***

### repository?

```ts
optional repository: string;
```

Defined in: index.ts:170

***

### requiredBins?

```ts
optional requiredBins: string[];
```

Defined in: index.ts:192

Required system binaries (e.g., "zig", "clang")

***

### symbols?

```ts
optional symbols: Record<string, FFISymbolDef>;
```

Defined in: index.ts:181

FFI symbol definitions

***

### version

```ts
version: string;
```

Defined in: index.ts:164

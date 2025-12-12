---
title: FetchZigSources
---

# Function: fetchZigSources()

```ts
function fetchZigSources(): Promise<{
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

Defined in: [internal/toolchain/src/index.ts:125](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/toolchain/src/index.ts#L125)

Fetch available Zig versions from the upstream overlay

## Returns

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

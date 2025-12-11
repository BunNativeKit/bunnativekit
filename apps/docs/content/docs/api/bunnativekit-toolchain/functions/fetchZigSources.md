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

Defined in: internal/toolchain/src/index.ts:115

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

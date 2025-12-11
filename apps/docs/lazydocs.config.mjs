// @ts-check
/** @type {import("../../../lazydocs/src/index.ts").AutoDocsConfig} */
const config = {
  watch: {
    debounce: 1000,
    ignore: ["**/node_modules/**", "**/dist/**", "**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx", "**/tests/**", "**/__tests__/**", "**/test/**", "**/.turbo/**"],
  },
  source: {
    path: "../..",
    // Monorepo mode: generate docs per-package
    monorepo: true,
    tsconfig: "../../tsconfig.base.json",

    packages: [
      {
        name: "bnk",
        path: "apps/bnk",
        entryPoint: "apps/bnk/src",
        tsconfig: "../bnk/tsconfig.json",
        private: false,
      },
      {
        name: "@bunnativekit/examples",
        path: "apps/examples",
        entryPoint: "apps/examples/src",
        tsconfig: "../examples/tsconfig.json",
        private: true,
      },
      {
        name: "create-bnk",
        path: "apps/create-bnk",
        entryPoint: "apps/create-bnk/src/index.ts",
        tsconfig: "../create-bnk/tsconfig.json",
        private: true,
      },
      {
        name: "@bunnativekit/aot",
        path: "packages/aot",
        entryPoint: "packages/aot/src/index.ts",
        tsconfig: "../../packages/aot/tsconfig.json",
        private: false,
      },
      {
        name: "@bunnativekit/jit",
        path: "packages/jit",
        entryPoint: "packages/jit/src/index.ts",
        tsconfig: "../../packages/jit/tsconfig.json",
        private: false,
      },
      {
        name: "@bunnativekit/runtime",
        path: "packages/runtime",
        entryPoint: "packages/runtime/src/index.ts",
        tsconfig: "../../packages/runtime/tsconfig.json",
        private: false,
      },
      {
        name: "@bunnativekit/types",
        path: "packages/types",
        entryPoint: "packages/types/src/index.ts",
        tsconfig: "../../packages/types/tsconfig.json",
        private: false,
      },
      {
        name: "@bunnativekit/loader",
        path: "internal/loader",
        entryPoint: "internal/loader/src/index.ts",
        tsconfig: "../../internal/loader/tsconfig.json",
        private: false,
      },
      {
        name: "@bunnativekit/platform",
        path: "internal/platform",
        entryPoint: "internal/platform/src/index.ts",
        tsconfig: "../../internal/platform/tsconfig.json",
        private: false,
      },
      {
        name: "@bunnativekit/cache",
        path: "internal/cache",
        entryPoint: "internal/cache/src/index.ts",
        tsconfig: "../../internal/cache/tsconfig.json",
        private: false,
      },
      {
        name: "@bunnativekit/debug",
        path: "internal/debug",
        entryPoint: "internal/debug/src/index.ts",
        tsconfig: "../../internal/debug/tsconfig.json",
        private: false,
      },
      {
        name: "@bunnativekit/schema",
        path: "internal/schema",
        entryPoint: "internal/schema/src/index.ts",
        tsconfig: "../../internal/schema/tsconfig.json",
        private: false,
      },
      {
        name: "@bunnativekit/compiler",
        path: "internal/compiler",
        entryPoint: "internal/compiler/src/index.ts",
        tsconfig: "../../internal/compiler/tsconfig.json",
        private: false,
      },
      {
        name: "@bunnativekit/isolation",
        path: "internal/isolation",
        entryPoint: "internal/isolation/src/index.ts",
        tsconfig: "../../internal/isolation/tsconfig.json",
        private: false,
      },
      {
        name: "@bunnativekit/toolchain",
        path: "internal/toolchain",
        entryPoint: "internal/toolchain/src/index.ts",
        tsconfig: "../../internal/toolchain/tsconfig.json",
        private: false,
      }
    ],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "**/tests/**",
      "**/__tests__/**",
      "**/test/**",
    ],
  },

  output: {
    apiDir: "content/docs/api",
    clean: true,
  },

  typedoc: {
    // Per-package generation for proper tsconfig resolution
    entryPointStrategy: "resolve",
    outputFileStrategy: "members",
    membersWithOwnFile: ["Class", "Interface", "Enum", "Function", "TypeAlias"],
  },

  sidebar: {
    collapsed: false,
    title: "API Ref",
  },
};

export default config;

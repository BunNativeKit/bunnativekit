import type { TypeDocOptions } from "typedoc";

const config: Partial<TypeDocOptions> = {
    name: "BunNativeKit",

    // Entry points - separating public packages from internal
    entryPoints: [
        // Public packages first
        "packages/runtime",
        "packages/jit",
        "packages/aot",
        "packages/types",
        // Internal packages
        "internal/compiler",
        "internal/loader",
        "internal/isolation",
        "internal/cache",
        "internal/debug",
        "internal/platform",
        "internal/schema",
    ],
    entryPointStrategy: "packages",
    packageOptions: {
        entryPoints: ["src/index.ts"],
    } as TypeDocOptions,

    // Output configuration
    out: "apps/docs-typedoc",
    readme: "README.md",
    includeVersion: true,

    // Project-level documents for guides (create these as needed)
    projectDocuments: ["docs/**/*.md"],

    // =========================================================================
    // ORGANIZATION - This is key for better structure
    // =========================================================================

    // Group by category first, then by reflection type
    categorizeByGroup: false,

    // Define clear category ordering
    categoryOrder: [
        "Core",
        "JIT Compilation",
        "AOT Compilation",
        "Runtime",
        "Types",
        "Compiler",
        "Loader",
        "Platform",
        "Cache",
        "Debug",
        "Schema",
        "Isolation",
        "Internal",
        "Utilities",
        "*",
    ],

    // Group ordering - show what matters first
    groupOrder: [
        "Functions",
        "Classes",
        "Interfaces",
        "Type Aliases",
        "Variables",
        "Enums",
        "Namespaces",
        "*",
    ],

    // Use @group and @category tags in source for better organization
    searchGroupBoosts: {
        Functions: 1.5,
        Classes: 1.3,
        Interfaces: 1.2,
        "Type Aliases": 1.0,
    },

    // =========================================================================
    // NAVIGATION
    // =========================================================================

    navigation: {
        includeCategories: true,
        includeGroups: true,
        includeFolders: true,
        compactFolders: false, // Keep folder structure visible
        excludeReferences: true,
    },

    // Quick links
    navigationLinks: {
        GitHub: "https://github.com/user/bunnativekit",
    },

    sidebarLinks: {
        "Quick Start": "./index.html",
        "API Reference": "./modules.html",
    },

    // =========================================================================
    // FILTERING & EXCLUSIONS
    // =========================================================================

    exclude: [
        "**/dist/**",
        "**/.turbo/**",
        ".changeset/**",
        "**/node_modules/**",
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/__tests__/**",
        "**/__mocks__/**",
    ],

    excludeExternals: true,
    externalPattern: ["**/node_modules/**", "**/bun-types/**"],

    // Show protected members (useful for extension)
    excludePrivate: true,
    excludeProtected: false,

    // Include @internal marked items but mark them clearly
    excludeInternal: false,

    // Don't show re-export chains
    excludeReferences: true,

    // =========================================================================
    // OUTPUT FORMATTING
    // =========================================================================

    // Sorting - source order is usually most intuitive
    sort: ["source-order", "alphabetical"],
    kindSortOrder: [
        "Function",
        "Class",
        "Interface",
        "TypeAlias",
        "Variable",
        "Enum",
        "Namespace",
    ],

    // Show member visibility in sidebar
    visibilityFilters: {
        protected: true,
        private: false,
        inherited: true,
        external: false,
    },

    // =========================================================================
    // CODE HIGHLIGHTING & MARKDOWN
    // =========================================================================

    // Better code highlighting themes
    lightHighlightTheme: "github-light",
    darkHighlightTheme: "github-dark",

    // Enable more languages for syntax highlighting
    highlightLanguages: [
        "typescript",
        "javascript",
        "json",
        "bash",
        "shell",
        "zig",
        "c",
        "cpp",
        "rust",
    ],

    // Markdown configuration
    markdownLinkExternal: true,

    // =========================================================================
    // VALIDATION & ERROR HANDLING
    // =========================================================================

    skipErrorChecking: true,
    treatWarningsAsErrors: false,

    validation: {
        notExported: false,
        invalidLink: false,
        notDocumented: false,
    },

    // =========================================================================
    // CUSTOM CONTENT
    // =========================================================================

    // Custom CSS for better styling
    customCss: "docs/custom.css",

    customFooterHtml:
        '<a href="https://github.com/user/bunnativekit">BunNativeKit</a> - Native code toolkit for Bun',

    // Show "Defined in" source links
    disableSources: false,
    sourceLinkExternal: true,

    // Hide breadcrumbs for cleaner look (optional)
    hideGenerator: false,

    // =========================================================================
    // PERFORMANCE
    // =========================================================================

    // Emit declaration files help with hover docs
    emit: "docs",

    // Clean output directory before generating
    cleanOutputDir: true,

    // Watch mode settings
    preserveWatchOutput: true,
};

export default config;

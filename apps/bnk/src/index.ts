/**
 * Main monolithic package exporting all BunNativeKit APIs.
 * Use via CLI (`bunx bnk`) or as a library.
 * @module
 */

// core packages

export * from "@bunnativekit/aot";
export { default as aot } from "@bunnativekit/aot";
export * from "@bunnativekit/jit";
export { default as jit } from "@bunnativekit/jit";
export * from "@bunnativekit/runtime";
export * from "@bunnativekit/types";

// internal packages

export * as cache from "@bunnativekit/cache";
export * as compiler from "@bunnativekit/compiler";
export * as debug from "@bunnativekit/debug";
export * as isolation from "@bunnativekit/isolation";
export * as loader from "@bunnativekit/loader";
export * as platform from "@bunnativekit/platform";
export * as schema from "@bunnativekit/schema";
export * as toolchain from "@bunnativekit/toolchain";

// cli

export { runCLI } from "./cli";

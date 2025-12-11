// Subprocess isolation protects the main process from native code crashes.
import { jit } from "@bunnativekit/jit";
import { createIsolatedProcess } from "@bunnativekit/isolation";
import { compile } from "@bunnativekit/compiler";
import { getCacheSubdir } from "@bunnativekit/cache";
import { getPlatformInfo } from "@bunnativekit/platform";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

console.log("Isolation Demo\n");

// normal jit operation

console.log("1. Normal JIT call (direct mode)...");
const result = await jit.zig(`
  export fn add(a: i32, b: i32) i32 {
    return a + b;
  }
`, 10, 20);
console.log(`   Result: ${result}\n`);

// isolated subprocess call

console.log("2. JIT with subprocess isolation...");

// compile a module that we'll run isolated
const isolatedSource = `
export fn multiply(a: i32, b: i32) i32 {
    return a * b;
}

export fn divide(a: i32, b: i32) i32 {
    // This would crash if b is 0 in a direct call!
    return @divTrunc(a, b);
}
`;

const tempDir = getCacheSubdir("isolation-demo");
if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true });
}

const sourcePath = join(tempDir, "isolated.zig");
await Bun.write(sourcePath, isolatedSource);

const platformInfo = getPlatformInfo();
const compileResult = await compile(
    {
        source: sourcePath,
        language: "zig",
        optimization: "speed",
        outName: "isolated",
    },
    {
        sourceRoot: tempDir,
        outputDir: tempDir,
    }
);

if (!compileResult.success) {
    console.error("   Compilation failed:", compileResult.error);
    process.exit(1);
}

const libPath = compileResult.outputPath!;
console.log(`   Compiled module: ${libPath}`);

// create an isolated process
const proc = createIsolatedProcess({
    modulePath: libPath,
    binding: "ffi",
    symbols: {
        multiply: { args: ["i32", "i32"], returns: "i32" },
        divide: { args: ["i32", "i32"], returns: "i32" },
    },
    timeout: 5000,
    onError: "throw",
    debug: true,
});

// set up event handlers
proc.on("ready", () => {
    console.log("   Subprocess is ready!");
});

proc.on("error", (error) => {
    console.error("   Error from subprocess:", error.message);
});

proc.on("death", (exitCode) => {
    console.error(`   Subprocess died with exit code: ${exitCode}`);
});

// start the isolated process
console.log("   Starting isolated subprocess...");
await proc.start();

// make isolated calls
console.log("   Calling multiply(6, 7) in subprocess...");
const multResult = await proc.call<number>("multiply", 6, 7);
console.log(`   Result: ${multResult}`);

console.log("   Calling divide(100, 4) in subprocess...");
const divResult = await proc.call<number>("divide", 100, 4);
console.log(`   Result: ${divResult}`);

// crash handling demo

console.log("\n3. Crash handling demonstration...");
console.log("   In subprocess isolation mode, crashes don't bring down main process.");
console.log("   The process can be restarted after a crash.");

// shutdown the process
console.log("\n4. Shutting down isolated process...");
await proc.shutdown();
console.log("   Process shutdown complete.");

console.log("\nDemo Complete");
console.log("Key takeaways:");
console.log("  - Native code runs in a separate subprocess");
console.log("  - IPC is handled transparently via Bun.spawn");
console.log("  - Crashes in native code don't affect the main process");
console.log("  - You can set up event handlers for error/death events");
console.log("  - Processes can be restarted with proc.restart()");

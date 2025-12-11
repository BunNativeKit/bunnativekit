// Demonstrates JIT caching: same source reuses compiled binary.
import { jit } from "@bunnativekit/jit";

console.log("JIT Caching Demo\n");

const source = `
  export fn main(a: i32, b: i32) i32 {
    return a + b;
  }
`;

// first call compiles
console.log("First call (will compile)...");
const start1 = performance.now();
const result1 = await jit.zig(source, 1, 2);
const time1 = performance.now() - start1;
console.log(`Result: ${result1}, Time: ${time1.toFixed(2)}ms`);

// second call hits cache
console.log("\nSecond call (should be cached)...");
const start2 = performance.now();
const result2 = await jit.zig(source, 3, 4);
const time2 = performance.now() - start2;
console.log(`Result: ${result2}, Time: ${time2.toFixed(2)}ms`);

// different source triggers recompile
console.log("\nThird call (different source, will compile)...");
const start3 = performance.now();
const result3 = await jit.zig(`
  export fn main(a: i32, b: i32) i32 {
    return a * b;
  }
`, 5, 6);
const time3 = performance.now() - start3;
console.log(`Result: ${result3}, Time: ${time3.toFixed(2)}ms`);

console.log("\n--- Summary ---");
console.log(`First compile: ${time1.toFixed(2)}ms`);
console.log(`Cached call:   ${time2.toFixed(2)}ms`);
console.log(`New compile:   ${time3.toFixed(2)}ms`);
console.log(`Cache speedup: ${(time1 / time2).toFixed(1)}x`);

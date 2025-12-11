// Benchmarks comparing JIT compilation and cached FFI call performance.
import { jit } from "@bunnativekit/jit";

console.log("JIT Benchmarks\n");

// warmup
await jit.zig(`export fn main(a: i32, b: i32) i32 { return a + b; }`, 1, 2);

// cached ffi calls
console.log("Benchmark: 1000 cached FFI calls");
const source = `export fn main(a: i32, b: i32) i32 { return a + b; }`;

// pre-compile
await jit.zig(source, 0, 0);

const iterations = 1000;
const start = performance.now();
for (let i = 0; i < iterations; i++) {
  await jit.zig(source, i, i + 1);
}
const elapsed = performance.now() - start;

console.log(`Total time: ${elapsed.toFixed(2)}ms`);
console.log(`Per call: ${(elapsed / iterations).toFixed(4)}ms`);
console.log(`Calls/sec: ${Math.round(iterations / (elapsed / 1000))}`);

// compile time
console.log("\nBenchmark: 10 different compilations");
const compileStart = performance.now();
for (let i = 0; i < 10; i++) {
  await jit.zig(`
    export fn main(a: i32, b: i32) i32 {
      return a + b + ${i};
    }
  `, 1, 2);
}
const compileElapsed = performance.now() - compileStart;
console.log(`Total compile time: ${compileElapsed.toFixed(2)}ms`);
console.log(`Avg compile time: ${(compileElapsed / 10).toFixed(2)}ms`);

// fibonacci
console.log("\nBenchmark: Complex computation (fibonacci)");
const fibSource = `
  export fn main(n: i32, _: i32) i32 {
    if (n <= 1) return n;
    var a: i32 = 0;
    var b: i32 = 1;
    var i: i32 = 2;
    while (i <= n) : (i += 1) {
      const tmp = a + b;
      a = b;
      b = tmp;
    }
    return b;
  }
`;

// compile once
await jit.zig(fibSource, 1, 0);

const fibStart = performance.now();
const fibIterations = 10000;
for (let i = 0; i < fibIterations; i++) {
  await jit.zig(fibSource, 40, 0);
}
const fibElapsed = performance.now() - fibStart;
console.log(`Fib(40) x ${fibIterations}: ${fibElapsed.toFixed(2)}ms`);
console.log(`Per call: ${(fibElapsed / fibIterations).toFixed(4)}ms`);

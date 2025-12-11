// Basic JIT example: inline Zig code compiled and executed at runtime.
import { jit } from "@bunnativekit/jit";

console.log("Basic JIT Add\n");

const result = await jit.zig(`
  export fn main(a: i32, b: i32) i32 {
    return a + b;
  }
`, 6, 7);

console.log(`6 + 7 = ${result}`);
console.log(`Type: ${typeof result}`);

const result2 = await jit.zig(`
  export fn main(a: i32, b: i32) i32 {
    return a * b;
  }
`, 8, 9);

console.log(`8 * 9 = ${result2}`);

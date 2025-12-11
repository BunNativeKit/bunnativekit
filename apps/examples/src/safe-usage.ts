// Error handling with safeZig and safeUse - no crashes, just Result types.
import { jit, safeUse, SafeResult } from "@bunnativekit/jit";

console.log("Safe JIT Usage\n");

// good code - should work
const goodResult = await jit.safeZig(`
  export fn main(a: i32, b: i32) i32 {
    return a + b;
  }
`, 6, 7);

if (goodResult.isError()) {
  console.log("Unexpected error:", goodResult.error);
} else {
  console.log("Good result:", goodResult.unwrap());
}

// bad code - should fail gracefully
console.log("\nTrying bad code...");
const badResult = await jit.safeZig(`
  export fn main(a: i32, b: i32) i32 {
    // This is intentionally broken syntax
    return a +++ b;
  }
`, 6, 7);

if (badResult.isError()) {
  console.log("Caught error (as expected):", badResult.error?.message?.slice(0, 100) + "...");
  console.log("Thanks for not crashing my threads lil bro 🙏");
} else {
  console.log("Somehow got:", badResult.unwrap());
}

// using safeUse wrapper on regular jit call
console.log("\nUsing safeUse wrapper...");
const wrapped = await safeUse(jit.zig(`
  export fn main(a: i32, b: i32) i32 {
    return a - b;
  }
`, 100, 42));

console.log("Wrapped result:", wrapped.isOk() ? wrapped.unwrap() : "error");

// unwrapOr example
console.log("\nUsing unwrapOr with default...");
const withDefault = (await jit.safeZig(`broken code`, 1, 2)).unwrapOr(-1);
console.log("Result with default:", withDefault);

// Matrix multiplication benchmark: JIT Zig vs native Bun TypedArrays.
import { jit } from "@bunnativekit/jit";

const matmulSource = `
  export fn main(n: i32, seed: i32) i32 {
    // Allocate matrices on stack (max 50x50)
    var a: [2500]i32 = undefined;
    var b: [2500]i32 = undefined;
    var c: [2500]i32 = undefined;
    
    // Initialize matrices with deterministic values based on seed
    var i: i32 = 0;
    while (i < n * n) : (i += 1) {
      a[@intCast(i)] = @rem((seed + i), 100);
      b[@intCast(i)] = @rem((seed * 2 + i), 100);
      c[@intCast(i)] = 0;
    }
    
    // Matrix multiplication: C = A * B
    var row: i32 = 0;
    while (row < n) : (row += 1) {
      var col: i32 = 0;
      while (col < n) : (col += 1) {
        var sum: i32 = 0;
        var k: i32 = 0;
        while (k < n) : (k += 1) {
          const a_idx = row * n + k;
          const b_idx = k * n + col;
          sum += a[@intCast(a_idx)] * b[@intCast(b_idx)];
        }
        c[@intCast(row * n + col)] = sum;
      }
    }
    
    // Return sum of all elements in result matrix
    var total: i32 = 0;
    i = 0;
    while (i < n * n) : (i += 1) {
      total += c[@intCast(i)];
    }
    return total;
  }
`;

// Native Bun implementation
function matmulNative(n: number, seed: number): number {
  // Use typed arrays for better performance
  const a = new Int32Array(n * n);
  const b = new Int32Array(n * n);
  const c = new Int32Array(n * n);

  // Initialize matrices
  for (let i = 0; i < n * n; i++) {
    a[i] = (seed + i) % 100;
    b[i] = (seed * 2 + i) % 100;
  }

  // Matrix multiplication
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += a[row * n + k] * b[k * n + col];
      }
      c[row * n + col] = sum;
    }
  }

  // Sum all elements
  let total = 0;
  for (let i = 0; i < n * n; i++) {
    total += c[i];
  }
  return total;
}

// Generate random test cases - different matrix sizes and seeds
const testCases = Array.from({ length: 30 }, () => ({
  n: Math.floor(Math.random() * 20) + 20,  // Matrix size: 20-39
  seed: Math.floor(Math.random() * 10000)   // Random seed for data
}));

// Pre-calculate expected results using native implementation
console.log('Pre-calculating expected results...');
const expectedResults = testCases.map(({ n, seed }) => ({
  n,
  seed,
  expected: matmulNative(n, seed)
}));
console.log(`Testing with ${testCases.length} random matrix multiplications`);
console.log(`Matrix sizes: ${Math.min(...testCases.map(t => t.n))}x${Math.min(...testCases.map(t => t.n))} to ${Math.max(...testCases.map(t => t.n))}x${Math.max(...testCases.map(t => t.n))}`);

// zig moment
console.log('jit time :3');
const jitStart = performance.now();
let jitIterations = 0;
const jitTargetTime = 15000; // 15 seconds
while (performance.now() - jitStart < jitTargetTime) {
  const { n, seed } = testCases[jitIterations % testCases.length];
  await jit.zig(matmulSource, n, seed);
  jitIterations++;
}
const jitElapsed = performance.now() - jitStart;

// thow it at bun with same number of iterations
console.log('buntime :D');
const nativeStart = performance.now();
for (let i = 0; i < jitIterations; i++) {
  const { n, seed } = testCases[i % testCases.length];
  matmulNative(n, seed);
}
const nativeElapsed = performance.now() - nativeStart;

console.log(`\nPerformance Results`);
console.log("Iterations:", jitIterations, "matrix multiplications per implementation");
console.log("JIT Zig:", `${jitElapsed.toFixed(2)}`, "ms total | ", `${(jitElapsed / jitIterations).toFixed(4)}`, "ms per call");
console.log("Native Bun:", `${nativeElapsed.toFixed(2)}`, "ms total | ", `${(nativeElapsed / jitIterations).toFixed(4)}`, "ms per call");

const speedup = nativeElapsed / jitElapsed;
if (speedup > 1) {
  console.log(`\nJIT is ${speedup.toFixed(2)}x faster than native Bun`);
} else {
  console.log(`\nBun is ${(1 / speedup).toFixed(2)}x faster than JIT`);
}

// Verify correctness just to be sure im not pulling numbers out of my ass
console.log(`\nverify correctness`);
let allCorrect = true;
const failures: Array<{ n: number; seed: number; got: number; expected: number }> = [];

for (const { n, seed, expected } of expectedResults) {
  const result = await jit.zig(matmulSource, n, seed);

  if (result !== expected) {
    failures.push({ n, seed, got: result as number, expected });
    allCorrect = false;
  }
}

if (allCorrect) {
  console.log(`All ${expectedResults.length} random test cases verified correctly`);
  console.log(`\nSample results:`);
  for (let i = 0; i < Math.min(5, expectedResults.length); i++) {
    const { n, seed, expected } = expectedResults[i];
    console.log(`- ${n}x${n} matrix (seed=${seed}): sum=${expected}`);
  }
} else {
  console.log(`${failures.length} tests failed!`);
  failures.slice(0, 5).forEach(({ n, seed, got, expected }) => {
    console.log(`- ${n}x${n} matrix (seed=${seed}): got ${got}, expected ${expected}`);
  });
}   

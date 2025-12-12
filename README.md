# BunNativeKit

> Early work in progress. Don't expect anything to work (how you want it to at least).

BunNativeKit (bnk) is a little research project i started to do a bunch of funny "nonsense" and "neat" things to- uh i mean WITH* bun :D

### Essentially a TLDR of BNK would be my funny attempt at working with native code in Bun, but wrapping it up in a nice DX box :D

Write inline Zig, C, C++, or Rust right in your TypeScript and have it Just Work™. The JIT compiler handles all the compilation, caching (both memory and disk!), and FFI symbol parsing automagically. Need production builds? AOT mode has you covered with cross-platform compilation and TypeScript declaration generation. Oh and it'll even install Zig for you if you don't have it <3

```ts
import { jit } from "@bunnativekit/jit";
// <lang>.jit() expects a main function. currently it will run main, though this will be configurable in the future.
const result = await jit.zig(`
  export fn main(a: i32, b: i32) i32 {
    return a + b;
  }
`, 6, 7); // => 13
```

Give [bunnativekit.xwx.gg](https://bunnativekit.xwx.gg) a look for more nonsense + deeper dive into what bnk is, why/what/huh???- and a api ref ([bnk.xwx.gg](https://bnk.xwx.gg) also works dw <3)


MIT License <3
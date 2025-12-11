'use client';

import Link from 'next/link';
import {
  FeatureBlurb,
  FoundationBlock,
  Hero,
  InfoBlock,
  Kicker,
  PageShell,
  StackSection,
  StatusGroup,
  TwoColSection,
} from './_components';
import { CodeSection } from './_code-section';
import { BenchmarkSection } from './_benchmark-section';
import { PackageGrid } from './_package-grid';
import { DeveloperExperienceSection } from './_developer-experience';

export default function HomePage() {
  return (
    <PageShell>
      <Hero title="BunNativeKit" subtitle="Native code in Bun projects" />

      <TwoColSection>
        <div className="space-y-8">
          <FeatureBlurb
            label="JIT"
            body="Compile Zig/C/C++/Rust inline. Fast feedback loop, automatic caching."
          />
          <FeatureBlurb
            label="AOT"
            body="Pre-compile for production. Cross-platform builds, type generation."
          />
          <FeatureBlurb label="Runtime" body="Load pre-built binaries. Consistent API across platforms." />
        </div>

        <CodeSection
          lang="ts"
          code={`import { jit } from "@bunnativekit/jit";

const zig = await jit.zig(\`
  export fn main(a: i32, b: i32) i32 {
    return a + b;
  }
\`, 5, 3);

const c = await jit.c(\`
int main(int value) { return value * 2; }
\`, 9);

const cpp = await jit.cpp(\`
extern "C" int main(int value) { return value * value; }
\`, 4);

const rust = await jit.rust(\`
  #[no_mangle]
  pub extern "C" fn main(a: i32, b: i32) -> i32 {
    a * b
  }
\`, 6, 7);

console.log({ zig, c, cpp, rust });`}
          description='Each <code class="px-1 py-0.5 bg-neutral-900 text-neutral-100 rounded text-xs font-mono">jit.&lt;lang&gt;</code> helper compiles the snippet, invokes its exported <code class="px-1 py-0.5 bg-neutral-900 text-neutral-100 rounded text-xs font-mono">main</code> function with the provided arguments, and returns that call&rsquo;s result. Use <code class="px-1 py-0.5 bg-neutral-900 text-neutral-100 rounded text-xs font-mono">jit.compile</code> if you need long-lived modules with multiple symbols.'
        />
      </TwoColSection>

      <DeveloperExperienceSection />

      <StackSection>
        <Kicker>Packages</Kicker>
        <PackageGrid />
      </StackSection>

      <BenchmarkSection />

      <StackSection>
        <h2 className="text-3xl font-bold">How it works</h2>

        {/* Symbol Parsing */}
        <InfoBlock title="Automatic Symbol Extraction">
          <p className="text-lg text-neutral-700 leading-relaxed">
            The JIT compiler uses language-specific regex parsers to extract exported functions from your source code.
            For Zig, it matches{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">
              export fn name(args) returnType
            </code>{' '}
            patterns, automatically mapping types like{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">i32</code> →{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">FFIType.i32</code> and
            pointers to{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">FFIType.ptr</code>.
            Similar parsers handle C/C++ ({' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">EXPORT</code> or{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">extern "C"</code>) and Rust ({' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">#[no_mangle]</code> with{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">extern "C"</code>).
          </p>
        </InfoBlock>

        {/* Compilation */}
        <InfoBlock title="Cross-Platform Compilation">
          <p className="text-lg text-neutral-700 leading-relaxed">
            The{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">
              @internal/compiler
            </code>{' '}
            package wraps the Zig toolchain with optimization flags ({' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">-OReleaseFast</code>,{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">-OReleaseSmall</code>,{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">-OReleaseSafe</code>) and
            generates dynamic libraries with{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">-dynamic</code>.
            It detects the target platform (Linux/macOS/Windows) and architecture (x64/arm64) to construct proper Zig
            target triples like{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">x86_64-linux</code> or{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">aarch64-darwin</code> for
            cross-compilation.
          </p>
        </InfoBlock>

        {/* Caching */}
        <InfoBlock title="Smart Build Caching">
          <p className="text-lg text-neutral-700 leading-relaxed">
            Cache keys combine the module name with a SHA-256 hash (first 16 chars) of the source content using{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">Bun.CryptoHasher</code>.
            The{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">@internal/cache</code>{' '}
            package maintains a JSON manifest tracking entry metadata (hash, paths, timestamps) in platform-specific cache
            directories ({' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">~/.cache/bunnativekit</code> on
            Linux,{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">~/Library/Caches/bunnativekit</code>{' '}
            on macOS). JIT mode has both memory (LRU with 100-entry limit) and disk caches.
          </p>
        </InfoBlock>

        {/* FFI Loading */}
        <InfoBlock title="Type-Safe FFI Loading">
          <p className="text-lg text-neutral-700 leading-relaxed">
            The{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">
              @internal/loader
            </code>{' '}
            package converts parsed symbols into Bun&apos;s{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">dlopen</code> format with
            typed args/returns arrays. Each FFI library gets a wrapper exposing{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">call(name, ...args)</code> with
            optional performance tracing via{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">@internal/debug</code>. The
            loader validates symbol existence, handles name mapping (user name → mangled symbol), and provides{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">close()</code> for cleanup.
          </p>
        </InfoBlock>

        {/* Isolation */}
        <InfoBlock title="Subprocess Isolation">
          <p className="text-lg text-neutral-700 leading-relaxed">
            FFI modules can optionally run in isolated subprocesses spawned via{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">
              @internal/isolation
            </code>
            . Function calls use JSON IPC messages ({' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">IPCRequest</code>/{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">IPCResponse</code>) with request
            IDs for async coordination. This prevents native crashes from killing the main process for dlopen-style
            libraries. Set{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">
              isolation: "subprocess"
            </code>{' '}
            (or{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">"auto"</code> during
            development) on FFI manifests or JIT calls; NAPI and CC bindings currently run in-process.
          </p>
        </InfoBlock>

        {/* AOT */}
        <InfoBlock title="AOT Type Generation">
          <p className="text-lg text-neutral-700 leading-relaxed">
            The AOT compiler generates TypeScript{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">.d.ts</code> files from symbol
            definitions, creating typed interfaces that match your native functions. It produces{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">.meta.json</code> files with
            source hashes and platform info to detect when recompilation is needed. Watch mode uses{' '}
            <code className="bg-neutral-900 text-neutral-100 px-2 py-1 rounded text-sm font-mono">fs.watch()</code> to trigger
            automatic rebuilds on source changes, with the same cache validation as JIT mode.
          </p>
        </InfoBlock>
      </StackSection>

      <StackSection>
        <h2 className="text-3xl font-bold">Technical Foundation</h2>

        <div className="space-y-6">
          <FoundationBlock title="Built on Bun's Runtime">
            <p className="text-base text-neutral-700 leading-relaxed">
              BunNativeKit leverages Bun&apos;s native capabilities at its core. The{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">bun:ffi</code> module
              provides{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">dlopen()</code> for
              loading shared libraries, with typed FFI declarations that map directly to C ABI. We use{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">Bun.CryptoHasher</code>{' '}
              for SHA-256 hashing instead of Node&apos;s crypto module for better performance. File I/O goes through{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">Bun.file()</code> and{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">Bun.write()</code> which
              are optimized for large binary artifacts. The{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">cc</code> export from{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">bun:ffi</code> enables
              inline C compilation as an alternative binding method.
            </p>
          </FoundationBlock>

          <FoundationBlock title="Zig Toolchain Integration">
            <p className="text-base text-neutral-700 leading-relaxed">
              The entire compilation pipeline runs through Zig, which acts as both a native compiler and a C/C++
              cross-compiler. We invoke{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">zig build-lib</code> for
              Zig source,{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">zig cc</code> /{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">zig c++</code> for C/C++,
              and configure{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">rustc</code> to use Zig as
              its linker via{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">
                --codegen linker=zig
              </code>
              . The{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">@internal/toolchain</code>{' '}
              package manages Zig installation, automatically downloading platform-specific binaries from{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">ziglang.org</code>&apos;s
              index JSON, validating SHA-256 checksums with Zod schemas, and caching executables in the system cache
              directory.
            </p>
          </FoundationBlock>

          <FoundationBlock title="Process Architecture">
            <p className="text-base text-neutral-700 leading-relaxed">
              Compilation happens in the main process by spawning Zig (or rustc) via{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">Bun.spawn()</code>, piping
              stdout/stderr for diagnostics. For optional subprocess isolation of native FFI execution, we launch worker
              processes with{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">Bun.spawn()</code> + IPC
              handlers that load the compiled library and exchange JSON messages over{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">process.send()</code>/{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">
                process.on('message')
              </code>
              . This creates a boundary between native crashes and the main Bun process, with request/response correlation
              via incrementing IDs and Promise-based APIs.
            </p>
          </FoundationBlock>

          <FoundationBlock title="Platform Detection & Cross-Compilation">
            <p className="text-base text-neutral-700 leading-relaxed">
              Platform information comes from{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">
                process.platform
              </code>{' '}
              and{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">process.arch</code>, mapped
              to Zig target triples (e.g.,{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">
                x86_64-linux-gnu
              </code>
              ,{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">aarch64-macos</code>). The{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">@internal/platform</code>{' '}
              package maintains mappings for shared library extensions ({' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">.so</code>,{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">.dylib</code>,{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">.dll</code>), library
              prefixes ({' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">lib</code> on Unix, empty
              on Windows), and cache directories following XDG Base Directory spec on Linux, standard locations on
              macOS/Windows. Cross-compilation works because Zig ships with libc implementations for all targets in a
              single download.
            </p>
          </FoundationBlock>

          <FoundationBlock title="Type System Bridge">
            <p className="text-base text-neutral-700 leading-relaxed">
              FFI type mappings connect native types to Bun&apos;s{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">FFIType</code> enum. Zig
              types like{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">i32</code>,{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">u64</code>,{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">f32</code> map to{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">FFIType.i32</code>,{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">FFIType.u64</code>,{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">FFIType.f32</code>. Pointers
              ({' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">*T</code>,{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">?*T</code>) become{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">FFIType.ptr</code>, while
              null-terminated strings ({' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">[*:0]u8</code>,{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">[*c]u8</code>) use{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">FFIType.cstring</code>. For
              AOT compilation, these same mappings generate TypeScript types ({' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">i32 → number</code>,{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">ptr → Pointer</code>) in{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">.d.ts</code> declarations.
              The parsers use regex to extract function signatures and apply these rules automatically, falling back to{' '}
              <code className="bg-neutral-900 text-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">void</code> for unknown
              types.
            </p>
          </FoundationBlock>
        </div>
      </StackSection>

      <StackSection>
        <Kicker>Status</Kicker>

        <div className="space-y-6">
          <StatusGroup dotClassName="bg-green-500" title="Works">
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-1 text-base text-neutral-600">
              <div>• JIT compilation (Zig, C, C++, Rust)</div>
              <div>• Disk and memory caching</div>
              <div>• FFI symbol parsing</div>
              <div>• Subprocess isolation</div>
              <div>• AOT single-target builds</div>
              <div>• TypeScript declaration generation</div>
              <div>
                • CLI (<code className="text-sm font-mono">init</code>, <code className="text-sm font-mono">build</code>,{' '}
                <code className="text-sm font-mono">dev</code>, <code className="text-sm font-mono">run</code>,{' '}
                <code className="text-sm font-mono">test</code>)
              </div>
              <div>• Automatic Zig installation</div>
            </div>
          </StatusGroup>

          <StatusGroup dotClassName="bg-yellow-500" title="Incomplete">
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-1 text-base text-neutral-600">
              <div>• NAPI (loading works, no build path)</div>
              <div>• Incremental builds</div>
              <div>• Tracing and diagnostics</div>
              <div>• Test runner integration</div>
            </div>
          </StatusGroup>

          <StatusGroup dotClassName="bg-neutral-400" title="Planned">
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-1 text-base text-neutral-600">
              <div>• Multi-target AOT builds</div>
              <div>• Prebuilt artifact publishing</div>
              <div>• NAPI project templates</div>
            </div>
          </StatusGroup>
        </div>
      </StackSection>

      <footer className="flex gap-8 text-xl pt-8 border-t">
        <Link href="/docs" className="hover:underline">
          Documentation →
        </Link>
        <Link
          href="https://github.com/bunnativekit/bunnativekit"
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          GitHub →
        </Link>
      </footer>
    </PageShell>
  );
}

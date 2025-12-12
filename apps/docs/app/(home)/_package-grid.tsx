interface Package {
  name: string;
  description: string;
}

const packages: Package[] = [
  {
    name: '@bunnativekit/jit',
    description: 'Inline compilation with template literal helpers and optional FFI subprocess isolation',
  },
  {
    name: '@bunnativekit/aot',
    description: 'Ahead-of-time compiler with manifest generation and multi-target support',
  },
  {
    name: '@bunnativekit/runtime',
    description: 'Runtime loader with manifest-aware symbol parsing and error handling',
  },
  {
    name: '@bunnativekit/types',
    description: 'Shared TypeScript definitions for all packages',
  },
  {
    name: 'bnk',
    description: 'CLI for init, build, dev, test, and toolchain management',
  },
  {
    name: 'create-bnk',
    description: 'Project scaffolding with examples and configuration',
  },
];

export function PackageGrid() {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-base">
      {packages.map((pkg) => (
        <div key={pkg.name} className="space-y-1 sm:space-y-2">
          <code className="text-sm font-semibold">{pkg.name}</code>
          <p className="text-neutral-600">{pkg.description}</p>
        </div>
      ))}
    </div>
  );
}

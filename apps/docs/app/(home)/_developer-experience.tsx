import { Kicker } from './_components';

interface FeatureList {
  title: string;
  features: string[];
}

const featureLists: FeatureList[] = [
  {
    title: 'Create native modules',
    features: [
      'Write inline Zig, C, C++, or Rust',
      'Automatic Zig installation if missing',
      'Template literal helpers with full types',
      'Subprocess isolation for untrusted FFI code',
      'Source hash-based caching',
    ],
  },
  {
    title: 'Use compiled modules',
    features: [
      'FFI/NAPI symbol resolution',
      'Manifest-guided loading',
      'Cross-platform artifact handling',
      'TypeScript declaration generation',
      'Error strategies for production',
    ],
  },
];

export function DeveloperExperienceSection() {
  return (
    <section className="space-y-8">
      <Kicker>Developer experience</Kicker>
      <div className="grid md:grid-cols-2 gap-8">
        {featureLists.map((list) => (
          <div key={list.title} className="space-y-3">
            <h3 className="text-2xl font-semibold">{list.title}</h3>
            <ul className="space-y-2 text-lg text-neutral-600">
              {list.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

import type { ReactNode } from 'react';

export function PageShell(props: { children: ReactNode }) {
  return (
    <main className="flex-1 p-8 md:p-16">
      <div className="max-w-5xl mx-auto space-y-24">{props.children}</div>
    </main>
  );
}

export function Hero(props: { title: ReactNode; subtitle: ReactNode }) {
  return (
    <header className="space-y-6">
      <h1 className="text-7xl md:text-8xl font-black">{props.title}</h1>
      <p className="text-3xl md:text-4xl font-light text-neutral-600">{props.subtitle}</p>
    </header>
  );
}

export function Kicker(props: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`text-sm font-bold uppercase tracking-wider text-neutral-400${props.className ? ` ${props.className}` : ''}`}
    >
      {props.children}
    </h2>
  );
}

export function TwoColSection(props: { children: ReactNode }) {
  return <section className="grid md:grid-cols-2 gap-12">{props.children}</section>;
}

export function StackSection(props: { children: ReactNode }) {
  return <section className="space-y-8">{props.children}</section>;
}

export function FeatureBlurb(props: { label: ReactNode; body: ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-3">{props.label}</h2>
      <p className="text-xl">{props.body}</p>
    </div>
  );
}

export function InfoBlock(props: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-2xl font-semibold">{props.title}</h3>
      {props.children}
    </div>
  );
}

export function FoundationBlock(props: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold">{props.title}</h3>
      {props.children}
    </div>
  );
}

export function StatusGroup(props: { dotClassName: string; title: ReactNode; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${props.dotClassName}`}></span>
        {props.title}
      </h3>
      {props.children}
    </div>
  );
}

import type { ReactNode } from 'react';

export function PageShell(props: { children: ReactNode }) {
  return (
    <main className="flex-1 p-4 sm:p-8 md:p-16 overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-12 sm:space-y-16 md:space-y-24">{props.children}</div>
    </main>
  );
}

export function Hero(props: { title: ReactNode; subtitle: ReactNode }) {
  return (
    <header className="space-y-4 md:space-y-6">
      <h1 className="text-5xl sm:text-7xl md:text-8xl font-black">{props.title}</h1>
      <p className="text-2xl sm:text-3xl md:text-4xl font-light text-neutral-600">{props.subtitle}</p>
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
  return <section className="grid md:grid-cols-2 gap-8 md:gap-12">{props.children}</section>;
}

export function StackSection(props: { children: ReactNode }) {
  return <section className="space-y-6 sm:space-y-8">{props.children}</section>;
}

export function FeatureBlurb(props: { label: ReactNode; body: ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2 sm:mb-3">{props.label}</h2>
      <p className="text-base sm:text-lg md:text-xl">{props.body}</p>
    </div>
  );
}

export function InfoBlock(props: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="space-y-2 sm:space-y-3">
      <h3 className="text-xl sm:text-2xl font-semibold">{props.title}</h3>
      {props.children}
    </div>
  );
}

export function FoundationBlock(props: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="space-y-2 sm:space-y-3">
      <h3 className="text-lg sm:text-xl font-semibold">{props.title}</h3>
      {props.children}
    </div>
  );
}

export function StatusGroup(props: { dotClassName: string; title: ReactNode; children: ReactNode }) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${props.dotClassName}`}></span>
        {props.title}
      </h3>
      {props.children}
    </div>
  );
}

export function Code(props: { children: ReactNode }) {
  return (
    <code className="bg-neutral-900 text-neutral-100 px-1 py-0.5 sm:px-1.5 rounded text-xs sm:text-sm font-mono break-words">
      {props.children}
    </code>
  );
}

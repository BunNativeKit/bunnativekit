import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';

interface CodeSectionProps {
  code: string;
  lang: string;
  description?: string;
}

export function CodeSection({ code, lang, description }: CodeSectionProps) {
  return (
    <div>
      <DynamicCodeBlock lang={lang} code={code} />
      {description && (
        <p className="mt-3 text-sm text-neutral-500" dangerouslySetInnerHTML={{ __html: description }} />
      )}
    </div>
  );
}

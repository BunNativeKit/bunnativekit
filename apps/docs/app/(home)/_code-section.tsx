import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';

interface CodeSectionProps {
  code: string;
  lang: string;
  description?: string;
}

export function CodeSection({ code, lang, description }: CodeSectionProps) {
  return (
    <div className="min-w-0">
      <div className="overflow-x-auto">
        <DynamicCodeBlock lang={lang} code={code} />
      </div>
      {description && (
        // biome-ignore lint/security/noDangerouslySetInnerHtml: shh
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-neutral-500" dangerouslySetInnerHTML={{ __html: description }} />
      )}
    </div>
  );
}

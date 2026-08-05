export function ScienceNote({ text }: { text: string }) {
  return (
    <p className="text-accent-soft-text border-accent mt-1.5 border-l-3 pl-3 italic">
      {text}
    </p>
  );
}

export function GuidelineHeading({
  title,
  text,
}: {
  title: string;
  text?: string | string[];
}) {
  const paragraphs =
    text === undefined ? [] : Array.isArray(text) ? text : [text];
  return (
    <div className="mt-5">
      <p className="font-heading text-ink mb-1 text-lg font-medium">{title}</p>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="text-ink-muted mt-2 first:mt-0">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function GuidelineInline({
  title,
  text,
  science,
  showScience = false,
}: {
  title: string;
  text?: string | string[];
  science?: string;
  showScience?: boolean;
}) {
  const paragraphs =
    text === undefined ? [] : Array.isArray(text) ? text : [text];
  return (
    <div>
      <p>
        <span className="text-ink font-medium">{title}: </span>
        <span className="text-ink-muted">{paragraphs.join(' ')}</span>
      </p>
      {showScience && science && <ScienceNote text={science} />}
    </div>
  );
}

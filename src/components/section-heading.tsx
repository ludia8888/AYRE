export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <p className="font-mono text-xs uppercase tracking-[0.32em] text-brand-green">{eyebrow}</p>
      <h2 className="font-display text-4xl uppercase leading-none text-white md:text-5xl">{title}</h2>
      <p className="max-w-3xl text-sm text-white/62 md:text-base">{description}</p>
    </div>
  );
}

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
    <div className="space-y-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand-green">{eyebrow}</p>
      <h2 className="max-w-2xl font-display text-3xl font-extrabold leading-[1.05] tracking-[-0.02em] text-[var(--text)] md:text-4xl">
        {title}
      </h2>
      <p className="max-w-xl text-sm leading-relaxed text-[var(--muted)]">{description}</p>
    </div>
  );
}

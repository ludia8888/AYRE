import { SectionHeading } from "@/components/section-heading";
import { getSiteDataset } from "@/lib/data";
import { formatDateTime } from "@/lib/formatting";

export default async function ChangelogPage() {
  const dataset = await getSiteDataset();

  return (
    <div className="space-y-10">
      <SectionHeading
        eyebrow="Changelog"
        title="Score versions are communicated publicly"
        description="If the formula changes, AYRE explains what changed and when it changed so old screenshots do not become ambiguous."
      />
      <div className="space-y-4">
        {dataset.changelogEntries.map((entry) => (
          <article key={entry.id} className="ayre-panel overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-brand-green via-brand-green/50 to-transparent" />
            <div className="p-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="font-display text-2xl font-extrabold tracking-[-0.02em] text-[var(--text)]">{entry.title}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{entry.summary}</p>
                </div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--dim)]">
                  {entry.version} • {formatDateTime(entry.publishedAt)}
                </p>
              </div>
              <ul className="mt-5 space-y-2">
                {entry.changes.map((change) => (
                  <li key={change} className="ayre-accent-left rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text-secondary)] transition hover:border-brand-green/20">
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

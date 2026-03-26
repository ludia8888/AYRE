import { SectionHeading } from "@/components/section-heading";
import { getSiteDataset } from "@/lib/data";
import { formatDateTime } from "@/lib/formatting";

export default async function ChangelogPage() {
  const dataset = await getSiteDataset();

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Methodology changelog"
        title="Score versions are communicated publicly"
        description="If the formula changes, AYRE explains what changed and when it changed so old screenshots do not become ambiguous."
      />
      <div className="space-y-4">
        {dataset.changelogEntries.map((entry) => (
          <article key={entry.id} className="ayre-panel p-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-display text-4xl uppercase text-white">{entry.title}</p>
                <p className="mt-1 text-sm text-white/58">{entry.summary}</p>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/42">
                {entry.version} • {formatDateTime(entry.publishedAt)}
              </p>
            </div>
            <ul className="mt-5 grid gap-3 text-sm text-white/68">
              {entry.changes.map((change) => (
                <li key={change} className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3">
                  {change}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

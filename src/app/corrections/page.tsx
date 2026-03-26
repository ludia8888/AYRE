import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { getSiteDataset } from "@/lib/data";

const correctionsEmail = process.env.NEXT_PUBLIC_CORRECTIONS_EMAIL ?? "corrections@ayre.example";

const statusConfig: Record<string, { color: string; dot: string }> = {
  pending_review: { color: "text-[var(--brand-yellow)] border-[var(--brand-yellow)]/20", dot: "bg-[var(--brand-yellow)]" },
  temporarily_unpublished: { color: "text-brand-red border-brand-red/15", dot: "bg-brand-red" },
  corrected: { color: "text-brand-green border-brand-green/20", dot: "bg-brand-green" },
  rejected: { color: "text-[var(--muted)] border-[var(--border)]", dot: "bg-[var(--dim)]" },
};

export default async function CorrectionsPage() {
  const dataset = await getSiteDataset();

  return (
    <div className="space-y-12">
      <SectionHeading
        eyebrow="Corrections"
        title="Public intake. Internal triage."
        description="Email-driven. Status tracked internally."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="h-1 bg-gradient-to-r from-brand-green via-brand-green/50 to-transparent" />
          <div className="p-6">
            <p className="font-display text-xl font-extrabold tracking-[-0.02em] text-[var(--text)]">Request a correction</p>
            <div className="mt-4 space-y-3">
              <p className="text-sm text-[var(--text-secondary)]">Send the claim URL, the contested issue, and the preferred correction.</p>
              <p className="font-serif text-base italic text-[var(--text-secondary)]">&ldquo;We review requests in a timely manner.&rdquo;</p>
              <Link
                href={`mailto:${correctionsEmail}`}
                className="ayre-link mt-2 inline-block font-mono text-[10px] uppercase tracking-[0.14em] text-brand-green transition hover:text-[var(--text)]"
              >
                {correctionsEmail}
              </Link>
            </div>
          </div>
        </div>

        <div className="ayre-panel p-6">
          <p className="font-display text-xl font-extrabold tracking-[-0.02em] text-[var(--text)]">Statuses</p>
          <div className="mt-4 space-y-1.5">
            {Object.entries(statusConfig).map(([status, config]) => (
              <div
                key={status}
                className={`flex items-center gap-2.5 rounded-md border bg-[var(--bg)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] ${config.color}`}
              >
                <span className={`size-1.5 rounded-full ${config.dot}`} />
                {status}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ayre-panel p-6">
        <p className="font-display text-xl font-extrabold tracking-[-0.02em] text-[var(--text)]">Recent</p>
        <div className="mt-4 space-y-2">
          {dataset.correctionRequests.map((request) => {
            const config = statusConfig[request.status] ?? statusConfig.rejected;
            return (
              <div key={request.id} className="ayre-accent-left flex items-start justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4 transition hover:border-brand-green/15 hover:shadow-sm">
                <div>
                  <p className="font-display text-sm font-bold tracking-[-0.01em] text-[var(--text)]">{request.expertSlug.replaceAll("-", " ")}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{request.summary}</p>
                </div>
                <span className={`flex shrink-0 items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[7px] uppercase tracking-[0.14em] ${config.color}`}>
                  <span className={`size-1 rounded-full ${config.dot}`} />
                  {request.status.split("_").join(" ")}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

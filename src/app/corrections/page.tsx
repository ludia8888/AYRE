import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { getSiteDataset } from "@/lib/data";

const correctionsEmail = process.env.NEXT_PUBLIC_CORRECTIONS_EMAIL ?? "corrections@ayre.example";

export default async function CorrectionsPage() {
  const dataset = await getSiteDataset();

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Corrections"
        title="Public intake. Internal triage."
        description="Disputed claims are reviewed in a timely manner. Phase 1 keeps the channel simple and email-driven while the internal workflow tracks status changes."
      />
      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="ayre-panel p-6">
          <p className="font-display text-4xl uppercase text-white">How to request a correction</p>
          <div className="mt-4 space-y-3 text-sm text-white/67">
            <p>Send the claim URL or source URL, the contested issue, and the preferred correction to the email below.</p>
            <p>We review requests in a timely manner.</p>
            <Link href={`mailto:${correctionsEmail}`} className="font-mono text-[11px] uppercase tracking-[0.24em] text-brand-green">
              {correctionsEmail}
            </Link>
          </div>
        </div>
        <div className="ayre-panel p-6">
          <p className="font-display text-4xl uppercase text-white">Internal statuses</p>
          <ul className="mt-4 grid gap-3 text-sm text-white/67">
            {["pending_review", "temporarily_unpublished", "corrected", "rejected"].map((status) => (
              <li key={status} className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 font-mono text-[12px] uppercase tracking-[0.2em]">
                {status}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ayre-panel p-6">
        <p className="font-display text-4xl uppercase text-white">Recent requests</p>
        <div className="mt-5 grid gap-3">
          {dataset.correctionRequests.map((request) => (
            <div key={request.id} className="rounded-2xl border border-white/10 bg-white/4 px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-display text-2xl uppercase text-white">{request.expertSlug.replaceAll("-", " ")}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">{request.status}</p>
              </div>
              <p className="mt-2 text-sm text-white/64">{request.summary}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

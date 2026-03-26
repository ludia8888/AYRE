import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClaimCard } from "@/components/claim-card";
import { ScoreChip } from "@/components/score-chip";
import { SectionHeading } from "@/components/section-heading";
import { getExpertSnapshotBySlug, getSiteDataset } from "@/lib/data";
import { buildTrackedPath, formatDate } from "@/lib/formatting";

type ExpertPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 3600;

export async function generateMetadata({ params }: ExpertPageProps): Promise<Metadata> {
  const { slug } = await params;
  const snapshot = await getExpertSnapshotBySlug(slug);

  if (!snapshot) {
    return { title: "Expert not found | AYRE" };
  }

  const ogPath = `/experts/${slug}/opengraph-image?v=${snapshot.scoreVersion}`;
  const title = `${snapshot.expert.displayName} | AYRE`;
  const description = `AYRE ${snapshot.ayreScore}. Based on ${snapshot.resolvedCount} resolved predictions. Score ${snapshot.scoreVersion}.`;

  return {
    title,
    description,
    openGraph: { title, description, images: [ogPath] },
    twitter: { card: "summary_large_image", title, description, images: [ogPath] },
  };
}

export default async function ExpertPage({ params }: ExpertPageProps) {
  const { slug } = await params;
  const [dataset, snapshot] = await Promise.all([getSiteDataset(), getExpertSnapshotBySlug(slug)]);

  if (!snapshot) {
    notFound();
  }

  const sourceMap = new Map(dataset.sourceDocuments.map((source) => [source.id, source]));
  const recentResolved = [...snapshot.resolvedRecords].sort(
    (left, right) => new Date(right.claim.publishedAt).getTime() - new Date(left.claim.publishedAt).getTime(),
  );

  return (
    <div className="space-y-12">
      {/* ── Profile hero ── */}
      <section className="animate-fade-up ayre-hero-bg overflow-hidden rounded-xl border border-[var(--border)]">
        <div className="h-1 bg-gradient-to-r from-brand-green via-brand-green/60 to-transparent" />
        <div className="p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand-green">Profile</span>
                <span className="h-px flex-1 bg-[var(--border)]" />
              </div>
              <div>
                <h1 className="border-l-4 border-brand-green pl-5 font-serif text-[clamp(2.2rem,5vw,4.5rem)] italic leading-[0.95] text-[var(--text)]">
                  {snapshot.expert.displayName}
                </h1>
                <p className="mt-2 text-[15px] text-[var(--muted)]">{snapshot.expert.headline}</p>
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                <div className="ayre-stat">
                  <span>Accuracy</span>
                  <strong>{snapshot.accuracy.toFixed(1)}%</strong>
                </div>
                <div className="ayre-stat">
                  <span>Resolved</span>
                  <strong>{snapshot.resolvedCount}</strong>
                </div>
                <div className="ayre-stat">
                  <span>Version</span>
                  <strong>{snapshot.scoreVersion}</strong>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--dim)]">
                <a href={buildTrackedPath(`/experts/${snapshot.expert.slug}`, "expert", snapshot.expert.slug)} className="ayre-link transition hover:text-brand-green">Share URL</a>
                <span className="text-[var(--border)]">|</span>
                <a href="/methodology" className="ayre-link transition hover:text-brand-green">Method</a>
                <span className="text-[var(--border)]">|</span>
                <a href="/corrections" className="ayre-link transition hover:text-brand-green">Corrections</a>
              </div>
            </div>
            <div className="space-y-3">
              <ScoreChip snapshot={snapshot} />
              <div className="rounded-lg border border-brand-green/20 bg-brand-green/[0.03] p-4 transition hover:border-brand-green/30">
                <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-brand-green">Best call</p>
                <p className="mt-1.5 font-serif text-lg italic leading-snug text-[var(--text)]">
                  {snapshot.bestCall?.claim.eventLabel ?? "No resolved calls yet"}
                </p>
                {snapshot.bestCall ? (
                  <p className="mt-1.5 font-mono text-[10px] text-[var(--muted)]">
                    {formatDate(snapshot.bestCall.resolution.resolvedAt)} • Brier {snapshot.bestCall.brier.toFixed(3)}
                  </p>
                ) : null}
              </div>
              <div className="rounded-lg border border-brand-red/12 bg-brand-red/[0.02] p-4 transition hover:border-brand-red/20">
                <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-brand-red/70">Worst call</p>
                <p className="mt-1.5 font-serif text-lg italic leading-snug text-[var(--text)]">
                  {snapshot.worstCall?.claim.eventLabel ?? "No misses yet"}
                </p>
                {snapshot.worstCall ? (
                  <p className="mt-1.5 font-mono text-[10px] text-[var(--muted)]">
                    Brier {snapshot.worstCall.brier.toFixed(3)}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Resolved calls ── */}
      <section className="animate-fade-up space-y-6" style={{ animationDelay: "0.1s" }}>
        <SectionHeading
          eyebrow="Calls"
          title="Every call stays source-linked"
          description="The quote, the direction, the evidence, and the version."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {recentResolved.map((record) => (
            <ClaimCard key={record.claim.id} record={record} source={sourceMap.get(record.claim.sourceDocumentId)} />
          ))}
        </div>
      </section>
    </div>
  );
}

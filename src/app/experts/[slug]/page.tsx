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
    return {
      title: "Expert not found | AYRE",
    };
  }

  const ogPath = `/experts/${slug}/opengraph-image?v=${snapshot.scoreVersion}`;
  const title = `${snapshot.expert.displayName} | AYRE`;
  const description = `AYRE ${snapshot.ayreScore}. Based on ${snapshot.resolvedCount} resolved predictions. Score ${snapshot.scoreVersion}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogPath],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogPath],
    },
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
    <div className="space-y-8">
      <section className="ayre-panel overflow-hidden p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-brand-green">Profile mode</p>
            <div>
              <h1 className="font-display text-5xl uppercase leading-none text-white md:text-6xl">{snapshot.expert.displayName}</h1>
              <p className="mt-2 text-base text-white/66">{snapshot.expert.headline}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="ayre-stat">
                <span>Accuracy</span>
                <strong>{snapshot.accuracy.toFixed(1)}%</strong>
              </div>
              <div className="ayre-stat">
                <span>Resolved claims</span>
                <strong>{snapshot.resolvedCount}</strong>
              </div>
              <div className="ayre-stat">
                <span>Version</span>
                <strong>{snapshot.scoreVersion}</strong>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/55">
              <a href={buildTrackedPath(`/experts/${snapshot.expert.slug}`, "expert", snapshot.expert.slug)}>Tracked share URL</a>
              <a href="/methodology">Methodology</a>
              <a href="/corrections">Corrections</a>
            </div>
          </div>
          <div className="space-y-4">
            <ScoreChip snapshot={snapshot} />
            <div className="ayre-panel border-white/8 bg-white/3 p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">Best call</p>
              <p className="mt-2 font-display text-3xl uppercase text-white">
                {snapshot.bestCall?.claim.eventLabel ?? "No resolved calls yet"}
              </p>
              {snapshot.bestCall ? (
                <p className="mt-2 text-sm text-white/62">
                  Resolved on {formatDate(snapshot.bestCall.resolution.resolvedAt)} with Brier {snapshot.bestCall.brier.toFixed(3)}.
                </p>
              ) : null}
            </div>
            <div className="ayre-panel border-white/8 bg-white/3 p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">Worst call</p>
              <p className="mt-2 font-display text-3xl uppercase text-white">
                {snapshot.worstCall?.claim.eventLabel ?? "No misses yet"}
              </p>
              {snapshot.worstCall ? (
                <p className="mt-2 text-sm text-white/62">
                  Brier {snapshot.worstCall.brier.toFixed(3)} with published source still linked below.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Resolved calls"
          title="Every call stays source-linked"
          description="Profiles carry the quote, the direction, the evidence link, and the version that scored the call."
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

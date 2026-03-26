import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CompareSummaryCard } from "@/components/compare-summary-card";
import { SectionHeading } from "@/components/section-heading";
import { getCompareSnapshot } from "@/lib/data";
import { compareTitle, formatPercent } from "@/lib/formatting";

type ComparePageProps = {
  params: Promise<{
    pair: string;
  }>;
};

export const revalidate = 3600;

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const { pair } = await params;
  const compare = await getCompareSnapshot(pair);

  if (!compare) {
    return {
      title: "Compare not found | AYRE",
    };
  }

  const ogPath = `/compare/${pair}/opengraph-image?v=${compare.scoreVersion}`;
  const title = `${compare.left.expert.displayName} vs ${compare.right.expert.displayName} | AYRE`;
  const description = `AYRE compare card. ${compare.winner === "tie" ? "Tie board" : `${compare.scoreDelta}-point spread`} on Score ${compare.scoreVersion}.`;

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

export default async function ComparePage({ params }: ComparePageProps) {
  const { pair } = await params;
  const compare = await getCompareSnapshot(pair);

  if (!compare) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <CompareSummaryCard compare={compare} priorityLabel="Compare mode" />

      <section className="grid gap-4 lg:grid-cols-2">
        {[compare.left, compare.right].map((snapshot) => (
          <div key={snapshot.expert.id} className="ayre-panel p-6">
            <p className="font-display text-4xl uppercase text-white">{snapshot.expert.displayName}</p>
            <p className="mt-1 text-sm text-white/62">{snapshot.expert.headline}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="ayre-stat">
                <span>AYRE score</span>
                <strong>{snapshot.ayreScore}</strong>
              </div>
              <div className="ayre-stat">
                <span>Accuracy</span>
                <strong>{formatPercent(snapshot.accuracy, 1)}</strong>
              </div>
              <div className="ayre-stat">
                <span>Resolved</span>
                <strong>{snapshot.resolvedCount}</strong>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Shared events"
          title={compareTitle(compare)}
          description="Where the two people called the same proposition, the compare page shows who landed closer and who drifted."
        />
        <div className="ayre-panel overflow-hidden">
          <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-4 border-b border-white/10 px-5 py-4 font-mono text-[11px] uppercase tracking-[0.24em] text-white/42 md:px-6">
            <span>Event</span>
            <span>{compare.left.expert.displayName}</span>
            <span>{compare.right.expert.displayName}</span>
          </div>
          <div className="divide-y divide-white/8">
            {compare.sharedClaims.map((shared) => (
              <div key={shared.eventKey} className="grid grid-cols-[1.4fr_1fr_1fr] gap-4 px-5 py-5 md:px-6">
                <div>
                  <p className="font-display text-2xl uppercase text-white">{shared.eventLabel}</p>
                  <p className="mt-2 text-xs text-white/48">
                    Winner:{" "}
                    {shared.winner === "left"
                      ? compare.left.expert.displayName
                      : shared.winner === "right"
                        ? compare.right.expert.displayName
                        : "Tie"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/42">Call</p>
                  <p className="mt-2 text-sm text-white/78">
                    {shared.left?.claim.predictedOutcome === "yes" ? "YES" : "NO"} • Brier {shared.left?.brier.toFixed(3)}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/42">Call</p>
                  <p className="mt-2 text-sm text-white/78">
                    {shared.right?.claim.predictedOutcome === "yes" ? "YES" : "NO"} • Brier {shared.right?.brier.toFixed(3)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

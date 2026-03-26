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
    return { title: "Compare not found | AYRE" };
  }

  const ogPath = `/compare/${pair}/opengraph-image?v=${compare.scoreVersion}`;
  const title = `${compare.left.expert.displayName} vs ${compare.right.expert.displayName} | AYRE`;
  const description = `AYRE compare card. ${compare.winner === "tie" ? "Tie board" : `${compare.scoreDelta}-point spread`} on Score ${compare.scoreVersion}.`;

  return {
    title,
    description,
    openGraph: { title, description, images: [ogPath] },
    twitter: { card: "summary_large_image", title, description, images: [ogPath] },
  };
}

export default async function ComparePage({ params }: ComparePageProps) {
  const { pair } = await params;
  const compare = await getCompareSnapshot(pair);

  if (!compare) {
    notFound();
  }

  return (
    <div className="space-y-12">
      <CompareSummaryCard compare={compare} priorityLabel="Compare" />

      <section className="animate-fade-up grid gap-4 lg:grid-cols-2" style={{ animationDelay: "0.1s" }}>
        {[compare.left, compare.right].map((snapshot) => {
          const isWinner =
            (compare.winner === "left" && snapshot === compare.left) ||
            (compare.winner === "right" && snapshot === compare.right);
          const isLoser = !isWinner && compare.winner !== "tie";
          return (
            <div
              key={snapshot.expert.id}
              className={`rounded-lg border p-5 transition ${
                isWinner ? "ayre-winner" : isLoser ? "ayre-loser" : "ayre-neutral"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-2xl font-extrabold tracking-[-0.02em] text-[var(--text)]">{snapshot.expert.displayName}</p>
                  <p className="mt-0.5 text-xs text-[var(--muted)]">{snapshot.expert.headline}</p>
                </div>
                {isWinner ? (
                  <span className="rounded-full bg-brand-green px-2 py-0.5 font-mono text-[7px] uppercase tracking-[0.12em] text-white">Winner</span>
                ) : null}
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="ayre-stat">
                  <span>Score</span>
                  <strong className={isWinner ? "text-brand-green" : ""}>{snapshot.ayreScore}</strong>
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
          );
        })}
      </section>

      <section className="animate-fade-up space-y-6" style={{ animationDelay: "0.15s" }}>
        <SectionHeading
          eyebrow="Shared events"
          title={compareTitle(compare)}
          description="Same proposition, different calls. Who landed closer?"
        />
        <div className="ayre-panel overflow-hidden">
          <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-3 border-b border-[var(--border)] px-5 py-2.5 font-mono text-[7px] uppercase tracking-[0.18em] text-[var(--dim)] md:px-6">
            <span>Event</span>
            <span>{compare.left.expert.displayName}</span>
            <span>{compare.right.expert.displayName}</span>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {compare.sharedClaims.map((shared) => (
              <div key={shared.eventKey} className="grid grid-cols-[1.4fr_1fr_1fr] gap-3 px-5 py-3.5 transition hover:bg-[var(--bg)] md:px-6">
                <div>
                  <p className="font-display text-sm font-bold tracking-[-0.01em] text-[var(--text)]">{shared.eventLabel}</p>
                  <p className="mt-0.5 font-mono text-[9px] text-brand-green">
                    {shared.winner === "left"
                      ? compare.left.expert.displayName
                      : shared.winner === "right"
                        ? compare.right.expert.displayName
                        : "Tie"}
                  </p>
                </div>
                <div className={`rounded-md p-2.5 ${shared.winner === "left" ? "border border-brand-green/20 bg-brand-green/[0.03]" : "bg-[var(--bg)]"}`}>
                  <p className="font-mono text-[7px] uppercase tracking-[0.16em] text-[var(--dim)]">{shared.left?.claim.predictedOutcome === "yes" ? "YES" : "NO"}</p>
                  <p className={`mt-0.5 font-display text-base font-bold tracking-[-0.02em] ${shared.winner === "left" ? "text-brand-green" : "text-[var(--text)]"}`}>{shared.left?.brier.toFixed(3)}</p>
                </div>
                <div className={`rounded-md p-2.5 ${shared.winner === "right" ? "border border-brand-green/20 bg-brand-green/[0.03]" : "bg-[var(--bg)]"}`}>
                  <p className="font-mono text-[7px] uppercase tracking-[0.16em] text-[var(--dim)]">{shared.right?.claim.predictedOutcome === "yes" ? "YES" : "NO"}</p>
                  <p className={`mt-0.5 font-display text-base font-bold tracking-[-0.02em] ${shared.winner === "right" ? "text-brand-green" : "text-[var(--text)]"}`}>{shared.right?.brier.toFixed(3)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

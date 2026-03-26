import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { compareTitle } from "@/lib/formatting";
import type { CompareSnapshot } from "@/lib/types";

export function CompareSummaryCard({
  compare,
  priorityLabel,
}: {
  compare: CompareSnapshot;
  priorityLabel?: string;
}) {
  const leftWinner = compare.winner === "left";
  const rightWinner = compare.winner === "right";

  return (
    <div className="ayre-panel ayre-grid relative overflow-hidden p-6">
      {priorityLabel ? (
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.32em] text-brand-green">{priorityLabel}</p>
      ) : null}
      <div className="space-y-5">
        <div>
          <p className="font-display text-4xl uppercase leading-none text-white">{compareTitle(compare)}</p>
          <p className="mt-2 text-sm text-white/65">
            Winner is readable in half a second: green accent for the higher score, red accent for the lower one.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[compare.left, compare.right].map((snapshot, index) => {
            const winner = index === 0 ? leftWinner : rightWinner;
            return (
              <div
                key={snapshot.expert.id}
                className={`rounded-[1.4rem] border p-4 ${
                  winner
                    ? "border-brand-green/40 bg-brand-green/10"
                    : compare.winner === "tie"
                      ? "border-white/10 bg-white/5"
                      : "border-brand-red/30 bg-brand-red/10"
                }`}
              >
                <p className="font-display text-2xl uppercase text-white">{snapshot.expert.displayName}</p>
                <p className="mt-1 text-sm text-white/60">Based on {snapshot.resolvedCount} resolved predictions</p>
                <div className="mt-5 flex items-end gap-3">
                  <strong className="font-display text-6xl leading-none text-white">{snapshot.ayreScore}</strong>
                  <span className="pb-1 font-mono text-xs uppercase tracking-[0.28em] text-white/45">Score v1.0</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="rounded-[1.2rem] border border-white/10 bg-white/3 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">Representative call</p>
          <p className="mt-2 font-display text-2xl uppercase text-white">{compare.representativeCall}</p>
          <p className="mt-2 text-sm text-white/60">Score delta: {compare.scoreDelta} points.</p>
        </div>
        <Link
          href={`/compare/${compare.pair}`}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-white/70"
        >
          Open compare card
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

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
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
      {priorityLabel ? (
        <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.22em] text-brand-green">{priorityLabel}</p>
      ) : null}
      <div className="space-y-5">
        <p className="font-display text-2xl font-extrabold leading-[1.05] tracking-[-0.02em] text-[var(--text)] md:text-3xl">
          {compareTitle(compare)}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[compare.left, compare.right].map((snapshot, index) => {
            const winner = index === 0 ? leftWinner : rightWinner;
            const loser = !winner && compare.winner !== "tie";
            return (
              <div
                key={snapshot.expert.id}
                className={`rounded-lg border p-4 transition ${
                  winner ? "ayre-winner" : loser ? "ayre-loser" : "ayre-neutral"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-sm font-bold tracking-[-0.01em] text-[var(--text)]">{snapshot.expert.displayName}</p>
                    <p className="mt-0.5 text-[11px] text-[var(--muted)]">{snapshot.resolvedCount} resolved</p>
                  </div>
                  {winner ? (
                    <span className="rounded-full bg-brand-green px-2 py-0.5 font-mono text-[7px] uppercase tracking-[0.14em] text-white">
                      Winner
                    </span>
                  ) : null}
                </div>
                <div className="mt-4">
                  <strong
                    className={`ayre-score-hover inline-block font-display text-6xl font-extrabold leading-none tracking-[-0.05em] ${
                      winner ? "text-brand-green" : loser ? "ayre-loser-score text-[var(--dim)]" : "text-[var(--text)]"
                    }`}
                  >
                    {snapshot.ayreScore}
                  </strong>
                  <span className="ml-2 font-mono text-[8px] uppercase tracking-[0.16em] text-[var(--dim)]">v1.0</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
          <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-[var(--dim)]">Representative call</p>
          <p className="mt-1.5 font-serif text-lg italic text-[var(--text)]">{compare.representativeCall}</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-brand-green/10 px-2.5 py-1 font-mono text-[10px] font-bold text-brand-green">
              {compare.scoreDelta}pt delta
            </span>
          </div>
        </div>
        <Link
          href={`/compare/${compare.pair}`}
          className="ayre-link inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--muted)] transition hover:text-brand-green"
        >
          Full comparison
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}

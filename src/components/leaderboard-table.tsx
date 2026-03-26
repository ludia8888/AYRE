import Link from "next/link";

import { ScoreChip } from "@/components/score-chip";
import { formatPercent } from "@/lib/formatting";
import type { LeaderboardSection } from "@/lib/types";

export function LeaderboardTable({ section, limit }: { section: LeaderboardSection; limit?: number }) {
  const rows = typeof limit === "number" ? section.rows.slice(0, limit) : section.rows;

  return (
    <div className="ayre-panel overflow-hidden">
      <div className="border-b border-[var(--border)] px-5 py-4 md:px-6">
        <p className="font-display text-lg font-extrabold tracking-[-0.02em] text-[var(--text)]">{section.title}</p>
        <p className="mt-0.5 text-xs text-[var(--muted)]">{section.description}</p>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {rows.map((snapshot, index) => (
          <Link
            key={snapshot.expert.id}
            href={`/experts/${snapshot.expert.slug}`}
            className={`ayre-accent-left group grid gap-4 px-5 py-4 transition hover:bg-[var(--bg)] md:grid-cols-[56px_1.2fr_0.8fr_160px] md:items-center md:px-6 ${index === 0 ? "bg-brand-green/[0.03]" : ""}`}
          >
            <div className={`font-display text-[2.5rem] font-extrabold leading-none tracking-[-0.05em] transition ${index === 0 ? "text-brand-green/25 group-hover:text-brand-green/50" : "text-[var(--bg-elevated)] group-hover:text-brand-green/30"}`}>
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="space-y-0.5">
              <p className="font-display text-base font-bold tracking-[-0.01em] text-[var(--text)]">{snapshot.expert.displayName}</p>
              <p className="text-xs text-[var(--muted)]">{snapshot.expert.headline}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--dim)]">Accuracy</p>
                <p className="mt-0.5 font-display text-lg font-bold tracking-[-0.02em] text-[var(--text)]">{formatPercent(snapshot.accuracy, 1)}</p>
              </div>
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--dim)]">Resolved</p>
                <p className="mt-0.5 font-display text-lg font-bold tracking-[-0.02em] text-[var(--text)]">{snapshot.resolvedCount}</p>
              </div>
            </div>
            <div className="md:justify-self-end">
              <ScoreChip snapshot={snapshot} compact />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

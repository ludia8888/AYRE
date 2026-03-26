import Link from "next/link";

import { ScoreChip } from "@/components/score-chip";
import { formatPercent } from "@/lib/formatting";
import type { LeaderboardSection } from "@/lib/types";

export function LeaderboardTable({ section, limit }: { section: LeaderboardSection; limit?: number }) {
  const rows = typeof limit === "number" ? section.rows.slice(0, limit) : section.rows;

  return (
    <div className="ayre-panel overflow-hidden">
      <div className="border-b border-white/10 px-5 py-4 md:px-6">
        <p className="font-display text-3xl uppercase text-white">{section.title}</p>
        <p className="mt-1 text-sm text-white/58">{section.description}</p>
      </div>
      <div className="divide-y divide-white/8">
        {rows.map((snapshot, index) => (
          <Link
            key={snapshot.expert.id}
            href={`/experts/${snapshot.expert.slug}`}
            className="grid gap-5 px-5 py-5 transition hover:bg-white/3 md:grid-cols-[40px_1.2fr_0.8fr_200px] md:px-6"
          >
            <div className="font-mono text-sm uppercase tracking-[0.28em] text-white/35">#{index + 1}</div>
            <div className="space-y-1">
              <p className="font-display text-2xl uppercase text-white">{snapshot.expert.displayName}</p>
              <p className="text-sm text-white/55">{snapshot.expert.headline}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">Accuracy</p>
                <p className="mt-1 text-lg text-white">{formatPercent(snapshot.accuracy, 1)}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">Resolved</p>
                <p className="mt-1 text-lg text-white">{snapshot.resolvedCount}</p>
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

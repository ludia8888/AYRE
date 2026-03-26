import clsx from "clsx";

import type { ExpertSnapshot } from "@/lib/types";

export function ScoreChip({ snapshot, compact = false }: { snapshot: ExpertSnapshot; compact?: boolean }) {
  return (
    <div
      className={clsx(
        "rounded-2xl border px-3 py-2",
        snapshot.ayreScore >= 70
          ? "border-brand-green/40 bg-brand-green/10"
          : snapshot.ayreScore <= 45
            ? "border-brand-red/40 bg-brand-red/10"
            : "border-white/10 bg-white/5",
      )}
    >
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">AYRE</span>
        {snapshot.provisional ? (
          <span className="rounded-full border border-brand-yellow/30 bg-[rgba(255,202,82,0.12)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--brand-yellow)]">
            Provisional
          </span>
        ) : null}
      </div>
      <div className="mt-1 flex items-end gap-2">
        <strong className="font-display text-4xl leading-none text-white">{snapshot.ayreScore}</strong>
        {!compact ? <span className="pb-1 text-xs text-white/45">Based on {snapshot.resolvedCount}</span> : null}
      </div>
      {!compact ? <p className="mt-1 text-xs text-white/55">Score v{snapshot.scoreVersion.replace("v", "")}</p> : null}
    </div>
  );
}

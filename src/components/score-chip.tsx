import clsx from "clsx";

import type { ExpertSnapshot } from "@/lib/types";

export function ScoreChip({ snapshot, compact = false }: { snapshot: ExpertSnapshot; compact?: boolean }) {
  const isGood = snapshot.ayreScore >= 70;
  const isBad = snapshot.ayreScore <= 45;

  return (
    <div
      className={clsx(
        "ayre-score-hover rounded-lg border px-4 py-3 transition",
        isGood ? "ayre-winner" : isBad ? "ayre-loser" : "ayre-neutral",
      )}
    >
      <div className="flex items-center gap-2">
        <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-[var(--muted)]">AYRE</span>
        {snapshot.provisional ? (
          <span className="rounded border border-[var(--brand-yellow)]/20 bg-[rgba(184,134,11,0.06)] px-1.5 py-px font-mono text-[7px] uppercase tracking-[0.12em] text-[var(--brand-yellow)]">
            Prov
          </span>
        ) : null}
      </div>
      <div className="mt-1 flex items-end gap-1.5">
        <strong
          className={clsx(
            "font-display leading-none tracking-[-0.04em]",
            compact ? "text-3xl font-extrabold" : "text-[3.5rem] font-extrabold",
            isGood ? "text-brand-green" : isBad ? "text-brand-red" : "text-[var(--text)]",
          )}
        >
          {snapshot.ayreScore}
        </strong>
        {!compact ? (
          <span className="pb-1 font-mono text-[9px] text-[var(--dim)]">/{snapshot.resolvedCount}</span>
        ) : null}
      </div>
      {!compact ? (
        <p className="mt-0.5 font-mono text-[8px] tracking-[0.14em] text-[var(--dim)]">
          SCORE V{snapshot.scoreVersion.replace("v", "")}
        </p>
      ) : null}
    </div>
  );
}

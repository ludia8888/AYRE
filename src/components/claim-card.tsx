import Link from "next/link";

import {
  formatClaimStatus,
  formatDate,
  formatPredictionDirection,
  formatPercent,
  formatResolutionStage,
  formatSettlementPolicy,
} from "@/lib/formatting";
import type { Claim, ResolvedClaimRecord, SourceDocument } from "@/lib/types";

export function ClaimCard({
  record,
  source,
}: {
  record: ResolvedClaimRecord | Claim;
  source?: SourceDocument;
}) {
  const claim = "claim" in record ? record.claim : record;
  const resolvedRecord = "claim" in record ? record : undefined;

  return (
    <article className="ayre-panel space-y-4 p-5 transition hover:shadow-md">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded border border-[var(--border)] px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-[var(--muted)]">
          {formatClaimStatus(claim.status)}
        </span>
        <span
          className={`rounded border px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em] ${
            claim.predictedOutcome === "yes"
              ? "border-brand-green/30 bg-brand-green/5 text-brand-green"
              : "border-brand-red/20 bg-brand-red/5 text-brand-red"
          }`}
        >
          {formatPredictionDirection(claim)}
        </span>
        {claim.confidenceTier ? (
          <span className="rounded border border-[var(--border)] px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-[var(--dim)]">
            {claim.confidenceTier}
          </span>
        ) : null}
      </div>

      <div className="space-y-3">
        <p className="font-display text-xl font-bold leading-tight tracking-[-0.01em] text-[var(--text)]">{claim.eventLabel}</p>
        <blockquote className="relative rounded-lg bg-[var(--bg)] p-5">
          <span className="absolute -top-2 left-4 font-serif text-4xl leading-none text-brand-green/30">&ldquo;</span>
          <p className="font-serif text-[1.15rem] italic leading-[1.55] text-[var(--text-secondary)]">
            {claim.quotedText}
          </p>
        </blockquote>
      </div>

      <div className="grid gap-1.5 text-xs md:grid-cols-2">
        {[
          { label: "Published", value: formatDate(claim.publishedAt) },
          { label: "Deadline", value: formatDate(claim.deadline) },
          ...(resolvedRecord
            ? [
                { label: "Brier", value: resolvedRecord.brier.toFixed(3), bold: true },
                { label: "Probability", value: formatPercent(resolvedRecord.probability * 100, 0) },
                {
                  label: "Settlement",
                  value: `${formatSettlementPolicy(resolvedRecord.resolution.settlementPolicy)} • ${formatResolutionStage(resolvedRecord.resolution.settledStage)}`,
                  full: true,
                },
                ...(resolvedRecord.resolution.revisedValue
                  ? [
                      {
                        label: "Revision",
                        value: `${resolvedRecord.resolution.revisedValue}${resolvedRecord.resolution.revisedAt ? ` on ${formatDate(resolvedRecord.resolution.revisedAt)}` : ""}`,
                        full: true,
                      },
                    ]
                  : []),
              ]
            : []),
        ].map((item) => (
          <div
            key={item.label}
            className={`flex items-baseline justify-between rounded-md bg-[var(--bg)] px-3 py-2 ${"full" in item && item.full ? "md:col-span-2" : ""}`}
          >
            <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-[var(--dim)]">{item.label}</span>
            <span className={`${"bold" in item && item.bold ? "font-bold text-[var(--text)]" : "text-[var(--text-secondary)]"}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {resolvedRecord?.resolution.revisionNotes ? (
        <div className="rounded-md bg-[var(--bg)] p-3 font-serif text-sm italic text-[var(--text-secondary)]">
          {resolvedRecord.resolution.revisionNotes}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        {source ? (
          <Link
            href={source.url}
            target="_blank"
            className="ayre-link rounded-md border border-[var(--border)] px-3 py-1 font-mono text-[8px] uppercase tracking-[0.14em] text-[var(--muted)] transition hover:border-brand-green hover:text-brand-green"
          >
            Source
          </Link>
        ) : null}
        {resolvedRecord ? (
          <Link
            href={resolvedRecord.resolution.evidenceUrl}
            target="_blank"
            className="ayre-link rounded-md border border-[var(--border)] px-3 py-1 font-mono text-[8px] uppercase tracking-[0.14em] text-[var(--muted)] transition hover:border-brand-green hover:text-brand-green"
          >
            Evidence
          </Link>
        ) : null}
      </div>
    </article>
  );
}

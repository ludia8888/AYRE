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
    <article className="ayre-panel space-y-4 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-white/55">
          {formatClaimStatus(claim.status)}
        </span>
        <span
          className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.28em] ${
            claim.predictedOutcome === "yes"
              ? "border-brand-green/30 bg-brand-green/10 text-brand-green"
              : "border-brand-red/30 bg-brand-red/10 text-brand-red"
          }`}
        >
          Call: {formatPredictionDirection(claim)}
        </span>
        {claim.confidenceTier ? (
          <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
            {claim.confidenceTier} conviction
          </span>
        ) : null}
      </div>
      <div className="space-y-2">
        <p className="font-display text-3xl uppercase leading-none text-white">{claim.eventLabel}</p>
        <blockquote className="border-l border-white/10 pl-4 text-sm leading-6 text-white/72">“{claim.quotedText}”</blockquote>
      </div>
      <div className="grid gap-4 text-sm text-white/62 md:grid-cols-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">Published</p>
          <p>{formatDate(claim.publishedAt)}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">Deadline</p>
          <p>{formatDate(claim.deadline)}</p>
        </div>
        {resolvedRecord ? (
          <>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">Brier</p>
              <p>{resolvedRecord.brier.toFixed(3)}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">Probability of event</p>
              <p>{formatPercent(resolvedRecord.probability * 100, 0)}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">Settlement</p>
              <p>
                {formatSettlementPolicy(resolvedRecord.resolution.settlementPolicy)} •{" "}
                {formatResolutionStage(resolvedRecord.resolution.settledStage)}
              </p>
            </div>
            {resolvedRecord.resolution.revisedValue ? (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">Tracked revision</p>
                <p>
                  {resolvedRecord.resolution.revisedValue}
                  {resolvedRecord.resolution.revisedAt ? ` on ${formatDate(resolvedRecord.resolution.revisedAt)}` : ""}
                </p>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
      {resolvedRecord?.resolution.revisionNotes ? (
        <div className="rounded-2xl border border-white/10 bg-white/4 p-4 text-sm text-white/62">
          {resolvedRecord.resolution.revisionNotes}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/55">
        {source ? (
          <Link href={source.url} target="_blank" className="rounded-full border border-white/10 px-3 py-2 hover:border-white/20">
            Source link
          </Link>
        ) : null}
        {resolvedRecord ? (
          <Link
            href={resolvedRecord.resolution.evidenceUrl}
            target="_blank"
            className="rounded-full border border-white/10 px-3 py-2 hover:border-white/20"
          >
            Evidence link
          </Link>
        ) : null}
      </div>
    </article>
  );
}

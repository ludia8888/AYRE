"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { postJson } from "@/components/admin/request";
import { CLAIM_TYPES, CONFIDENCE_TIERS } from "@/lib/types";
import type { Claim, Expert, SourceDocument } from "@/lib/types";

function ClaimWorkflowEditor({
  claim,
  expertLabel,
  sourceLabel,
}: {
  claim: Claim;
  expertLabel: string;
  sourceLabel: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<{
    id: string;
    status: string;
    confidenceTier: string;
    explicitProbability: string;
    tierAssignmentReason: string;
    rejectionReason: string;
    reviewedBy: string;
  }>({
    id: claim.id,
    status: claim.status === "resolved" ? "published_open" : claim.status,
    confidenceTier: claim.confidenceTier ?? "",
    explicitProbability: claim.explicitProbability?.toString() ?? "",
    tierAssignmentReason: claim.tierAssignmentReason ?? "",
    rejectionReason: claim.rejectionReason ?? "",
    reviewedBy: claim.reviewedBy ?? "ops-admin",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSave() {
    try {
      setPending(true);
      setStatus(null);
      await postJson("/api/admin/claims", {
        intent: "update",
        id: form.id,
        status: form.status,
        confidenceTier: form.confidenceTier || undefined,
        explicitProbability: form.explicitProbability ? Number(form.explicitProbability) : undefined,
        tierAssignmentReason: form.tierAssignmentReason || undefined,
        rejectionReason: form.rejectionReason || undefined,
        reviewedBy: form.reviewedBy || undefined,
      });
      setStatus("Saved.");
      startTransition(() => router.refresh());
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-2xl uppercase text-white">{claim.eventLabel}</p>
          <p className="mt-1 text-sm text-white/55">
            {expertLabel} • {sourceLabel}
          </p>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">{claim.status}</span>
      </div>
      <p className="mt-3 text-sm text-white/62">{claim.quotedText}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <select className="ayre-input" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
          <option value="review">review</option>
          <option value="published_open">published_open</option>
          <option value="published_awaiting_data">published_awaiting_data</option>
          <option value="rejected_unscoreable">rejected_unscoreable</option>
        </select>
        <select className="ayre-input" value={form.confidenceTier} onChange={(event) => setForm({ ...form, confidenceTier: event.target.value })}>
          <option value="">No tier</option>
          {CONFIDENCE_TIERS.map((tier) => (
            <option key={tier} value={tier}>
              {tier}
            </option>
          ))}
        </select>
        <input
          className="ayre-input"
          placeholder="Explicit probability"
          value={form.explicitProbability}
          onChange={(event) => setForm({ ...form, explicitProbability: event.target.value })}
        />
        <input className="ayre-input" placeholder="Reviewed by" value={form.reviewedBy} onChange={(event) => setForm({ ...form, reviewedBy: event.target.value })} />
        <input className="ayre-input" placeholder="Rejection reason" value={form.rejectionReason} onChange={(event) => setForm({ ...form, rejectionReason: event.target.value })} />
      </div>
      <textarea
        className="ayre-input mt-3 min-h-24"
        placeholder="Tier assignment reason"
        value={form.tierAssignmentReason}
        onChange={(event) => setForm({ ...form, tierAssignmentReason: event.target.value })}
      />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" className="ayre-button ayre-button-primary" disabled={pending} onClick={handleSave}>
          {pending ? "Saving..." : "Save workflow"}
        </button>
        {status ? <p className="text-sm text-white/62">{status}</p> : null}
      </div>
    </div>
  );
}

export function ClaimsManager({
  experts,
  claims,
  sourceDocuments,
}: {
  experts: Expert[];
  claims: Claim[];
  sourceDocuments: SourceDocument[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<{
    expertId: string;
    sourceTitle: string;
    sourcePlatform: string;
    sourceUrl: string;
    publishedAt: string;
    eventLabel: string;
    eventKey: string;
    quotedText: string;
    claimType: string;
    predictedOutcome: string;
    deadline: string;
    metricKey: string;
    metricLabel: string;
    operator: string;
    threshold: string;
    unit: string;
    status: string;
    confidenceTier: string;
    explicitProbability: string;
    tierAssignmentReason: string;
    rejectionReason: string;
  }>({
    expertId: experts[0]?.id ?? "",
    sourceTitle: "",
    sourcePlatform: "",
    sourceUrl: "",
    publishedAt: new Date().toISOString().slice(0, 16),
    eventLabel: "",
    eventKey: "",
    quotedText: "",
    claimType: CLAIM_TYPES[0],
    predictedOutcome: "yes",
    deadline: "",
    metricKey: "",
    metricLabel: "",
    operator: "",
    threshold: "",
    unit: "",
    status: "review",
    confidenceTier: "",
    explicitProbability: "",
    tierAssignmentReason: "",
    rejectionReason: "",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const sourceById = Object.fromEntries(sourceDocuments.map((source) => [source.id, source]));
  const expertById = Object.fromEntries(experts.map((expert) => [expert.id, expert]));

  const orderedClaims = [...claims].sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));

  async function handleCreate() {
    try {
      setPending(true);
      setStatus(null);
      await postJson("/api/admin/claims", {
        intent: "create",
        expertId: form.expertId,
        sourceTitle: form.sourceTitle,
        sourcePlatform: form.sourcePlatform || undefined,
        sourceUrl: form.sourceUrl,
        publishedAt: new Date(form.publishedAt).toISOString(),
        eventLabel: form.eventLabel,
        eventKey: form.eventKey || undefined,
        quotedText: form.quotedText,
        claimType: form.claimType,
        predictedOutcome: form.predictedOutcome,
        deadline: new Date(form.deadline).toISOString(),
        metricKey: form.metricKey,
        metricLabel: form.metricLabel,
        operator: form.operator,
        threshold: form.threshold ? Number(form.threshold) : undefined,
        unit: form.unit,
        status: form.status,
        confidenceTier: form.confidenceTier || undefined,
        explicitProbability: form.explicitProbability ? Number(form.explicitProbability) : undefined,
        tierAssignmentReason: form.tierAssignmentReason || undefined,
        rejectionReason: form.rejectionReason || undefined,
      });
      setStatus("Claim draft created.");
      startTransition(() => router.refresh());
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Create failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="ayre-panel p-5">
        <p className="font-display text-3xl uppercase text-white">Create manual claim</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <select className="ayre-input" value={form.expertId} onChange={(event) => setForm({ ...form, expertId: event.target.value })}>
            {experts.map((expert) => (
              <option key={expert.id} value={expert.id}>
                {expert.displayName}
              </option>
            ))}
          </select>
          <input className="ayre-input" placeholder="Source title" value={form.sourceTitle} onChange={(event) => setForm({ ...form, sourceTitle: event.target.value })} />
          <input className="ayre-input" placeholder="Source platform" value={form.sourcePlatform} onChange={(event) => setForm({ ...form, sourcePlatform: event.target.value })} />
          <input className="ayre-input" placeholder="Source URL" value={form.sourceUrl} onChange={(event) => setForm({ ...form, sourceUrl: event.target.value })} />
          <input className="ayre-input" type="datetime-local" value={form.publishedAt} onChange={(event) => setForm({ ...form, publishedAt: event.target.value })} />
          <input className="ayre-input" type="datetime-local" value={form.deadline} onChange={(event) => setForm({ ...form, deadline: event.target.value })} />
          <select className="ayre-input" value={form.claimType} onChange={(event) => setForm({ ...form, claimType: event.target.value })}>
            {CLAIM_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select className="ayre-input" value={form.predictedOutcome} onChange={(event) => setForm({ ...form, predictedOutcome: event.target.value })}>
            <option value="yes">yes</option>
            <option value="no">no</option>
          </select>
        </div>
        <input className="ayre-input mt-3" placeholder="Event label" value={form.eventLabel} onChange={(event) => setForm({ ...form, eventLabel: event.target.value })} />
        <input className="ayre-input mt-3" placeholder="Event key (optional)" value={form.eventKey} onChange={(event) => setForm({ ...form, eventKey: event.target.value })} />
        <textarea className="ayre-input mt-3 min-h-28" placeholder="Quoted text" value={form.quotedText} onChange={(event) => setForm({ ...form, quotedText: event.target.value })} />
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <input className="ayre-input" placeholder="Metric key" value={form.metricKey} onChange={(event) => setForm({ ...form, metricKey: event.target.value })} />
          <input className="ayre-input" placeholder="Metric label" value={form.metricLabel} onChange={(event) => setForm({ ...form, metricLabel: event.target.value })} />
          <input className="ayre-input" placeholder="Operator" value={form.operator} onChange={(event) => setForm({ ...form, operator: event.target.value })} />
          <input className="ayre-input" placeholder="Threshold" value={form.threshold} onChange={(event) => setForm({ ...form, threshold: event.target.value })} />
          <input className="ayre-input" placeholder="Unit" value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })} />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <select className="ayre-input" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            <option value="review">review</option>
            <option value="published_open">published_open</option>
            <option value="published_awaiting_data">published_awaiting_data</option>
            <option value="rejected_unscoreable">rejected_unscoreable</option>
          </select>
          <select className="ayre-input" value={form.confidenceTier} onChange={(event) => setForm({ ...form, confidenceTier: event.target.value })}>
            <option value="">No tier</option>
            {CONFIDENCE_TIERS.map((tier) => (
              <option key={tier} value={tier}>
                {tier}
              </option>
            ))}
          </select>
          <input className="ayre-input" placeholder="Explicit probability" value={form.explicitProbability} onChange={(event) => setForm({ ...form, explicitProbability: event.target.value })} />
          <input className="ayre-input" placeholder="Rejection reason" value={form.rejectionReason} onChange={(event) => setForm({ ...form, rejectionReason: event.target.value })} />
        </div>
        <textarea className="ayre-input mt-3 min-h-24" placeholder="Tier assignment reason" value={form.tierAssignmentReason} onChange={(event) => setForm({ ...form, tierAssignmentReason: event.target.value })} />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" className="ayre-button ayre-button-primary" disabled={pending} onClick={handleCreate}>
            {pending ? "Creating..." : "Create claim"}
          </button>
          {status ? <p className="text-sm text-white/62">{status}</p> : null}
        </div>
      </div>

      <div className="ayre-panel p-5">
        <p className="font-display text-3xl uppercase text-white">Workflow queue</p>
        <div className="mt-4 grid gap-3">
          {orderedClaims.map((claim) => (
            <ClaimWorkflowEditor
              key={claim.id}
              claim={claim}
              expertLabel={expertById[claim.expertId]?.displayName ?? claim.expertId}
              sourceLabel={sourceById[claim.sourceDocumentId]?.title ?? claim.sourceDocumentId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

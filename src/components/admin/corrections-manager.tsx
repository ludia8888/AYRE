"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { postJson } from "@/components/admin/request";
import type { Claim, CorrectionRequest, Expert } from "@/lib/types";

function CorrectionEditor({
  request,
  claims,
}: {
  request: CorrectionRequest;
  claims: Claim[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<{
    id: string;
    expertSlug: string;
    claimId: string;
    status: string;
    summary: string;
    linkedClaimStatus: string;
  }>({
    id: request.id,
    expertSlug: request.expertSlug,
    claimId: request.claimId ?? "",
    status: request.status,
    summary: request.summary,
    linkedClaimStatus: "",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSave() {
    try {
      setPending(true);
      setStatus(null);
      await postJson("/api/admin/corrections", {
        ...form,
        claimId: form.claimId || undefined,
        linkedClaimStatus: form.linkedClaimStatus || undefined,
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
        <p className="font-display text-2xl uppercase text-white">{form.expertSlug.replaceAll("-", " ")}</p>
        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">{request.submittedAt.slice(0, 10)}</span>
      </div>
      <textarea className="ayre-input mt-3 min-h-24" value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} />
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <select className="ayre-input" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
          <option value="pending_review">pending_review</option>
          <option value="temporarily_unpublished">temporarily_unpublished</option>
          <option value="corrected">corrected</option>
          <option value="rejected">rejected</option>
        </select>
        <select className="ayre-input" value={form.claimId} onChange={(event) => setForm({ ...form, claimId: event.target.value })}>
          <option value="">No linked claim</option>
          {claims.map((claim) => (
            <option key={claim.id} value={claim.id}>
              {claim.eventLabel}
            </option>
          ))}
        </select>
        <select className="ayre-input" value={form.linkedClaimStatus} onChange={(event) => setForm({ ...form, linkedClaimStatus: event.target.value })}>
          <option value="">Do not change claim</option>
          <option value="review">move to review</option>
          <option value="published_open">restore published_open</option>
          <option value="published_awaiting_data">restore published_awaiting_data</option>
          <option value="rejected_unscoreable">mark rejected_unscoreable</option>
        </select>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" className="ayre-button ayre-button-primary" disabled={pending} onClick={handleSave}>
          {pending ? "Saving..." : "Save correction"}
        </button>
        {status ? <p className="text-sm text-white/62">{status}</p> : null}
      </div>
    </div>
  );
}

export function CorrectionsManager({
  requests,
  experts,
  claims,
}: {
  requests: CorrectionRequest[];
  experts: Expert[];
  claims: Claim[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<{
    expertSlug: string;
    claimId: string;
    status: string;
    summary: string;
    linkedClaimStatus: string;
  }>({
    expertSlug: experts[0]?.slug ?? "",
    claimId: "",
    status: "pending_review",
    summary: "",
    linkedClaimStatus: "",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleCreate() {
    try {
      setPending(true);
      setStatus(null);
      await postJson("/api/admin/corrections", {
        ...form,
        claimId: form.claimId || undefined,
        linkedClaimStatus: form.linkedClaimStatus || undefined,
      });
      setForm({
        expertSlug: experts[0]?.slug ?? "",
        claimId: "",
        status: "pending_review",
        summary: "",
        linkedClaimStatus: "",
      });
      setStatus("Correction request created.");
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
        <p className="font-display text-3xl uppercase text-white">Create correction request</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <select className="ayre-input" value={form.expertSlug} onChange={(event) => setForm({ ...form, expertSlug: event.target.value })}>
            {experts.map((expert) => (
              <option key={expert.slug} value={expert.slug}>
                {expert.displayName}
              </option>
            ))}
          </select>
          <select className="ayre-input" value={form.claimId} onChange={(event) => setForm({ ...form, claimId: event.target.value })}>
            <option value="">No linked claim</option>
            {claims.map((claim) => (
              <option key={claim.id} value={claim.id}>
                {claim.eventLabel}
              </option>
            ))}
          </select>
          <select className="ayre-input" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            <option value="pending_review">pending_review</option>
            <option value="temporarily_unpublished">temporarily_unpublished</option>
            <option value="corrected">corrected</option>
            <option value="rejected">rejected</option>
          </select>
          <select className="ayre-input" value={form.linkedClaimStatus} onChange={(event) => setForm({ ...form, linkedClaimStatus: event.target.value })}>
            <option value="">Do not change claim</option>
            <option value="review">move linked claim to review</option>
            <option value="published_open">restore published_open</option>
            <option value="published_awaiting_data">restore published_awaiting_data</option>
            <option value="rejected_unscoreable">mark rejected_unscoreable</option>
          </select>
        </div>
        <textarea className="ayre-input mt-3 min-h-28" placeholder="Summary" value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" className="ayre-button ayre-button-primary" disabled={pending} onClick={handleCreate}>
            {pending ? "Creating..." : "Create correction"}
          </button>
          {status ? <p className="text-sm text-white/62">{status}</p> : null}
        </div>
      </div>

      <div className="ayre-panel p-5">
        <p className="font-display text-3xl uppercase text-white">Existing requests</p>
        <div className="mt-4 grid gap-3">
          {requests.map((request) => (
            <CorrectionEditor key={request.id} request={request} claims={claims} />
          ))}
        </div>
      </div>
    </div>
  );
}

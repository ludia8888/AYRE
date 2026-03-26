"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { postJson } from "@/components/admin/request";
import type { Claim, Expert, Resolution } from "@/lib/types";

export function ResolutionsManager({
  claims,
  experts,
  resolutions,
}: {
  claims: Claim[];
  experts: Expert[];
  resolutions: Resolution[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<{
    claimId: string;
    outcome: string;
    actualValue: string;
    evidenceUrl: string;
    resolvedAt: string;
    settlementPolicy: string;
    settledStage: string;
    officialReleaseDate: string;
    initialReleaseValue: string;
    initialReleaseAt: string;
    revisedValue: string;
    revisedAt: string;
    revisionHandling: string;
    revisionNotes: string;
    reviewerId: string;
    reviewerName: string;
    notes: string;
  }>({
    claimId: claims[0]?.id ?? "",
    outcome: "yes",
    actualValue: "",
    evidenceUrl: "",
    resolvedAt: new Date().toISOString().slice(0, 16),
    settlementPolicy: "first_official_release",
    settledStage: "official_preliminary",
    officialReleaseDate: "",
    initialReleaseValue: "",
    initialReleaseAt: "",
    revisedValue: "",
    revisedAt: "",
    revisionHandling: "tracked_no_rescore",
    revisionNotes: "",
    reviewerId: "ops-admin",
    reviewerName: "AYRE Ops",
    notes: "",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const orderedClaims = [...claims].sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
  const claimById = Object.fromEntries(claims.map((claim) => [claim.id, claim]));
  const expertById = Object.fromEntries(experts.map((expert) => [expert.id, expert]));
  const orderedResolutions = [...resolutions].sort((left, right) => right.resolvedAt.localeCompare(left.resolvedAt));

  async function handleSave() {
    try {
      setPending(true);
      setStatus(null);
      await postJson("/api/admin/resolutions", {
        ...form,
        resolvedAt: new Date(form.resolvedAt).toISOString(),
        officialReleaseDate: form.officialReleaseDate || undefined,
        initialReleaseAt: form.initialReleaseAt ? new Date(form.initialReleaseAt).toISOString() : undefined,
        revisedAt: form.revisedAt ? new Date(form.revisedAt).toISOString() : undefined,
        initialReleaseValue: form.initialReleaseValue || undefined,
        revisedValue: form.revisedValue || undefined,
        revisionNotes: form.revisionNotes || undefined,
      });
      setStatus("Resolution saved.");
      startTransition(() => router.refresh());
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Resolution save failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="ayre-panel p-5">
        <p className="font-display text-3xl uppercase text-white">Upsert resolution</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <select className="ayre-input" value={form.claimId} onChange={(event) => setForm({ ...form, claimId: event.target.value })}>
            {orderedClaims.map((claim) => (
              <option key={claim.id} value={claim.id}>
                {(expertById[claim.expertId]?.displayName ?? "Unknown").replace(/\s+/g, " ")} • {claim.eventLabel}
              </option>
            ))}
          </select>
          <select className="ayre-input" value={form.outcome} onChange={(event) => setForm({ ...form, outcome: event.target.value })}>
            <option value="yes">yes</option>
            <option value="no">no</option>
          </select>
          <select className="ayre-input" value={form.settlementPolicy} onChange={(event) => setForm({ ...form, settlementPolicy: event.target.value })}>
            <option value="first_official_release">first_official_release</option>
            <option value="latest_official_revision">latest_official_revision</option>
          </select>
          <select className="ayre-input" value={form.settledStage} onChange={(event) => setForm({ ...form, settledStage: event.target.value })}>
            <option value="official_preliminary">official_preliminary</option>
            <option value="official_revised">official_revised</option>
            <option value="official_final">official_final</option>
            <option value="market_close">market_close</option>
          </select>
          <input className="ayre-input" placeholder="Actual value" value={form.actualValue} onChange={(event) => setForm({ ...form, actualValue: event.target.value })} />
          <input className="ayre-input" placeholder="Evidence URL" value={form.evidenceUrl} onChange={(event) => setForm({ ...form, evidenceUrl: event.target.value })} />
          <input className="ayre-input" type="datetime-local" value={form.resolvedAt} onChange={(event) => setForm({ ...form, resolvedAt: event.target.value })} />
          <input className="ayre-input" type="date" value={form.officialReleaseDate} onChange={(event) => setForm({ ...form, officialReleaseDate: event.target.value })} />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input className="ayre-input" placeholder="Initial release value" value={form.initialReleaseValue} onChange={(event) => setForm({ ...form, initialReleaseValue: event.target.value })} />
          <input className="ayre-input" type="datetime-local" value={form.initialReleaseAt} onChange={(event) => setForm({ ...form, initialReleaseAt: event.target.value })} />
          <input className="ayre-input" placeholder="Revised value" value={form.revisedValue} onChange={(event) => setForm({ ...form, revisedValue: event.target.value })} />
          <input className="ayre-input" type="datetime-local" value={form.revisedAt} onChange={(event) => setForm({ ...form, revisedAt: event.target.value })} />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <select className="ayre-input" value={form.revisionHandling} onChange={(event) => setForm({ ...form, revisionHandling: event.target.value })}>
            <option value="tracked_no_rescore">tracked_no_rescore</option>
            <option value="retroactive_rescore">retroactive_rescore</option>
          </select>
          <input className="ayre-input" placeholder="Reviewer ID" value={form.reviewerId} onChange={(event) => setForm({ ...form, reviewerId: event.target.value })} />
          <input className="ayre-input" placeholder="Reviewer name" value={form.reviewerName} onChange={(event) => setForm({ ...form, reviewerName: event.target.value })} />
        </div>
        <textarea className="ayre-input mt-3 min-h-24" placeholder="Revision notes" value={form.revisionNotes} onChange={(event) => setForm({ ...form, revisionNotes: event.target.value })} />
        <textarea className="ayre-input mt-3 min-h-24" placeholder="Operator notes" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" className="ayre-button ayre-button-primary" disabled={pending} onClick={handleSave}>
            {pending ? "Saving..." : "Save resolution"}
          </button>
          {status ? <p className="text-sm text-white/62">{status}</p> : null}
        </div>
      </div>

      <div className="ayre-panel p-5">
        <p className="font-display text-3xl uppercase text-white">Recent resolutions</p>
        <div className="mt-4 grid gap-3">
          {orderedResolutions.map((resolution) => {
            const claim = claimById[resolution.claimId];
            const expert = claim ? expertById[claim.expertId] : undefined;

            return (
              <div key={resolution.id} className="rounded-2xl border border-white/10 bg-white/4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-display text-2xl uppercase text-white">{claim?.eventLabel ?? resolution.claimId}</p>
                  <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">{resolution.outcome}</span>
                </div>
                <p className="mt-2 text-sm text-white/58">{expert?.displayName ?? "Unknown expert"} • {resolution.actualValue}</p>
                <p className="mt-2 text-sm text-white/62">{resolution.notes}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

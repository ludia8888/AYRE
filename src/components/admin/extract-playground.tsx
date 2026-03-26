"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { postJson } from "@/components/admin/request";
import { CLAIM_TYPES, CONFIDENCE_TIERS } from "@/lib/types";
import type { ExtractedClaimCandidate, ExtractSourcePreview } from "@/lib/types";
import type { Expert } from "@/lib/types";

const sampleText = `I expect three rate cuts in 2024, with the first coming in Q3.
I strongly believe recession is coming by Q2 2025.
There's a risk the 10-year ends the year below 3.5%.`;

export function ExtractPlayground({ experts }: { experts: Expert[] }) {
  const router = useRouter();
  const [mode, setMode] = useState<"text" | "url">("text");
  const [payload, setPayload] = useState(sampleText);
  const [sourceUrl, setSourceUrl] = useState("https://example.com");
  const [expertId, setExpertId] = useState(experts[0]?.id ?? "");
  const [sourceTitle, setSourceTitle] = useState("");
  const [sourcePlatform, setSourcePlatform] = useState("");
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().slice(0, 16));
  const [rows, setRows] = useState<ExtractedClaimCandidate[]>([]);
  const [preview, setPreview] = useState<ExtractSourcePreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleExtract() {
    try {
      setError(null);
      setStatus(null);
      const data = await postJson<{
        rows?: ExtractedClaimCandidate[];
        preview?: ExtractSourcePreview;
      }>("/api/admin/extract", {
        intent: "preview",
        ...(mode === "url" ? { sourceUrl } : { payload }),
      });

      setRows(data.rows ?? []);
      setPreview(data.preview ?? null);
      if (data.preview?.sourceTitle) {
        setSourceTitle(data.preview.sourceTitle);
      }
      if (data.preview?.sourceUrl) {
        try {
          setSourcePlatform(new URL(data.preview.sourceUrl).hostname.replace(/^www\./, ""));
        } catch {
          setSourcePlatform("");
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Extraction failed.");
    }
  }

  function updateApprovalStatus(id: string, approvalStatus: "approved" | "rejected") {
    setRows((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              approvalStatus,
              operatorOverride: approvalStatus !== "approved",
              overrideReason: approvalStatus === "rejected" ? "Operator rejected the candidate after review." : row.overrideReason,
            }
          : row,
      ),
    );
  }

  function updateCandidate(id: string, patch: Partial<ExtractedClaimCandidate>) {
    setRows((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              ...patch,
              operatorOverride: true,
            }
          : row,
      ),
    );
  }

  async function handleCommit() {
    try {
      setPending(true);
      setError(null);
      setStatus(null);
      const result = await postJson<{ createdClaims: number }>("/api/admin/extract", {
        intent: "commit",
        expertId,
        sourceUrl: mode === "url" ? sourceUrl : undefined,
        sourceTitle: sourceTitle || "Operator extract draft",
        sourcePlatform: sourcePlatform || undefined,
        publishedAt: new Date(publishedAt).toISOString(),
        candidates: rows,
      });
      setStatus(`${result.createdClaims} review drafts created from approved candidates.`);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Commit failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_0.95fr]">
      <div className="ayre-panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-display text-3xl uppercase text-white">Source intake</p>
          <div className="flex gap-2 font-mono text-[11px] uppercase tracking-[0.2em]">
            <button
              type="button"
              className={`rounded-full border px-3 py-2 ${mode === "text" ? "border-brand-green/35 bg-brand-green/10 text-brand-green" : "border-white/10 text-white/55"}`}
              onClick={() => setMode("text")}
            >
              Paste text
            </button>
            <button
              type="button"
              className={`rounded-full border px-3 py-2 ${mode === "url" ? "border-brand-green/35 bg-brand-green/10 text-brand-green" : "border-white/10 text-white/55"}`}
              onClick={() => setMode("url")}
            >
              Source URL
            </button>
          </div>
        </div>
        {mode === "url" ? (
          <input className="ayre-input mt-4" value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} />
        ) : (
          <textarea className="ayre-input mt-4 min-h-72" value={payload} onChange={(event) => setPayload(event.target.value)} />
        )}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <select className="ayre-input" value={expertId} onChange={(event) => setExpertId(event.target.value)}>
            {experts.map((expert) => (
              <option key={expert.id} value={expert.id}>
                {expert.displayName}
              </option>
            ))}
          </select>
          <input className="ayre-input" type="datetime-local" value={publishedAt} onChange={(event) => setPublishedAt(event.target.value)} />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <input className="ayre-input" placeholder="Source title" value={sourceTitle} onChange={(event) => setSourceTitle(event.target.value)} />
          <input className="ayre-input" placeholder="Source platform" value={sourcePlatform} onChange={(event) => setSourcePlatform(event.target.value)} />
        </div>
        <button type="button" className="ayre-button ayre-button-primary mt-4" onClick={handleExtract}>
          {mode === "url" ? "Fetch + extract in one step" : "Extract candidates"}
        </button>
        {error ? <p className="mt-3 text-sm text-brand-red">{error}</p> : null}
        {status ? <p className="mt-3 text-sm text-brand-green">{status}</p> : null}
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/4 p-4 text-sm text-white/62">
          URL mode is the Phase 1 bottleneck reducer: source link in, page fetch + parse + extract out, operator only approves or rejects the final candidate list.
        </div>
      </div>
      <div className="ayre-panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-display text-3xl uppercase text-white">Candidate array</p>
          <button
            type="button"
            className="ayre-button ayre-button-secondary"
            disabled={pending || rows.every((row) => row.approvalStatus !== "approved")}
            onClick={handleCommit}
          >
            {pending ? "Creating..." : "Create review drafts"}
          </button>
        </div>
        {preview ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/4 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/42">
              {preview.workflow === "url_fetch" ? "Fetched source" : "Pasted source"} • {preview.charCount} chars
            </p>
            {preview.sourceTitle ? <p className="mt-2 font-display text-2xl uppercase text-white">{preview.sourceTitle}</p> : null}
            <p className="mt-2 line-clamp-4 text-sm text-white/62">{preview.sourceTextPreview}</p>
          </div>
        ) : null}
        <div className="mt-4 grid gap-3">
          {rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-5 text-sm text-white/48">
              One sentence can produce multiple candidates. Operator overrides are stored whenever the reviewer changes the suggested tier or type.
            </div>
          ) : (
            rows.map((row) => (
              <div key={row.id} className="rounded-2xl border border-white/10 bg-white/4 px-4 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
                    {row.llmSuggestedClaimType}
                  </span>
                  <span className="rounded-full border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
                    {row.llmSuggestedTier}
                  </span>
                  <span className="rounded-full border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
                    {row.predictedOutcome}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.24em] ${
                      row.approvalStatus === "approved"
                        ? "border-brand-green/35 bg-brand-green/10 text-brand-green"
                        : row.approvalStatus === "rejected"
                          ? "border-brand-red/35 bg-brand-red/10 text-brand-red"
                          : "border-white/10 text-white/45"
                    }`}
                  >
                    {row.approvalStatus ?? "pending"}
                  </span>
                </div>
                <p className="mt-3 font-display text-2xl uppercase text-white">{row.eventLabel}</p>
                <p className="mt-2 text-sm text-white/62">{row.sourceSpan}</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.24em] text-white/42">
                  LLM confidence {row.llmConfidence} • {row.llmModelVersion}
                </p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <input
                    className="ayre-input"
                    value={row.eventLabel}
                    onChange={(event) => updateCandidate(row.id, { eventLabel: event.target.value })}
                  />
                  <input
                    className="ayre-input"
                    value={row.llmSuggestedProbability?.toString() ?? ""}
                    onChange={(event) =>
                      updateCandidate(row.id, {
                        llmSuggestedProbability: event.target.value ? Number(event.target.value) : undefined,
                      })
                    }
                  />
                  <select
                    className="ayre-input"
                    value={row.llmSuggestedClaimType}
                    onChange={(event) =>
                      updateCandidate(row.id, {
                        llmSuggestedClaimType: event.target.value as ExtractedClaimCandidate["llmSuggestedClaimType"],
                      })
                    }
                  >
                    {CLAIM_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <select
                    className="ayre-input"
                    value={row.llmSuggestedTier}
                    onChange={(event) =>
                      updateCandidate(row.id, {
                        llmSuggestedTier: event.target.value as ExtractedClaimCandidate["llmSuggestedTier"],
                      })
                    }
                  >
                    {CONFIDENCE_TIERS.map((tier) => (
                      <option key={tier} value={tier}>
                        {tier}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  className="ayre-input mt-3 min-h-20"
                  placeholder="Override reason"
                  value={row.overrideReason ?? ""}
                  onChange={(event) => updateCandidate(row.id, { overrideReason: event.target.value })}
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-brand-green/35 bg-brand-green/10 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-green"
                    onClick={() => updateApprovalStatus(row.id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-brand-red/35 bg-brand-red/10 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-red"
                    onClick={() => updateApprovalStatus(row.id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

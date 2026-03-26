"use client";

import { useState } from "react";

import type { ExtractedClaimCandidate, ExtractSourcePreview } from "@/lib/types";

const sampleText = `I expect three rate cuts in 2024, with the first coming in Q3.
I strongly believe recession is coming by Q2 2025.
There's a risk the 10-year ends the year below 3.5%.`;

export function ExtractPlayground() {
  const [mode, setMode] = useState<"text" | "url">("text");
  const [payload, setPayload] = useState(sampleText);
  const [sourceUrl, setSourceUrl] = useState("https://example.com");
  const [rows, setRows] = useState<ExtractedClaimCandidate[]>([]);
  const [preview, setPreview] = useState<ExtractSourcePreview | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleExtract() {
    setError(null);
    const response = await fetch("/api/admin/extract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mode === "url" ? { sourceUrl } : { payload }),
    });
    const data = (await response.json()) as {
      rows?: ExtractedClaimCandidate[];
      preview?: ExtractSourcePreview;
      error?: string;
    };

    if (!response.ok) {
      setError(data.error ?? "Extraction failed.");
      return;
    }

    setRows(data.rows ?? []);
    setPreview(data.preview ?? null);
  }

  function updateApprovalStatus(id: string, approvalStatus: "approved" | "rejected") {
    setRows((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              approvalStatus,
              operatorOverride: approvalStatus !== "approved",
              overrideReason:
                approvalStatus === "rejected"
                  ? "Operator rejected the candidate after review."
                  : row.operatorOverride
                    ? row.overrideReason
                    : undefined,
            }
          : row,
      ),
    );
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
        <button type="button" className="ayre-button ayre-button-primary mt-4" onClick={handleExtract}>
          {mode === "url" ? "Fetch + extract in one step" : "Extract candidates"}
        </button>
        {error ? <p className="mt-3 text-sm text-brand-red">{error}</p> : null}
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/4 p-4 text-sm text-white/62">
          URL mode is the Phase 1 bottleneck reducer: source link in, page fetch + parse + extract out, operator only approves or rejects the final candidate list.
        </div>
      </div>
      <div className="ayre-panel p-5">
        <p className="font-display text-3xl uppercase text-white">Candidate array</p>
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

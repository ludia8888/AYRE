"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { postJson } from "@/components/admin/request";
import type { ImportPreviewRow } from "@/lib/types";

const sampleCsv = `expertSlug,sourceUrl,quote,publishedAt,eventLabel,claimType,predictedOutcome,deadline
cathie-wood,https://example.com/source,"We expect CPI under 3% by year end",2024-08-14T11:00:00.000Z,"US CPI ends 2024 below 3.0%",threshold_cross_by_date,yes,2024-12-31T23:59:59.000Z`;

export function ImportPreview() {
  const router = useRouter();
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [payload, setPayload] = useState(sampleCsv);
  const [rows, setRows] = useState<ImportPreviewRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handlePreview() {
    try {
      setError(null);
      setStatus(null);
      const data = await postJson<{ rows: ImportPreviewRow[] }>("/api/admin/import", {
        intent: "preview",
        format,
        payload,
      });
      setRows(data.rows ?? []);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Preview failed.");
    }
  }

  async function handleCommit() {
    try {
      setPending(true);
      setError(null);
      setStatus(null);
      const result = await postJson<{ createdClaims: number }>("/api/admin/import", {
        intent: "commit",
        format,
        payload,
      });
      setStatus(`${result.createdClaims} review drafts created.`);
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
          <p className="font-display text-3xl uppercase text-white">Preview payload</p>
          <select className="ayre-input max-w-[180px]" value={format} onChange={(event) => setFormat(event.target.value as "csv" | "json")}>
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
        </div>
        <textarea className="ayre-input mt-4 min-h-72" value={payload} onChange={(event) => setPayload(event.target.value)} />
        <button type="button" className="ayre-button ayre-button-primary mt-4" onClick={handlePreview}>
          Validate import
        </button>
        {error ? <p className="mt-3 text-sm text-brand-red">{error}</p> : null}
        {status ? <p className="mt-3 text-sm text-brand-green">{status}</p> : null}
      </div>

      <div className="ayre-panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-display text-3xl uppercase text-white">Row results</p>
          <button
            type="button"
            className="ayre-button ayre-button-secondary"
            disabled={pending || rows.length === 0 || rows.some((row) => row.status === "invalid")}
            onClick={handleCommit}
          >
            {pending ? "Committing..." : "Commit valid rows"}
          </button>
        </div>
        <div className="mt-4 grid gap-3">
          {rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-5 text-sm text-white/48">
              Run a preview to see validation errors, duplicates, and row-level readiness before you create review drafts.
            </div>
          ) : (
            rows.map((row) => (
              <div key={row.rowNumber} className="rounded-2xl border border-white/10 bg-white/4 px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">Row {row.rowNumber}</p>
                  <p className={`font-mono text-[11px] uppercase tracking-[0.24em] ${row.status === "valid" ? "text-brand-green" : "text-brand-red"}`}>
                    {row.status}
                  </p>
                </div>
                {row.errors.length > 0 ? (
                  <ul className="mt-3 grid gap-2 text-sm text-white/62">
                    {row.errors.map((issue) => (
                      <li key={issue}>{issue}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-white/62">{row.preview.quote}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

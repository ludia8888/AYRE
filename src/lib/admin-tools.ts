import Papa from "papaparse";
import { z } from "zod";

import type { ExtractedClaimCandidate, ExtractSourcePreview, ImportPreviewRow } from "@/lib/types";

const importRowSchema = z.object({
  expertSlug: z.string().min(1),
  sourceUrl: z.string().url(),
  quote: z.string().min(10),
  publishedAt: z.string().min(4),
  eventLabel: z.string().min(4),
  claimType: z.string().min(4),
  predictedOutcome: z.enum(["yes", "no"]),
  deadline: z.string().min(4),
});

function inferClaimType(text: string): ExtractedClaimCandidate["llmSuggestedClaimType"] {
  const normalized = text.toLowerCase();

  if (
    normalized.includes("first cut") ||
    normalized.includes("before q4") ||
    (normalized.includes("first") && normalized.match(/\bq[1-4]\b/))
  ) {
    return "first_action_by_date";
  }

  if (normalized.includes("cuts") || normalized.match(/\b\d+\s+cuts?\b/)) {
    return "count_by_deadline";
  }

  if (normalized.includes("basis points") || normalized.includes("bp")) {
    return "cumulative_change_by_deadline";
  }

  if (normalized.includes("between ") || normalized.includes("range")) {
    return "range_value_during_window";
  }

  if (
    normalized.includes("ends") ||
    normalized.includes("end the year") ||
    normalized.includes("year end") ||
    normalized.includes("close")
  ) {
    return "end_value_at_date";
  }

  return "threshold_cross_by_date";
}

function inferTier(text: string): ExtractedClaimCandidate["llmSuggestedTier"] {
  const normalized = text.toLowerCase();

  if (
    normalized.includes("no doubt") ||
    normalized.includes("definitely") ||
    normalized.includes("strongly") ||
    normalized.includes("will ")
  ) {
    return "high";
  }

  if (normalized.includes("likely") || normalized.includes("expect") || normalized.includes("base case")) {
    return "medium";
  }

  return "low";
}

function inferDirection(text: string): ExtractedClaimCandidate["predictedOutcome"] {
  const normalized = text.toLowerCase();

  if (
    normalized.includes("won't") ||
    normalized.includes("will not") ||
    normalized.includes("do not") ||
    normalized.includes("don't") ||
    normalized.includes("doubt") ||
    normalized.includes("no way")
  ) {
    return "no";
  }

  return "yes";
}

function splitIntoCandidateSpans(input: string) {
  return input
    .split(/[\n\.]+/)
    .flatMap((chunk) => chunk.split(/, with /i))
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 12);
}

function inferProbabilityFromTier(tier: ExtractedClaimCandidate["llmSuggestedTier"]) {
  if (tier === "high") {
    return 0.8;
  }
  if (tier === "medium") {
    return 0.7;
  }
  return 0.6;
}

export function extractClaimCandidates(input: string): ExtractedClaimCandidate[] {
  return splitIntoCandidateSpans(input).map((span, index) => {
    const llmSuggestedTier = inferTier(span);
    return {
      id: `candidate-${index + 1}`,
      sourceSpan: span,
      normalizedQuote: span,
      eventLabel: span.replace(/^i\s+(think|expect|believe)\s+/i, "").replace(/\s+/g, " ").trim(),
      predictedOutcome: inferDirection(span),
      llmSuggestedClaimType: inferClaimType(span),
      llmSuggestedTier,
      llmConfidence: Number((0.62 + index * 0.07).toFixed(2)),
      llmSuggestedProbability: inferProbabilityFromTier(llmSuggestedTier),
      llmModelVersion: "gpt-5.4-mini-2026-03-01",
      operatorOverride: false,
      approvalStatus: "pending",
    };
  });
}

export function buildImportPreview(text: string, format: "csv" | "json"): ImportPreviewRow[] {
  const rows =
    format === "json"
      ? (JSON.parse(text) as Record<string, string>[])
      : Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true }).data;

  return rows.map((row, index) => {
    const result = importRowSchema.safeParse(row);
    return {
      rowNumber: index + 1,
      status: result.success ? "valid" : "invalid",
      errors: result.success ? [] : result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
      preview: row,
    };
  });
}

function stripHtmlToText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readTitle(html: string) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  return stripHtmlToText(title).slice(0, 160);
}

export async function fetchSourcePreview(sourceUrl: string): Promise<ExtractSourcePreview> {
  const response = await fetch(sourceUrl, {
    headers: {
      "User-Agent": "AYRE Phase 1 Extractor/1.0",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch source URL (${response.status}).`);
  }

  const html = await response.text();
  const sourceTextPreview = stripHtmlToText(html).slice(0, 5000);

  return {
    sourceUrl,
    sourceTitle: readTitle(html),
    sourceTextPreview,
    workflow: "url_fetch",
    charCount: sourceTextPreview.length,
  };
}

export function buildTextPreview(payload: string): ExtractSourcePreview {
  const sourceTextPreview = payload.trim();

  return {
    sourceTextPreview,
    workflow: "text_input",
    charCount: sourceTextPreview.length,
  };
}

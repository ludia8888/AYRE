import { NextResponse } from "next/server";
import { z } from "zod";

import { commitExtractCandidates } from "@/lib/admin-service";
import { buildTextPreview, extractClaimCandidates, fetchSourcePreview } from "@/lib/admin-tools";
import { CLAIM_TYPES, CONFIDENCE_TIERS } from "@/lib/types";

const previewSchema = z.object({
  intent: z.literal("preview").default("preview"),
  payload: z.string().optional(),
  sourceUrl: z.string().url().optional(),
});

const candidateSchema = z.object({
  id: z.string(),
  sourceSpan: z.string(),
  normalizedQuote: z.string(),
  eventLabel: z.string().min(2),
  predictedOutcome: z.enum(["yes", "no"]),
  llmSuggestedClaimType: z.enum(CLAIM_TYPES),
  llmSuggestedTier: z.enum(CONFIDENCE_TIERS),
  llmConfidence: z.number(),
  llmSuggestedProbability: z.number().optional(),
  llmModelVersion: z.string(),
  operatorOverride: z.boolean(),
  overrideReason: z.string().optional(),
  approvalStatus: z.enum(["pending", "approved", "rejected"]).optional(),
});

const commitSchema = z.object({
  intent: z.literal("commit"),
  expertId: z.string().min(1),
  sourceUrl: z.string().url().optional(),
  sourceTitle: z.string().min(2),
  sourcePlatform: z.string().optional(),
  publishedAt: z.string().min(4),
  candidates: z.array(candidateSchema).min(1),
});

const requestSchema = z.union([previewSchema, commitSchema]);

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());

    if (body.intent === "commit") {
      const result = await commitExtractCandidates(body);
      return NextResponse.json(result);
    }

    const preview = body.sourceUrl ? await fetchSourcePreview(body.sourceUrl) : buildTextPreview(body.payload ?? "");

    if (!preview.sourceTextPreview) {
      throw new Error("No extractable text found.");
    }

    const rows = extractClaimCandidates(preview.sourceTextPreview);
    return NextResponse.json({ rows, preview });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Extraction failed." },
      { status: 400 },
    );
  }
}

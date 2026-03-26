import { NextResponse } from "next/server";
import { z } from "zod";

import { activateScoringVersion, createCandidateScoringVersion, refreshPublicArtifacts } from "@/lib/admin-service";

const createSchema = z.object({
  intent: z.literal("create"),
  version: z.string().min(2),
  label: z.string().min(2),
  priorQuality: z.number().min(0).max(1),
  shrinkageK: z.number().min(1),
  low: z.number().min(0).max(1),
  medium: z.number().min(0).max(1),
  high: z.number().min(0).max(1),
  baselineResolvedClaims: z.number().min(0).optional(),
  nextReviewAt: z.string().min(4),
  changelogTitle: z.string().min(4),
  changelogSummary: z.string().min(4),
});

const activateSchema = z.object({
  intent: z.literal("activate"),
  versionId: z.string().min(1),
});

const refreshSchema = z.object({
  intent: z.literal("refresh"),
});

const requestSchema = z.union([createSchema, activateSchema, refreshSchema]);

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());

    if (body.intent === "create") {
      const version = await createCandidateScoringVersion(body);
      return NextResponse.json({ version });
    }

    if (body.intent === "activate") {
      const result = await activateScoringVersion(body.versionId);
      return NextResponse.json(result);
    }

    const result = await refreshPublicArtifacts();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Scoring mutation failed." },
      { status: 400 },
    );
  }
}

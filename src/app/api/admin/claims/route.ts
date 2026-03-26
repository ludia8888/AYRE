import { NextResponse } from "next/server";
import { z } from "zod";

import { createClaim, updateClaimWorkflow } from "@/lib/admin-service";
import { CLAIM_TYPES, CONFIDENCE_TIERS } from "@/lib/types";

const createStatuses = ["draft", "review", "published_open", "published_awaiting_data", "rejected_unscoreable"] as const;
const workflowStatuses = ["review", "published_open", "published_awaiting_data", "rejected_unscoreable"] as const;

const createSchema = z.object({
  intent: z.literal("create"),
  expertId: z.string().min(1),
  sourceTitle: z.string().min(2),
  sourcePlatform: z.string().optional(),
  sourceUrl: z.string().url(),
  publishedAt: z.string().min(4),
  eventLabel: z.string().min(4),
  eventKey: z.string().optional(),
  quotedText: z.string().min(10),
  claimType: z.enum(CLAIM_TYPES),
  predictedOutcome: z.enum(["yes", "no"]),
  deadline: z.string().min(4),
  metricKey: z.string().min(2),
  metricLabel: z.string().min(2),
  operator: z.string().min(2),
  threshold: z.number().optional(),
  unit: z.string().min(1),
  status: z.enum(createStatuses),
  confidenceTier: z.enum(CONFIDENCE_TIERS).optional(),
  explicitProbability: z.number().min(0).max(1).optional(),
  tierAssignmentReason: z.string().optional(),
  rejectionReason: z.string().optional(),
});

const updateSchema = z.object({
  intent: z.literal("update"),
  id: z.string().min(1),
  status: z.enum(workflowStatuses),
  confidenceTier: z.enum(CONFIDENCE_TIERS).optional(),
  explicitProbability: z.number().min(0).max(1).optional(),
  tierAssignmentReason: z.string().optional(),
  rejectionReason: z.string().optional(),
  reviewedBy: z.string().optional(),
});

const requestSchema = z.union([createSchema, updateSchema]);

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());

    if (body.intent === "create") {
      const result = await createClaim(body);
      return NextResponse.json(result);
    }

    const claim = await updateClaimWorkflow(body);
    return NextResponse.json({ claim });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Claim mutation failed." },
      { status: 400 },
    );
  }
}

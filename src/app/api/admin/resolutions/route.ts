import { NextResponse } from "next/server";
import { z } from "zod";

import { upsertResolution } from "@/lib/admin-service";

const requestSchema = z.object({
  claimId: z.string().min(1),
  outcome: z.enum(["yes", "no"]),
  actualValue: z.string().min(1),
  evidenceUrl: z.string().url(),
  resolvedAt: z.string().min(4),
  settlementPolicy: z.enum(["first_official_release", "latest_official_revision"]),
  settledStage: z.enum(["official_preliminary", "official_revised", "official_final", "market_close"]),
  officialReleaseDate: z.string().optional(),
  initialReleaseValue: z.string().optional(),
  initialReleaseAt: z.string().optional(),
  revisedValue: z.string().optional(),
  revisedAt: z.string().optional(),
  revisionHandling: z.enum(["tracked_no_rescore", "retroactive_rescore"]).optional(),
  revisionNotes: z.string().optional(),
  reviewerId: z.string().min(1),
  reviewerName: z.string().min(1),
  notes: z.string().min(3),
});

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());
    const resolution = await upsertResolution(body);
    return NextResponse.json({ resolution });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Resolution save failed." },
      { status: 400 },
    );
  }
}

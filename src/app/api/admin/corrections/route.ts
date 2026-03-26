import { NextResponse } from "next/server";
import { z } from "zod";

import { saveCorrection } from "@/lib/admin-service";

const requestSchema = z.object({
  id: z.string().optional(),
  expertSlug: z.string().min(1),
  claimId: z.string().optional(),
  status: z.enum(["pending_review", "temporarily_unpublished", "corrected", "rejected"]),
  summary: z.string().min(4),
  linkedClaimStatus: z.enum(["review", "published_open", "published_awaiting_data", "rejected_unscoreable"]).optional(),
});

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());
    const correction = await saveCorrection(body);
    return NextResponse.json({ correction });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Correction save failed." },
      { status: 400 },
    );
  }
}

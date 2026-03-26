import { NextResponse } from "next/server";
import { z } from "zod";

import { buildTextPreview, extractClaimCandidates, fetchSourcePreview } from "@/lib/admin-tools";

const requestSchema = z.object({
  payload: z.string().optional(),
  sourceUrl: z.string().url().optional(),
});

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());
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

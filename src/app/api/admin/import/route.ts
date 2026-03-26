import { NextResponse } from "next/server";
import { z } from "zod";

import { buildImportPreview } from "@/lib/admin-tools";

const requestSchema = z.object({
  format: z.enum(["csv", "json"]),
  payload: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());
    const rows = buildImportPreview(body.payload, body.format);
    return NextResponse.json({ rows });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Import preview failed." },
      { status: 400 },
    );
  }
}

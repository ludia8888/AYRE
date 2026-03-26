import { NextResponse } from "next/server";
import { z } from "zod";

import { buildImportPreview, importRowSchema, parseImportRows } from "@/lib/admin-tools";
import { commitImportRows } from "@/lib/admin-service";
import { getSiteDataset } from "@/lib/data";

const previewSchema = z.object({
  intent: z.literal("preview").default("preview"),
  format: z.enum(["csv", "json"]),
  payload: z.string().min(1),
});

const commitSchema = z.object({
  intent: z.literal("commit"),
  format: z.enum(["csv", "json"]),
  payload: z.string().min(1),
});

const requestSchema = z.union([previewSchema, commitSchema]);

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());
    const dataset = await getSiteDataset();
    const sourceById = new Map(dataset.sourceDocuments.map((item) => [item.id, item]));
    const duplicateKeys = new Set(
      dataset.claims.map((claim) => {
        const source = sourceById.get(claim.sourceDocumentId);
        const quote = claim.quotedText.trim().replace(/\s+/g, " ").toLowerCase();
        return source ? `${dataset.experts.find((expert) => expert.id === claim.expertId)?.slug ?? claim.expertId}::${source.url}::${quote}` : "";
      }),
    );
    const expertSlugs = new Set(dataset.experts.map((expert) => expert.slug));

    if (body.intent === "preview") {
      const rows = buildImportPreview(body.payload, body.format, { expertSlugs, duplicateKeys });
      return NextResponse.json({ rows });
    }

    const rows = parseImportRows(body.payload, body.format);
    const validRows = rows.filter((row) => row.success).map((row) => row.data);
    const validationErrors = rows.filter((row) => !row.success);

    if (validationErrors.length > 0) {
      throw new Error("Fix invalid rows before committing import drafts.");
    }

    validRows.forEach((row) => importRowSchema.parse(row));
    const result = await commitImportRows(validRows);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Import preview failed." },
      { status: 400 },
    );
  }
}

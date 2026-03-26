import { NextResponse } from "next/server";
import { z } from "zod";

import { saveExpert } from "@/lib/admin-service";

const requestSchema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
  displayName: z.string().min(2),
  headline: z.string().min(4),
  organization: z.string().min(2),
  avatarUrl: z.string().min(1),
  bio: z.string().min(10),
  featured: z.boolean().default(false),
  x: z.string().optional(),
  website: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());
    const expert = await saveExpert(body);
    return NextResponse.json({ expert });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Expert save failed." },
      { status: 400 },
    );
  }
}

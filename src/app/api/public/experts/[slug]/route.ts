import { NextResponse } from "next/server";

import { getExpertSnapshotBySlug } from "@/lib/data";

export const runtime = "nodejs";
export const revalidate = 3600;

type RouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteProps) {
  const { slug } = await params;
  const snapshot = await getExpertSnapshotBySlug(slug);

  if (!snapshot) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(snapshot, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

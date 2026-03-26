import { NextResponse } from "next/server";

import { getCompareSnapshot } from "@/lib/data";

export const runtime = "nodejs";
export const revalidate = 3600;

type RouteProps = {
  params: Promise<{
    pair: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteProps) {
  const { pair } = await params;
  const snapshot = await getCompareSnapshot(pair);

  if (!snapshot) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(snapshot, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

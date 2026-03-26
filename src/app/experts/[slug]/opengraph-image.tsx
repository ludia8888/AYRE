import { ImageResponse } from "next/og";

import { getRequestOrigin } from "@/lib/site-url";
import type { ExpertSnapshot } from "@/lib/types";

export const runtime = "edge";
export const alt = "AYRE expert scorecard";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const revalidate = 3600;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type ExpertOgProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Image({ params }: ExpertOgProps) {
  const { slug } = await params;
  const origin = await getRequestOrigin();
  const response = await fetch(`${origin}/api/public/experts/${slug}`, {
    next: {
      revalidate,
    },
  });

  if (!response.ok) {
    return new ImageResponse(<div>Missing expert</div>, size);
  }

  const snapshot = (await response.json()) as ExpertSnapshot;

  if (!snapshot) {
    return new ImageResponse(<div>Missing expert</div>, size);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at top left, rgba(0,214,143,0.25), transparent 30%), radial-gradient(circle at bottom right, rgba(247,73,109,0.22), transparent 28%), #071018",
          color: "white",
          padding: "48px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
            <div
              style={{
                width: "92px",
                height: "92px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "34px",
              }}
            >
              {initials(snapshot.expert.displayName)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ fontSize: "18px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#00d68f" }}>AYRE</div>
              <div style={{ fontSize: "58px", textTransform: "uppercase", lineHeight: 1 }}>{snapshot.expert.displayName}</div>
            </div>
          </div>
          <div
            style={{
              borderRadius: "28px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: snapshot.ayreScore >= 70 ? "rgba(0,214,143,0.16)" : "rgba(255,255,255,0.06)",
              padding: "22px 26px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span style={{ fontSize: "14px", letterSpacing: "0.24em", textTransform: "uppercase", opacity: 0.6 }}>AYRE Score</span>
            <span style={{ fontSize: "92px", lineHeight: 0.9 }}>{snapshot.ayreScore}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          <div
            style={{
              flex: 1,
              borderRadius: "28px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.05)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ fontSize: "14px", letterSpacing: "0.24em", textTransform: "uppercase", opacity: 0.5 }}>Best call</div>
            <div style={{ fontSize: "34px", textTransform: "uppercase", lineHeight: 1.05 }}>
              {snapshot.bestCall?.claim.eventLabel ?? "No resolved calls yet"}
            </div>
          </div>
          <div
            style={{
              width: "320px",
              borderRadius: "28px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.05)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: "14px", letterSpacing: "0.24em", textTransform: "uppercase", opacity: 0.5 }}>Based on</div>
            <div style={{ fontSize: "48px", lineHeight: 1 }}>{snapshot.resolvedCount} resolved predictions</div>
            <div style={{ fontSize: "16px", letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.45 }}>
              Score {snapshot.scoreVersion}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

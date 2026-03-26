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

  const isGood = snapshot.ayreScore >= 70;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f8f7f4",
          color: "#0f0f0f",
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
                background: "#efeeea",
                border: "1px solid #d8d7d2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "34px",
                color: "#86857e",
              }}
            >
              {initials(snapshot.expert.displayName)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ fontSize: "18px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#00a67e" }}>AYRE</div>
              <div style={{ fontSize: "58px", textTransform: "uppercase", lineHeight: 1, color: "#0f0f0f" }}>{snapshot.expert.displayName}</div>
            </div>
          </div>
          <div
            style={{
              borderRadius: "16px",
              border: isGood ? "2px solid #00a67e" : "1px solid #d8d7d2",
              background: isGood ? "rgba(0,166,126,0.06)" : "#ffffff",
              padding: "22px 26px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span style={{ fontSize: "14px", letterSpacing: "0.24em", textTransform: "uppercase", color: "#86857e" }}>AYRE Score</span>
            <span style={{ fontSize: "92px", lineHeight: 0.9, color: isGood ? "#00a67e" : "#0f0f0f" }}>{snapshot.ayreScore}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          <div
            style={{
              flex: 1,
              borderRadius: "16px",
              border: "1px solid #d8d7d2",
              background: "#ffffff",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ fontSize: "14px", letterSpacing: "0.24em", textTransform: "uppercase", color: "#86857e" }}>Best call</div>
            <div style={{ fontSize: "34px", textTransform: "uppercase", lineHeight: 1.05, color: "#0f0f0f" }}>
              {snapshot.bestCall?.claim.eventLabel ?? "No resolved calls yet"}
            </div>
          </div>
          <div
            style={{
              width: "320px",
              borderRadius: "16px",
              border: "1px solid #d8d7d2",
              background: "#ffffff",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: "14px", letterSpacing: "0.24em", textTransform: "uppercase", color: "#86857e" }}>Based on</div>
            <div style={{ fontSize: "48px", lineHeight: 1, color: "#0f0f0f" }}>{`${snapshot.resolvedCount} resolved predictions`}</div>
            <div style={{ fontSize: "16px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#aeada6" }}>
              {`Score ${snapshot.scoreVersion}`}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

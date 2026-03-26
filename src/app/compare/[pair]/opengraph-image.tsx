import { ImageResponse } from "next/og";

import { getRequestOrigin } from "@/lib/site-url";
import type { CompareSnapshot } from "@/lib/types";

export const runtime = "edge";
export const alt = "AYRE compare card";
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

type CompareOgProps = {
  params: Promise<{
    pair: string;
  }>;
};

export default async function Image({ params }: CompareOgProps) {
  const { pair } = await params;
  const origin = await getRequestOrigin();
  const response = await fetch(`${origin}/api/public/compare/${pair}`, {
    next: {
      revalidate,
    },
  });

  if (!response.ok) {
    return new ImageResponse(<div>Missing compare</div>, size);
  }

  const compare = (await response.json()) as CompareSnapshot;

  if (!compare) {
    return new ImageResponse(<div>Missing compare</div>, size);
  }

  const winner = compare.winner === "right" ? compare.right : compare.left;
  const loser = compare.winner === "right" ? compare.left : compare.right;

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
            "radial-gradient(circle at top left, rgba(0,214,143,0.22), transparent 30%), radial-gradient(circle at bottom right, rgba(247,73,109,0.2), transparent 28%), #060c12",
          color: "white",
          padding: "44px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: "18px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#00d68f" }}>AYRE compare</div>
            <div style={{ fontSize: "60px", textTransform: "uppercase", lineHeight: 1 }}>{compare.left.expert.displayName} vs {compare.right.expert.displayName}</div>
          </div>
          <div style={{ fontSize: "18px", letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.52 }}>
            Score {compare.scoreVersion}
          </div>
        </div>

        <div style={{ display: "flex", gap: "22px" }}>
          {[compare.left, compare.right].map((snapshot) => {
            const isWinner = snapshot.expert.id === winner.expert.id && compare.winner !== "tie";
            const isLoser = snapshot.expert.id === loser.expert.id && compare.winner !== "tie";
            return (
              <div
                key={snapshot.expert.id}
                style={{
                  flex: 1,
                  borderRadius: "32px",
                  border: isWinner
                    ? "1px solid rgba(0,214,143,0.45)"
                    : isLoser
                      ? "1px solid rgba(247,73,109,0.35)"
                      : "1px solid rgba(255,255,255,0.1)",
                  background: isWinner
                    ? "rgba(0,214,143,0.16)"
                    : isLoser
                      ? "rgba(247,73,109,0.14)"
                      : "rgba(255,255,255,0.04)",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                  <div
                    style={{
                      width: "86px",
                      height: "86px",
                      borderRadius: "999px",
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.07)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "30px",
                    }}
                  >
                    {initials(snapshot.expert.displayName)}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "38px", textTransform: "uppercase", lineHeight: 1 }}>{snapshot.expert.displayName}</span>
                    <span style={{ fontSize: "16px", opacity: 0.58 }}>Based on {snapshot.resolvedCount} resolved predictions</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <span style={{ fontSize: "110px", lineHeight: 0.9 }}>{snapshot.ayreScore}</span>
                  <span style={{ fontSize: "18px", letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.5 }}>AYRE Score</span>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            borderRadius: "28px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.05)",
            padding: "22px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "14px", letterSpacing: "0.24em", textTransform: "uppercase", opacity: 0.5 }}>Representative call</span>
            <span style={{ fontSize: "34px", textTransform: "uppercase", lineHeight: 1.05 }}>{compare.representativeCall}</span>
          </div>
          <div style={{ fontSize: "22px", letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.68 }}>
            Delta {compare.scoreDelta}
          </div>
        </div>
      </div>
    ),
    size,
  );
}

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
          background: "#f8f7f4",
          color: "#0f0f0f",
          padding: "44px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: "18px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#00a67e" }}>AYRE compare</div>
            <div style={{ fontSize: "54px", textTransform: "uppercase", lineHeight: 1, color: "#0f0f0f" }}>
              {`${compare.left.expert.displayName} vs ${compare.right.expert.displayName}`}
            </div>
          </div>
          <div style={{ fontSize: "16px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#aeada6" }}>
            {`Score ${compare.scoreVersion}`}
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
                  borderRadius: "16px",
                  border: isWinner
                    ? "2px solid #00a67e"
                    : isLoser
                      ? "1px solid rgba(212,54,75,0.2)"
                      : "1px solid #d8d7d2",
                  background: isWinner
                    ? "rgba(0,166,126,0.06)"
                    : isLoser
                      ? "rgba(212,54,75,0.03)"
                      : "#ffffff",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                  opacity: isLoser ? 0.7 : 1,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "999px",
                      border: "1px solid #d8d7d2",
                      background: "#efeeea",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "26px",
                      color: "#86857e",
                    }}
                  >
                    {initials(snapshot.expert.displayName)}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "34px", textTransform: "uppercase", lineHeight: 1, color: "#0f0f0f" }}>{snapshot.expert.displayName}</span>
                    <span style={{ fontSize: "14px", color: "#86857e" }}>{`${snapshot.resolvedCount} resolved`}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <span style={{ fontSize: "100px", lineHeight: 0.9, color: isWinner ? "#00a67e" : "#0f0f0f" }}>{snapshot.ayreScore}</span>
                  <span style={{ fontSize: "16px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#aeada6" }}>AYRE</span>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            borderRadius: "12px",
            border: "1px solid #d8d7d2",
            background: "#ffffff",
            padding: "20px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "12px", letterSpacing: "0.24em", textTransform: "uppercase", color: "#aeada6" }}>Representative call</span>
            <span style={{ fontSize: "28px", lineHeight: 1.1, color: "#0f0f0f" }}>{compare.representativeCall}</span>
          </div>
          <div
            style={{
              borderRadius: "999px",
              background: "rgba(0,166,126,0.1)",
              padding: "8px 16px",
              fontSize: "16px",
              color: "#00a67e",
              letterSpacing: "0.1em",
            }}
          >
            {`${compare.scoreDelta}pt delta`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}

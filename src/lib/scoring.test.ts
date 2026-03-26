import { describe, expect, it } from "vitest";

import { mockSiteDataset } from "@/lib/mock-data";
import { buildCompareSnapshot, buildExpertSnapshot, getLeaderboardSections, resolveClaimProbability } from "@/lib/scoring";

describe("scoring", () => {
  it("treats negative calls as inverse event probability", () => {
    const claim = mockSiteDataset.claims.find((item) => item.eventKey === "cpi-below-3-end-2024" && item.predictedOutcome === "no");
    expect(claim).toBeDefined();
    expect(resolveClaimProbability(claim!, mockSiteDataset.activeScoreVersion)).toBeCloseTo(0.2);
  });

  it("excludes awaiting-data and open claims from the resolved denominator", () => {
    const expert = mockSiteDataset.experts.find((item) => item.slug === "lyn-alden");
    expect(expert).toBeDefined();
    const snapshot = buildExpertSnapshot({ expert: expert!, dataset: mockSiteDataset });

    expect(snapshot.awaitingDataCount).toBe(1);
    expect(snapshot.resolvedCount).toBe(6);
  });

  it("keeps lowest-scoring section dormant when the board is not deep enough", () => {
    const sections = getLeaderboardSections({ dataset: mockSiteDataset, now: new Date("2026-03-26T09:00:00.000Z") });

    expect(sections).toHaveLength(1);
    expect(sections[0]?.id).toBe("top-scorecards");
  });

  it("builds compare snapshots on shared event keys", () => {
    const left = mockSiteDataset.experts.find((item) => item.slug === "nouriel-roubini");
    const right = mockSiteDataset.experts.find((item) => item.slug === "cathie-wood");
    expect(left && right).toBeTruthy();

    const compare = buildCompareSnapshot({
      dataset: mockSiteDataset,
      left: left!,
      right: right!,
    });

    expect(compare.sharedClaims.length).toBeGreaterThan(3);
    expect(compare.scoreDelta).toBeGreaterThanOrEqual(0);
  });
});

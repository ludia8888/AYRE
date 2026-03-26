import { describe, expect, it } from "vitest";

import { buildImportPreview, extractClaimCandidates } from "@/lib/admin-tools";

describe("admin extraction helpers", () => {
  it("splits multi-part source text into multiple claim candidates", () => {
    const rows = extractClaimCandidates("I expect three rate cuts in 2024, with the first coming in Q3.");

    expect(rows).toHaveLength(2);
    expect(rows[0]?.llmSuggestedClaimType).toBe("count_by_deadline");
    expect(rows[1]?.llmSuggestedClaimType).toBe("first_action_by_date");
  });

  it("marks new candidates as pending review", () => {
    const [row] = extractClaimCandidates("I strongly believe recession is coming by Q2 2025.");

    expect(row?.approvalStatus).toBe("pending");
  });

  it("flags unknown expert slugs and duplicates during import preview", () => {
    const rows = buildImportPreview(
      `expertSlug,sourceUrl,quote,publishedAt,eventLabel,claimType,predictedOutcome,deadline
missing-expert,https://example.com/source,"We expect CPI under 3% by year end",2024-08-14T11:00:00.000Z,"US CPI ends 2024 below 3.0%",threshold_cross_by_date,yes,2024-12-31T23:59:59.000Z`,
      "csv",
      {
        expertSlugs: new Set(["cathie-wood"]),
        duplicateKeys: new Set([
          "missing-expert::https://example.com/source::we expect cpi under 3% by year end",
        ]),
      },
    );

    expect(rows[0]?.status).toBe("invalid");
    expect(rows[0]?.errors.some((issue) => issue.includes("Unknown expert slug"))).toBe(true);
    expect(rows[0]?.errors.some((issue) => issue.includes("duplicate"))).toBe(true);
  });
});

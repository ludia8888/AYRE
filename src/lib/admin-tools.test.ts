import { describe, expect, it } from "vitest";

import { extractClaimCandidates } from "@/lib/admin-tools";

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
});

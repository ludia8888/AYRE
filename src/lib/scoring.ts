import type {
  Claim,
  CompareSnapshot,
  Expert,
  ExpertSnapshot,
  LeaderboardSection,
  ResolvedClaimRecord,
  Resolution,
  ScoringVersion,
  SharedClaimComparison,
  SiteDataset,
  WindowKey,
} from "@/lib/types";

function round(value: number, digits = 3) {
  return Number(value.toFixed(digits));
}

export function resolveClaimProbability(claim: Claim, scoringVersion: ScoringVersion) {
  const directionalConfidence =
    claim.explicitProbability ?? (claim.confidenceTier ? scoringVersion.tierMap[claim.confidenceTier] : scoringVersion.tierMap.medium);

  return claim.predictedOutcome === "yes" ? directionalConfidence : 1 - directionalConfidence;
}

export function calculateBrierScore(probability: number, outcome: Resolution["outcome"]) {
  const actual = outcome === "yes" ? 1 : 0;
  return round((probability - actual) ** 2, 4);
}

export function isBinaryCorrect(probability: number, outcome: Resolution["outcome"]) {
  const predictedYes = probability >= 0.5;
  return predictedYes ? outcome === "yes" : outcome === "no";
}

export function buildResolvedRecord(
  claim: Claim,
  resolution: Resolution,
  scoringVersion: ScoringVersion,
): ResolvedClaimRecord {
  const probability = resolveClaimProbability(claim, scoringVersion);
  return {
    claim,
    resolution,
    probability,
    brier: calculateBrierScore(probability, resolution.outcome),
    binaryCorrect: isBinaryCorrect(probability, resolution.outcome),
  };
}

export function splitPairSlug(pair: string) {
  const [left, right] = pair.split("-vs-");
  return { left, right };
}

export function buildPairSlug(leftSlug: string, rightSlug: string) {
  return `${leftSlug}-vs-${rightSlug}`;
}

function getWindowStart(window: WindowKey, now: Date) {
  if (window === "all") {
    return undefined;
  }

  const years = Number(window.replace("y", ""));
  const start = new Date(now);
  start.setFullYear(start.getFullYear() - years);
  return start;
}

function isClaimVisibleForWindow(claim: Claim, window: WindowKey, now: Date) {
  const start = getWindowStart(window, now);
  if (!start) {
    return true;
  }

  return new Date(claim.publishedAt) >= start;
}

export function buildExpertSnapshot(params: {
  expert: Expert;
  dataset: SiteDataset;
  scoringVersion?: ScoringVersion;
  window?: WindowKey;
  now?: Date;
}): ExpertSnapshot {
  const { expert, dataset } = params;
  const scoringVersion = params.scoringVersion ?? dataset.activeScoreVersion;
  const window = params.window ?? "all";
  const now = params.now ?? new Date();

  const claims = dataset.claims.filter(
    (claim) =>
      claim.expertId === expert.id &&
      claim.scoreVersion === scoringVersion.version &&
      isClaimVisibleForWindow(claim, window, now),
  );

  const resolutionByClaimId = new Map(dataset.resolutions.map((resolution) => [resolution.claimId, resolution]));
  const resolvedRecords = claims
    .filter((claim) => claim.status === "resolved")
    .map((claim) => {
      const resolution = resolutionByClaimId.get(claim.id);
      return resolution ? buildResolvedRecord(claim, resolution, scoringVersion) : undefined;
    })
    .filter((record): record is ResolvedClaimRecord => Boolean(record));

  const resolvedCount = resolvedRecords.length;
  const rawQuality =
    resolvedCount > 0 ? round(1 - resolvedRecords.reduce((total, record) => total + record.brier, 0) / resolvedCount) : 0;
  const adjustedQuality =
    resolvedCount > 0
      ? round(
          (resolvedCount / (resolvedCount + scoringVersion.shrinkageK)) * rawQuality +
            (scoringVersion.shrinkageK / (resolvedCount + scoringVersion.shrinkageK)) * scoringVersion.priorQuality,
        )
      : scoringVersion.priorQuality;
  const averageBrier = resolvedCount > 0 ? round(resolvedRecords.reduce((total, record) => total + record.brier, 0) / resolvedCount) : 0;
  const accuracy =
    resolvedCount > 0
      ? round((resolvedRecords.filter((record) => record.binaryCorrect).length / resolvedCount) * 100, 1)
      : 0;

  const byBrierAsc = [...resolvedRecords].sort((a, b) => a.brier - b.brier);

  return {
    expert,
    window,
    scoreVersion: scoringVersion.version,
    ayreScore: Math.round(adjustedQuality * 100),
    adjustedQuality,
    rawQuality,
    averageBrier,
    accuracy,
    resolvedCount,
    openCount: claims.filter((claim) => claim.status === "published_open").length,
    awaitingDataCount: claims.filter((claim) => claim.status === "published_awaiting_data").length,
    rejectedCount: claims.filter((claim) => claim.status === "rejected_unscoreable").length,
    provisional: resolvedCount >= 5 && resolvedCount < 15,
    bestCall: byBrierAsc[0],
    worstCall: byBrierAsc.at(-1),
    resolvedRecords: byBrierAsc,
    visibleClaims: claims,
  };
}

export function getLeaderboardSections(params: {
  dataset: SiteDataset;
  window?: WindowKey;
  now?: Date;
}): LeaderboardSection[] {
  const { dataset } = params;
  const window = params.window ?? "all";
  const now = params.now ?? new Date();

  const snapshots = dataset.experts
    .map((expert) => buildExpertSnapshot({ expert, dataset, window, now }))
    .filter((snapshot) => snapshot.resolvedCount >= 5);

  const topRows = [...snapshots].sort(
    (left, right) =>
      right.ayreScore - left.ayreScore ||
      right.resolvedCount - left.resolvedCount ||
      left.expert.displayName.localeCompare(right.expert.displayName),
  );

  const sections: LeaderboardSection[] = [
    {
      id: "top-scorecards",
      title: "Top Scorecards",
      description: "The best macro track records on the board right now.",
      rows: topRows,
    },
  ];

  const launchDate = new Date(dataset.launchDate);
  const launchDelayReached = now.getTime() - launchDate.getTime() >= 21 * 24 * 60 * 60 * 1000;
  const lowestEligible = snapshots.filter((snapshot) => snapshot.resolvedCount >= 10);

  if (launchDelayReached && lowestEligible.length >= 15) {
    sections.push({
      id: "lowest-scoring",
      title: "Lowest Scoring",
      description: "Same formula, sorted from the bottom up once the board is dense enough.",
      rows: [...lowestEligible].sort((left, right) => left.ayreScore - right.ayreScore),
    });
  }

  return sections;
}

function pickRepresentativeCall(sharedClaims: SharedClaimComparison[], winnerSnapshot: ExpertSnapshot) {
  const decisiveShared = sharedClaims.find((claim) => claim.winner !== "tie" && claim.winner !== "none");
  if (decisiveShared) {
    return decisiveShared.eventLabel;
  }

  return winnerSnapshot.bestCall?.claim.eventLabel ?? "Macro calls under pressure";
}

export function buildCompareSnapshot(params: {
  dataset: SiteDataset;
  left: Expert;
  right: Expert;
  window?: WindowKey;
  now?: Date;
}): CompareSnapshot {
  const window = params.window ?? "all";
  const leftSnapshot = buildExpertSnapshot({
    expert: params.left,
    dataset: params.dataset,
    window,
    now: params.now,
  });
  const rightSnapshot = buildExpertSnapshot({
    expert: params.right,
    dataset: params.dataset,
    window,
    now: params.now,
  });

  const leftByEvent = new Map(leftSnapshot.resolvedRecords.map((record) => [record.claim.eventKey, record]));
  const rightByEvent = new Map(rightSnapshot.resolvedRecords.map((record) => [record.claim.eventKey, record]));
  const sharedKeys = [...new Set([...leftByEvent.keys()].filter((eventKey) => rightByEvent.has(eventKey)))];
  const sharedClaims = sharedKeys.map((eventKey) => {
    const left = leftByEvent.get(eventKey);
    const right = rightByEvent.get(eventKey);
    const leftScore = left ? 1 - left.brier : -1;
    const rightScore = right ? 1 - right.brier : -1;

    let winner: SharedClaimComparison["winner"] = "none";
    if (left && right) {
      if (Math.abs(leftScore - rightScore) < 0.001) {
        winner = "tie";
      } else {
        winner = leftScore > rightScore ? "left" : "right";
      }
    }

    return {
      eventKey,
      eventLabel: left?.claim.eventLabel ?? right?.claim.eventLabel ?? eventKey,
      left,
      right,
      winner,
    };
  });

  let winner: CompareSnapshot["winner"] = "tie";
  if (leftSnapshot.ayreScore !== rightSnapshot.ayreScore) {
    winner = leftSnapshot.ayreScore > rightSnapshot.ayreScore ? "left" : "right";
  }

  const winnerSnapshot =
    winner === "right" ? rightSnapshot : leftSnapshot.ayreScore >= rightSnapshot.ayreScore ? leftSnapshot : rightSnapshot;

  return {
    pair: buildPairSlug(params.left.slug, params.right.slug),
    window,
    scoreVersion: params.dataset.activeScoreVersion.version,
    left: leftSnapshot,
    right: rightSnapshot,
    winner,
    scoreDelta: Math.abs(leftSnapshot.ayreScore - rightSnapshot.ayreScore),
    representativeCall: pickRepresentativeCall(sharedClaims, winnerSnapshot),
    sharedClaims,
  };
}

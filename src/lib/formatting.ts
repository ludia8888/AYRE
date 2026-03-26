import type { Claim, CompareSnapshot, ExpertSnapshot, Resolution, WindowKey } from "@/lib/types";

export function formatPercent(value: number, digits = 0) {
  return `${value.toFixed(digits)}%`;
}

export function formatQuality(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatWindowLabel(window: WindowKey) {
  switch (window) {
    case "1y":
      return "1Y";
    case "3y":
      return "3Y";
    case "5y":
      return "5Y";
    default:
      return "All time";
  }
}

export function formatPredictionDirection(claim: Claim) {
  return claim.predictedOutcome === "yes" ? "YES" : "NO";
}

export function formatClaimStatus(status: Claim["status"]) {
  switch (status) {
    case "published_open":
      return "Open";
    case "published_awaiting_data":
      return "Awaiting data";
    case "resolved":
      return "Resolved";
    case "rejected_unscoreable":
      return "Rejected";
    case "review":
      return "In review";
    default:
      return "Draft";
  }
}

export function buildTrackedPath(path: string, campaign: "expert" | "compare", contentId: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}utm_source=share_card&utm_medium=social&utm_campaign=${campaign}&utm_content=${contentId}`;
}

export function compareTitle(compare: CompareSnapshot) {
  return `${compare.left.expert.displayName} vs ${compare.right.expert.displayName}`;
}

export function expertScoreLine(snapshot: ExpertSnapshot) {
  return `AYRE ${snapshot.ayreScore} • Based on ${snapshot.resolvedCount} resolved predictions`;
}

export function formatSettlementPolicy(policy: Resolution["settlementPolicy"]) {
  return policy === "first_official_release" ? "First official release" : "Latest official revision";
}

export function formatResolutionStage(stage: Resolution["settledStage"]) {
  switch (stage) {
    case "official_preliminary":
      return "Official preliminary";
    case "official_revised":
      return "Official revised";
    case "official_final":
      return "Official final";
    default:
      return "Market close";
  }
}

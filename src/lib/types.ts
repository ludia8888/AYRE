export const WINDOW_KEYS = ["1y", "3y", "5y", "all"] as const;
export const CONFIDENCE_TIERS = ["low", "medium", "high"] as const;
export const CLAIM_TYPES = [
  "count_by_deadline",
  "first_action_by_date",
  "cumulative_change_by_deadline",
  "threshold_cross_by_date",
  "end_value_at_date",
  "range_value_during_window",
] as const;
export const CLAIM_STATUSES = [
  "draft",
  "review",
  "published_open",
  "published_awaiting_data",
  "resolved",
  "rejected_unscoreable",
] as const;

export type WindowKey = (typeof WINDOW_KEYS)[number];
export type ConfidenceTier = (typeof CONFIDENCE_TIERS)[number];
export type ClaimType = (typeof CLAIM_TYPES)[number];
export type ClaimStatus = (typeof CLAIM_STATUSES)[number];
export type Outcome = "yes" | "no";
export type TierMap = Record<ConfidenceTier, number>;
export type ClaimDirection = "yes" | "no";
export type ScoreVersionStatus = "active" | "candidate" | "superseded";
export type ResolutionDataStage = "official_preliminary" | "official_revised" | "official_final" | "market_close";
export type SettlementPolicy = "first_official_release" | "latest_official_revision";
export type CorrectionStatus =
  | "pending_review"
  | "temporarily_unpublished"
  | "corrected"
  | "rejected";

export interface Expert {
  id: string;
  slug: string;
  displayName: string;
  headline: string;
  organization: string;
  avatarUrl: string;
  bio: string;
  domain: "macro";
  featured: boolean;
  socialLinks: {
    x?: string;
    website?: string;
  };
}

export interface SourceDocument {
  id: string;
  expertId: string;
  title: string;
  platform: string;
  url: string;
  publishedAt: string;
}

export interface ResolutionRule {
  claimType: ClaimType;
  metricKey: string;
  metricLabel: string;
  operator: string;
  threshold?: number;
  unit: string;
  deadline: string;
  range?: {
    min: number;
    max: number;
  };
}

export interface Claim {
  id: string;
  expertId: string;
  sourceDocumentId: string;
  eventKey: string;
  eventLabel: string;
  quotedText: string;
  publishedAt: string;
  deadline: string;
  claimType: ClaimType;
  predictedOutcome: ClaimDirection;
  status: ClaimStatus;
  scoreVersion: string;
  resolutionRule: ResolutionRule;
  sourceSpan?: string;
  explicitProbability?: number;
  confidenceTier?: ConfidenceTier;
  tierAssignmentReason?: string;
  tierAssignedBy?: string;
  tierAssignedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  llmSuggestedClaimType?: ClaimType;
  llmSuggestedTier?: ConfidenceTier;
  llmConfidence?: number;
  llmSuggestedProbability?: number;
  llmModelVersion?: string;
  operatorOverride?: boolean;
  overrideReason?: string;
}

export interface Resolution {
  id: string;
  claimId: string;
  outcome: Outcome;
  actualValue: string;
  evidenceUrl: string;
  resolvedAt: string;
  settlementPolicy: SettlementPolicy;
  settledStage: ResolutionDataStage;
  officialReleaseDate?: string;
  initialReleaseValue?: string;
  initialReleaseAt?: string;
  revisedValue?: string;
  revisedAt?: string;
  revisionHandling?: "tracked_no_rescore" | "retroactive_rescore";
  revisionNotes?: string;
  reviewerId: string;
  reviewerName: string;
  notes: string;
}

export interface ScoringVersion {
  id: string;
  version: string;
  label: string;
  status: ScoreVersionStatus;
  priorQuality: number;
  shrinkageK: number;
  tierMap: TierMap;
  activatedAt: string;
  calibratedAt: string;
  baselineResolvedClaims: number;
  nextReviewAt: string;
  highlightUntil: string;
  changelogTitle: string;
  changelogSummary: string;
}

export interface ChangelogEntry {
  id: string;
  version: string;
  publishedAt: string;
  title: string;
  summary: string;
  changes: string[];
}

export interface CorrectionRequest {
  id: string;
  expertSlug: string;
  claimId?: string;
  status: CorrectionStatus;
  submittedAt: string;
  summary: string;
}

export interface LaunchGate {
  label: string;
  detail: string;
  status: "done" | "in_progress" | "todo";
}

export interface SiteDataset {
  launchDate: string;
  activeScoreVersion: ScoringVersion;
  scoringVersions: ScoringVersion[];
  experts: Expert[];
  sourceDocuments: SourceDocument[];
  claims: Claim[];
  resolutions: Resolution[];
  changelogEntries: ChangelogEntry[];
  correctionRequests: CorrectionRequest[];
  launchGates: LaunchGate[];
}

export interface ResolvedClaimRecord {
  claim: Claim;
  resolution: Resolution;
  probability: number;
  brier: number;
  binaryCorrect: boolean;
}

export interface ExpertSnapshot {
  expert: Expert;
  window: WindowKey;
  scoreVersion: string;
  ayreScore: number;
  adjustedQuality: number;
  rawQuality: number;
  averageBrier: number;
  accuracy: number;
  resolvedCount: number;
  openCount: number;
  awaitingDataCount: number;
  rejectedCount: number;
  provisional: boolean;
  bestCall?: ResolvedClaimRecord;
  worstCall?: ResolvedClaimRecord;
  resolvedRecords: ResolvedClaimRecord[];
  visibleClaims: Claim[];
}

export interface SharedClaimComparison {
  eventKey: string;
  eventLabel: string;
  left?: ResolvedClaimRecord;
  right?: ResolvedClaimRecord;
  winner: "left" | "right" | "tie" | "none";
}

export interface CompareSnapshot {
  pair: string;
  window: WindowKey;
  scoreVersion: string;
  left: ExpertSnapshot;
  right: ExpertSnapshot;
  winner: "left" | "right" | "tie";
  scoreDelta: number;
  representativeCall: string;
  sharedClaims: SharedClaimComparison[];
}

export interface LeaderboardSection {
  id: string;
  title: string;
  description: string;
  rows: ExpertSnapshot[];
}

export interface ExtractedClaimCandidate {
  id: string;
  sourceSpan: string;
  normalizedQuote: string;
  eventLabel: string;
  predictedOutcome: ClaimDirection;
  llmSuggestedClaimType: ClaimType;
  llmSuggestedTier: ConfidenceTier;
  llmConfidence: number;
  llmSuggestedProbability?: number;
  llmModelVersion: string;
  operatorOverride: boolean;
  overrideReason?: string;
  approvalStatus?: "pending" | "approved" | "rejected";
}

export interface ExtractSourcePreview {
  sourceUrl?: string;
  sourceTitle?: string;
  sourceTextPreview: string;
  workflow: "text_input" | "url_fetch";
  charCount: number;
}

export interface ImportPreviewRow {
  rowNumber: number;
  status: "valid" | "invalid";
  errors: string[];
  preview: Record<string, string>;
}

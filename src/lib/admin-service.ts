import { randomUUID } from "node:crypto";

import type { ParsedImportRow } from "@/lib/admin-tools";
import { getFirebaseAdminServices } from "@/lib/firebase/server";
import { mockSiteDataset } from "@/lib/mock-data";
import { buildCompareSnapshot, buildExpertSnapshot, getLeaderboardSections } from "@/lib/scoring";
import type {
  Claim,
  ClaimDirection,
  ClaimStatus,
  ClaimType,
  ConfidenceTier,
  CorrectionRequest,
  CorrectionStatus,
  ExtractedClaimCandidate,
  Expert,
  Outcome,
  Resolution,
  ResolutionDataStage,
  ScoringVersion,
  SettlementPolicy,
  SiteDataset,
  SourceDocument,
  WindowKey,
} from "@/lib/types";

const WINDOWS: WindowKey[] = ["1y", "3y", "5y", "all"];

export interface ExpertInput {
  id?: string;
  slug?: string;
  displayName: string;
  headline: string;
  organization: string;
  avatarUrl: string;
  bio: string;
  featured: boolean;
  x?: string;
  website?: string;
}

export interface ClaimInput {
  expertId: string;
  sourceTitle: string;
  sourcePlatform?: string;
  sourceUrl: string;
  publishedAt: string;
  eventLabel: string;
  eventKey?: string;
  quotedText: string;
  claimType: ClaimType;
  predictedOutcome: ClaimDirection;
  deadline: string;
  metricKey: string;
  metricLabel: string;
  operator: string;
  threshold?: number;
  unit: string;
  status: Exclude<ClaimStatus, "resolved">;
  confidenceTier?: ConfidenceTier;
  explicitProbability?: number;
  tierAssignmentReason?: string;
  rejectionReason?: string;
  actorId?: string;
  actorName?: string;
  llmSuggestedClaimType?: ClaimType;
  llmSuggestedTier?: ConfidenceTier;
  llmConfidence?: number;
  llmSuggestedProbability?: number;
  llmModelVersion?: string;
  operatorOverride?: boolean;
  overrideReason?: string;
  sourceSpan?: string;
}

export interface ClaimWorkflowUpdateInput {
  id: string;
  status: Exclude<ClaimStatus, "draft" | "resolved">;
  confidenceTier?: ConfidenceTier;
  explicitProbability?: number;
  tierAssignmentReason?: string;
  rejectionReason?: string;
  reviewedBy?: string;
}

export interface ResolutionInput {
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
  revisionHandling?: Resolution["revisionHandling"];
  revisionNotes?: string;
  reviewerId: string;
  reviewerName: string;
  notes: string;
}

export interface CorrectionInput {
  id?: string;
  expertSlug: string;
  claimId?: string;
  status: CorrectionStatus;
  summary: string;
  linkedClaimStatus?: Exclude<ClaimStatus, "draft" | "resolved">;
}

export interface ScoringVersionInput {
  version: string;
  label: string;
  priorQuality: number;
  shrinkageK: number;
  low: number;
  medium: number;
  high: number;
  baselineResolvedClaims?: number;
  nextReviewAt: string;
  changelogTitle: string;
  changelogSummary: string;
}

export interface PublicRefreshResult {
  expertDocs: number;
  leaderboardDocs: number;
  compareDocs: number;
  cardDocs: number;
}

export interface ExtractCommitInput {
  expertId: string;
  sourceUrl?: string;
  sourceTitle: string;
  sourcePlatform?: string;
  publishedAt: string;
  candidates: ExtractedClaimCandidate[];
}

function requireAdminServices() {
  const services = getFirebaseAdminServices();
  if (!services) {
    throw new Error("Firebase Admin is not configured.");
  }

  return services;
}

function chunk<T>(items: T[], size: number) {
  const groups: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    groups.push(items.slice(index, index + size));
  }
  return groups;
}

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function slugify(value: string) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferPlatformFromUrl(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "web";
  }
}

function confidenceReasonForTier(tier?: ConfidenceTier) {
  if (tier === "high") {
    return "Contains clear conviction language such as will, strongly, or no doubt.";
  }

  if (tier === "medium") {
    return "Uses likely or base-case framing without hard certainty.";
  }

  if (tier === "low") {
    return "Uses possibility or risk framing without a hard commitment.";
  }

  return undefined;
}

function toSourceKey(expertId: string, sourceUrl: string, quote: string) {
  return `${expertId}::${sourceUrl.trim()}::${normalizeText(quote).toLowerCase()}`;
}

async function loadAdminDataset(): Promise<SiteDataset> {
  const { db } = requireAdminServices();

  const [experts, sourceDocuments, claims, resolutions, scoringVersions, changelogEntries, correctionRequests] =
    await Promise.all([
      db.collection("experts").get(),
      db.collection("source_documents").get(),
      db.collection("claims").get(),
      db.collection("resolutions").get(),
      db.collection("scoring_versions").get(),
      db.collection("methodology_changelog").get(),
      db.collection("corrections").get(),
    ]);

  const scoringVersionDocs = scoringVersions.docs.map((doc) => doc.data()) as SiteDataset["scoringVersions"];
  const activeScoreVersion =
    scoringVersionDocs.find((version) => version.status === "active") ??
    scoringVersionDocs.sort((left, right) => right.activatedAt.localeCompare(left.activatedAt))[0];

  if (!activeScoreVersion) {
    throw new Error("No scoring version found.");
  }

  return {
    launchDate: activeScoreVersion.activatedAt,
    activeScoreVersion,
    scoringVersions: scoringVersionDocs,
    experts: experts.docs.map((doc) => doc.data()) as SiteDataset["experts"],
    sourceDocuments: sourceDocuments.docs.map((doc) => doc.data()) as SiteDataset["sourceDocuments"],
    claims: claims.docs.map((doc) => doc.data()) as SiteDataset["claims"],
    resolutions: resolutions.docs.map((doc) => doc.data()) as SiteDataset["resolutions"],
    changelogEntries: changelogEntries.docs.map((doc) => doc.data()) as SiteDataset["changelogEntries"],
    correctionRequests: correctionRequests.docs.map((doc) => doc.data()) as SiteDataset["correctionRequests"],
    launchGates: mockSiteDataset.launchGates,
  };
}

function buildSourceDocumentRecord(input: ClaimInput, expertId: string, sourceId: string): SourceDocument {
  return {
    id: sourceId,
    expertId,
    title: normalizeText(input.sourceTitle),
    platform: normalizeText(input.sourcePlatform || inferPlatformFromUrl(input.sourceUrl)),
    url: input.sourceUrl.trim(),
    publishedAt: input.publishedAt,
  };
}

function buildClaimRecord(
  input: ClaimInput,
  dataset: SiteDataset,
  sourceDocumentId: string,
  claimId: string,
): Claim {
  const tierReason = input.tierAssignmentReason || confidenceReasonForTier(input.confidenceTier);
  const actorId = input.actorId ?? "ops-admin";
  const reviewedAt = new Date().toISOString();

  return {
    id: claimId,
    expertId: input.expertId,
    sourceDocumentId,
    eventKey: input.eventKey?.trim() || slugify(input.eventLabel),
    eventLabel: normalizeText(input.eventLabel),
    quotedText: normalizeText(input.quotedText),
    publishedAt: input.publishedAt,
    deadline: input.deadline,
    claimType: input.claimType,
    predictedOutcome: input.predictedOutcome,
    status: input.status,
    scoreVersion: dataset.activeScoreVersion.version,
    resolutionRule: {
      claimType: input.claimType,
      metricKey: normalizeText(input.metricKey),
      metricLabel: normalizeText(input.metricLabel),
      operator: normalizeText(input.operator),
      threshold: input.threshold,
      unit: normalizeText(input.unit),
      deadline: input.deadline,
    },
    sourceSpan: input.sourceSpan,
    explicitProbability: input.explicitProbability,
    confidenceTier: input.confidenceTier,
    tierAssignmentReason: tierReason,
    tierAssignedBy: input.confidenceTier ? actorId : undefined,
    tierAssignedAt: input.confidenceTier ? reviewedAt : undefined,
    reviewedBy: actorId,
    reviewedAt,
    rejectionReason: input.status === "rejected_unscoreable" ? input.rejectionReason : undefined,
    llmSuggestedClaimType: input.llmSuggestedClaimType ?? input.claimType,
    llmSuggestedTier: input.llmSuggestedTier ?? input.confidenceTier,
    llmConfidence: input.llmConfidence,
    llmSuggestedProbability: input.llmSuggestedProbability,
    llmModelVersion: input.llmModelVersion,
    operatorOverride: input.operatorOverride ?? false,
    overrideReason: input.overrideReason,
  };
}

function summarizePublicExpert(snapshot: ReturnType<typeof buildExpertSnapshot>) {
  return {
    expertId: snapshot.expert.id,
    slug: snapshot.expert.slug,
    displayName: snapshot.expert.displayName,
    organization: snapshot.expert.organization,
    window: snapshot.window,
    scoreVersion: snapshot.scoreVersion,
    ayreScore: snapshot.ayreScore,
    accuracy: snapshot.accuracy,
    resolvedCount: snapshot.resolvedCount,
    openCount: snapshot.openCount,
    awaitingDataCount: snapshot.awaitingDataCount,
    provisional: snapshot.provisional,
    bestCall: snapshot.bestCall
      ? {
          eventLabel: snapshot.bestCall.claim.eventLabel,
          brier: snapshot.bestCall.brier,
          outcome: snapshot.bestCall.resolution.outcome,
        }
      : null,
    worstCall: snapshot.worstCall
      ? {
          eventLabel: snapshot.worstCall.claim.eventLabel,
          brier: snapshot.worstCall.brier,
          outcome: snapshot.worstCall.resolution.outcome,
        }
      : null,
  };
}

function summarizePublicCompare(compare: ReturnType<typeof buildCompareSnapshot>) {
  return {
    pair: compare.pair,
    window: compare.window,
    scoreVersion: compare.scoreVersion,
    winner: compare.winner,
    scoreDelta: compare.scoreDelta,
    representativeCall: compare.representativeCall,
    left: {
      slug: compare.left.expert.slug,
      displayName: compare.left.expert.displayName,
      ayreScore: compare.left.ayreScore,
      resolvedCount: compare.left.resolvedCount,
    },
    right: {
      slug: compare.right.expert.slug,
      displayName: compare.right.expert.displayName,
      ayreScore: compare.right.ayreScore,
      resolvedCount: compare.right.resolvedCount,
    },
    sharedClaims: compare.sharedClaims.slice(0, 8).map((claim) => ({
      eventKey: claim.eventKey,
      eventLabel: claim.eventLabel,
      winner: claim.winner,
    })),
  };
}

export async function refreshPublicArtifacts(): Promise<PublicRefreshResult> {
  const { db } = requireAdminServices();
  const dataset = await loadAdminDataset();
  const operations: Array<{ collection: string; id: string; data: Record<string, unknown> }> = [];
  const updatedAt = new Date().toISOString();

  for (const window of WINDOWS) {
    for (const expert of dataset.experts) {
      const snapshot = buildExpertSnapshot({ expert, dataset, window });
      operations.push({
        collection: "public_experts",
        id: `${expert.slug}__${window}`,
        data: {
          ...summarizePublicExpert(snapshot),
          updatedAt,
        },
      });

      if (window === "all") {
        operations.push({
          collection: "public_cards",
          id: `expert__${expert.slug}`,
          data: {
            type: "expert",
            slug: expert.slug,
            scoreVersion: snapshot.scoreVersion,
            ayreScore: snapshot.ayreScore,
            resolvedCount: snapshot.resolvedCount,
            updatedAt,
          },
        });
      }
    }

    const sections = getLeaderboardSections({ dataset, window });
    for (const section of sections) {
      operations.push({
        collection: "public_leaderboards",
        id: `${window}__${section.id}`,
        data: {
          window,
          id: section.id,
          title: section.title,
          description: section.description,
          scoreVersion: dataset.activeScoreVersion.version,
          updatedAt,
          rows: section.rows.map((row) => ({
            slug: row.expert.slug,
            displayName: row.expert.displayName,
            ayreScore: row.ayreScore,
            accuracy: row.accuracy,
            resolvedCount: row.resolvedCount,
            provisional: row.provisional,
          })),
        },
      });
    }
  }

  for (let leftIndex = 0; leftIndex < dataset.experts.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < dataset.experts.length; rightIndex += 1) {
      const left = dataset.experts[leftIndex];
      const right = dataset.experts[rightIndex];

      if (!left || !right) {
        continue;
      }

      for (const window of WINDOWS) {
        const compare = buildCompareSnapshot({ dataset, left, right, window });
        operations.push({
          collection: "public_compares",
          id: `${compare.pair}__${window}`,
          data: {
            ...summarizePublicCompare(compare),
            updatedAt,
          },
        });

        if (window === "all") {
          operations.push({
            collection: "public_cards",
            id: `compare__${compare.pair}`,
            data: {
              type: "compare",
              pair: compare.pair,
              scoreVersion: compare.scoreVersion,
              winner: compare.winner,
              scoreDelta: compare.scoreDelta,
              representativeCall: compare.representativeCall,
              updatedAt,
            },
          });
        }
      }
    }
  }

  for (const group of chunk(operations, 400)) {
    const batch = db.batch();
    for (const operation of group) {
      batch.set(db.collection(operation.collection).doc(operation.id), operation.data, { merge: true });
    }
    await batch.commit();
  }

  return {
    expertDocs: operations.filter((item) => item.collection === "public_experts").length,
    leaderboardDocs: operations.filter((item) => item.collection === "public_leaderboards").length,
    compareDocs: operations.filter((item) => item.collection === "public_compares").length,
    cardDocs: operations.filter((item) => item.collection === "public_cards").length,
  };
}

export async function saveExpert(input: ExpertInput) {
  const { db } = requireAdminServices();
  const dataset = await loadAdminDataset();
  const slug = input.slug?.trim() || slugify(input.displayName);
  const conflicting = dataset.experts.find((expert) => expert.slug === slug && expert.id !== input.id);

  if (conflicting) {
    throw new Error(`Expert slug "${slug}" already exists.`);
  }

  const expert: Expert = {
    id: input.id ?? `expert-${slug}`,
    slug,
    displayName: normalizeText(input.displayName),
    headline: normalizeText(input.headline),
    organization: normalizeText(input.organization),
    avatarUrl: input.avatarUrl.trim() || `/avatars/${slug}.svg`,
    bio: normalizeText(input.bio),
    domain: "macro",
    featured: input.featured,
    socialLinks: {
      x: input.x?.trim() || undefined,
      website: input.website?.trim() || undefined,
    },
  };

  await db.collection("experts").doc(expert.id).set(expert, { merge: true });
  await refreshPublicArtifacts();

  return expert;
}

export async function createClaim(input: ClaimInput) {
  const { db } = requireAdminServices();
  const dataset = await loadAdminDataset();
  const expert = dataset.experts.find((item) => item.id === input.expertId);

  if (!expert) {
    throw new Error("Expert not found.");
  }

  if (input.status === "rejected_unscoreable" && !input.rejectionReason) {
    throw new Error("Rejected claims require a rejection reason.");
  }

  const duplicateKey = toSourceKey(expert.id, input.sourceUrl, input.quotedText);
  const existingSources = new Map(dataset.sourceDocuments.map((item) => [item.id, item]));
  const existingKeys = new Set(
    dataset.claims.map((claim) => {
      const source = existingSources.get(claim.sourceDocumentId);
      return source ? toSourceKey(claim.expertId, source.url, claim.quotedText) : "";
    }),
  );

  if (existingKeys.has(duplicateKey)) {
    throw new Error("A claim with the same source URL and quote already exists for this expert.");
  }

  const sourceDocument = buildSourceDocumentRecord(input, expert.id, `source-${randomUUID()}`);
  const claim = buildClaimRecord(input, dataset, sourceDocument.id, `claim-${randomUUID()}`);

  const batch = db.batch();
  batch.set(db.collection("source_documents").doc(sourceDocument.id), sourceDocument);
  batch.set(db.collection("claims").doc(claim.id), claim);
  await batch.commit();

  if (claim.status !== "review" && claim.status !== "draft") {
    await refreshPublicArtifacts();
  }

  return { sourceDocument, claim };
}

export async function updateClaimWorkflow(input: ClaimWorkflowUpdateInput) {
  const { db } = requireAdminServices();
  const dataset = await loadAdminDataset();
  const claim = dataset.claims.find((item) => item.id === input.id);

  if (!claim) {
    throw new Error("Claim not found.");
  }

  if (input.status === "rejected_unscoreable" && !input.rejectionReason) {
    throw new Error("Rejected claims require a rejection reason.");
  }

  const patch: Partial<Claim> = {
    status: input.status,
    confidenceTier: input.confidenceTier,
    explicitProbability: input.explicitProbability,
    tierAssignmentReason: input.tierAssignmentReason || confidenceReasonForTier(input.confidenceTier),
    rejectionReason: input.status === "rejected_unscoreable" ? input.rejectionReason : undefined,
    reviewedBy: input.reviewedBy ?? "ops-admin",
    reviewedAt: new Date().toISOString(),
    tierAssignedBy: input.confidenceTier ? input.reviewedBy ?? "ops-admin" : undefined,
    tierAssignedAt: input.confidenceTier ? new Date().toISOString() : undefined,
    scoreVersion: dataset.activeScoreVersion.version,
  };

  await db.collection("claims").doc(input.id).set(patch, { merge: true });
  await refreshPublicArtifacts();

  return {
    ...claim,
    ...patch,
  } satisfies Claim;
}

export async function upsertResolution(input: ResolutionInput) {
  const { db } = requireAdminServices();
  const dataset = await loadAdminDataset();
  const claim = dataset.claims.find((item) => item.id === input.claimId);

  if (!claim) {
    throw new Error("Claim not found.");
  }

  const existingResolution = dataset.resolutions.find((item) => item.claimId === input.claimId);
  const resolution: Resolution = {
    id: existingResolution?.id ?? `resolution-${randomUUID()}`,
    claimId: input.claimId,
    outcome: input.outcome,
    actualValue: normalizeText(input.actualValue),
    evidenceUrl: input.evidenceUrl.trim(),
    resolvedAt: input.resolvedAt,
    settlementPolicy: input.settlementPolicy,
    settledStage: input.settledStage,
    officialReleaseDate: input.officialReleaseDate,
    initialReleaseValue: input.initialReleaseValue,
    initialReleaseAt: input.initialReleaseAt,
    revisedValue: input.revisedValue,
    revisedAt: input.revisedAt,
    revisionHandling: input.revisionHandling,
    revisionNotes: input.revisionNotes,
    reviewerId: input.reviewerId,
    reviewerName: input.reviewerName,
    notes: normalizeText(input.notes),
  };

  const batch = db.batch();
  batch.set(db.collection("resolutions").doc(resolution.id), resolution, { merge: true });
  batch.set(
    db.collection("claims").doc(claim.id),
    {
      status: "resolved",
      reviewedBy: input.reviewerId,
      reviewedAt: new Date().toISOString(),
    } satisfies Partial<Claim>,
    { merge: true },
  );
  await batch.commit();

  await refreshPublicArtifacts();
  return resolution;
}

export async function saveCorrection(input: CorrectionInput) {
  const { db } = requireAdminServices();
  const correction: CorrectionRequest = {
    id: input.id ?? `correction-${randomUUID()}`,
    expertSlug: input.expertSlug,
    claimId: input.claimId || undefined,
    status: input.status,
    submittedAt: new Date().toISOString(),
    summary: normalizeText(input.summary),
  };

  const batch = db.batch();
  batch.set(db.collection("corrections").doc(correction.id), correction, { merge: true });

  if (input.claimId && input.linkedClaimStatus) {
    batch.set(
      db.collection("claims").doc(input.claimId),
      {
        status: input.linkedClaimStatus,
        reviewedAt: new Date().toISOString(),
        reviewedBy: "ops-admin",
      } satisfies Partial<Claim>,
      { merge: true },
    );
  }

  await batch.commit();
  await refreshPublicArtifacts();

  return correction;
}

export async function createCandidateScoringVersion(input: ScoringVersionInput) {
  const { db } = requireAdminServices();
  const dataset = await loadAdminDataset();

  if (dataset.scoringVersions.some((item) => item.version === input.version)) {
    throw new Error(`Scoring version "${input.version}" already exists.`);
  }

  const now = new Date().toISOString();
  const version: ScoringVersion = {
    id: `score-${slugify(input.version)}`,
    version: input.version,
    label: normalizeText(input.label),
    status: "candidate",
    priorQuality: input.priorQuality,
    shrinkageK: input.shrinkageK,
    tierMap: {
      low: input.low,
      medium: input.medium,
      high: input.high,
    },
    activatedAt: now,
    calibratedAt: now,
    baselineResolvedClaims: input.baselineResolvedClaims ?? dataset.resolutions.length,
    nextReviewAt: input.nextReviewAt,
    highlightUntil: now,
    changelogTitle: normalizeText(input.changelogTitle),
    changelogSummary: normalizeText(input.changelogSummary),
  };

  await db.collection("scoring_versions").doc(version.id).set(version);
  return version;
}

export async function activateScoringVersion(versionId: string) {
  const { db } = requireAdminServices();
  const dataset = await loadAdminDataset();
  const target = dataset.scoringVersions.find((item) => item.id === versionId);

  if (!target) {
    throw new Error("Scoring version not found.");
  }

  const now = new Date();
  const nowIso = now.toISOString();
  const highlightUntil = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();
  const batch = db.batch();

  for (const version of dataset.scoringVersions) {
    const nextStatus =
      version.id === versionId ? "active" : version.status === "active" ? "superseded" : version.status;

    batch.set(
      db.collection("scoring_versions").doc(version.id),
      {
        status: nextStatus,
        activatedAt: version.id === versionId ? nowIso : version.activatedAt,
        highlightUntil: version.id === versionId ? highlightUntil : version.highlightUntil,
      } satisfies Partial<ScoringVersion>,
      { merge: true },
    );
  }

  for (const claim of dataset.claims) {
    batch.set(
      db.collection("claims").doc(claim.id),
      {
        scoreVersion: target.version,
      } satisfies Partial<Claim>,
      { merge: true },
    );
  }

  const changelogId = `changelog-${randomUUID()}`;

  batch.set(db.collection("methodology_changelog").doc(changelogId), {
    id: changelogId,
    version: target.version,
    publishedAt: nowIso,
    title: target.changelogTitle,
    summary: target.changelogSummary,
    changes: [
      `Activated ${target.version}`,
      `Shrinkage K ${target.shrinkageK}`,
      `Tier map ${target.tierMap.low}/${target.tierMap.medium}/${target.tierMap.high}`,
    ],
  });

  await batch.commit();
  await refreshPublicArtifacts();

  return {
    versionId,
    activeVersion: target.version,
  };
}

export async function commitImportRows(rows: ParsedImportRow[]) {
  const { db } = requireAdminServices();
  const dataset = await loadAdminDataset();
  const sourceById = new Map(dataset.sourceDocuments.map((item) => [item.id, item]));
  const existingKeys = new Set(
    dataset.claims.map((claim) => {
      const source = sourceById.get(claim.sourceDocumentId);
      return source ? toSourceKey(claim.expertId, source.url, claim.quotedText) : "";
    }),
  );

  const expertBySlug = new Map(dataset.experts.map((expert) => [expert.slug, expert]));
  const drafts: Array<{ sourceDocument: SourceDocument; claim: Claim }> = [];

  for (const row of rows) {
    const expert = expertBySlug.get(row.expertSlug);
    if (!expert) {
      throw new Error(`Unknown expert slug "${row.expertSlug}"`);
    }

    const duplicateKey = toSourceKey(expert.id, row.sourceUrl, row.quote);
    if (existingKeys.has(duplicateKey)) {
      continue;
    }

    const sourceDocument = buildSourceDocumentRecord(
      {
        expertId: expert.id,
        sourceTitle: row.eventLabel,
        sourceUrl: row.sourceUrl,
        sourcePlatform: inferPlatformFromUrl(row.sourceUrl),
        publishedAt: row.publishedAt,
        eventLabel: row.eventLabel,
        quotedText: row.quote,
        claimType: row.claimType as ClaimType,
        predictedOutcome: row.predictedOutcome,
        deadline: row.deadline,
        metricKey: "pending_review",
        metricLabel: "Pending review rule",
        operator: "pending_review",
        threshold: undefined,
        unit: "pending",
        status: "review",
      },
      expert.id,
      `source-${randomUUID()}`,
    );

    const claim = buildClaimRecord(
      {
        expertId: expert.id,
        sourceTitle: sourceDocument.title,
        sourcePlatform: sourceDocument.platform,
        sourceUrl: sourceDocument.url,
        publishedAt: sourceDocument.publishedAt,
        eventLabel: row.eventLabel,
        quotedText: row.quote,
        claimType: row.claimType as ClaimType,
        predictedOutcome: row.predictedOutcome,
        deadline: row.deadline,
        metricKey: "pending_review",
        metricLabel: "Pending review rule",
        operator: "pending_review",
        threshold: undefined,
        unit: "pending",
        status: "review",
        actorId: "ops-import",
      },
      dataset,
      sourceDocument.id,
      `claim-${randomUUID()}`,
    );

    existingKeys.add(duplicateKey);
    drafts.push({ sourceDocument, claim });
  }

  for (const group of chunk(drafts, 150)) {
    const batch = db.batch();
    for (const item of group) {
      batch.set(db.collection("source_documents").doc(item.sourceDocument.id), item.sourceDocument);
      batch.set(db.collection("claims").doc(item.claim.id), item.claim);
    }
    await batch.commit();
  }

  return {
    createdClaims: drafts.length,
  };
}

export async function commitExtractCandidates(input: ExtractCommitInput) {
  const { db } = requireAdminServices();
  const dataset = await loadAdminDataset();
  const expert = dataset.experts.find((item) => item.id === input.expertId);

  if (!expert) {
    throw new Error("Expert not found.");
  }

  const approved = input.candidates.filter((candidate) => candidate.approvalStatus === "approved");
  if (approved.length === 0) {
    throw new Error("Approve at least one candidate before creating review drafts.");
  }

  const sourceDocument: SourceDocument = {
    id: `source-${randomUUID()}`,
    expertId: expert.id,
    title: normalizeText(input.sourceTitle),
    platform: normalizeText(input.sourcePlatform || inferPlatformFromUrl(input.sourceUrl || "")),
    url: input.sourceUrl?.trim() || `internal://extract/${randomUUID()}`,
    publishedAt: input.publishedAt,
  };

  const batch = db.batch();
  batch.set(db.collection("source_documents").doc(sourceDocument.id), sourceDocument);

  for (const candidate of approved) {
    const claim = buildClaimRecord(
      {
        expertId: expert.id,
        sourceTitle: sourceDocument.title,
        sourcePlatform: sourceDocument.platform,
        sourceUrl: sourceDocument.url,
        publishedAt: input.publishedAt,
        eventLabel: candidate.eventLabel,
        quotedText: candidate.normalizedQuote,
        claimType: candidate.llmSuggestedClaimType,
        predictedOutcome: candidate.predictedOutcome,
        deadline: input.publishedAt,
        metricKey: "pending_review",
        metricLabel: "Pending review rule",
        operator: "pending_review",
        threshold: undefined,
        unit: "pending",
        status: "review",
        confidenceTier: candidate.llmSuggestedTier,
        explicitProbability: candidate.llmSuggestedProbability,
        actorId: "ops-extract",
        llmSuggestedClaimType: candidate.llmSuggestedClaimType,
        llmSuggestedTier: candidate.llmSuggestedTier,
        llmConfidence: candidate.llmConfidence,
        llmSuggestedProbability: candidate.llmSuggestedProbability,
        llmModelVersion: candidate.llmModelVersion,
        operatorOverride: candidate.operatorOverride,
        overrideReason: candidate.overrideReason,
        sourceSpan: candidate.sourceSpan,
      },
      dataset,
      sourceDocument.id,
      `claim-${randomUUID()}`,
    );

    batch.set(db.collection("claims").doc(claim.id), claim);
  }

  await batch.commit();

  return {
    createdClaims: approved.length,
    sourceDocument,
  };
}

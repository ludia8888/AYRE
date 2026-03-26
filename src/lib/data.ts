import { unstable_noStore as noStore } from "next/cache";

import { getDb, schema } from "@/lib/db";
import { mockSiteDataset } from "@/lib/mock-data";
import { buildCompareSnapshot, buildExpertSnapshot, buildPairSlug, getLeaderboardSections, splitPairSlug } from "@/lib/scoring";
import type {
  CompareSnapshot,
  SiteDataset,
  WindowKey,
} from "@/lib/types";

async function fetchDatabaseDataset(): Promise<SiteDataset | null> {
  noStore();

  const db = getDb();
  if (!db) {
    return null;
  }

  try {
    const [expertRows, sourceDocRows, claimRows, resolutionRows, scoringVersionRows, changelogRows, correctionRows] =
      await Promise.all([
        db.select().from(schema.experts),
        db.select().from(schema.sourceDocuments),
        db.select().from(schema.claims),
        db.select().from(schema.resolutions),
        db.select().from(schema.scoringVersions),
        db.select().from(schema.changelogEntries),
        db.select().from(schema.corrections),
      ]);

    // Map DB rows to app types (camelCase mapping)
    const expertsMapped = expertRows.map((r) => ({
      id: r.id,
      slug: r.slug,
      displayName: r.displayName,
      headline: r.headline,
      organization: r.organization,
      avatarUrl: r.avatarUrl,
      bio: r.bio,
      domain: r.domain as "macro",
      featured: r.featured,
      socialLinks: (r.socialLinks ?? {}) as { x?: string; website?: string },
    }));

    const sourceDocsMapped = sourceDocRows.map((r) => ({
      id: r.id,
      expertId: r.expertId,
      title: r.title,
      platform: r.platform,
      url: r.url,
      publishedAt: r.publishedAt,
    }));

    const claimsMapped = claimRows.map((r) => ({
      id: r.id,
      expertId: r.expertId,
      sourceDocumentId: r.sourceDocumentId,
      eventKey: r.eventKey,
      eventLabel: r.eventLabel,
      quotedText: r.quotedText,
      publishedAt: r.publishedAt,
      deadline: r.deadline,
      claimType: r.claimType as SiteDataset["claims"][number]["claimType"],
      predictedOutcome: r.predictedOutcome as "yes" | "no",
      status: r.status as SiteDataset["claims"][number]["status"],
      scoreVersion: r.scoreVersion,
      resolutionRule: r.resolutionRule as SiteDataset["claims"][number]["resolutionRule"],
      sourceSpan: r.sourceSpan ?? undefined,
      explicitProbability: r.explicitProbability ? Number(r.explicitProbability) : undefined,
      confidenceTier: (r.confidenceTier as "low" | "medium" | "high" | undefined) ?? undefined,
      tierAssignmentReason: r.tierAssignmentReason ?? undefined,
      tierAssignedBy: r.tierAssignedBy ?? undefined,
      tierAssignedAt: r.tierAssignedAt ?? undefined,
      reviewedBy: r.reviewedBy ?? undefined,
      reviewedAt: r.reviewedAt ?? undefined,
      rejectionReason: r.rejectionReason ?? undefined,
      llmSuggestedClaimType: r.llmSuggestedClaimType as SiteDataset["claims"][number]["claimType"] | undefined,
      llmSuggestedTier: (r.llmSuggestedTier as "low" | "medium" | "high" | undefined) ?? undefined,
      llmConfidence: r.llmConfidence ? Number(r.llmConfidence) : undefined,
      llmSuggestedProbability: r.llmSuggestedProbability ? Number(r.llmSuggestedProbability) : undefined,
      llmModelVersion: r.llmModelVersion ?? undefined,
      operatorOverride: r.operatorOverride ?? undefined,
      overrideReason: r.overrideReason ?? undefined,
    }));

    const resolutionsMapped = resolutionRows.map((r) => ({
      id: r.id,
      claimId: r.claimId,
      outcome: r.outcome as "yes" | "no",
      actualValue: r.actualValue,
      evidenceUrl: r.evidenceUrl,
      resolvedAt: r.resolvedAt,
      settlementPolicy: r.settlementPolicy as "first_official_release" | "latest_official_revision",
      settledStage: r.settledStage as "official_preliminary" | "official_revised" | "official_final" | "market_close",
      officialReleaseDate: r.officialReleaseDate ?? undefined,
      initialReleaseValue: r.initialReleaseValue ?? undefined,
      initialReleaseAt: r.initialReleaseAt ?? undefined,
      revisedValue: r.revisedValue ?? undefined,
      revisedAt: r.revisedAt ?? undefined,
      revisionHandling: (r.revisionHandling as "tracked_no_rescore" | "retroactive_rescore" | undefined) ?? undefined,
      revisionNotes: r.revisionNotes ?? undefined,
      reviewerId: r.reviewerId,
      reviewerName: r.reviewerName,
      notes: r.notes,
    }));

    const scoringVersionsMapped = scoringVersionRows.map((r) => ({
      id: r.id,
      version: r.version,
      label: r.label,
      status: r.status as "active" | "candidate" | "superseded",
      priorQuality: Number(r.priorQuality),
      shrinkageK: Number(r.shrinkageK),
      tierMap: r.tierMap as { low: number; medium: number; high: number },
      activatedAt: r.activatedAt,
      calibratedAt: r.calibratedAt,
      baselineResolvedClaims: Number(r.baselineResolvedClaims),
      nextReviewAt: r.nextReviewAt,
      highlightUntil: r.highlightUntil,
      changelogTitle: r.changelogTitle,
      changelogSummary: r.changelogSummary,
    }));

    const changelogMapped = changelogRows.map((r) => ({
      id: r.id,
      version: r.version,
      publishedAt: r.publishedAt,
      title: r.title,
      summary: r.summary,
      changes: r.changes as string[],
    }));

    const correctionsMapped = correctionRows.map((r) => ({
      id: r.id,
      expertSlug: r.expertSlug,
      claimId: r.claimId ?? undefined,
      status: r.status as "pending_review" | "temporarily_unpublished" | "corrected" | "rejected",
      submittedAt: r.submittedAt,
      summary: r.summary,
    }));

    const activeScoreVersion =
      scoringVersionsMapped.find((v) => v.status === "active") ?? mockSiteDataset.activeScoreVersion;

    return {
      launchDate: activeScoreVersion.activatedAt,
      activeScoreVersion,
      scoringVersions: scoringVersionsMapped,
      experts: expertsMapped,
      sourceDocuments: sourceDocsMapped,
      claims: claimsMapped,
      resolutions: resolutionsMapped,
      changelogEntries: changelogMapped,
      correctionRequests: correctionsMapped,
      launchGates: mockSiteDataset.launchGates,
    };
  } catch (error) {
    console.error("[AYRE] Database fetch failed, falling back to mock data:", error instanceof Error ? error.message : error);
    return null;
  }
}

export async function getSiteDataset() {
  return (await fetchDatabaseDataset()) ?? mockSiteDataset;
}

export async function getExpertBySlug(slug: string) {
  const dataset = await getSiteDataset();
  return dataset.experts.find((expert) => expert.slug === slug) ?? null;
}

export async function getExpertSnapshotBySlug(slug: string, window: WindowKey = "all") {
  const dataset = await getSiteDataset();
  const expert = dataset.experts.find((item) => item.slug === slug);
  if (!expert) {
    return null;
  }

  return buildExpertSnapshot({ expert, dataset, window });
}

export async function getAllExpertSnapshots(window: WindowKey = "all") {
  const dataset = await getSiteDataset();
  return dataset.experts.map((expert) => buildExpertSnapshot({ expert, dataset, window }));
}

export async function getLeaderboard(window: WindowKey = "all") {
  const dataset = await getSiteDataset();
  return getLeaderboardSections({ dataset, window });
}

export async function getCompareSnapshot(pair: string, window: WindowKey = "all"): Promise<CompareSnapshot | null> {
  const dataset = await getSiteDataset();
  const { left, right } = splitPairSlug(pair);
  const leftExpert = dataset.experts.find((expert) => expert.slug === left);
  const rightExpert = dataset.experts.find((expert) => expert.slug === right);

  if (!leftExpert || !rightExpert) {
    return null;
  }

  return buildCompareSnapshot({ dataset, left: leftExpert, right: rightExpert, window });
}

export async function getFeaturedCompare() {
  const dataset = await getSiteDataset();
  const left = dataset.experts.find((expert) => expert.slug === "nouriel-roubini");
  const right = dataset.experts.find((expert) => expert.slug === "cathie-wood");

  if (!left || !right) {
    return null;
  }

  return buildCompareSnapshot({ dataset, left, right, window: "all" });
}

export async function getFeaturedExperts() {
  const dataset = await getSiteDataset();
  return dataset.experts.filter((expert) => expert.featured).map((expert) => buildExpertSnapshot({ expert, dataset }));
}

export async function getPairOptions() {
  const dataset = await getSiteDataset();
  const pairs = [
    ["nouriel-roubini", "cathie-wood"],
    ["lyn-alden", "mohamed-el-erian"],
    ["ed-yardeni", "jim-cramer"],
  ];

  return pairs
    .map(([left, right]) => {
      const leftExpert = dataset.experts.find((expert) => expert.slug === left);
      const rightExpert = dataset.experts.find((expert) => expert.slug === right);

      if (!leftExpert || !rightExpert) {
        return null;
      }

      return {
        slug: buildPairSlug(leftExpert.slug, rightExpert.slug),
        label: `${leftExpert.displayName} vs ${rightExpert.displayName}`,
      };
    })
    .filter(Boolean) as { slug: string; label: string }[];
}

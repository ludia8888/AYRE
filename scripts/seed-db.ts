import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { mockSiteDataset } from "../src/lib/mock-data";
import * as schema from "../src/lib/db/schema";

const DATABASE_URL = process.env.DATABASE_URL ?? "postgresql://isihyeon@localhost:5432/ayre";

async function main() {
  const client = postgres(DATABASE_URL);
  const db = drizzle(client, { schema });

  console.log("Seeding database...");

  // Clear existing data (in reverse FK order)
  await db.delete(schema.corrections);
  await db.delete(schema.changelogEntries);
  await db.delete(schema.resolutions);
  await db.delete(schema.claims);
  await db.delete(schema.sourceDocuments);
  await db.delete(schema.scoringVersions);
  await db.delete(schema.experts);

  // Insert experts
  for (const expert of mockSiteDataset.experts) {
    await db.insert(schema.experts).values({
      id: expert.id,
      slug: expert.slug,
      displayName: expert.displayName,
      headline: expert.headline,
      organization: expert.organization,
      avatarUrl: expert.avatarUrl,
      bio: expert.bio,
      domain: expert.domain,
      featured: expert.featured,
      socialLinks: expert.socialLinks,
    });
  }
  console.log(`  Experts: ${mockSiteDataset.experts.length}`);

  // Insert source documents
  for (const doc of mockSiteDataset.sourceDocuments) {
    await db.insert(schema.sourceDocuments).values({
      id: doc.id,
      expertId: doc.expertId,
      title: doc.title,
      platform: doc.platform,
      url: doc.url,
      publishedAt: doc.publishedAt,
    });
  }
  console.log(`  Source docs: ${mockSiteDataset.sourceDocuments.length}`);

  // Insert scoring versions
  for (const sv of mockSiteDataset.scoringVersions) {
    await db.insert(schema.scoringVersions).values({
      id: sv.id,
      version: sv.version,
      label: sv.label,
      status: sv.status,
      priorQuality: String(sv.priorQuality),
      shrinkageK: String(sv.shrinkageK),
      tierMap: sv.tierMap,
      activatedAt: sv.activatedAt,
      calibratedAt: sv.calibratedAt,
      baselineResolvedClaims: String(sv.baselineResolvedClaims),
      nextReviewAt: sv.nextReviewAt,
      highlightUntil: sv.highlightUntil,
      changelogTitle: sv.changelogTitle,
      changelogSummary: sv.changelogSummary,
    });
  }
  console.log(`  Scoring versions: ${mockSiteDataset.scoringVersions.length}`);

  // Insert claims
  for (const claim of mockSiteDataset.claims) {
    await db.insert(schema.claims).values({
      id: claim.id,
      expertId: claim.expertId,
      sourceDocumentId: claim.sourceDocumentId,
      eventKey: claim.eventKey,
      eventLabel: claim.eventLabel,
      quotedText: claim.quotedText,
      publishedAt: claim.publishedAt,
      deadline: claim.deadline,
      claimType: claim.claimType,
      predictedOutcome: claim.predictedOutcome,
      status: claim.status,
      scoreVersion: claim.scoreVersion,
      resolutionRule: claim.resolutionRule,
      confidenceTier: claim.confidenceTier,
      tierAssignmentReason: claim.tierAssignmentReason,
    });
  }
  console.log(`  Claims: ${mockSiteDataset.claims.length}`);

  // Insert resolutions
  for (const res of mockSiteDataset.resolutions) {
    await db.insert(schema.resolutions).values({
      id: res.id,
      claimId: res.claimId,
      outcome: res.outcome,
      actualValue: res.actualValue,
      evidenceUrl: res.evidenceUrl,
      resolvedAt: res.resolvedAt,
      settlementPolicy: res.settlementPolicy,
      settledStage: res.settledStage,
      reviewerId: res.reviewerId,
      reviewerName: res.reviewerName,
      notes: res.notes,
    });
  }
  console.log(`  Resolutions: ${mockSiteDataset.resolutions.length}`);

  // Insert changelog entries
  for (const entry of mockSiteDataset.changelogEntries) {
    await db.insert(schema.changelogEntries).values({
      id: entry.id,
      version: entry.version,
      publishedAt: entry.publishedAt,
      title: entry.title,
      summary: entry.summary,
      changes: entry.changes,
    });
  }
  console.log(`  Changelog entries: ${mockSiteDataset.changelogEntries.length}`);

  // Insert corrections
  for (const corr of mockSiteDataset.correctionRequests) {
    await db.insert(schema.corrections).values({
      id: corr.id,
      expertSlug: corr.expertSlug,
      claimId: corr.claimId,
      status: corr.status,
      submittedAt: corr.submittedAt,
      summary: corr.summary,
    });
  }
  console.log(`  Corrections: ${mockSiteDataset.correctionRequests.length}`);

  console.log("\nDone! Database seeded successfully.");
  await client.end();
}

void main();

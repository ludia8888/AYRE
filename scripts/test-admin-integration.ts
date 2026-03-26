import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  commitExtractCandidates,
  commitImportRows,
  createClaim,
  refreshPublicArtifacts,
  saveCorrection,
  saveExpert,
  updateClaimWorkflow,
  upsertResolution,
} from "../src/lib/admin-service";
import { getFirebaseAdminServices } from "../src/lib/firebase/server";

function loadEnvFile(filePath: string) {
  const raw = readFileSync(filePath, "utf8");

  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");
    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();

    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

async function main() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  loadEnvFile(path.resolve(scriptDir, "..", ".env.local"));

  const services = getFirebaseAdminServices();
  if (!services) {
    throw new Error("Firebase Admin env is missing.");
  }

  const suffix = Date.now().toString();
  const slug = `integration-${suffix}`;
  const createdDocIds = {
    experts: [] as string[],
    claims: [] as string[],
    resolutions: [] as string[],
    sources: [] as string[],
    corrections: [] as string[],
  };

  try {
    const expert = await saveExpert({
      displayName: `Integration ${suffix}`,
      slug,
      headline: "Integration flow for admin tooling.",
      organization: "AYRE Test Lab",
      avatarUrl: `/avatars/${slug}.svg`,
      bio: "Temporary record used by the live Firebase admin integration test.",
      featured: false,
    });
    createdDocIds.experts.push(expert.id);

    const manualClaim = await createClaim({
      expertId: expert.id,
      sourceTitle: "Integration manual source",
      sourceUrl: `https://example.com/${slug}/manual`,
      publishedAt: new Date().toISOString(),
      eventLabel: "Integration claim should resolve yes",
      quotedText: "I expect the integration test claim to resolve yes by year end.",
      claimType: "threshold_cross_by_date",
      predictedOutcome: "yes",
      deadline: new Date(Date.now() + 86400000).toISOString(),
      metricKey: "integration_metric",
      metricLabel: "Integration metric",
      operator: "gte",
      threshold: 1,
      unit: "index",
      status: "review",
      confidenceTier: "medium",
      tierAssignmentReason: "Integration tier assignment",
      actorId: "integration-suite",
    });
    createdDocIds.claims.push(manualClaim.claim.id);
    createdDocIds.sources.push(manualClaim.sourceDocument.id);

    const published = await updateClaimWorkflow({
      id: manualClaim.claim.id,
      status: "published_open",
      confidenceTier: "high",
      tierAssignmentReason: "Published by integration suite",
      reviewedBy: "integration-suite",
    });
    assert.equal(published.status, "published_open");

    const resolution = await upsertResolution({
      claimId: manualClaim.claim.id,
      outcome: "yes",
      actualValue: "1.0",
      evidenceUrl: `https://example.com/${slug}/evidence`,
      resolvedAt: new Date().toISOString(),
      settlementPolicy: "first_official_release",
      settledStage: "official_preliminary",
      reviewerId: "integration-suite",
      reviewerName: "Integration Suite",
      notes: "Resolved during integration test.",
    });
    createdDocIds.resolutions.push(resolution.id);

    const importResult = await commitImportRows([
      {
        expertSlug: expert.slug,
        sourceUrl: `https://example.com/${slug}/import`,
        quote: "We expect imported integration drafts to land in review.",
        publishedAt: new Date().toISOString(),
        eventLabel: "Imported integration draft",
        claimType: "threshold_cross_by_date",
        predictedOutcome: "yes",
        deadline: new Date(Date.now() + 172800000).toISOString(),
      },
    ]);
    assert.equal(importResult.createdClaims, 1);

    const afterImportClaims = await services.db.collection("claims").where("expertId", "==", expert.id).get();
    afterImportClaims.docs.forEach((doc) => {
      if (!createdDocIds.claims.includes(doc.id)) {
        createdDocIds.claims.push(doc.id);
      }
    });
    const afterImportSources = await services.db.collection("source_documents").where("expertId", "==", expert.id).get();
    afterImportSources.docs.forEach((doc) => {
      if (!createdDocIds.sources.includes(doc.id)) {
        createdDocIds.sources.push(doc.id);
      }
    });

    const extractResult = await commitExtractCandidates({
      expertId: expert.id,
      sourceTitle: "Integration extract source",
      sourceUrl: `https://example.com/${slug}/extract`,
      publishedAt: new Date().toISOString(),
      candidates: [
        {
          id: "candidate-1",
          sourceSpan: "I strongly believe the extract integration claim should be reviewed.",
          normalizedQuote: "I strongly believe the extract integration claim should be reviewed.",
          eventLabel: "Extract integration draft",
          predictedOutcome: "yes",
          llmSuggestedClaimType: "first_action_by_date",
          llmSuggestedTier: "high",
          llmConfidence: 0.91,
          llmSuggestedProbability: 0.8,
          llmModelVersion: "integration-test",
          operatorOverride: true,
          overrideReason: "Approved by integration suite",
          approvalStatus: "approved",
        },
      ],
    });
    assert.equal(extractResult.createdClaims, 1);
    createdDocIds.sources.push(extractResult.sourceDocument.id);

    const correction = await saveCorrection({
      expertSlug: expert.slug,
      claimId: manualClaim.claim.id,
      status: "pending_review",
      summary: "Integration correction request",
    });
    createdDocIds.corrections.push(correction.id);

    const refreshResult = await refreshPublicArtifacts();
    assert.ok(refreshResult.expertDocs > 0);

    const publicExpert = await services.db.collection("public_experts").doc(`${expert.slug}__all`).get();
    assert.equal(publicExpert.exists, true);

    console.log(
      JSON.stringify(
        {
          status: "ok",
          slug,
          refreshResult,
          createdDocIds,
        },
        null,
        2,
      ),
    );
  } finally {
    const { db } = services;
    const cleanupCollections = ["public_experts", "public_compares", "public_cards"];

    for (const collectionName of cleanupCollections) {
      const snapshot = await db.collection(collectionName).get();
      const matchingDocs = snapshot.docs.filter((doc) => doc.id.includes(slug));

      for (const doc of matchingDocs) {
        await doc.ref.delete();
      }
    }

    for (const id of createdDocIds.corrections) {
      await db.collection("corrections").doc(id).delete().catch(() => undefined);
    }

    for (const id of createdDocIds.resolutions) {
      await db.collection("resolutions").doc(id).delete().catch(() => undefined);
    }

    for (const id of createdDocIds.claims) {
      await db.collection("claims").doc(id).delete().catch(() => undefined);
    }

    for (const id of createdDocIds.sources) {
      await db.collection("source_documents").doc(id).delete().catch(() => undefined);
    }

    for (const id of createdDocIds.experts) {
      await db.collection("experts").doc(id).delete().catch(() => undefined);
    }
  }
}

void main();

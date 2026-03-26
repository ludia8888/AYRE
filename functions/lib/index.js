"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueSourceExtraction = exports.refreshLeaderboardsNow = exports.sweepAwaitingData = exports.refreshLeaderboards = exports.onResolutionWrite = void 0;
const v2_1 = require("firebase-functions/v2");
const firestore_1 = require("firebase-functions/v2/firestore");
const https_1 = require("firebase-functions/v2/https");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const app_1 = require("firebase-admin/app");
const firestore_2 = require("firebase-admin/firestore");
(0, app_1.initializeApp)();
(0, v2_1.setGlobalOptions)({ region: "us-central1", maxInstances: 10 });
const db = (0, firestore_2.getFirestore)();
function stripHtmlToText(html) {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
function inferClaimType(text) {
    const normalized = text.toLowerCase();
    if (normalized.includes("first cut") ||
        normalized.includes("before q4") ||
        (normalized.includes("first") && normalized.match(/\bq[1-4]\b/))) {
        return "first_action_by_date";
    }
    if (normalized.includes("cuts") || normalized.match(/\b\d+\s+cuts?\b/)) {
        return "count_by_deadline";
    }
    if (normalized.includes("basis points") || normalized.includes("bp")) {
        return "cumulative_change_by_deadline";
    }
    if (normalized.includes("between ") || normalized.includes("range")) {
        return "range_value_during_window";
    }
    if (normalized.includes("ends") ||
        normalized.includes("end the year") ||
        normalized.includes("year end") ||
        normalized.includes("close")) {
        return "end_value_at_date";
    }
    return "threshold_cross_by_date";
}
function inferTier(text) {
    const normalized = text.toLowerCase();
    if (normalized.includes("no doubt") ||
        normalized.includes("definitely") ||
        normalized.includes("strongly") ||
        normalized.includes("will ")) {
        return "high";
    }
    if (normalized.includes("likely") || normalized.includes("expect") || normalized.includes("base case")) {
        return "medium";
    }
    return "low";
}
function inferDirection(text) {
    const normalized = text.toLowerCase();
    if (normalized.includes("won't") ||
        normalized.includes("will not") ||
        normalized.includes("do not") ||
        normalized.includes("don't") ||
        normalized.includes("doubt") ||
        normalized.includes("no way")) {
        return "no";
    }
    return "yes";
}
function extractClaimCandidates(input) {
    return input
        .split(/[\n\.]+/)
        .flatMap((chunk) => chunk.split(/, with /i))
        .map((chunk) => chunk.trim())
        .filter((chunk) => chunk.length > 12)
        .map((chunk, index) => ({
        id: `candidate-${index + 1}`,
        sourceSpan: chunk,
        normalizedQuote: chunk,
        eventLabel: chunk,
        predictedOutcome: inferDirection(chunk),
        llmSuggestedClaimType: inferClaimType(chunk),
        llmSuggestedTier: inferTier(chunk),
        llmConfidence: Number((0.62 + index * 0.07).toFixed(2)),
        operatorOverride: false,
        approvalStatus: "pending",
    }));
}
async function recalculateExpertSnapshot(expertId) {
    const [claimsSnapshot, resolutionsSnapshot, scoringVersionSnapshot] = await Promise.all([
        db.collection("claims").where("expertId", "==", expertId).get(),
        db.collection("resolutions").get(),
        db.collection("scoring_versions").where("status", "==", "active").limit(1).get(),
    ]);
    const activeVersion = scoringVersionSnapshot.docs[0]?.data();
    const resolutionsByClaimId = new Map(resolutionsSnapshot.docs.map((doc) => [doc.data().claimId, doc.data()]));
    const resolvedClaims = claimsSnapshot.docs
        .map((doc) => doc.data())
        .filter((claim) => claim.status === "resolved" && claim.scoreVersion === activeVersion?.version)
        .map((claim) => {
        const resolution = resolutionsByClaimId.get(claim.id);
        return { claim, resolution };
    })
        .filter((record) => record.resolution);
    await db.collection("public_experts").doc(expertId).set({
        expertId,
        scoreVersion: activeVersion?.version,
        resolvedCount: resolvedClaims.length,
        updatedAt: new Date().toISOString(),
    }, { merge: true });
}
exports.onResolutionWrite = (0, firestore_1.onDocumentWritten)("resolutions/{resolutionId}", async (event) => {
    const after = event.data?.after.data();
    if (!after?.claimId) {
        return;
    }
    const claim = await db.collection("claims").doc(after.claimId).get();
    const expertId = claim.data()?.expertId;
    if (!expertId) {
        return;
    }
    await recalculateExpertSnapshot(expertId);
});
exports.refreshLeaderboards = (0, scheduler_1.onSchedule)("every 60 minutes", async () => {
    await db.collection("public_leaderboards").doc("all-time").set({
        refreshedAt: new Date().toISOString(),
        note: "Replace this placeholder with the same ranked snapshot logic used by the Next.js data layer.",
    }, { merge: true });
});
exports.sweepAwaitingData = (0, scheduler_1.onSchedule)("every day 02:00", async () => {
    const snapshot = await db.collection("claims").where("status", "==", "published_open").get();
    const now = Date.now();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        const claim = doc.data();
        if (claim.deadline && new Date(claim.deadline).getTime() < now) {
            batch.update(doc.ref, { status: "published_awaiting_data" });
        }
    });
    await batch.commit();
});
exports.refreshLeaderboardsNow = (0, https_1.onRequest)(async (_request, response) => {
    await db.collection("public_leaderboards").doc("manual-refresh").set({
        refreshedAt: new Date().toISOString(),
        actor: "manual-http-trigger",
    }, { merge: true });
    response.json({ ok: true });
});
exports.queueSourceExtraction = (0, firestore_1.onDocumentCreated)("source_extraction_jobs/{jobId}", async (event) => {
    const job = event.data?.data();
    const sourceUrl = job?.sourceUrl;
    if (!sourceUrl) {
        return;
    }
    await event.data?.ref.set({
        status: "processing",
        startedAt: new Date().toISOString(),
    }, { merge: true });
    const response = await fetch(sourceUrl, {
        headers: {
            "User-Agent": "AYRE Phase 1 Extractor/1.0",
        },
    });
    const html = await response.text();
    const sourceTextPreview = stripHtmlToText(html).slice(0, 5000);
    const candidates = extractClaimCandidates(sourceTextPreview);
    await event.data?.ref.set({
        status: "complete",
        completedAt: new Date().toISOString(),
        sourceTextPreview,
        candidateCount: candidates.length,
        candidates,
    }, { merge: true });
});

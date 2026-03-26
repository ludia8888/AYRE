import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import { mockSiteDataset } from "../src/lib/mock-data";

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

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

async function main() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const rootDir = path.resolve(scriptDir, "..");
  const envPath = path.join(rootDir, ".env.local");

  loadEnvFile(envPath);

  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error("Missing Firebase Admin env vars in .env.local");
  }

  const app =
    getApps()[0] ??
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });

  const db = getFirestore(app);
  db.settings({ ignoreUndefinedProperties: true });

  const operations = [
    ...mockSiteDataset.experts.map((item) => ({ collection: "experts", id: item.id, data: item })),
    ...mockSiteDataset.sourceDocuments.map((item) => ({
      collection: "source_documents",
      id: item.id,
      data: item,
    })),
    ...mockSiteDataset.claims.map((item) => ({ collection: "claims", id: item.id, data: item })),
    ...mockSiteDataset.resolutions.map((item) => ({ collection: "resolutions", id: item.id, data: item })),
    ...mockSiteDataset.scoringVersions.map((item) => ({
      collection: "scoring_versions",
      id: item.id,
      data: item,
    })),
    ...mockSiteDataset.changelogEntries.map((item) => ({
      collection: "methodology_changelog",
      id: item.id,
      data: item,
    })),
    ...mockSiteDataset.correctionRequests.map((item) => ({
      collection: "corrections",
      id: item.id,
      data: item,
    })),
  ];

  for (const group of chunk(operations, 400)) {
    const batch = db.batch();

    for (const operation of group) {
      batch.set(db.collection(operation.collection).doc(operation.id), operation.data, { merge: true });
    }

    await batch.commit();
  }

  console.log(
    JSON.stringify(
      {
        status: "ok",
        projectId: process.env.FIREBASE_PROJECT_ID,
        counts: {
          experts: mockSiteDataset.experts.length,
          sourceDocuments: mockSiteDataset.sourceDocuments.length,
          claims: mockSiteDataset.claims.length,
          resolutions: mockSiteDataset.resolutions.length,
          scoringVersions: mockSiteDataset.scoringVersions.length,
          changelogEntries: mockSiteDataset.changelogEntries.length,
          correctionRequests: mockSiteDataset.correctionRequests.length,
        },
      },
      null,
      2,
    ),
  );
}

void main();

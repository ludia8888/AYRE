import { unstable_noStore as noStore } from "next/cache";

import { getFirebaseAdminServices } from "@/lib/firebase/server";
import { mockSiteDataset } from "@/lib/mock-data";
import { buildCompareSnapshot, buildExpertSnapshot, buildPairSlug, getLeaderboardSections, splitPairSlug } from "@/lib/scoring";
import type {
  CompareSnapshot,
  SiteDataset,
  WindowKey,
} from "@/lib/types";

async function fetchFirestoreDataset(): Promise<SiteDataset | null> {
  noStore();

  const services = getFirebaseAdminServices();
  if (!services) {
    return null;
  }

  try {
    const [experts, sourceDocuments, claims, resolutions, scoringVersions, changelogEntries, correctionRequests] =
      await Promise.all([
        services.db.collection("experts").get(),
        services.db.collection("source_documents").get(),
        services.db.collection("claims").get(),
        services.db.collection("resolutions").get(),
        services.db.collection("scoring_versions").get(),
        services.db.collection("methodology_changelog").get(),
        services.db.collection("corrections").get(),
      ]);

    const scoringVersionDocs = scoringVersions.docs.map((doc) => doc.data()) as SiteDataset["scoringVersions"];
    const activeScoreVersion =
      scoringVersionDocs.find((version) => version.status === "active") ?? mockSiteDataset.activeScoreVersion;

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
  } catch (error) {
    console.error("[AYRE] Firestore fetch failed, falling back to mock data:", error instanceof Error ? error.message : error);
    return null;
  }
}

export async function getSiteDataset() {
  return (await fetchFirestoreDataset()) ?? mockSiteDataset;
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

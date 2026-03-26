import { AdminShell } from "@/components/admin-shell";
import { ScoringManager } from "@/components/admin/scoring-manager";
import { getSiteDataset } from "@/lib/data";

export default async function AdminScoringPage() {
  const dataset = await getSiteDataset();
  const version = dataset.activeScoreVersion;

  return (
    <AdminShell
      title="Scoring"
      description="Prior quality, shrinkage K, and the tier map freeze inside a score version. Expert recalculation happens immediately, leaderboard refresh is batched."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="ayre-stat">
          <span>Active version</span>
          <strong>{version.version}</strong>
        </div>
        <div className="ayre-stat">
          <span>Baseline resolved</span>
          <strong>{version.baselineResolvedClaims}</strong>
        </div>
        <div className="ayre-stat">
          <span>Next review</span>
          <strong>{new Date(version.nextReviewAt).toLocaleDateString("en-US")}</strong>
        </div>
      </div>
      <ScoringManager
        versions={dataset.scoringVersions}
        activeVersion={version}
        resolvedCount={dataset.resolutions.length}
        changelogEntries={dataset.changelogEntries}
      />
    </AdminShell>
  );
}

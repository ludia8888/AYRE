import { AdminShell } from "@/components/admin-shell";
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
      <div className="ayre-panel p-6">
        <p className="font-display text-4xl uppercase text-white">Recalibration trigger</p>
        <ul className="mt-5 grid gap-3 text-sm text-white/65">
          <li className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3">
            Review once per quarter.
          </li>
          <li className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3">
            Only bump the version when resolved claims double or six months have elapsed.
          </li>
          <li className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3">
            After a bump, publish a methodology changelog and show a 14-day public banner.
          </li>
        </ul>
      </div>
    </AdminShell>
  );
}

import { AdminShell } from "@/components/admin-shell";
import { getSiteDataset } from "@/lib/data";

export default async function AdminOverviewPage() {
  const dataset = await getSiteDataset();

  return (
    <AdminShell
      title="Operating board"
      description="Seed the experts, queue review work, freeze scoring versions, and track correction requests without exposing any write path to public users."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="ayre-stat">
          <span>Experts</span>
          <strong>{dataset.experts.length}</strong>
        </div>
        <div className="ayre-stat">
          <span>Claims</span>
          <strong>{dataset.claims.length}</strong>
        </div>
        <div className="ayre-stat">
          <span>Resolved</span>
          <strong>{dataset.resolutions.length}</strong>
        </div>
        <div className="ayre-stat">
          <span>Active version</span>
          <strong>{dataset.activeScoreVersion.version}</strong>
        </div>
      </div>

      <div className="ayre-panel p-6">
        <p className="font-display text-4xl uppercase text-white">Launch gates</p>
        <div className="mt-5 grid gap-3">
          {dataset.launchGates.map((gate) => (
            <div key={gate.label} className="rounded-2xl border border-white/10 bg-white/4 px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-display text-2xl uppercase text-white">{gate.label}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">{gate.status}</p>
              </div>
              <p className="mt-2 text-sm text-white/62">{gate.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

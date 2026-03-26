import { AdminShell } from "@/components/admin-shell";
import { getSiteDataset } from "@/lib/data";

export default async function AdminExpertsPage() {
  const dataset = await getSiteDataset();

  return (
    <AdminShell
      title="Experts"
      description="Internal expert records back the public scorecards. Phase 1 keeps this list macro-only and seeded by operators."
    >
      <div className="grid gap-3">
        {dataset.experts.map((expert) => (
          <div key={expert.id} className="ayre-panel p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-3xl uppercase text-white">{expert.displayName}</p>
                <p className="mt-1 text-sm text-white/58">{expert.headline}</p>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">{expert.slug}</p>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

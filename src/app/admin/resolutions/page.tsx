import { AdminShell } from "@/components/admin-shell";
import { getSiteDataset } from "@/lib/data";

export default async function AdminResolutionsPage() {
  const dataset = await getSiteDataset();

  return (
    <AdminShell
      title="Resolutions"
      description="Only resolved claims move the score. Open claims and awaiting-data claims stay visible but do not enter the denominator."
    >
      <div className="grid gap-3">
        {dataset.resolutions.slice(0, 10).map((resolution) => (
          <div key={resolution.id} className="ayre-panel p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-display text-2xl uppercase text-white">{resolution.actualValue}</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">{resolution.outcome}</p>
            </div>
            <p className="mt-2 text-sm text-white/62">{resolution.notes}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

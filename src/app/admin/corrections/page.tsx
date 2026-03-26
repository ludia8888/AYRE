import { AdminShell } from "@/components/admin-shell";
import { getSiteDataset } from "@/lib/data";

export default async function AdminCorrectionsPage() {
  const dataset = await getSiteDataset();

  return (
    <AdminShell
      title="Corrections"
      description="Corrections can temporarily unpublish a claim before it is edited or restored. The public SLA stays qualitative rather than numeric."
    >
      <div className="grid gap-3">
        {dataset.correctionRequests.map((request) => (
          <div key={request.id} className="ayre-panel p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-display text-2xl uppercase text-white">{request.expertSlug.replaceAll("-", " ")}</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">{request.status}</p>
            </div>
            <p className="mt-2 text-sm text-white/62">{request.summary}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

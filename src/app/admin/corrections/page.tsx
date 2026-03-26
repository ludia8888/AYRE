import { AdminShell } from "@/components/admin-shell";
import { CorrectionsManager } from "@/components/admin/corrections-manager";
import { getSiteDataset } from "@/lib/data";

export default async function AdminCorrectionsPage() {
  const dataset = await getSiteDataset();

  return (
    <AdminShell
      title="Corrections"
      description="Corrections can temporarily unpublish a claim before it is edited or restored. The public SLA stays qualitative rather than numeric."
    >
      <CorrectionsManager requests={dataset.correctionRequests} experts={dataset.experts} claims={dataset.claims} />
    </AdminShell>
  );
}

import { AdminShell } from "@/components/admin-shell";
import { ExpertsManager } from "@/components/admin/experts-manager";
import { getSiteDataset } from "@/lib/data";

export default async function AdminExpertsPage() {
  const dataset = await getSiteDataset();

  return (
    <AdminShell
      title="Experts"
      description="Internal expert records back the public scorecards. Phase 1 keeps this list macro-only and seeded by operators."
    >
      <ExpertsManager experts={dataset.experts} />
    </AdminShell>
  );
}

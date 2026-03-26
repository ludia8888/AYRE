import { AdminShell } from "@/components/admin-shell";
import { ResolutionsManager } from "@/components/admin/resolutions-manager";
import { getSiteDataset } from "@/lib/data";

export default async function AdminResolutionsPage() {
  const dataset = await getSiteDataset();

  return (
    <AdminShell
      title="Resolutions"
      description="Only resolved claims move the score. Open claims and awaiting-data claims stay visible but do not enter the denominator."
    >
      <ResolutionsManager claims={dataset.claims} experts={dataset.experts} resolutions={dataset.resolutions} />
    </AdminShell>
  );
}

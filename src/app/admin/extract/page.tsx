import { AdminShell } from "@/components/admin-shell";
import { ExtractPlayground } from "@/components/admin/extract-playground";
import { getSiteDataset } from "@/lib/data";

export default async function AdminExtractPage() {
  const dataset = await getSiteDataset();

  return (
    <AdminShell
      title="LLM extract"
      description="Production flow should compress to URL in, background fetch + parse + extract, then operator approve or reject. The page below supports the same candidate-review shape while the Cloud Functions queue is wired."
    >
      <ExtractPlayground experts={dataset.experts} />
    </AdminShell>
  );
}

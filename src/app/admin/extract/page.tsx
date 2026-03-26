import { AdminShell } from "@/components/admin-shell";
import { ExtractPlayground } from "@/components/admin/extract-playground";

export default function AdminExtractPage() {
  return (
    <AdminShell
      title="LLM extract"
      description="Production flow should compress to URL in, background fetch + parse + extract, then operator approve or reject. The page below supports the same candidate-review shape while the Cloud Functions queue is wired."
    >
      <ExtractPlayground />
    </AdminShell>
  );
}

import { AdminShell } from "@/components/admin-shell";
import { ImportPreview } from "@/components/admin/import-preview";

export default function AdminImportPage() {
  return (
    <AdminShell
      title="Bulk import"
      description="CSV or JSON imports should validate into review drafts first. The importer catches missing fields and malformed rows before anything reaches scoring."
    >
      <ImportPreview />
    </AdminShell>
  );
}

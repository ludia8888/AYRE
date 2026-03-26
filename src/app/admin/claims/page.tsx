import { AdminShell } from "@/components/admin-shell";
import { ClaimsManager } from "@/components/admin/claims-manager";
import { getSiteDataset } from "@/lib/data";

export default async function AdminClaimsPage() {
  const dataset = await getSiteDataset();
  const reviewed = dataset.claims.filter((claim) => claim.status === "resolved" || claim.status === "published_open");
  const rejected = dataset.claims.filter((claim) => claim.status === "rejected_unscoreable");

  return (
    <AdminShell
      title="Claims"
      description="Claims move from review to publish only when the quote, deadline, event key, and resolution rule are specific enough to survive dispute."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="ayre-stat">
          <span>Reviewed / live</span>
          <strong>{reviewed.length}</strong>
        </div>
        <div className="ayre-stat">
          <span>Rejected</span>
          <strong>{rejected.length}</strong>
        </div>
        <div className="ayre-stat">
          <span>Awaiting data</span>
          <strong>{dataset.claims.filter((claim) => claim.status === "published_awaiting_data").length}</strong>
        </div>
      </div>
      <ClaimsManager experts={dataset.experts} claims={dataset.claims} sourceDocuments={dataset.sourceDocuments} />
    </AdminShell>
  );
}

import { AdminShell } from "@/components/admin-shell";

const guide = [
  {
    tier: "Low",
    body: "Use for phrases like may, could, risk, possible, or scenario framing. If the quote is soft enough that two reviewers disagree on whether it is even a call, reject it instead.",
  },
  {
    tier: "Medium",
    body: "Use for likely, expect, should, base case, or strongly directional language without absolute certainty.",
  },
  {
    tier: "High",
    body: "Use for will, definitely, no doubt, strongly believe, or other hard-conviction language.",
  },
];

export default function ConfidenceGuidePage() {
  return (
    <AdminShell
      title="Confidence guide"
      description="Tier assignment is part of the audit trail. Operators should record the reason, the assignee, and the timestamp every time they accept or override a suggestion."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {guide.map((item) => (
          <div key={item.tier} className="ayre-panel p-5">
            <p className="font-display text-3xl uppercase text-white">{item.tier}</p>
            <p className="mt-2 text-sm text-white/64">{item.body}</p>
          </div>
        ))}
      </div>
      <div className="ayre-panel p-6">
        <p className="font-display text-4xl uppercase text-white">Reject outright when</p>
        <ul className="mt-5 grid gap-3 text-sm text-white/65">
          <li className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3">The claim is conditional.</li>
          <li className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3">The quote has no deadline.</li>
          <li className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3">Metric or threshold is ambiguous.</li>
          <li className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3">A compound sentence cannot be split into clean claim candidates.</li>
          <li className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3">The quote is narrative commentary rather than a proposition that can settle yes or no.</li>
        </ul>
      </div>
    </AdminShell>
  );
}

import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { getSiteDataset } from "@/lib/data";

export default async function MethodologyPage() {
  const dataset = await getSiteDataset();
  const version = dataset.activeScoreVersion;

  const principles = [
    "We only score public statements, interviews, newsletters, videos, and other public-facing source material.",
    "AYRE Score is a mechanical output of the published formula, not an editorial opinion or a recommendation.",
    "Every published claim links back to the source quote and the evidence used for resolution.",
    "Macro releases settle on the first official public release unless a claim explicitly targets revised or final data.",
    "Later revisions are logged on the claim record, but they do not retroactively rescore the active score version by default.",
    "Corrections are handled through a public intake channel and reviewed in a timely manner.",
    "AYRE scores are not investment, hiring, or legal advice.",
  ];

  return (
    <div className="space-y-12">
      <SectionHeading
        eyebrow="Method"
        title="Public statements only. Machine-scored formula."
        description="Frozen score version. Source links visible. Correction channel for disputes."
      />

      <section className="space-y-2">
        {principles.map((item, i) => (
          <div key={item} className="ayre-accent-left flex gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-brand-green/20 hover:shadow-sm">
            <span className="font-mono text-[10px] font-bold text-brand-green">{String(i + 1).padStart(2, "0")}</span>
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{item}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="h-1 bg-gradient-to-r from-brand-green via-brand-green/50 to-transparent" />
        <div className="p-6">
          <p className="font-display text-2xl font-extrabold tracking-[-0.02em] text-[var(--text)]">Launch formula</p>
          <div className="mt-4 grid gap-2 md:grid-cols-3">
            <div className="ayre-stat">
              <span>Prior quality</span>
              <strong>{version.priorQuality}</strong>
            </div>
            <div className="ayre-stat">
              <span>Shrinkage K</span>
              <strong>{version.shrinkageK}</strong>
            </div>
            <div className="ayre-stat">
              <span>Tier map</span>
              <strong>{version.tierMap.low}/{version.tierMap.medium}/{version.tierMap.high}</strong>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {[
              { label: "Raw quality", formula: "1 - mean(Brier)" },
              { label: "Adjusted", formula: "(n/(n+K)) × raw + (K/(n+K)) × prior" },
              { label: "AYRE Score", formula: "round(adjusted × 100)" },
            ].map((eq) => (
              <div key={eq.label} className="flex items-baseline gap-3 rounded-md bg-[var(--bg)] px-4 py-3">
                <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[var(--dim)]">{eq.label}</span>
                <span className="font-mono text-sm text-brand-green">{eq.formula}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
            Explicit probabilities override confidence tiers. When the quote has no number, the tier map is used as a frozen proxy.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="ayre-panel p-6 transition hover:shadow-sm">
          <p className="font-display text-xl font-extrabold tracking-[-0.02em] text-[var(--text)]">Versioning</p>
          <div className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
            <p>Recalibration reviewed quarterly. New version when resolved claims double or six months pass.</p>
            <p>Old shared cards keep their original score version label.</p>
          </div>
          <Link href="/methodology/changelog" className="ayre-link mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.16em] text-brand-green transition hover:text-[var(--text)]">
            Changelog →
          </Link>
        </div>

        <div className="ayre-panel p-6 transition hover:shadow-sm">
          <p className="font-display text-xl font-extrabold tracking-[-0.02em] text-[var(--text)]">Revisions</p>
          <div className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
            <p>AYRE v1.0 settles on first official public release. Later revisions logged but don&apos;t retroactively rescore.</p>
            <p>Keeps snapshots stable and share cards interpretable.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

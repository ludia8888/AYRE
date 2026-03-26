import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { getSiteDataset } from "@/lib/data";

export default async function MethodologyPage() {
  const dataset = await getSiteDataset();
  const version = dataset.activeScoreVersion;

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Methodology"
        title="Public statements only. Machine-scored formula."
        description="AYRE uses only public statements, applies a frozen score version, keeps source links visible, and offers a correction channel for disputes."
      />

      <section className="grid gap-4 md:grid-cols-2">
        {[
          "We only score public statements, interviews, newsletters, videos, and other public-facing source material.",
          "AYRE Score is a mechanical output of the published formula, not an editorial opinion or a recommendation.",
          "Every published claim links back to the source quote and the evidence used for resolution.",
          "Macro releases settle on the first official public release unless a claim explicitly targets revised or final data.",
          "Later revisions are logged on the claim record, but they do not retroactively rescore the active score version by default.",
          "Corrections are handled through a public intake channel and reviewed in a timely manner.",
          "AYRE scores are not investment, hiring, or legal advice.",
        ].map((item) => (
          <div key={item} className="ayre-panel p-5 text-sm text-white/68">
            {item}
          </div>
        ))}
      </section>

      <section className="ayre-panel p-6">
        <p className="font-display text-4xl uppercase text-white">Launch formula</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
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
            <strong>
              {version.tierMap.low}/{version.tierMap.medium}/{version.tierMap.high}
            </strong>
          </div>
        </div>
        <div className="mt-6 space-y-3 text-sm text-white/65">
          <p>
            Raw quality = <code>1 - mean(Brier)</code>
          </p>
          <p>
            Adjusted quality = <code>(n / (n + K)) * raw + (K / (n + K)) * prior</code>
          </p>
          <p>
            AYRE Score = <code>round(adjusted quality * 100)</code>
          </p>
          <p>
            Explicit probabilities override confidence tiers. When the quote has no number, the tier map is used as a frozen proxy
            for the current score version.
          </p>
        </div>
      </section>

      <section className="ayre-panel p-6">
        <p className="font-display text-4xl uppercase text-white">Versioning policy</p>
        <div className="mt-4 space-y-3 text-sm text-white/65">
          <p>Recalibration is reviewed once per quarter.</p>
          <p>A new score version is allowed only when resolved claims double from the current baseline or six months pass.</p>
          <p>When a new version goes live, the site posts a changelog and keeps old shared cards labeled with their original score version.</p>
          <Link href="/methodology/changelog" className="font-mono text-[11px] uppercase tracking-[0.24em] text-brand-green">
            Open changelog
          </Link>
        </div>
      </section>

      <section className="ayre-panel p-6">
        <p className="font-display text-4xl uppercase text-white">Macro release revisions</p>
        <div className="mt-4 space-y-3 text-sm text-white/65">
          <p>Some macro series publish a preliminary print and revise it later. AYRE v1.0 settles claims on the first official public release by default.</p>
          <p>If a revised value arrives later, the claim record logs the new number and timestamp, but existing scorecards do not retroactively change unless the claim explicitly targeted revised or final data.</p>
          <p>This keeps scoreVersion snapshots stable, keeps old share cards interpretable, and still preserves a visible audit trail for anyone reviewing the data path.</p>
        </div>
      </section>
    </div>
  );
}

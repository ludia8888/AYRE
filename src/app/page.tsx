import Link from "next/link";
import { ArrowRight, Swords } from "lucide-react";

import { ClaimCard } from "@/components/claim-card";
import { CompareSummaryCard } from "@/components/compare-summary-card";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { ScoreChip } from "@/components/score-chip";
import { SectionHeading } from "@/components/section-heading";
import { getFeaturedCompare, getFeaturedExperts, getLeaderboard } from "@/lib/data";
import { buildTrackedPath, formatDate } from "@/lib/formatting";

export default async function HomePage() {
  const [featuredCompare, featuredExperts, leaderboardSections] = await Promise.all([
    getFeaturedCompare(),
    getFeaturedExperts(),
    getLeaderboard("all"),
  ]);

  const topSection = leaderboardSections[0];
  const allExperts = topSection?.rows ?? [];

  return (
    <div className="space-y-20 pb-20">
      {/* ── Hero ── */}
      <section className="animate-fade-up ayre-hero-bg relative overflow-hidden rounded-xl border border-[var(--border)]">
        <div className="h-1 bg-gradient-to-r from-brand-green via-brand-green/60 to-transparent" />

        <div className="px-6 py-6 md:px-10 md:py-8">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-5">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/5 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-brand-green">
                  <span className="size-1.5 animate-pulse rounded-full bg-brand-green" />
                  Macro Phase 1 — Live
                </div>
                <h1 className="font-serif text-[clamp(2.8rem,6.5vw,5.5rem)] italic leading-[0.92] text-[var(--text)]">
                  Are you <span className="not-italic font-display font-extrabold tracking-[-0.04em] text-brand-green">real</span>?
                </h1>
                <p className="max-w-md text-[14px] leading-relaxed text-[var(--muted)]">
                  AYRE scores macro experts on verifiable public predictions. Every card shows the score, the sample size, the
                  source link, and the score version.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <Link href="/leaderboard" className="ayre-button ayre-button-primary">
                  Browse the board
                  <ArrowRight className="size-3.5" />
                </Link>
                {featuredCompare ? (
                  <Link
                    href={buildTrackedPath(`/compare/${featuredCompare.pair}`, "compare", featuredCompare.pair)}
                    className="ayre-button ayre-button-secondary"
                  >
                    Dr. Doom vs Cathie
                    <Swords className="size-3.5" />
                  </Link>
                ) : null}
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { label: "Sources", value: "Public only" },
                  { label: "Formula", value: "Frozen v1.0" },
                  { label: "Domain", value: "Macro" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-baseline justify-between rounded-md border border-[var(--border)] bg-[var(--bg)]/60 px-3 py-2 transition hover:border-[var(--border-hover)]">
                    <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-[var(--dim)]">{stat.label}</span>
                    <span className="font-display text-sm font-bold tracking-[-0.01em] text-[var(--text)]">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {featuredCompare ? (
              <CompareSummaryCard compare={featuredCompare} priorityLabel="Featured matchup" />
            ) : null}
          </div>
        </div>
      </section>

      {/* ── Scrolling ticker ── */}
      {allExperts.length > 0 ? (
        <div className="ayre-ticker my-0 py-2.5">
          <div className="ayre-ticker-track">
            {[...allExperts, ...allExperts].map((snapshot, i) => (
              <Link
                key={`${snapshot.expert.id}-${i}`}
                href={`/experts/${snapshot.expert.slug}`}
                className="inline-flex items-center gap-2 px-6 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] transition hover:text-brand-green"
              >
                <span className="text-[var(--text)]">{snapshot.expert.displayName}</span>
                <span className={snapshot.ayreScore >= 70 ? "font-bold text-brand-green" : snapshot.ayreScore <= 45 ? "text-brand-red" : ""}>
                  {snapshot.ayreScore}
                </span>
                <span className="text-[var(--dim)]">•</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {/* ── Leaderboard preview ── */}
      <section className="animate-fade-up space-y-6" style={{ animationDelay: "0.1s" }}>
        <SectionHeading
          eyebrow="Leaderboard"
          title="Top scorecards"
          description="Ranked by the frozen v1.0 scoring config. Sample size is always visible."
        />
        {topSection ? <LeaderboardTable section={topSection} limit={5} /> : null}
      </section>

      {/* ── Manifesto banner — COLOR BREAK ── */}
      <section className="-mx-4 overflow-hidden rounded-none bg-[var(--text)] px-6 py-10 md:-mx-6 md:rounded-xl md:px-12 md:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-[clamp(1.5rem,3.5vw,2.8rem)] italic leading-[1.2] text-[var(--bg)]">
            &ldquo;Put your wrist on the line.<br />Or shut up.&rdquo;
          </p>
          <div className="mx-auto mt-6 h-px w-12 bg-brand-green" />
          <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.24em] text-[var(--dim)]">
            LinkedIn = where you&apos;ve been. AYRE = what you knew.
          </p>
        </div>
      </section>

      {/* ── Featured experts — ASYMMETRIC GRID ── */}
      <section className="animate-fade-up space-y-6" style={{ animationDelay: "0.15s" }}>
        <SectionHeading
          eyebrow="Profiles"
          title="Is this person actually real, or just loud?"
          description="Featured scorecards. The question stays the same."
        />
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:grid-rows-2">
          {featuredExperts.slice(0, 3).map((snapshot, i) => (
            <Link
              key={snapshot.expert.id}
              href={buildTrackedPath(`/experts/${snapshot.expert.slug}`, "expert", snapshot.expert.slug)}
              className={`ayre-panel group block p-5 transition hover:-translate-y-0.5 hover:shadow-lg ${
                i === 0 ? "lg:row-span-2" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base font-bold tracking-[-0.01em] text-[var(--text)]">{snapshot.expert.displayName}</p>
                  <p className="text-xs text-[var(--muted)]">{snapshot.expert.organization}</p>
                </div>
                <ScoreChip snapshot={snapshot} compact />
              </div>

              <p className={`mt-3 text-xs leading-relaxed text-[var(--muted)] ${i === 0 ? "mb-6" : "mb-4"}`}>
                {snapshot.expert.headline}
              </p>

              <div className={`rounded-lg border border-brand-green/10 bg-brand-green/[0.03] p-4 ${i === 0 ? "p-6" : ""}`}>
                <p className={`font-extrabold leading-none tracking-[-0.03em] text-[var(--text)] ${
                  i === 0 ? "font-serif text-3xl italic md:text-4xl" : "font-display text-xl"
                }`}>
                  Is {snapshot.expert.displayName.split(" ")[0]} real?
                </p>
                <p className={`mt-2 text-[var(--muted)] ${i === 0 ? "text-sm" : "text-xs"}`}>
                  {i === 0
                    ? "See the full scorecard: best call, worst miss, every source link, and the exact score version."
                    : "Check the scorecard and source links."
                  }
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-[var(--dim)]">v{snapshot.scoreVersion.replace("v", "")}</span>
                <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--muted)] transition group-hover:text-brand-green">
                  Open
                  <ArrowRight className="size-3 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── What a scorecard needs + sample call ── */}
      <section className="animate-fade-up grid gap-8 lg:grid-cols-[1fr_1fr]" style={{ animationDelay: "0.2s" }}>
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Requirements"
            title="Claim, outcome, actionability"
            description="The board is wired around verifiable calls and explicit deadlines."
          />
          <div className="space-y-2">
            {[
              { num: "01", title: "Concrete claims only", body: "Vague or deadline-free statements never touch the score." },
              { num: "02", title: "Evidence-linked scores", body: "Source links and score version labels on every profile." },
              { num: "03", title: "Provenance on shares", body: "Cards include Score vX.Y so archived screenshots stay interpretable." },
            ].map((item) => (
              <div key={item.num} className="ayre-accent-left flex gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-brand-green/20 hover:shadow-sm">
                <span className="font-mono text-[10px] font-bold text-brand-green">{item.num}</span>
                <div>
                  <p className="font-display text-sm font-bold tracking-[-0.01em] text-[var(--text)]">{item.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted)]">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {featuredExperts[0]?.bestCall ? (
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Sample"
              title="One card, one argument"
              description={`Best call resolved ${formatDate(featuredExperts[0].bestCall.resolution.resolvedAt)}.`}
            />
            <ClaimCard record={featuredExperts[0].bestCall} />
          </div>
        ) : null}
      </section>
    </div>
  );
}

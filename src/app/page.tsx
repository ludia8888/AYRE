import Link from "next/link";
import { ArrowRight, BadgeInfo, Radar, Share2, Swords } from "lucide-react";

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

  return (
    <div className="space-y-20 pb-20">
      <section className="ayre-panel overflow-hidden border-none bg-[radial-gradient(circle_at_top_left,rgba(0,214,143,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(247,73,109,0.16),transparent_25%),linear-gradient(180deg,rgba(9,16,22,0.95),rgba(9,16,22,0.9))] p-8 md:p-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/70">
              Macro Phase 1
            </div>
            <div className="space-y-4">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-green">Are you real?</p>
              <h1 className="max-w-3xl font-display text-5xl uppercase leading-none tracking-tight text-white md:text-7xl">
                Public calls. Frozen scoring. Brutally legible track records.
              </h1>
              <p className="max-w-2xl text-base text-white/72 md:text-lg">
                AYRE scores macro experts on verifiable public predictions. Every card shows the score, the sample size, the
                source link, and the score version that produced it.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/leaderboard" className="ayre-button ayre-button-primary">
                Browse the board
                <ArrowRight className="size-4" />
              </Link>
              {featuredCompare ? (
                <Link
                  href={buildTrackedPath(`/compare/${featuredCompare.pair}`, "compare", featuredCompare.pair)}
                  className="ayre-button ayre-button-secondary"
                >
                  Is Dr. Doom real?
                  <Swords className="size-4" />
                </Link>
              ) : null}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="ayre-stat">
                <span>Public sources only</span>
                <strong>Source-linked claims</strong>
              </div>
              <div className="ayre-stat">
                <span>Frozen formula</span>
                <strong>Score v1.0</strong>
              </div>
              <div className="ayre-stat">
                <span>Launch focus</span>
                <strong>Macro only</strong>
              </div>
            </div>
          </div>

          {featuredCompare ? (
            <CompareSummaryCard compare={featuredCompare} priorityLabel="Featured matchup" />
          ) : null}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Leaderboard"
          title="Top scorecards"
          description="The launch board ranks experts using the frozen v1.0 scoring config and always shows how many resolved predictions back the number."
        />
        {topSection ? <LeaderboardTable section={topSection} limit={5} /> : null}
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Featured profiles"
          title="Question-style calls to action"
          description="The landing page keeps asking the same thing: is this person actually real, or just loud?"
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {featuredExperts.slice(0, 3).map((snapshot) => (
            <Link
              key={snapshot.expert.id}
              href={buildTrackedPath(`/experts/${snapshot.expert.slug}`, "expert", snapshot.expert.slug)}
              className="ayre-panel group block p-5 transition hover:-translate-y-0.5 hover:border-white/20"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-2xl uppercase text-white">{snapshot.expert.displayName}</p>
                  <p className="text-sm text-white/60">{snapshot.expert.organization}</p>
                </div>
                <ScoreChip snapshot={snapshot} compact />
              </div>
              <p className="mb-5 text-sm text-white/65">{snapshot.expert.headline}</p>
              <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
                <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.28em] text-brand-green">Question CTA</p>
                <p className="font-display text-3xl uppercase leading-none text-white">
                  Is {snapshot.expert.displayName.split(" ")[0]} real?
                </p>
                <p className="mt-3 text-sm text-white/60">
                  Check the scorecard. See the best call, the misses, and the exact source links.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.28em] text-white/45">
                <span>Score v{snapshot.scoreVersion.replace("v", "")}</span>
                <span className="flex items-center gap-2 text-white/70">
                  Open card
                  <ArrowRight className="size-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="What a scorecard needs"
            title="Claim, outcome, actionability"
            description="Phase 1 is browse-only, but the board is already wired around verifiable calls and explicit deadlines."
          />
          <div className="grid gap-3">
            {[
              {
                icon: Radar,
                title: "Claim has to be concrete",
                body: "Conditional, vague, or deadline-free statements stay in the database as rejected and never touch the score.",
              },
              {
                icon: BadgeInfo,
                title: "Every score links back to evidence",
                body: "Source links, evidence links, and score version labels are visible on every public profile.",
              },
              {
                icon: Share2,
                title: "Share cards carry provenance",
                body: "Expert and compare cards include Score vX.Y so archived screenshots remain interpretable after later recalibration.",
              },
            ].map((item) => (
              <div key={item.title} className="ayre-panel flex gap-4 p-5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/8">
                  <item.icon className="size-5 text-brand-green" />
                </div>
                <div className="space-y-1">
                  <p className="font-display text-2xl uppercase text-white">{item.title}</p>
                  <p className="text-sm text-white/65">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {featuredExperts[0]?.bestCall ? (
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Resolved call"
              title="One card, one screenshot, one argument"
              description={`Sample best call resolved on ${formatDate(featuredExperts[0].bestCall.resolution.resolvedAt)}.`}
            />
            <ClaimCard record={featuredExperts[0].bestCall} />
          </div>
        ) : null}
      </section>
    </div>
  );
}

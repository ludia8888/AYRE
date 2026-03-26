import { LeaderboardTable } from "@/components/leaderboard-table";
import { SectionHeading } from "@/components/section-heading";
import { getLeaderboard } from "@/lib/data";

export default async function LeaderboardPage() {
  const sections = await getLeaderboard("all");

  return (
    <div className="space-y-10">
      <div className="animate-fade-up">
        <SectionHeading
          eyebrow="Board"
          title="Leaderboard"
          description="Top Scorecards ship at launch. Lowest Scoring stays dormant until the board is older than 21 days and deep enough to avoid sensational thin-sample lists."
        />
      </div>
      {sections.map((section, i) => (
        <div key={section.id} className="space-y-10">
          <div className="animate-fade-up" style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
            <LeaderboardTable section={section} />
          </div>
          {i < sections.length - 1 ? (
            <div className="ayre-ornament">
              <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-[var(--dim)]">
                {sections[i + 1]?.title}
              </span>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

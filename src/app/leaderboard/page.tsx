import { LeaderboardTable } from "@/components/leaderboard-table";
import { SectionHeading } from "@/components/section-heading";
import { getLeaderboard } from "@/lib/data";

export default async function LeaderboardPage() {
  const sections = await getLeaderboard("all");

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Board"
        title="Leaderboard"
        description="Top Scorecards ship at launch. Lowest Scoring stays dormant until the board is older than 21 days and deep enough to avoid sensational thin-sample lists."
      />
      {sections.map((section) => (
        <LeaderboardTable key={section.id} section={section} />
      ))}
    </div>
  );
}

import Link from "next/link";

import { getSiteDataset } from "@/lib/data";

const bannerEvaluationTime = Date.now();

export async function SiteHeader() {
  const dataset = await getSiteDataset();
  const showBanner = new Date(dataset.activeScoreVersion.highlightUntil).getTime() > bannerEvaluationTime;
  const nav = [
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/methodology", label: "Methodology" },
    { href: "/corrections", label: "Corrections" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <header className="sticky top-0 z-20 pt-4">
      <div className="space-y-2">
        {showBanner ? (
          <Link
            href="/methodology/changelog"
            className="block rounded-[1.2rem] border border-brand-green/25 bg-brand-green/10 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.24em] text-brand-green"
          >
            {dataset.activeScoreVersion.changelogTitle} • Open methodology changelog
          </Link>
        ) : null}
        <div className="ayre-panel flex items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-display text-3xl uppercase tracking-tight text-white">
              AYRE
            </Link>
            <span className="hidden font-mono text-xs uppercase tracking-[0.28em] text-white/40 md:inline">
              Are You Real?
            </span>
          </div>

          <nav className="flex items-center gap-2 overflow-x-auto font-mono text-[11px] uppercase tracking-[0.24em] text-white/60">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-transparent px-3 py-2 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

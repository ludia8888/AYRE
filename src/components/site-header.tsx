import Link from "next/link";

import { getSiteDataset } from "@/lib/data";

const bannerEvaluationTime = Date.now();

export async function SiteHeader() {
  const dataset = await getSiteDataset();
  const showBanner = new Date(dataset.activeScoreVersion.highlightUntil).getTime() > bannerEvaluationTime;
  const nav = [
    { href: "/leaderboard", label: "Board" },
    { href: "/methodology", label: "Method" },
    { href: "/corrections", label: "Corrections" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <header className="sticky top-0 z-20 pt-4">
      <div className="space-y-2">
        {showBanner ? (
          <Link
            href="/methodology/changelog"
            className="block rounded-md border border-brand-green/20 bg-brand-green/5 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-brand-green transition hover:bg-brand-green/8"
          >
            {dataset.activeScoreVersion.changelogTitle} • Changelog
          </Link>
        ) : null}
        <nav className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]/95 px-5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-sm">
          <Link href="/" className="group flex items-baseline gap-0.5">
            <span className="font-display text-xl font-extrabold tracking-[-0.03em] text-[var(--text)] transition group-hover:text-brand-green">AYRE</span>
            <span className="text-xl font-extrabold text-brand-green">.</span>
          </Link>

          <div className="flex items-center gap-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="ayre-link rounded-md px-2.5 py-1.5 transition hover:text-[var(--text)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-white/10 pt-6 text-sm text-white/50">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-xl uppercase text-white">AYRE</p>
          <p>Public statements only. Machine-scored formula. Source-linked evidence.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em]">
          <Link href="/methodology">Methodology</Link>
          <Link href="/methodology/changelog">Changelog</Link>
          <Link href="/corrections">Corrections</Link>
          <Link href="/admin/guidelines/confidence">Tier guide</Link>
        </div>
      </div>
    </footer>
  );
}

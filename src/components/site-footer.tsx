import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 pb-8">
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="h-1 bg-gradient-to-r from-brand-green via-brand-green/60 to-transparent" />
        <div className="p-8 md:p-10">
          <div className="flex flex-col gap-10 md:flex-row md:justify-between">
            <div className="max-w-md">
              <p className="font-display text-3xl font-extrabold tracking-[-0.03em] text-[var(--text)] md:text-4xl">
                AYRE<span className="text-brand-green">.</span>
              </p>
              <p className="mt-5 font-serif text-2xl italic leading-snug text-[var(--text-secondary)]">
                &ldquo;Put your wrist on the line.<br />Or shut up.&rdquo;
              </p>
              <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
                Public statements only. Machine-scored formula. Source-linked evidence. No editorial opinion. No shortcuts.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted)] md:text-right">
              <Link href="/methodology" className="ayre-link transition hover:text-[var(--text)]">Methodology</Link>
              <Link href="/methodology/changelog" className="ayre-link transition hover:text-[var(--text)]">Changelog</Link>
              <Link href="/corrections" className="ayre-link transition hover:text-[var(--text)]">Corrections</Link>
              <Link href="/admin/guidelines/confidence" className="ayre-link transition hover:text-[var(--text)]">Tier guide</Link>
              <div className="mt-4 h-px w-12 bg-[var(--border)] md:ml-auto" />
              <span className="mt-1 text-[var(--dim)]">Score v1.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

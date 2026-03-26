import Link from "next/link";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/experts", label: "Experts" },
  { href: "/admin/claims", label: "Claims" },
  { href: "/admin/resolutions", label: "Resolutions" },
  { href: "/admin/import", label: "Bulk import" },
  { href: "/admin/extract", label: "LLM extract" },
  { href: "/admin/scoring", label: "Scoring" },
  { href: "/admin/corrections", label: "Corrections" },
  { href: "/admin/guidelines/confidence", label: "Confidence guide" },
];

export function AdminShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="ayre-panel h-fit p-4">
        <p className="font-display text-3xl uppercase text-white">Admin</p>
        <p className="mt-2 text-sm text-white/58">
          Internal operating surface. Wire Firebase Auth session middleware before production.
        </p>
        <nav className="mt-5 grid gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/55">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-white/10 px-3 py-3 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-green">Internal workflow</p>
          <h1 className="font-display text-5xl uppercase leading-none text-white">{title}</h1>
          <p className="max-w-3xl text-sm text-white/62 md:text-base">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

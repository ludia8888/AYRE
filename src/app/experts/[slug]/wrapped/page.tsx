import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getExpertSnapshotBySlug } from "@/lib/data";
import { formatPercent } from "@/lib/formatting";

type WrappedPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: WrappedPageProps): Promise<Metadata> {
  const { slug } = await params;
  const snapshot = await getExpertSnapshotBySlug(slug);
  if (!snapshot) return { title: "Not found | AYRE" };
  return {
    title: `${snapshot.expert.displayName} Wrapped | AYRE`,
    description: `AYRE ${snapshot.ayreScore}. ${snapshot.resolvedCount} resolved predictions. Are they real?`,
  };
}

export default async function WrappedPage({ params }: WrappedPageProps) {
  const { slug } = await params;
  const snapshot = await getExpertSnapshotBySlug(slug);

  if (!snapshot) notFound();

  const isGood = snapshot.ayreScore >= 70;
  const isBad = snapshot.ayreScore <= 45;
  const scoreColor = isGood ? "#00a67e" : isBad ? "#d4364b" : "#0f0f0f";

  return (
    <div className="mx-auto max-w-lg space-y-6">
      {/* ── The Wrapped Card — screenshot-optimized ── */}
      <div
        id="wrapped-card"
        className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--text)] p-8 text-white"
        style={{ aspectRatio: "4/5" }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-bold tracking-[-0.02em]">AYRE<span style={{ color: scoreColor }}>.</span></span>
          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">Score v{snapshot.scoreVersion.replace("v", "")}</span>
        </div>

        {/* Main content */}
        <div className="mt-8 space-y-6">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/40">Macro Expert Scorecard</p>
            <h1 className="mt-2 font-serif text-4xl italic text-white">{snapshot.expert.displayName}</h1>
            <p className="mt-1 text-sm text-white/50">{snapshot.expert.organization}</p>
          </div>

          {/* The big score */}
          <div className="flex items-end gap-3">
            <span
              className="font-display text-[7rem] font-extrabold leading-none tracking-[-0.06em]"
              style={{ color: scoreColor }}
            >
              {snapshot.ayreScore}
            </span>
            <div className="mb-2 space-y-0.5">
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/35">AYRE Score</p>
              <p className="text-sm text-white/50">Based on {snapshot.resolvedCount} calls</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-white/5 p-3">
              <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/35">Accuracy</p>
              <p className="mt-1 font-display text-2xl font-bold tracking-[-0.02em]">{formatPercent(snapshot.accuracy, 0)}</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/35">Resolved</p>
              <p className="mt-1 font-display text-2xl font-bold tracking-[-0.02em]">{snapshot.resolvedCount}</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/35">Avg Brier</p>
              <p className="mt-1 font-display text-2xl font-bold tracking-[-0.02em]">{snapshot.averageBrier.toFixed(2)}</p>
            </div>
          </div>

          {/* Best & Worst */}
          {snapshot.bestCall ? (
            <div className="rounded-lg border border-white/8 bg-white/[0.03] p-4">
              <p className="font-mono text-[7px] uppercase tracking-[0.2em]" style={{ color: scoreColor }}>Best call</p>
              <p className="mt-1 font-serif text-lg italic text-white">{snapshot.bestCall.claim.eventLabel}</p>
              <p className="mt-1 text-xs text-white/40">Brier {snapshot.bestCall.brier.toFixed(3)}</p>
            </div>
          ) : null}

          {snapshot.worstCall ? (
            <div className="rounded-lg border border-white/8 bg-white/[0.03] p-4">
              <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#d4364b]">Worst call</p>
              <p className="mt-1 font-serif text-lg italic text-white">{snapshot.worstCall.claim.eventLabel}</p>
              <p className="mt-1 text-xs text-white/40">Brier {snapshot.worstCall.brier.toFixed(3)}</p>
            </div>
          ) : null}
        </div>

        {/* Bottom tagline */}
        <div className="absolute bottom-6 left-8 right-8">
          <div className="flex items-end justify-between">
            <p className="font-serif text-sm italic text-white/30">Are you real?</p>
            <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">ayre.example</p>
          </div>
        </div>
      </div>

      {/* ── Actions below the card ── */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          className="ayre-button ayre-button-primary flex-1"
          data-share-twitter
          onClick={undefined}
        >
          Share on X
        </button>
        <button
          className="ayre-button ayre-button-secondary flex-1"
          data-copy-link
          onClick={undefined}
        >
          Copy link
        </button>
      </div>

      <ShareActions slug={snapshot.expert.slug} name={snapshot.expert.displayName} score={snapshot.ayreScore} />

      <p className="text-center text-xs text-[var(--muted)]">
        <Link href={`/experts/${snapshot.expert.slug}`} className="ayre-link">
          Full scorecard →
        </Link>
      </p>
    </div>
  );
}

function ShareActions({ slug, name, score }: { slug: string; name: string; score: number }) {
  const shareUrl = `https://ayre.example/experts/${slug}/wrapped`;
  const shareText = `${name}'s AYRE Score: ${score}. Are they real? Check the scorecard:`;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          document.querySelector('[data-share-twitter]')?.addEventListener('click', () => {
            window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent('${shareText}') + '&url=' + encodeURIComponent('${shareUrl}'), '_blank');
          });
          document.querySelector('[data-copy-link]')?.addEventListener('click', async () => {
            try {
              await navigator.clipboard.writeText('${shareUrl}');
              const btn = document.querySelector('[data-copy-link]');
              if (btn) { btn.textContent = 'COPIED!'; setTimeout(() => btn.textContent = 'COPY LINK', 2000); }
            } catch(e) {}
          });
        `,
      }}
    />
  );
}

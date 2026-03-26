"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { postJson } from "@/components/admin/request";
import type { ChangelogEntry, ScoringVersion } from "@/lib/types";

export function ScoringManager({
  versions,
  activeVersion,
  resolvedCount,
  changelogEntries,
}: {
  versions: ScoringVersion[];
  activeVersion: ScoringVersion;
  resolvedCount: number;
  changelogEntries: ChangelogEntry[];
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    version: "",
    label: "",
    priorQuality: activeVersion.priorQuality.toString(),
    shrinkageK: activeVersion.shrinkageK.toString(),
    low: activeVersion.tierMap.low.toString(),
    medium: activeVersion.tierMap.medium.toString(),
    high: activeVersion.tierMap.high.toString(),
    baselineResolvedClaims: resolvedCount.toString(),
    nextReviewAt: activeVersion.nextReviewAt.slice(0, 10),
    changelogTitle: "",
    changelogSummary: "",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleCreate() {
    try {
      setPending(true);
      setStatus(null);
      await postJson("/api/admin/scoring", {
        intent: "create",
        version: form.version,
        label: form.label,
        priorQuality: Number(form.priorQuality),
        shrinkageK: Number(form.shrinkageK),
        low: Number(form.low),
        medium: Number(form.medium),
        high: Number(form.high),
        baselineResolvedClaims: Number(form.baselineResolvedClaims),
        nextReviewAt: new Date(form.nextReviewAt).toISOString(),
        changelogTitle: form.changelogTitle,
        changelogSummary: form.changelogSummary,
      });
      setStatus("Candidate version created.");
      startTransition(() => router.refresh());
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Create failed.");
    } finally {
      setPending(false);
    }
  }

  async function handleActivate(versionId: string) {
    try {
      setPending(true);
      setStatus(null);
      await postJson("/api/admin/scoring", { intent: "activate", versionId });
      setStatus("Active score version updated.");
      startTransition(() => router.refresh());
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Activation failed.");
    } finally {
      setPending(false);
    }
  }

  async function handleRefresh() {
    try {
      setPending(true);
      setStatus(null);
      const result = await postJson<{
        expertDocs: number;
        leaderboardDocs: number;
        compareDocs: number;
        cardDocs: number;
      }>("/api/admin/scoring", {
        intent: "refresh",
      });
      setStatus(
        `Refreshed ${result.expertDocs} expert docs, ${result.leaderboardDocs} leaderboard docs, ${result.compareDocs} compare docs, ${result.cardDocs} card docs.`,
      );
      startTransition(() => router.refresh());
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Refresh failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="ayre-panel p-5">
        <p className="font-display text-3xl uppercase text-white">Create candidate version</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input className="ayre-input" placeholder="Version (v1.1)" value={form.version} onChange={(event) => setForm({ ...form, version: event.target.value })} />
          <input className="ayre-input" placeholder="Label" value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} />
          <input className="ayre-input" placeholder="Prior quality" value={form.priorQuality} onChange={(event) => setForm({ ...form, priorQuality: event.target.value })} />
          <input className="ayre-input" placeholder="Shrinkage K" value={form.shrinkageK} onChange={(event) => setForm({ ...form, shrinkageK: event.target.value })} />
          <input className="ayre-input" placeholder="Low tier" value={form.low} onChange={(event) => setForm({ ...form, low: event.target.value })} />
          <input className="ayre-input" placeholder="Medium tier" value={form.medium} onChange={(event) => setForm({ ...form, medium: event.target.value })} />
          <input className="ayre-input" placeholder="High tier" value={form.high} onChange={(event) => setForm({ ...form, high: event.target.value })} />
          <input className="ayre-input" placeholder="Baseline resolved" value={form.baselineResolvedClaims} onChange={(event) => setForm({ ...form, baselineResolvedClaims: event.target.value })} />
          <input className="ayre-input" type="date" value={form.nextReviewAt} onChange={(event) => setForm({ ...form, nextReviewAt: event.target.value })} />
          <input className="ayre-input md:col-span-2" placeholder="Changelog title" value={form.changelogTitle} onChange={(event) => setForm({ ...form, changelogTitle: event.target.value })} />
        </div>
        <textarea className="ayre-input mt-3 min-h-24" placeholder="Changelog summary" value={form.changelogSummary} onChange={(event) => setForm({ ...form, changelogSummary: event.target.value })} />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" className="ayre-button ayre-button-primary" disabled={pending} onClick={handleCreate}>
            {pending ? "Creating..." : "Create candidate"}
          </button>
          <button type="button" className="ayre-button ayre-button-secondary" disabled={pending} onClick={handleRefresh}>
            Refresh public snapshots
          </button>
          {status ? <p className="text-sm text-white/62">{status}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="ayre-panel p-5">
          <p className="font-display text-3xl uppercase text-white">Versions</p>
          <div className="mt-4 grid gap-3">
            {versions
              .slice()
              .sort((left, right) => right.activatedAt.localeCompare(left.activatedAt))
              .map((version) => (
                <div key={version.id} className="rounded-2xl border border-white/10 bg-white/4 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-display text-2xl uppercase text-white">{version.version}</p>
                      <p className="text-sm text-white/58">{version.label}</p>
                    </div>
                    <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">{version.status}</span>
                  </div>
                  <p className="mt-3 text-sm text-white/62">
                    prior {version.priorQuality} • K {version.shrinkageK} • tiers {version.tierMap.low}/{version.tierMap.medium}/
                    {version.tierMap.high}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {version.status !== "active" ? (
                      <button type="button" className="ayre-button ayre-button-primary" disabled={pending} onClick={() => handleActivate(version.id)}>
                        Activate version
                      </button>
                    ) : (
                      <span className="rounded-full border border-brand-green/30 bg-brand-green/10 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-green">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="ayre-panel p-5">
          <p className="font-display text-3xl uppercase text-white">Changelog</p>
          <div className="mt-4 grid gap-3">
            {changelogEntries
              .slice()
              .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt))
              .map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-white/10 bg-white/4 p-4">
                  <p className="font-display text-2xl uppercase text-white">{entry.title}</p>
                  <p className="mt-2 text-sm text-white/58">{entry.version} • {entry.publishedAt.slice(0, 10)}</p>
                  <p className="mt-2 text-sm text-white/62">{entry.summary}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

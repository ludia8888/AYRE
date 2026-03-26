"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { postJson } from "@/components/admin/request";
import type { Expert } from "@/lib/types";

function ExpertEditor({ expert }: { expert: Expert }) {
  const router = useRouter();
  const [form, setForm] = useState({
    id: expert.id,
    slug: expert.slug,
    displayName: expert.displayName,
    headline: expert.headline,
    organization: expert.organization,
    avatarUrl: expert.avatarUrl,
    bio: expert.bio,
    featured: expert.featured,
    x: expert.socialLinks.x ?? "",
    website: expert.socialLinks.website ?? "",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSave() {
    try {
      setPending(true);
      setStatus(null);
      await postJson("/api/admin/experts", form);
      setStatus("Saved.");
      startTransition(() => router.refresh());
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="ayre-panel p-5">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-white/65">
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">Display name</span>
          <input className="ayre-input" value={form.displayName} onChange={(event) => setForm({ ...form, displayName: event.target.value })} />
        </label>
        <label className="grid gap-2 text-sm text-white/65">
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">Slug</span>
          <input className="ayre-input" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
        </label>
        <label className="grid gap-2 text-sm text-white/65">
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">Organization</span>
          <input className="ayre-input" value={form.organization} onChange={(event) => setForm({ ...form, organization: event.target.value })} />
        </label>
        <label className="grid gap-2 text-sm text-white/65">
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">Avatar URL</span>
          <input className="ayre-input" value={form.avatarUrl} onChange={(event) => setForm({ ...form, avatarUrl: event.target.value })} />
        </label>
      </div>
      <label className="mt-3 grid gap-2 text-sm text-white/65">
        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">Headline</span>
        <input className="ayre-input" value={form.headline} onChange={(event) => setForm({ ...form, headline: event.target.value })} />
      </label>
      <label className="mt-3 grid gap-2 text-sm text-white/65">
        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">Bio</span>
        <textarea className="ayre-input min-h-28" value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} />
      </label>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-white/65">
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">X URL</span>
          <input className="ayre-input" value={form.x} onChange={(event) => setForm({ ...form, x: event.target.value })} />
        </label>
        <label className="grid gap-2 text-sm text-white/65">
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">Website</span>
          <input className="ayre-input" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} />
        </label>
      </div>
      <label className="mt-4 flex items-center gap-3 text-sm text-white/65">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(event) => setForm({ ...form, featured: event.target.checked })}
        />
        Featured on the landing page
      </label>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" className="ayre-button ayre-button-primary" disabled={pending} onClick={handleSave}>
          {pending ? "Saving..." : "Save expert"}
        </button>
        {status ? <p className="text-sm text-white/62">{status}</p> : null}
      </div>
    </div>
  );
}

export function ExpertsManager({ experts }: { experts: Expert[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    displayName: "",
    slug: "",
    headline: "",
    organization: "",
    avatarUrl: "",
    bio: "",
    featured: false,
    x: "",
    website: "",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleCreate() {
    try {
      setPending(true);
      setStatus(null);
      await postJson("/api/admin/experts", form);
      setForm({
        displayName: "",
        slug: "",
        headline: "",
        organization: "",
        avatarUrl: "",
        bio: "",
        featured: false,
        x: "",
        website: "",
      });
      setStatus("Expert created.");
      startTransition(() => router.refresh());
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Create failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="ayre-panel p-5">
        <p className="font-display text-3xl uppercase text-white">Create expert</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input className="ayre-input" placeholder="Display name" value={form.displayName} onChange={(event) => setForm({ ...form, displayName: event.target.value })} />
          <input className="ayre-input" placeholder="Slug (optional)" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
          <input className="ayre-input" placeholder="Organization" value={form.organization} onChange={(event) => setForm({ ...form, organization: event.target.value })} />
          <input className="ayre-input" placeholder="/avatars/name.svg" value={form.avatarUrl} onChange={(event) => setForm({ ...form, avatarUrl: event.target.value })} />
        </div>
        <input className="ayre-input mt-3" placeholder="Headline" value={form.headline} onChange={(event) => setForm({ ...form, headline: event.target.value })} />
        <textarea className="ayre-input mt-3 min-h-28" placeholder="Bio" value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} />
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <input className="ayre-input" placeholder="X URL" value={form.x} onChange={(event) => setForm({ ...form, x: event.target.value })} />
          <input className="ayre-input" placeholder="Website URL" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} />
        </div>
        <label className="mt-4 flex items-center gap-3 text-sm text-white/65">
          <input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} />
          Featured on home
        </label>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" className="ayre-button ayre-button-primary" disabled={pending} onClick={handleCreate}>
            {pending ? "Creating..." : "Create expert"}
          </button>
          {status ? <p className="text-sm text-white/62">{status}</p> : null}
        </div>
      </div>

      <div className="grid gap-4">
        {experts.map((expert) => (
          <ExpertEditor key={expert.id} expert={expert} />
        ))}
      </div>
    </div>
  );
}

## AYRE Phase 1

AYRE is a Phase 1 browse-only scorecard product for macro experts. The app ships a Polymarket-inspired public board, expert profiles, compare cards, and an internal admin surface for seeding claims, extracting candidates, and managing scoring versions.

### Stack

- `Next.js App Router + TypeScript + Tailwind`
- `Firebase Auth + Firestore + Storage + Cloud Functions` scaffolding
- `Vitest` for scoring logic tests
- Mock data fallback so the app runs locally before Firebase is configured

### Getting started

1. Install dependencies.

```bash
npm install
npm run dev
```

2. Copy `.env.example` to `.env.local` and fill Firebase keys if you want the app to read from Firestore. If no keys are present, the app falls back to the bundled mock dataset.

3. Open [http://localhost:3000](http://localhost:3000).

### Key routes

- `/`
- `/leaderboard`
- `/experts/[slug]`
- `/compare/[left]-vs-[right]`
- `/methodology`
- `/methodology/changelog`
- `/corrections`
- `/admin`
- `/admin/import`
- `/admin/extract`

### Scripts

```bash
npm run dev
npm run lint
npm run test
npm run build
```

### Firebase notes

- `firestore.rules` and `storage.rules` assume public read access only for materialized public collections and admin-only write access elsewhere.
- `functions/` contains a minimal Cloud Functions skeleton for expert snapshot refresh, hourly leaderboard refresh, and deadline sweeps.
- Production admin access still needs Firebase session cookie issuance. The current `middleware.ts` allows local preview by default and expects an `ayre_admin_session` cookie in locked-down environments.

### Current implementation boundaries

- Public pages are live and driven by derived score snapshots from the mock dataset or Firestore.
- Admin import and extract are working previews. They validate payloads and generate candidate arrays, but they do not persist review drafts yet.
- OG image routes exist for expert and compare pages, carry score version labels, and use score-versioned image URLs so social caches invalidate cleanly when the scoring version changes.
- Macro resolution policy defaults to first official release. Later revisions can be logged on the claim record without retroactively rescoring the active score version.

### Next implementation steps

- Wire persisted admin CRUD flows into Firestore writes.
- Move compare caching and scorecard asset generation into Firebase Storage-backed jobs.
- Replace the heuristic extract API with a configured LLM provider and store operator overrides for training data.

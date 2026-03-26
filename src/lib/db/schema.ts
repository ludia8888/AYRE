import { boolean, jsonb, numeric, pgTable, text, varchar } from "drizzle-orm/pg-core";

/* ── Experts ── */
export const experts = pgTable("experts", {
  id: text("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  displayName: varchar("display_name", { length: 255 }).notNull(),
  headline: text("headline").notNull().default(""),
  organization: varchar("organization", { length: 255 }).notNull().default(""),
  avatarUrl: text("avatar_url").notNull().default(""),
  bio: text("bio").notNull().default(""),
  domain: varchar("domain", { length: 50 }).notNull().default("macro"),
  featured: boolean("featured").notNull().default(false),
  socialLinks: jsonb("social_links").notNull().default({}),
});

/* ── Source Documents ── */
export const sourceDocuments = pgTable("source_documents", {
  id: text("id").primaryKey(),
  expertId: text("expert_id").notNull().references(() => experts.id),
  title: text("title").notNull(),
  platform: varchar("platform", { length: 100 }).notNull().default(""),
  url: text("url").notNull(),
  publishedAt: text("published_at").notNull(),
});

/* ── Claims ── */
export const claims = pgTable("claims", {
  id: text("id").primaryKey(),
  expertId: text("expert_id").notNull().references(() => experts.id),
  sourceDocumentId: text("source_document_id").notNull().references(() => sourceDocuments.id),
  eventKey: varchar("event_key", { length: 255 }).notNull().default(""),
  eventLabel: text("event_label").notNull(),
  quotedText: text("quoted_text").notNull(),
  publishedAt: text("published_at").notNull(),
  deadline: text("deadline").notNull(),
  claimType: varchar("claim_type", { length: 50 }).notNull(),
  predictedOutcome: varchar("predicted_outcome", { length: 10 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("draft"),
  scoreVersion: varchar("score_version", { length: 20 }).notNull().default("v1.0"),
  resolutionRule: jsonb("resolution_rule").notNull().default({}),
  sourceSpan: text("source_span"),
  explicitProbability: numeric("explicit_probability"),
  confidenceTier: varchar("confidence_tier", { length: 20 }),
  tierAssignmentReason: text("tier_assignment_reason"),
  tierAssignedBy: text("tier_assigned_by"),
  tierAssignedAt: text("tier_assigned_at"),
  reviewedBy: text("reviewed_by"),
  reviewedAt: text("reviewed_at"),
  rejectionReason: text("rejection_reason"),
  llmSuggestedClaimType: varchar("llm_suggested_claim_type", { length: 50 }),
  llmSuggestedTier: varchar("llm_suggested_tier", { length: 20 }),
  llmConfidence: numeric("llm_confidence"),
  llmSuggestedProbability: numeric("llm_suggested_probability"),
  llmModelVersion: varchar("llm_model_version", { length: 50 }),
  operatorOverride: boolean("operator_override"),
  overrideReason: text("override_reason"),
});

/* ── Resolutions ── */
export const resolutions = pgTable("resolutions", {
  id: text("id").primaryKey(),
  claimId: text("claim_id").notNull().references(() => claims.id),
  outcome: varchar("outcome", { length: 10 }).notNull(),
  actualValue: text("actual_value").notNull(),
  evidenceUrl: text("evidence_url").notNull(),
  resolvedAt: text("resolved_at").notNull(),
  settlementPolicy: varchar("settlement_policy", { length: 50 }).notNull(),
  settledStage: varchar("settled_stage", { length: 50 }).notNull(),
  officialReleaseDate: text("official_release_date"),
  initialReleaseValue: text("initial_release_value"),
  initialReleaseAt: text("initial_release_at"),
  revisedValue: text("revised_value"),
  revisedAt: text("revised_at"),
  revisionHandling: varchar("revision_handling", { length: 50 }),
  revisionNotes: text("revision_notes"),
  reviewerId: text("reviewer_id").notNull().default(""),
  reviewerName: text("reviewer_name").notNull().default(""),
  notes: text("notes").notNull().default(""),
});

/* ── Scoring Versions ── */
export const scoringVersions = pgTable("scoring_versions", {
  id: text("id").primaryKey(),
  version: varchar("version", { length: 20 }).notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("candidate"),
  priorQuality: numeric("prior_quality").notNull(),
  shrinkageK: numeric("shrinkage_k").notNull(),
  tierMap: jsonb("tier_map").notNull().default({}),
  activatedAt: text("activated_at").notNull(),
  calibratedAt: text("calibrated_at").notNull(),
  baselineResolvedClaims: numeric("baseline_resolved_claims").notNull().default("0"),
  nextReviewAt: text("next_review_at").notNull(),
  highlightUntil: text("highlight_until").notNull(),
  changelogTitle: text("changelog_title").notNull().default(""),
  changelogSummary: text("changelog_summary").notNull().default(""),
});

/* ── Changelog Entries ── */
export const changelogEntries = pgTable("changelog_entries", {
  id: text("id").primaryKey(),
  version: varchar("version", { length: 20 }).notNull(),
  publishedAt: text("published_at").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  changes: jsonb("changes").notNull().default([]),
});

/* ── Correction Requests ── */
export const corrections = pgTable("corrections", {
  id: text("id").primaryKey(),
  expertSlug: varchar("expert_slug", { length: 255 }).notNull(),
  claimId: text("claim_id"),
  status: varchar("status", { length: 50 }).notNull().default("pending_review"),
  submittedAt: text("submitted_at").notNull(),
  summary: text("summary").notNull(),
});

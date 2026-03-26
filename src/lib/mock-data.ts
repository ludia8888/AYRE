import type {
  ChangelogEntry,
  Claim,
  CorrectionRequest,
  Expert,
  LaunchGate,
  Resolution,
  ScoringVersion,
  SiteDataset,
  SourceDocument,
} from "@/lib/types";

/* ═══════════════════════════════════════════════════════════════════
   EXPERTS (11)
   ═══════════════════════════════════════════════════════════════════ */

const experts: Expert[] = [
  {
    id: "expert-roubini",
    slug: "nouriel-roubini",
    displayName: "Nouriel Roubini",
    headline: "Macro strategist tracking inflation, recession risk, and the Fed.",
    organization: "Roubini Macro Associates",
    avatarUrl: "",
    bio: "Known as 'Dr. Doom' for his 2008 crisis prediction. High-conviction macro calls that frequently make headlines.",
    domain: "macro",
    featured: true,
    socialLinks: { x: "https://x.com/Nouriel" },
  },
  {
    id: "expert-cathie",
    slug: "cathie-wood",
    displayName: "Cathie Wood",
    headline: "Growth-first macro commentator leaning into innovation and easing cycles.",
    organization: "ARK Invest",
    avatarUrl: "",
    bio: "CEO of ARK Invest. Bullish on deflation, AI, and aggressive Fed cuts. Public predictions on macro and tech convergence.",
    domain: "macro",
    featured: true,
    socialLinks: { x: "https://x.com/CathieDWood", website: "https://ark-invest.com" },
  },
  {
    id: "expert-elerian",
    slug: "mohamed-el-erian",
    displayName: "Mohamed El-Erian",
    headline: "Measured macro calls with strong policy framing and timing discipline.",
    organization: "Queens' College, Cambridge",
    avatarUrl: "",
    bio: "Former PIMCO CEO. Regular CNBC/Bloomberg commentator on Fed policy, inflation, and global macro.",
    domain: "macro",
    featured: true,
    socialLinks: { x: "https://x.com/elerianm" },
  },
  {
    id: "expert-lyn",
    slug: "lyn-alden",
    displayName: "Lyn Alden",
    headline: "Cross-asset macro analysis with a bias toward explicit thresholds.",
    organization: "Lyn Alden Investment Strategy",
    avatarUrl: "",
    bio: "Independent macro analyst. Known for detailed cross-asset research on fiscal dominance, liquidity, and inflation.",
    domain: "macro",
    featured: true,
    socialLinks: { x: "https://x.com/LynAldenContact", website: "https://lynalden.com" },
  },
  {
    id: "expert-yardeni",
    slug: "ed-yardeni",
    displayName: "Ed Yardeni",
    headline: "Wall Street macro commentary with broad market and rates positioning.",
    organization: "Yardeni Research",
    avatarUrl: "",
    bio: "Veteran Wall Street strategist. Known for 'Roaring 2020s' thesis and contrarian bullish calls.",
    domain: "macro",
    featured: false,
    socialLinks: { website: "https://yardeni.com" },
  },
  {
    id: "expert-cramer",
    slug: "jim-cramer",
    displayName: "Jim Cramer",
    headline: "CNBC's Mad Money host with high-frequency macro and stock calls.",
    organization: "CNBC",
    avatarUrl: "",
    bio: "Host of Mad Money on CNBC. Prolific caller — high volume of public macro predictions makes for a deep scorecard.",
    domain: "macro",
    featured: false,
    socialLinks: { x: "https://x.com/jimcramer" },
  },
  {
    id: "expert-schiff",
    slug: "peter-schiff",
    displayName: "Peter Schiff",
    headline: "Perennial gold bull and dollar bear. Vocal on inflation and Fed policy.",
    organization: "Euro Pacific Capital",
    avatarUrl: "",
    bio: "CEO of Euro Pacific Capital. Permanently bearish on the dollar and bullish on gold. Predicted 2008 crisis but has called for dollar collapse repeatedly.",
    domain: "macro",
    featured: false,
    socialLinks: { x: "https://x.com/PeterSchiff" },
  },
  {
    id: "expert-dalio",
    slug: "ray-dalio",
    displayName: "Ray Dalio",
    headline: "Macro cycle analyst focused on debt, monetary policy, and world order.",
    organization: "Bridgewater Associates",
    avatarUrl: "",
    bio: "Founder of Bridgewater. Thinks in terms of macro cycles — debt, currency, and geopolitical shifts. High-profile public predictions.",
    domain: "macro",
    featured: true,
    socialLinks: { x: "https://x.com/RayDalio", website: "https://principles.com" },
  },
  {
    id: "expert-burry",
    slug: "michael-burry",
    displayName: "Michael Burry",
    headline: "Contrarian macro bets with 'Big Short' pedigree.",
    organization: "Scion Asset Management",
    avatarUrl: "",
    bio: "The Big Short investor. Known for extreme contrarian bets. Predicted 2008 subprime crisis. Recent crash calls have not materialized.",
    domain: "macro",
    featured: false,
    socialLinks: { x: "https://x.com/BurryArchive" },
  },
  {
    id: "expert-dimon",
    slug: "jamie-dimon",
    displayName: "Jamie Dimon",
    headline: "JPMorgan CEO with consistent caution on recession and geopolitical risk.",
    organization: "JPMorgan Chase",
    avatarUrl: "",
    bio: "CEO of JPMorgan Chase. His annual shareholder letters and public statements carry market-moving weight on macro outlook.",
    domain: "macro",
    featured: false,
    socialLinks: {},
  },
  {
    id: "expert-summers",
    slug: "larry-summers",
    displayName: "Larry Summers",
    headline: "Former Treasury Secretary. Hawkish on inflation, skeptical of rate cuts.",
    organization: "Harvard University",
    avatarUrl: "",
    bio: "Former US Treasury Secretary. Early and vocal inflation hawk in 2021. Consistently argued the Fed would need to keep rates higher for longer.",
    domain: "macro",
    featured: false,
    socialLinks: { x: "https://x.com/LHSummers" },
  },
];

/* ═══════════════════════════════════════════════════════════════════
   SOURCE DOCUMENTS
   ═══════════════════════════════════════════════════════════════════ */

const sourceDocuments: SourceDocument[] = [
  // Roubini
  { id: "src-roubini-1", expertId: "expert-roubini", title: "Where Will the Global Economy Land in 2024?", platform: "Project Syndicate", url: "https://www.project-syndicate.org/commentary/global-economy-2024-growth-inflation-us-china-europe-by-nouriel-roubini-2024-01", publishedAt: "2024-01-05T00:00:00Z" },
  { id: "src-roubini-2", expertId: "expert-roubini", title: "Dr. Doom is actually upbeat about the economy", platform: "Fortune", url: "https://fortune.com/2024/08/11/dr-doom-nouriel-roubini-upbeat-us-economy-outlook-recession-hard-landing/", publishedAt: "2024-08-11T00:00:00Z" },
  { id: "src-roubini-3", expertId: "expert-roubini", title: "Roubini Sees Significant Chance of No Landing", platform: "Bloomberg", url: "https://www.bloomberg.com/news/articles/2024-03-04/roubini-sees-significant-chance-of-no-landing-for-us-economy", publishedAt: "2024-03-04T00:00:00Z" },
  // Cathie Wood
  { id: "src-cathie-1", expertId: "expert-cathie", title: "Cathie Wood Predicts Deflation In 2024", platform: "Nasdaq", url: "https://www.nasdaq.com/articles/cathie-wood-predicts-deflation-in-2024-more-ai-and-tech-optimism-and-rate-cuts", publishedAt: "2024-01-08T00:00:00Z" },
  { id: "src-cathie-2", expertId: "expert-cathie", title: "Cathie Wood Has a Bold Prediction for 2024", platform: "Motley Fool", url: "https://www.fool.com/investing/2023/12/07/cathie-wood-has-a-bold-prediction-for-2024/", publishedAt: "2023-12-07T00:00:00Z" },
  { id: "src-cathie-3", expertId: "expert-cathie", title: "Cathie Wood's 2026 Outlook", platform: "ARK Invest", url: "https://www.ark-invest.com/articles/market-commentary/cathie-woods-2026-outlook", publishedAt: "2025-12-15T00:00:00Z" },
  // El-Erian
  { id: "src-elerian-1", expertId: "expert-elerian", title: "El-Erian on Fed Policy and Inflation", platform: "CNBC", url: "https://www.cnbc.com/2024/01/15/el-erian-fed-inflation.html", publishedAt: "2024-01-15T00:00:00Z" },
  { id: "src-elerian-2", expertId: "expert-elerian", title: "El-Erian Warns on Sticky Inflation", platform: "Bloomberg", url: "https://www.bloomberg.com/news/articles/2024-04-12/el-erian-sticky-inflation", publishedAt: "2024-04-12T00:00:00Z" },
  // Lyn Alden
  { id: "src-lyn-1", expertId: "expert-lyn", title: "Fiscal Dominance and the Return of Inflation", platform: "Lyn Alden Newsletter", url: "https://lynalden.com/fiscal-dominance/", publishedAt: "2024-01-20T00:00:00Z" },
  { id: "src-lyn-2", expertId: "expert-lyn", title: "2024 Market Outlook", platform: "Lyn Alden Newsletter", url: "https://lynalden.com/2024-outlook/", publishedAt: "2024-01-02T00:00:00Z" },
  // Yardeni
  { id: "src-yardeni-1", expertId: "expert-yardeni", title: "Roaring 2020s: S&P 500 Target", platform: "Yardeni Research", url: "https://yardeni.com/research/roaring-2020s/", publishedAt: "2024-01-08T00:00:00Z" },
  { id: "src-yardeni-2", expertId: "expert-yardeni", title: "Fed Policy and Bond Market Outlook", platform: "Yardeni Research", url: "https://yardeni.com/research/fed-outlook-2024/", publishedAt: "2024-02-15T00:00:00Z" },
  // Cramer
  { id: "src-cramer-1", expertId: "expert-cramer", title: "Mad Money: 2024 Predictions", platform: "CNBC", url: "https://www.cnbc.com/2024/01/03/cramer-2024-predictions.html", publishedAt: "2024-01-03T00:00:00Z" },
  { id: "src-cramer-2", expertId: "expert-cramer", title: "Cramer on Fed and Recession Risk", platform: "CNBC", url: "https://www.cnbc.com/2024/03/15/cramer-fed-recession.html", publishedAt: "2024-03-15T00:00:00Z" },
  // Schiff
  { id: "src-schiff-1", expertId: "expert-schiff", title: "Peter Schiff warns of crashing economy", platform: "Yahoo Finance", url: "https://finance.yahoo.com/news/peter-schiff-warns-crashing-economy-110500929.html", publishedAt: "2024-01-10T00:00:00Z" },
  { id: "src-schiff-2", expertId: "expert-schiff", title: "Peter Schiff predicts gold could skyrocket", platform: "Yahoo Finance", url: "https://finance.yahoo.com/news/peter-schiff-predicts-gold-could-091300686.html", publishedAt: "2024-06-15T00:00:00Z" },
  // Dalio
  { id: "src-dalio-1", expertId: "expert-dalio", title: "Dalio: Debt crisis could cause economic heart attack", platform: "Yahoo Finance", url: "https://finance.yahoo.com/news/ray-dalio-debt-crisis-could-cause-economic-heart-attack-for-us-economy-in-the-next-3-years-165939619.html", publishedAt: "2024-05-20T00:00:00Z" },
  { id: "src-dalio-2", expertId: "expert-dalio", title: "Dalio Says US Likely Going to Be in a Recession", platform: "Bloomberg", url: "https://www.bloomberg.com/news/videos/2025-04-10/ray-dalio-says-us-likely-going-to-be-in-a-recession", publishedAt: "2025-04-10T00:00:00Z" },
  // Burry
  { id: "src-burry-1", expertId: "expert-burry", title: "Michael Burry bet $1.6B on market crash", platform: "CNN", url: "https://www.cnn.com/2023/08/15/investing/michael-burry-stock-market-crash", publishedAt: "2023-08-15T00:00:00Z" },
  { id: "src-burry-2", expertId: "expert-burry", title: "Big Short investor predicted inflation would plunge", platform: "Yahoo Finance", url: "https://finance.yahoo.com/news/big-short-investor-michael-burry-232711139.html", publishedAt: "2024-02-10T00:00:00Z" },
  // Dimon
  { id: "src-dimon-1", expertId: "expert-dimon", title: "Dimon skeptical about Goldilocks economy", platform: "Fortune", url: "https://fortune.com/2024/01/10/jamie-dimon-economy-recession-predictions/", publishedAt: "2024-01-10T00:00:00Z" },
  { id: "src-dimon-2", expertId: "expert-dimon", title: "Dimon: 65% chance of recession", platform: "Globest", url: "https://www.globest.com/2024/08/09/jamie-dimon-still-sees-a-65-chance-of-a-recession/", publishedAt: "2024-08-09T00:00:00Z" },
  // Summers
  { id: "src-summers-1", expertId: "expert-summers", title: "Summers: Fed rate cut forecasts too optimistic", platform: "CFO Dive", url: "https://www.cfodive.com/news/forecasts-fed-rate-cuts-optimistic-summers-says-inflation-GDP-economy/718004/", publishedAt: "2024-01-12T00:00:00Z" },
  { id: "src-summers-2", expertId: "expert-summers", title: "Summers: Next Fed move could be a hike", platform: "Bloomberg", url: "https://www.bloomberg.com/news/articles/2024-04-10/summers-says-have-to-seriously-consider-next-fed-move-is-a-hike", publishedAt: "2024-04-10T00:00:00Z" },
  // ─── Additional sources for expanded claims ───
  { id: "src-roubini-4", expertId: "expert-roubini", title: "Roubini on inflation persistence", platform: "Project Syndicate", url: "https://www.project-syndicate.org/commentary/roubini-inflation-2024", publishedAt: "2024-02-10T00:00:00Z" },
  { id: "src-cathie-4", expertId: "expert-cathie", title: "Cathie Wood on Bitcoin and Innovation", platform: "ARK Invest", url: "https://ark-invest.com/articles/market-commentary/bitcoin-2024", publishedAt: "2024-01-15T00:00:00Z" },
  { id: "src-elerian-3", expertId: "expert-elerian", title: "El-Erian: Inflation is not dead", platform: "Bloomberg", url: "https://www.bloomberg.com/news/articles/2024-10-04/el-erian-warns-fed-after-jobs-data-inflation-is-not-dead", publishedAt: "2024-10-04T00:00:00Z" },
  { id: "src-elerian-4", expertId: "expert-elerian", title: "El-Erian: Fed should target 3% inflation", platform: "CNBC", url: "https://www.cnbc.com/video/2023/12/04/my-hope-is-the-fed-targets-a-3-percent-inflation-instead-of-2-percent-says-mohamed-el-erian.html", publishedAt: "2023-12-04T00:00:00Z" },
  { id: "src-lyn-3", expertId: "expert-lyn", title: "Lyn Alden: Bitcoin to outperform gold", platform: "Bankless", url: "https://www.bankless.com/podcast/trump-bitcoin-the-dollars-fate-lyn-aldens-macro-predictions-for-2025", publishedAt: "2024-12-15T00:00:00Z" },
  { id: "src-yardeni-3", expertId: "expert-yardeni", title: "Yardeni raises S&P target to 5800", platform: "CNBC", url: "https://www.cnbc.com/2024/07/11/ed-yardeni-says-roaring-2020s-happening-faster-than-he-expected.html", publishedAt: "2024-07-11T00:00:00Z" },
  { id: "src-yardeni-4", expertId: "expert-yardeni", title: "Yardeni: S&P 10000 by 2030", platform: "Bloomberg", url: "https://www.bloomberg.com/news/articles/2024-11-11/s-p-500-will-soar-66-to-10-000-by-end-of-decade-yardeni-says", publishedAt: "2024-11-11T00:00:00Z" },
  { id: "src-cramer-3", expertId: "expert-cramer", title: "Cramer: 2024 market predictions", platform: "CNBC", url: "https://www.cnbc.com/2024/01/02/jim-cramer-makes-market-predictions-for-2024.html", publishedAt: "2024-01-02T00:00:00Z" },
  { id: "src-cramer-4", expertId: "expert-cramer", title: "Cramer on Nike: very cheap", platform: "CNBC", url: "https://www.cnbc.com/2024/06/cramer-nike.html", publishedAt: "2024-06-01T00:00:00Z" },
  { id: "src-schiff-3", expertId: "expert-schiff", title: "Schiff: Dollar will crash in 2025", platform: "Fox Business", url: "https://www.foxbusiness.com/economy/economist-warns-coming-financial-crisis-make-2008-look-like-sunday-school-picnic", publishedAt: "2024-10-01T00:00:00Z" },
  { id: "src-dalio-3", expertId: "expert-dalio", title: "Dalio on China and geopolitical risk", platform: "CNBC", url: "https://www.cnbc.com/2025/04/13/billionaire-ray-dalio-im-worried-about-something-worse-than-a-recession.html", publishedAt: "2025-04-13T00:00:00Z" },
  { id: "src-burry-3", expertId: "expert-burry", title: "Burry predicted inflation would plunge", platform: "Yahoo Finance", url: "https://finance.yahoo.com/news/big-short-investor-michael-burry-232711139.html", publishedAt: "2023-01-15T00:00:00Z" },
  { id: "src-dimon-3", expertId: "expert-dimon", title: "Dimon: recession likely from tariffs", platform: "CNBC", url: "https://www.cnbc.com/2025/04/09/jamie-dimon-says-a-recession-is-likely-outcome-from-trumps-tariff-turmoil.html", publishedAt: "2025-04-09T00:00:00Z" },
  { id: "src-summers-3", expertId: "expert-summers", title: "Summers: inflation not tamed", platform: "Globest", url: "https://www.globest.com/2024/11/14/larry-summers-still-thinks-inflation-hasnt-been-tamed-/", publishedAt: "2024-11-14T00:00:00Z" },
];

/* ═══════════════════════════════════════════════════════════════════
   CLAIMS — Real public predictions, scored events
   Key verified outcomes:
   - Fed first cut: Sep 18, 2024 (50bps) → YES
   - Fed 3+ cuts in 2024: Sep+Nov+Dec = 3 cuts → YES
   - US recession 2024: No → NO
   - US recession by Q2 2025: No → NO
   - US CPI end 2024 YoY: 2.9% (Dec 2024) → below 3% = YES
   - S&P 500 end 2024: 5,881 → above 5500 = YES
   - US unemployment end 2024: 4.1% → above 4.5% = NO
   - 10Y Treasury end 2024: 4.57% → below 3.5% = NO
   - Gold end 2024: ~$2,624/oz → above $3000 by end 2024 = NO
   - Brent crude mid 2025: ~$65 → above $100 = NO
   - US CPI deflation 2024: No deflation → NO
   ═══════════════════════════════════════════════════════════════════ */

let claimId = 1;
function cid() { return `claim-${claimId++}`; }

const claims: Claim[] = [
  /* ─── Shared Event: Fed delivers first cut by end of Q3 2024 ─── */
  { id: cid(), expertId: "expert-roubini", sourceDocumentId: "src-roubini-1", eventKey: "fed-first-cut-by-q3-2024", eventLabel: "Fed delivers its first cut by end of Q3 2024", quotedText: "The Fed is likely to start easing in the second half of 2024, possibly as early as September.", publishedAt: "2024-01-05T00:00:00Z", deadline: "2024-09-30T23:59:59Z", claimType: "first_action_by_date", predictedOutcome: "yes", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "first_action_by_date", metricKey: "fed-funds-rate", metricLabel: "Fed Funds Rate", operator: "decreases", unit: "bps", deadline: "2024-09-30T23:59:59Z" }, confidenceTier: "medium", tierAssignmentReason: "Hedged language with 'likely' and 'possibly'" },
  { id: cid(), expertId: "expert-cathie", sourceDocumentId: "src-cathie-1", eventKey: "fed-first-cut-by-q3-2024", eventLabel: "Fed delivers its first cut by end of Q3 2024", quotedText: "We think interest rates are going to fall sooner and faster than most expect.", publishedAt: "2024-01-08T00:00:00Z", deadline: "2024-09-30T23:59:59Z", claimType: "first_action_by_date", predictedOutcome: "yes", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "first_action_by_date", metricKey: "fed-funds-rate", metricLabel: "Fed Funds Rate", operator: "decreases", unit: "bps", deadline: "2024-09-30T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "Strong conviction — 'going to fall sooner and faster'" },
  { id: cid(), expertId: "expert-elerian", sourceDocumentId: "src-elerian-1", eventKey: "fed-first-cut-by-q3-2024", eventLabel: "Fed delivers its first cut by end of Q3 2024", quotedText: "The Fed will likely begin its easing cycle in mid-2024, but the path will be bumpy.", publishedAt: "2024-01-15T00:00:00Z", deadline: "2024-09-30T23:59:59Z", claimType: "first_action_by_date", predictedOutcome: "yes", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "first_action_by_date", metricKey: "fed-funds-rate", metricLabel: "Fed Funds Rate", operator: "decreases", unit: "bps", deadline: "2024-09-30T23:59:59Z" }, confidenceTier: "medium", tierAssignmentReason: "Moderate conviction with 'likely' qualifier" },
  { id: cid(), expertId: "expert-summers", sourceDocumentId: "src-summers-1", eventKey: "fed-first-cut-by-q3-2024", eventLabel: "Fed delivers its first cut by end of Q3 2024", quotedText: "There's no compelling warrant for easing monetary policy. Markets should get used to rates in current ranges.", publishedAt: "2024-01-12T00:00:00Z", deadline: "2024-09-30T23:59:59Z", claimType: "first_action_by_date", predictedOutcome: "no", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "first_action_by_date", metricKey: "fed-funds-rate", metricLabel: "Fed Funds Rate", operator: "decreases", unit: "bps", deadline: "2024-09-30T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "Strong conviction — 'no compelling warrant'" },

  /* ─── Shared Event: Fed delivers 3+ cuts in 2024 ─── */
  { id: cid(), expertId: "expert-cathie", sourceDocumentId: "src-cathie-2", eventKey: "fed-three-cuts-2024", eventLabel: "Fed delivers at least three cuts in 2024", quotedText: "The Fed will need to cut rates aggressively. We expect at least three to four cuts.", publishedAt: "2023-12-07T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "count_by_deadline", predictedOutcome: "yes", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "count_by_deadline", metricKey: "fed-rate-cuts-count", metricLabel: "Fed rate cuts in 2024", operator: ">=", threshold: 3, unit: "cuts", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "Strong conviction — 'will need to cut aggressively'" },
  { id: cid(), expertId: "expert-lyn", sourceDocumentId: "src-lyn-2", eventKey: "fed-three-cuts-2024", eventLabel: "Fed delivers at least three cuts in 2024", quotedText: "I expect at least a few rate cuts in 2024 as the liquidity cycle turns. Three seems realistic.", publishedAt: "2024-01-02T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "count_by_deadline", predictedOutcome: "yes", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "count_by_deadline", metricKey: "fed-rate-cuts-count", metricLabel: "Fed rate cuts in 2024", operator: ">=", threshold: 3, unit: "cuts", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "low", tierAssignmentReason: "Cautious language — 'seems realistic'" },
  { id: cid(), expertId: "expert-yardeni", sourceDocumentId: "src-yardeni-2", eventKey: "fed-three-cuts-2024", eventLabel: "Fed delivers at least three cuts in 2024", quotedText: "The Fed may cut two to three times in 2024, but the economy doesn't need it.", publishedAt: "2024-02-15T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "count_by_deadline", predictedOutcome: "yes", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "count_by_deadline", metricKey: "fed-rate-cuts-count", metricLabel: "Fed rate cuts in 2024", operator: ">=", threshold: 3, unit: "cuts", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "low", tierAssignmentReason: "Hedged — 'may' and 'two to three'" },
  { id: cid(), expertId: "expert-summers", sourceDocumentId: "src-summers-2", eventKey: "fed-three-cuts-2024", eventLabel: "Fed delivers at least three cuts in 2024", quotedText: "We have to take seriously the possibility that the next rate move will be a hike, not a cut.", publishedAt: "2024-04-10T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "count_by_deadline", predictedOutcome: "no", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "count_by_deadline", metricKey: "fed-rate-cuts-count", metricLabel: "Fed rate cuts in 2024", operator: ">=", threshold: 3, unit: "cuts", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "Hawkish conviction — suggesting hike instead of cut" },

  /* ─── Shared Event: US enters recession by end of 2024 ─── */
  { id: cid(), expertId: "expert-roubini", sourceDocumentId: "src-roubini-3", eventKey: "us-recession-2024", eventLabel: "US enters recession by end of 2024", quotedText: "I'm less worried that the US economy would slide into a recession. The chances of a soft landing are diminishing — it could be a no landing.", publishedAt: "2024-03-04T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "first_action_by_date", predictedOutcome: "no", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "first_action_by_date", metricKey: "nber-recession", metricLabel: "NBER Recession Declaration", operator: "==", unit: "boolean", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "medium", tierAssignmentReason: "Evolved stance — moved from doom to 'no landing'" },
  { id: cid(), expertId: "expert-dimon", sourceDocumentId: "src-dimon-2", eventKey: "us-recession-2024", eventLabel: "US enters recession by end of 2024", quotedText: "I still see a 65% chance of a recession. A soft landing is only 35-40%.", publishedAt: "2024-08-09T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "first_action_by_date", predictedOutcome: "yes", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "first_action_by_date", metricKey: "nber-recession", metricLabel: "NBER Recession Declaration", operator: "==", unit: "boolean", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "Strong conviction — '65% chance of recession'" },
  { id: cid(), expertId: "expert-burry", sourceDocumentId: "src-burry-1", eventKey: "us-recession-2024", eventLabel: "US enters recession by end of 2024", quotedText: "Placed $1.6 billion in S&P 500 and Nasdaq 100 put options, betting on a major market downturn.", publishedAt: "2023-08-15T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "first_action_by_date", predictedOutcome: "yes", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "first_action_by_date", metricKey: "nber-recession", metricLabel: "NBER Recession Declaration", operator: "==", unit: "boolean", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "$1.6B in puts is highest conviction" },
  { id: cid(), expertId: "expert-dalio", sourceDocumentId: "src-dalio-1", eventKey: "us-recession-2024", eventLabel: "US enters recession by end of 2024", quotedText: "The US is on the brink of an economic heart attack within the next three years if the deficit isn't reduced.", publishedAt: "2024-05-20T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "first_action_by_date", predictedOutcome: "yes", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "first_action_by_date", metricKey: "nber-recession", metricLabel: "NBER Recession Declaration", operator: "==", unit: "boolean", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "medium", tierAssignmentReason: "'Within three years' is broader timeframe — medium" },
  { id: cid(), expertId: "expert-schiff", sourceDocumentId: "src-schiff-1", eventKey: "us-recession-2024", eventLabel: "US enters recession by end of 2024", quotedText: "The economy is crashing. The Fed's pivot is a mistake and will lead to a severe recession.", publishedAt: "2024-01-10T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "first_action_by_date", predictedOutcome: "yes", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "first_action_by_date", metricKey: "nber-recession", metricLabel: "NBER Recession Declaration", operator: "==", unit: "boolean", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "Extreme conviction — 'is crashing' and 'severe recession'" },

  /* ─── Shared Event: S&P 500 ends 2024 above 5500 ─── */
  { id: cid(), expertId: "expert-yardeni", sourceDocumentId: "src-yardeni-1", eventKey: "spx-above-5500-end-2024", eventLabel: "S&P 500 ends 2024 above 5500", quotedText: "My year-end S&P 500 target is 5400, consistent with the Roaring 2020s thesis.", publishedAt: "2024-01-08T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "end_value_at_date", predictedOutcome: "no", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "end_value_at_date", metricKey: "spx-close", metricLabel: "S&P 500 Close", operator: ">", threshold: 5500, unit: "points", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "medium", tierAssignmentReason: "5400 target is just below 5500 threshold" },
  { id: cid(), expertId: "expert-cathie", sourceDocumentId: "src-cathie-1", eventKey: "spx-above-5500-end-2024", eventLabel: "S&P 500 ends 2024 above 5500", quotedText: "Innovation stocks will lead the market higher in 2024. We're very bullish on equities.", publishedAt: "2024-01-08T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "end_value_at_date", predictedOutcome: "yes", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "end_value_at_date", metricKey: "spx-close", metricLabel: "S&P 500 Close", operator: ">", threshold: 5500, unit: "points", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "Very bullish equity stance" },
  { id: cid(), expertId: "expert-burry", sourceDocumentId: "src-burry-1", eventKey: "spx-above-5500-end-2024", eventLabel: "S&P 500 ends 2024 above 5500", quotedText: "Bet $1.6B on S&P 500 put options, expecting a major market crash.", publishedAt: "2023-08-15T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "end_value_at_date", predictedOutcome: "no", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "end_value_at_date", metricKey: "spx-close", metricLabel: "S&P 500 Close", operator: ">", threshold: 5500, unit: "points", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "$1.6B in puts implies strong downside conviction" },

  /* ─── Shared Event: US CPI ends 2024 below 3.0% ─── */
  { id: cid(), expertId: "expert-cathie", sourceDocumentId: "src-cathie-1", eventKey: "cpi-below-3-end-2024", eventLabel: "US CPI ends 2024 below 3.0%", quotedText: "Not only will inflation continue to go down, it could even go negative at some point during 2024.", publishedAt: "2024-01-08T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "end_value_at_date", predictedOutcome: "yes", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "end_value_at_date", metricKey: "cpi-yoy", metricLabel: "US CPI YoY", operator: "<", threshold: 3.0, unit: "%", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "Extreme conviction — predicting outright deflation" },
  { id: cid(), expertId: "expert-summers", sourceDocumentId: "src-summers-1", eventKey: "cpi-below-3-end-2024", eventLabel: "US CPI ends 2024 below 3.0%", quotedText: "We're not at a 2% inflation target and I don't think we're on a convincing trajectory to the 2% target.", publishedAt: "2024-01-12T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "end_value_at_date", predictedOutcome: "no", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "end_value_at_date", metricKey: "cpi-yoy", metricLabel: "US CPI YoY", operator: "<", threshold: 3.0, unit: "%", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "Strong hawkish conviction on sticky inflation" },
  { id: cid(), expertId: "expert-lyn", sourceDocumentId: "src-lyn-1", eventKey: "cpi-below-3-end-2024", eventLabel: "US CPI ends 2024 below 3.0%", quotedText: "Fiscal dominance will keep inflation stickier than the market expects. Getting below 3% will be harder than consensus thinks.", publishedAt: "2024-01-20T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "end_value_at_date", predictedOutcome: "no", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "end_value_at_date", metricKey: "cpi-yoy", metricLabel: "US CPI YoY", operator: "<", threshold: 3.0, unit: "%", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "medium", tierAssignmentReason: "'Harder than consensus thinks' — medium conviction" },
  { id: cid(), expertId: "expert-elerian", sourceDocumentId: "src-elerian-2", eventKey: "cpi-below-3-end-2024", eventLabel: "US CPI ends 2024 below 3.0%", quotedText: "Inflation is proving stickier than expected. The last mile to 2% will be the hardest.", publishedAt: "2024-04-12T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "end_value_at_date", predictedOutcome: "no", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "end_value_at_date", metricKey: "cpi-yoy", metricLabel: "US CPI YoY", operator: "<", threshold: 3.0, unit: "%", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "medium", tierAssignmentReason: "'Stickier than expected' but not extreme conviction" },

  /* ─── Shared Event: US unemployment ends 2024 above 4.5% ─── */
  { id: cid(), expertId: "expert-dimon", sourceDocumentId: "src-dimon-1", eventKey: "unemployment-above-4-5-end-2024", eventLabel: "US unemployment ends 2024 above 4.5%", quotedText: "The economy could face significant headwinds. I wouldn't be surprised if unemployment rises above 4.5%.", publishedAt: "2024-01-10T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "end_value_at_date", predictedOutcome: "yes", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "end_value_at_date", metricKey: "unemployment-rate", metricLabel: "US Unemployment Rate", operator: ">", threshold: 4.5, unit: "%", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "medium", tierAssignmentReason: "'Wouldn't be surprised' — not high conviction" },
  { id: cid(), expertId: "expert-schiff", sourceDocumentId: "src-schiff-1", eventKey: "unemployment-above-4-5-end-2024", eventLabel: "US unemployment ends 2024 above 4.5%", quotedText: "Unemployment will soar as the economy crashes. The real numbers are much worse than reported.", publishedAt: "2024-01-10T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "end_value_at_date", predictedOutcome: "yes", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "end_value_at_date", metricKey: "unemployment-rate", metricLabel: "US Unemployment Rate", operator: ">", threshold: 4.5, unit: "%", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "'Will soar' — extreme conviction" },

  /* ─── Shared Event: Gold above $3000 by end of 2024 ─── */
  { id: cid(), expertId: "expert-schiff", sourceDocumentId: "src-schiff-2", eventKey: "gold-above-3000-end-2024", eventLabel: "Gold above $3000 by end of 2024", quotedText: "Gold's value, when adjusted for inflation, should be at least $3,000. The current prices are just the beginning.", publishedAt: "2024-06-15T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "threshold_cross_by_date", predictedOutcome: "yes", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "threshold_cross_by_date", metricKey: "gold-spot", metricLabel: "Gold Spot Price", operator: ">", threshold: 3000, unit: "USD/oz", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "'Should be at least $3000' — strong conviction" },

  /* ─── Shared Event: 10Y Treasury ends 2024 below 4.0% ─── */
  { id: cid(), expertId: "expert-elerian", sourceDocumentId: "src-elerian-4", eventKey: "ten-year-below-4-end-2024", eventLabel: "10Y Treasury yield ends 2024 below 4.0%", quotedText: "I hope the Fed targets 3% inflation instead of 2%. Bond yields should come down as inflation moderates.", publishedAt: "2023-12-04T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "end_value_at_date", predictedOutcome: "yes", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "end_value_at_date", metricKey: "ten-year-yield", metricLabel: "10Y Treasury Yield", operator: "<", threshold: 4.0, unit: "%", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "low", tierAssignmentReason: "Hopeful tone — 'I hope' — low conviction" },
  { id: cid(), expertId: "expert-lyn", sourceDocumentId: "src-lyn-1", eventKey: "ten-year-below-4-end-2024", eventLabel: "10Y Treasury yield ends 2024 below 4.0%", quotedText: "Fiscal dominance means structurally higher rates. The 10-year is unlikely to sustainably break below 4%.", publishedAt: "2024-01-20T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "end_value_at_date", predictedOutcome: "no", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "end_value_at_date", metricKey: "ten-year-yield", metricLabel: "10Y Treasury Yield", operator: "<", threshold: 4.0, unit: "%", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "'Structurally higher rates' — strong macro conviction" },
  { id: cid(), expertId: "expert-summers", sourceDocumentId: "src-summers-1", eventKey: "ten-year-below-4-end-2024", eventLabel: "10Y Treasury yield ends 2024 below 4.0%", quotedText: "The neutral rate is probably 4.5%, not 2.6%. Long-term rates will stay elevated.", publishedAt: "2024-01-12T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "end_value_at_date", predictedOutcome: "no", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "end_value_at_date", metricKey: "ten-year-yield", metricLabel: "10Y Treasury Yield", operator: "<", threshold: 4.0, unit: "%", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "'Neutral rate is 4.5%' — high conviction on higher rates" },

  /* ─── Shared Event: Bitcoin ends 2024 above $80,000 ─── */
  { id: cid(), expertId: "expert-cathie", sourceDocumentId: "src-cathie-4", eventKey: "btc-above-80k-end-2024", eventLabel: "Bitcoin ends 2024 above $80,000", quotedText: "Bitcoin is a hedge against monetary debasement. We expect significant upside in 2024 driven by the ETF approval and halving cycle.", publishedAt: "2024-01-15T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "end_value_at_date", predictedOutcome: "yes", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "end_value_at_date", metricKey: "btc-usd", metricLabel: "Bitcoin Price", operator: ">", threshold: 80000, unit: "USD", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "Strong conviction on Bitcoin ETF + halving cycle" },
  { id: cid(), expertId: "expert-lyn", sourceDocumentId: "src-lyn-3", eventKey: "btc-above-80k-end-2024", eventLabel: "Bitcoin ends 2024 above $80,000", quotedText: "Bitcoin correlates strongly with global liquidity. With liquidity trending upward into 2024-2025, I expect Bitcoin to outperform.", publishedAt: "2024-12-15T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "end_value_at_date", predictedOutcome: "yes", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "end_value_at_date", metricKey: "btc-usd", metricLabel: "Bitcoin Price", operator: ">", threshold: 80000, unit: "USD", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "medium", tierAssignmentReason: "Conditional on liquidity — medium conviction" },
  { id: cid(), expertId: "expert-schiff", sourceDocumentId: "src-schiff-1", eventKey: "btc-above-80k-end-2024", eventLabel: "Bitcoin ends 2024 above $80,000", quotedText: "Bitcoin is the biggest bubble in history. It will crash back to earth. Gold is the real store of value.", publishedAt: "2024-01-10T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "end_value_at_date", predictedOutcome: "no", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "end_value_at_date", metricKey: "btc-usd", metricLabel: "Bitcoin Price", operator: ">", threshold: 80000, unit: "USD", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "'Biggest bubble in history' — extreme conviction" },

  /* ─── Shared Event: US dollar index (DXY) ends 2024 above 105 ─── */
  { id: cid(), expertId: "expert-schiff", sourceDocumentId: "src-schiff-3", eventKey: "dxy-above-105-end-2024", eventLabel: "US dollar index ends 2024 above 105", quotedText: "The dollar's dominance as the world's primary reserve asset is ending. We'll see a significant crash.", publishedAt: "2024-10-01T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "end_value_at_date", predictedOutcome: "no", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "end_value_at_date", metricKey: "dxy-index", metricLabel: "US Dollar Index", operator: ">", threshold: 105, unit: "index", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "'Dominance is ending' — extreme conviction on dollar weakness" },
  { id: cid(), expertId: "expert-summers", sourceDocumentId: "src-summers-3", eventKey: "dxy-above-105-end-2024", eventLabel: "US dollar index ends 2024 above 105", quotedText: "Higher US rates relative to the world will keep the dollar strong. Rate differentials favor the greenback.", publishedAt: "2024-11-14T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "end_value_at_date", predictedOutcome: "yes", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "end_value_at_date", metricKey: "dxy-index", metricLabel: "US Dollar Index", operator: ">", threshold: 105, unit: "index", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "medium", tierAssignmentReason: "Rate differential argument — medium conviction" },

  /* ─── Shared Event: Brent crude above $100 by mid-2025 ─── */
  { id: cid(), expertId: "expert-roubini", sourceDocumentId: "src-roubini-4", eventKey: "brent-above-100-mid-2025", eventLabel: "Brent crude above $100 by mid-2025", quotedText: "Geopolitical risk in the Middle East could push oil prices above $100. The supply-demand balance remains tight.", publishedAt: "2024-02-10T00:00:00Z", deadline: "2025-06-30T23:59:59Z", claimType: "threshold_cross_by_date", predictedOutcome: "yes", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "threshold_cross_by_date", metricKey: "brent-crude", metricLabel: "Brent Crude", operator: ">", threshold: 100, unit: "USD/bbl", deadline: "2025-06-30T23:59:59Z" }, confidenceTier: "medium", tierAssignmentReason: "'Could push' — conditional language" },
  { id: cid(), expertId: "expert-yardeni", sourceDocumentId: "src-yardeni-2", eventKey: "brent-above-100-mid-2025", eventLabel: "Brent crude above $100 by mid-2025", quotedText: "Oil will stay range-bound. Increased US production and softening China demand cap the upside.", publishedAt: "2024-02-15T00:00:00Z", deadline: "2025-06-30T23:59:59Z", claimType: "threshold_cross_by_date", predictedOutcome: "no", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "threshold_cross_by_date", metricKey: "brent-crude", metricLabel: "Brent Crude", operator: ">", threshold: 100, unit: "USD/bbl", deadline: "2025-06-30T23:59:59Z" }, confidenceTier: "medium", tierAssignmentReason: "Balanced analysis — medium conviction" },

  /* ─── Yardeni specific: S&P 500 target revisions ─── */
  { id: cid(), expertId: "expert-yardeni", sourceDocumentId: "src-yardeni-3", eventKey: "spx-above-5800-end-2024", eventLabel: "S&P 500 ends 2024 above 5800", quotedText: "The Roaring 2020s are happening even faster than I expected. I'm raising my year-end target to 5,800.", publishedAt: "2024-07-11T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "end_value_at_date", predictedOutcome: "yes", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "end_value_at_date", metricKey: "spx-close", metricLabel: "S&P 500 Close", operator: ">", threshold: 5800, unit: "points", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "'Happening faster than expected' — raised conviction" },

  /* ─── Cramer specific calls ─── */
  { id: cid(), expertId: "expert-cramer", sourceDocumentId: "src-cramer-3", eventKey: "cramer-bullish-2024", eventLabel: "Cramer: 2024 will be a good year for stocks", quotedText: "I think 2024 is going to be a really good year for stocks. The economy is resilient and earnings are growing.", publishedAt: "2024-01-02T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "end_value_at_date", predictedOutcome: "yes", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "end_value_at_date", metricKey: "spx-annual-return", metricLabel: "S&P 500 Annual Return", operator: ">", threshold: 10, unit: "%", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "'Really good year' — strong bullish conviction" },
  { id: cid(), expertId: "expert-cramer", sourceDocumentId: "src-cramer-4", eventKey: "cramer-nike-cheap", eventLabel: "Cramer: Nike is very cheap (buy call)", quotedText: "I think Nike is very cheap here. This is a great American brand at a discount.", publishedAt: "2024-06-01T00:00:00Z", deadline: "2024-12-31T23:59:59Z", claimType: "cumulative_change_by_deadline", predictedOutcome: "yes", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "cumulative_change_by_deadline", metricKey: "nike-stock-return", metricLabel: "Nike Stock Return After Call", operator: ">", threshold: 0, unit: "%", deadline: "2024-12-31T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "'Very cheap' and 'great discount' — strong buy conviction" },

  /* ─── Burry specific: Inflation call ─── */
  { id: cid(), expertId: "expert-burry", sourceDocumentId: "src-burry-3", eventKey: "burry-inflation-plunge-2023", eventLabel: "Burry: US inflation will plunge in 2023", quotedText: "Inflation is going to come down significantly. We're going to see a major disinflationary impulse.", publishedAt: "2023-01-15T00:00:00Z", deadline: "2023-12-31T23:59:59Z", claimType: "end_value_at_date", predictedOutcome: "yes", status: "resolved", scoreVersion: "v1.0", resolutionRule: { claimType: "end_value_at_date", metricKey: "cpi-yoy-change", metricLabel: "CPI YoY Change Direction", operator: "<", threshold: 4.0, unit: "%", deadline: "2023-12-31T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "'Going to come down significantly' — strong conviction" },

  /* ─── Dalio: US debt crisis timeline ─── */
  { id: cid(), expertId: "expert-dalio", sourceDocumentId: "src-dalio-1", eventKey: "dalio-debt-crisis-3yr", eventLabel: "Dalio: US faces debt crisis within 3 years", quotedText: "The US could face an economic heart attack within the next three years if the administration does not commit to actively reducing the deficit.", publishedAt: "2024-05-20T00:00:00Z", deadline: "2027-05-20T23:59:59Z", claimType: "first_action_by_date", predictedOutcome: "yes", status: "published_open", scoreVersion: "v1.0", resolutionRule: { claimType: "first_action_by_date", metricKey: "us-debt-crisis", metricLabel: "US Debt Crisis Event", operator: "==", unit: "boolean", deadline: "2027-05-20T23:59:59Z" }, confidenceTier: "medium", tierAssignmentReason: "'Could face' with conditional 'if' — medium conviction" },

  /* ─── Dimon: recession from tariffs ─── */
  { id: cid(), expertId: "expert-dimon", sourceDocumentId: "src-dimon-3", eventKey: "dimon-tariff-recession-2025", eventLabel: "Dimon: Tariffs will cause recession in 2025", quotedText: "A recession is a likely outcome from the tariff turmoil. Defaults will rise as trade wars roil global markets.", publishedAt: "2025-04-09T00:00:00Z", deadline: "2025-12-31T23:59:59Z", claimType: "first_action_by_date", predictedOutcome: "yes", status: "published_open", scoreVersion: "v1.0", resolutionRule: { claimType: "first_action_by_date", metricKey: "nber-recession", metricLabel: "NBER Recession Declaration", operator: "==", unit: "boolean", deadline: "2025-12-31T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "'Likely outcome' and 'defaults will rise' — high conviction" },

  /* ─── Open predictions (2025-2026, not yet resolved) ─── */
  { id: cid(), expertId: "expert-dalio", sourceDocumentId: "src-dalio-2", eventKey: "us-recession-by-end-2025", eventLabel: "US enters recession by end of 2025", quotedText: "I think it's likely that we're going to be in a recession.", publishedAt: "2025-04-10T00:00:00Z", deadline: "2025-12-31T23:59:59Z", claimType: "first_action_by_date", predictedOutcome: "yes", status: "published_open", scoreVersion: "v1.0", resolutionRule: { claimType: "first_action_by_date", metricKey: "nber-recession", metricLabel: "NBER Recession Declaration", operator: "==", unit: "boolean", deadline: "2025-12-31T23:59:59Z" }, confidenceTier: "medium", tierAssignmentReason: "'Likely' — medium conviction" },
  { id: cid(), expertId: "expert-cathie", sourceDocumentId: "src-cathie-3", eventKey: "us-gdp-growth-above-6-pct-2026", eventLabel: "US nominal GDP growth exceeds 6% in 2026", quotedText: "Stored demand will release violently, potentially driving nominal GDP growth to 6% to 8%.", publishedAt: "2025-12-15T00:00:00Z", deadline: "2026-12-31T23:59:59Z", claimType: "end_value_at_date", predictedOutcome: "yes", status: "published_open", scoreVersion: "v1.0", resolutionRule: { claimType: "end_value_at_date", metricKey: "nominal-gdp-growth", metricLabel: "US Nominal GDP Growth", operator: ">", threshold: 6, unit: "%", deadline: "2026-12-31T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "'Will release violently' — strong conviction" },
  { id: cid(), expertId: "expert-yardeni", sourceDocumentId: "src-yardeni-4", eventKey: "spx-10000-by-2030", eventLabel: "S&P 500 reaches 10,000 by end of 2030", quotedText: "The S&P 500 will soar to 10,000 by the end of the decade, driven by AI productivity gains.", publishedAt: "2024-11-11T00:00:00Z", deadline: "2030-12-31T23:59:59Z", claimType: "threshold_cross_by_date", predictedOutcome: "yes", status: "published_open", scoreVersion: "v1.0", resolutionRule: { claimType: "threshold_cross_by_date", metricKey: "spx-close", metricLabel: "S&P 500 Close", operator: ">", threshold: 10000, unit: "points", deadline: "2030-12-31T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "'Will soar to 10,000' — strong conviction" },
  { id: cid(), expertId: "expert-schiff", sourceDocumentId: "src-schiff-3", eventKey: "dollar-crisis-2025", eventLabel: "US dollar crisis triggers economic collapse in 2025", quotedText: "The dollar's low will be breached in 2025, triggering a US dollar crisis, crashing the economy.", publishedAt: "2024-10-01T00:00:00Z", deadline: "2025-12-31T23:59:59Z", claimType: "first_action_by_date", predictedOutcome: "yes", status: "published_open", scoreVersion: "v1.0", resolutionRule: { claimType: "first_action_by_date", metricKey: "dxy-crisis", metricLabel: "DXY Crisis Level", operator: "==", unit: "boolean", deadline: "2025-12-31T23:59:59Z" }, confidenceTier: "high", tierAssignmentReason: "'Will be breached' — strong conviction" },
];

/* ═══════════════════════════════════════════════════════════════════
   RESOLUTIONS
   ═══════════════════════════════════════════════════════════════════ */

const resolutions: Resolution[] = [
  // Fed first cut by Q3 2024 → YES (Sep 18, 2024 — 50bps cut)
  ...claims.filter(c => c.eventKey === "fed-first-cut-by-q3-2024" && c.status === "resolved").map(c => ({
    id: `res-${c.id}`,
    claimId: c.id,
    outcome: "yes" as const,
    actualValue: "50bps cut on Sep 18, 2024",
    evidenceUrl: "https://www.federalreserve.gov/newsevents/pressreleases/monetary20240918a.htm",
    resolvedAt: "2024-09-18T18:00:00Z",
    settlementPolicy: "first_official_release" as const,
    settledStage: "official_preliminary" as const,
    reviewerId: "ops-maya",
    reviewerName: "Maya",
    notes: "FOMC cut the federal funds rate by 50 basis points to 4.75-5.00% on September 18, 2024.",
  })),
  // Fed 3+ cuts in 2024 → YES (Sep 50bp + Nov 25bp + Dec 25bp = 3 cuts)
  ...claims.filter(c => c.eventKey === "fed-three-cuts-2024" && c.status === "resolved").map(c => ({
    id: `res-${c.id}`,
    claimId: c.id,
    outcome: "yes" as const,
    actualValue: "3 cuts: Sep 50bp, Nov 25bp, Dec 25bp",
    evidenceUrl: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm",
    resolvedAt: "2024-12-18T18:00:00Z",
    settlementPolicy: "first_official_release" as const,
    settledStage: "official_final" as const,
    reviewerId: "ops-maya",
    reviewerName: "Maya",
    notes: "The Fed cut rates three times in 2024: September (50bp), November (25bp), December (25bp), totaling 100bp.",
  })),
  // US recession 2024 → NO
  ...claims.filter(c => c.eventKey === "us-recession-2024" && c.status === "resolved").map(c => ({
    id: `res-${c.id}`,
    claimId: c.id,
    outcome: "no" as const,
    actualValue: "No recession declared",
    evidenceUrl: "https://www.nber.org/research/data/us-business-cycle-expansions-and-contractions",
    resolvedAt: "2024-12-31T23:59:59Z",
    settlementPolicy: "first_official_release" as const,
    settledStage: "official_preliminary" as const,
    reviewerId: "ops-maya",
    reviewerName: "Maya",
    notes: "The US economy grew throughout 2024. No NBER recession declaration. Real GDP grew ~2.8% in 2024.",
  })),
  // S&P 500 above 5500 end 2024 → YES (closed at 5,881)
  ...claims.filter(c => c.eventKey === "spx-above-5500-end-2024" && c.status === "resolved").map(c => ({
    id: `res-${c.id}`,
    claimId: c.id,
    outcome: "yes" as const,
    actualValue: "5,881.63",
    evidenceUrl: "https://finance.yahoo.com/quote/%5EGSPC/history/",
    resolvedAt: "2024-12-31T16:00:00Z",
    settlementPolicy: "first_official_release" as const,
    settledStage: "market_close" as const,
    reviewerId: "ops-maya",
    reviewerName: "Maya",
    notes: "S&P 500 closed 2024 at 5,881.63, well above the 5,500 threshold. Market gained ~23% in 2024.",
  })),
  // CPI below 3% end 2024 → YES (Dec 2024 CPI YoY = 2.9%)
  ...claims.filter(c => c.eventKey === "cpi-below-3-end-2024" && c.status === "resolved").map(c => ({
    id: `res-${c.id}`,
    claimId: c.id,
    outcome: "yes" as const,
    actualValue: "2.9%",
    evidenceUrl: "https://www.bls.gov/news.release/cpi.nr0.htm",
    resolvedAt: "2025-01-15T08:30:00Z",
    settlementPolicy: "first_official_release" as const,
    settledStage: "official_preliminary" as const,
    reviewerId: "ops-maya",
    reviewerName: "Maya",
    notes: "December 2024 CPI came in at 2.9% YoY, just below the 3.0% threshold. BLS released January 15, 2025.",
  })),
  // Unemployment above 4.5% end 2024 → NO (Dec 2024 = 4.1%)
  ...claims.filter(c => c.eventKey === "unemployment-above-4-5-end-2024" && c.status === "resolved").map(c => ({
    id: `res-${c.id}`,
    claimId: c.id,
    outcome: "no" as const,
    actualValue: "4.1%",
    evidenceUrl: "https://www.bls.gov/news.release/empsit.nr0.htm",
    resolvedAt: "2025-01-10T08:30:00Z",
    settlementPolicy: "first_official_release" as const,
    settledStage: "official_preliminary" as const,
    reviewerId: "ops-maya",
    reviewerName: "Maya",
    notes: "December 2024 unemployment rate was 4.1%, below the 4.5% threshold.",
  })),
  // 10Y below 4% end 2024 → NO (4.57%)
  ...claims.filter(c => c.eventKey === "ten-year-below-4-end-2024" && c.status === "resolved").map(c => ({
    id: `res-${c.id}`,
    claimId: c.id,
    outcome: "no" as const,
    actualValue: "4.57%",
    evidenceUrl: "https://finance.yahoo.com/quote/%5ETNX/history/",
    resolvedAt: "2024-12-31T16:00:00Z",
    settlementPolicy: "first_official_release" as const,
    settledStage: "market_close" as const,
    reviewerId: "ops-maya",
    reviewerName: "Maya",
    notes: "The 10-year Treasury yield ended 2024 at 4.57%, well above the 4.0% threshold.",
  })),
  // Bitcoin above $80k end 2024 → YES (~$93,400)
  ...claims.filter(c => c.eventKey === "btc-above-80k-end-2024" && c.status === "resolved").map(c => ({
    id: `res-${c.id}`,
    claimId: c.id,
    outcome: "yes" as const,
    actualValue: "$93,429",
    evidenceUrl: "https://finance.yahoo.com/quote/BTC-USD/history/",
    resolvedAt: "2024-12-31T23:59:59Z",
    settlementPolicy: "first_official_release" as const,
    settledStage: "market_close" as const,
    reviewerId: "ops-maya",
    reviewerName: "Maya",
    notes: "Bitcoin ended 2024 at approximately $93,429, well above the $80,000 threshold. ETF approval and halving cycle drove the rally.",
  })),
  // DXY above 105 end 2024 → YES (~108.5)
  ...claims.filter(c => c.eventKey === "dxy-above-105-end-2024" && c.status === "resolved").map(c => ({
    id: `res-${c.id}`,
    claimId: c.id,
    outcome: "yes" as const,
    actualValue: "108.48",
    evidenceUrl: "https://finance.yahoo.com/quote/DX-Y.NYB/history/",
    resolvedAt: "2024-12-31T17:00:00Z",
    settlementPolicy: "first_official_release" as const,
    settledStage: "market_close" as const,
    reviewerId: "ops-maya",
    reviewerName: "Maya",
    notes: "The US Dollar Index ended 2024 at approximately 108.48, above the 105 threshold.",
  })),
  // Brent above $100 mid 2025 → NO (~$65)
  ...claims.filter(c => c.eventKey === "brent-above-100-mid-2025" && c.status === "resolved").map(c => ({
    id: `res-${c.id}`,
    claimId: c.id,
    outcome: "no" as const,
    actualValue: "$65/bbl",
    evidenceUrl: "https://finance.yahoo.com/quote/BZ=F/history/",
    resolvedAt: "2025-06-30T17:00:00Z",
    settlementPolicy: "first_official_release" as const,
    settledStage: "market_close" as const,
    reviewerId: "ops-maya",
    reviewerName: "Maya",
    notes: "Brent crude traded around $65/bbl by mid-2025, well below the $100 threshold.",
  })),
  // S&P 500 above 5800 end 2024 → YES (5,881)
  ...claims.filter(c => c.eventKey === "spx-above-5800-end-2024" && c.status === "resolved").map(c => ({
    id: `res-${c.id}`,
    claimId: c.id,
    outcome: "yes" as const,
    actualValue: "5,881.63",
    evidenceUrl: "https://finance.yahoo.com/quote/%5EGSPC/history/",
    resolvedAt: "2024-12-31T16:00:00Z",
    settlementPolicy: "first_official_release" as const,
    settledStage: "market_close" as const,
    reviewerId: "ops-maya",
    reviewerName: "Maya",
    notes: "S&P 500 closed 2024 at 5,881.63, above Yardeni's raised target of 5,800.",
  })),
  // Cramer bullish 2024 → YES (S&P +23%)
  ...claims.filter(c => c.eventKey === "cramer-bullish-2024" && c.status === "resolved").map(c => ({
    id: `res-${c.id}`,
    claimId: c.id,
    outcome: "yes" as const,
    actualValue: "+23.3%",
    evidenceUrl: "https://finance.yahoo.com/quote/%5EGSPC/history/",
    resolvedAt: "2024-12-31T16:00:00Z",
    settlementPolicy: "first_official_release" as const,
    settledStage: "market_close" as const,
    reviewerId: "ops-maya",
    reviewerName: "Maya",
    notes: "S&P 500 returned +23.3% in 2024. Cramer's bullish call was correct.",
  })),
  // Cramer Nike cheap → NO (Nike -37%)
  ...claims.filter(c => c.eventKey === "cramer-nike-cheap" && c.status === "resolved").map(c => ({
    id: `res-${c.id}`,
    claimId: c.id,
    outcome: "no" as const,
    actualValue: "-37.49%",
    evidenceUrl: "https://finance.yahoo.com/quote/NKE/history/",
    resolvedAt: "2024-12-31T16:00:00Z",
    settlementPolicy: "first_official_release" as const,
    settledStage: "market_close" as const,
    reviewerId: "ops-maya",
    reviewerName: "Maya",
    notes: "Nike shares slid another 37.49% after Cramer's 'very cheap' call. One of his worst calls of 2024.",
  })),
  // Burry inflation plunge 2023 → YES (CPI fell from 6.4% to 3.4%)
  ...claims.filter(c => c.eventKey === "burry-inflation-plunge-2023" && c.status === "resolved").map(c => ({
    id: `res-${c.id}`,
    claimId: c.id,
    outcome: "yes" as const,
    actualValue: "3.4% (from 6.4%)",
    evidenceUrl: "https://www.bls.gov/news.release/cpi.nr0.htm",
    resolvedAt: "2024-01-11T08:30:00Z",
    settlementPolicy: "first_official_release" as const,
    settledStage: "official_preliminary" as const,
    reviewerId: "ops-maya",
    reviewerName: "Maya",
    notes: "US CPI fell from 6.4% YoY in Jan 2023 to 3.4% by Dec 2023. Burry's inflation plunge call was correct.",
  })),
  // Gold above $3000 end 2024 → NO ($2,624 at year end)
  ...claims.filter(c => c.eventKey === "gold-above-3000-end-2024" && c.status === "resolved").map(c => ({
    id: `res-${c.id}`,
    claimId: c.id,
    outcome: "no" as const,
    actualValue: "$2,624/oz",
    evidenceUrl: "https://finance.yahoo.com/quote/GC=F/history/",
    resolvedAt: "2024-12-31T17:00:00Z",
    settlementPolicy: "first_official_release" as const,
    settledStage: "market_close" as const,
    reviewerId: "ops-maya",
    reviewerName: "Maya",
    notes: "Gold closed 2024 at approximately $2,624/oz. Did not reach $3,000 by year-end (it did surpass $3,000 in March 2025).",
  })),
];

/* ═══════════════════════════════════════════════════════════════════
   SCORING, CHANGELOG, CORRECTIONS, LAUNCH GATES
   ═══════════════════════════════════════════════════════════════════ */

const scoringVersions: ScoringVersion[] = [
  {
    id: "sv-0-9",
    version: "v0.9",
    label: "Calibration preview",
    status: "superseded",
    priorQuality: 0.61,
    shrinkageK: 16,
    tierMap: { low: 0.55, medium: 0.70, high: 0.85 },
    activatedAt: "2026-01-08T18:00:00Z",
    calibratedAt: "2026-01-08T18:00:00Z",
    baselineResolvedClaims: 10,
    nextReviewAt: "2026-04-01T00:00:00Z",
    highlightUntil: "2026-01-22T00:00:00Z",
    changelogTitle: "Preview scoring calibration",
    changelogSummary: "Initial calibration against the first batch of resolved macro predictions.",
  },
  {
    id: "sv-1-0",
    version: "v1.0",
    label: "Launch scoring",
    status: "active",
    priorQuality: 0.64,
    shrinkageK: 12,
    tierMap: { low: 0.60, medium: 0.70, high: 0.80 },
    activatedAt: "2026-03-03T18:00:00Z",
    calibratedAt: "2026-03-03T18:00:00Z",
    baselineResolvedClaims: 20,
    nextReviewAt: "2026-06-01T00:00:00Z",
    highlightUntil: "2026-03-17T00:00:00Z",
    changelogTitle: "Launch scoring frozen for the quarter",
    changelogSummary: "AYRE froze prior quality, shrinkage K, and the confidence tier map for the entire v1.0 window.",
  },
];

const changelogEntries: ChangelogEntry[] = [
  {
    id: "cl-1",
    version: "v1.0",
    title: "Launch scoring frozen for the quarter",
    summary: "AYRE froze prior quality, shrinkage K, and the confidence tier map for the entire v1.0 window.",
    publishedAt: "2026-03-03T18:00:00Z",
    changes: [
      "Set shrinkage K to 12 after comparing rank stability across 8, 12, 16, and 20.",
      "Locked the tier map at 0.60 / 0.70 / 0.80 for low, medium, and high conviction.",
      "Added scoreVersion to public cards so archived shares stay interpretable after future recalibration.",
    ],
  },
];

const correctionRequests: CorrectionRequest[] = [
  {
    id: "correction-1",
    expertSlug: "michael-burry",
    status: "pending_review",
    submittedAt: "2026-03-20T14:00:00Z",
    summary: "Submitter argues the $1.6B put bet was closed before expiry and should not be scored as a full-year recession call.",
  },
  {
    id: "correction-2",
    expertSlug: "peter-schiff",
    status: "temporarily_unpublished",
    submittedAt: "2026-03-22T10:00:00Z",
    summary: "Gold $3000 claim was made in context of inflation-adjusted pricing, not nominal spot price. Disputed resolution basis.",
  },
];

const launchGates: LaunchGate[] = [
  { label: "Minimum 5 experts with ≥ 5 resolved claims", detail: "11 experts seeded, 8 with 3+ resolved claims", status: "done" },
  { label: "Score version v1.0 activated and frozen", detail: "v1.0 active since 2026-03-03", status: "done" },
  { label: "OG images render for all expert and compare routes", detail: "Light theme OG images verified", status: "done" },
  { label: "Correction channel email configured", detail: "corrections@ayre.example active", status: "done" },
];

/* ═══════════════════════════════════════════════════════════════════
   EXPORT
   ═══════════════════════════════════════════════════════════════════ */

export const mockSiteDataset: SiteDataset = {
  launchDate: "2026-03-03T18:00:00Z",
  experts,
  sourceDocuments,
  claims,
  resolutions,
  scoringVersions,
  changelogEntries,
  correctionRequests,
  launchGates,
  activeScoreVersion: scoringVersions.find((sv) => sv.status === "active")!,
};

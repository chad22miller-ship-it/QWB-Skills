---
name: prospect-finder-team-v2
description: >-
  For QWB Command Center v3 team trackers (clean I/N grid). Prefer THIS over the legacy prospect-finder-team whenever the rep is prospecting.
  QWB prospecting engine — each rep on their OWN tracker. Finds and triages NEW
  recruiting leads from the rep's own LinkedIn Sales Navigator saved search,
  scores each STRONG / MAYBE / SKIP on the QWB recruiting rubric, drafts a
  personalized connection note for every STRONG (send-ready for
  linkedin-engine-team), and hands the rep the STRONG leads to drop into their
  own tracker. Triggers when the rep says "find prospects", "run my prospecting",
  "pull leads", "find recruits", "triage my Sales Navigator", "write my connect
  notes", or wants fresh LinkedIn leads scored and logged. Reads lead cards only
  (never opens profiles). Stages clean 14-column rows WITH a header row. Each rep
  points it at their own saved search and their own tracker. Do NOT trigger any other skill.
---
# Prospect Finder — QWB Edition v3 (Sales Navigator → your tracker)

> **v3 grid + header-row import (updated 7/20/2026).** The Prospects tab runs on
> the PRISTINE map: **Name = column B**, **Profile URL = column D**,
> **Owner = column H**, **Status = column I**, **Booked Date = column M**,
> **Connection Note = column N**. That's 14 columns A→N, no spacer. This skill and
> `linkedin-engine-team` share this exact map — they must never disagree by a
> column again.
>
> **Two things changed with v3 and they are load-bearing — get them wrong and the
> whole wave bounces:**
> 1. **The importer now needs a HEADER ROW.** The v3 QWB Tools importer maps
>    columns by matching your CSV's header names to the sheet's headers. A file
>    with no header row is rejected with
>    `ERROR: Wave file missing "Name" or "Profile URL" column.` (The old v2.0 rule
>    was the opposite — "no header ever." That rule is retired for the importer
>    path. The only place you still omit the header is a direct TSV paste into the
>    tab.)
> 2. **Profile URLs must be slash-free.** Write `https://www.linkedin.com/in/<slug>`
>    with NO trailing slash. Existing rows are stored slash-free and the importer
>    dedupes by exact URL string — a trailing slash slips past the dedupe and
>    creates a duplicate person. (Learned 7/20/2026: a re-added lead duplicated
>    because its new URL carried a trailing slash and the existing row didn't.)

You are the rep's lead-sourcing engine. Open their saved Sales Navigator search,
read the results cards, score each person on the QWB rubric, draft a
personalized connect note for every STRONG, and hand the rep send-ready,
column-aligned rows for their own Prospects tracker.

Identify + prep stage only. Find, score, draft the note, and stage the rows. You
never connect, message, open profiles, coach, or trigger another skill. The rep
confirms every write (Import → Append is the approval), and `linkedin-engine-team`
(run separately) sends the invites.

---

## One-time config (fill these in per rep)
- **YOUR_TRACKER_URL:** `<the rep's Command Center v3 Google Sheet>` (rows go to
  the `Prospects` tab)
  - Chad's master: `https://docs.google.com/spreadsheets/d/1uvABw5oJLAvj4zMm5v9BXdeuQeNK4TCUo1hQpM010R4/edit`
  - Team template: `https://docs.google.com/spreadsheets/d/15ps5Z49Z01_go1Wv7kqMiK7rx6UCHXSR-QixewydpJI/edit`
- **SAVED_SEARCH_URL:** `<the rep's Sales Navigator saved-search URL>`
- **YOUR_NAME:** `<goes in Column H (Owner) on every row>`

If `YOUR_TRACKER_URL` or `SAVED_SEARCH_URL` is blank, ask the rep for it before
running. Don't proceed without both — a run without a tracker to dedupe against
is a run that ships duplicates.

---

## Build the saved search

Starter recipe in `references/operations.md`; add the rep's region, save, paste
the URL into `SAVED_SEARCH_URL`. The untuned recipe front-loads AI/crypto/SaaS
account executives (STRONG hit-rate ~2–3 per page); tuning it — surface realtors,
loan officers, coaches, recruiters, hospitality/operators and **drop the generic
Sales + Business Development FUNCTION filter and the Account Executive title** —
lifts that to ~9 STRONG per page. Tune before a run and the daily footprint stays
small.

---

## What this IS / IS NOT
**IS:** sourcing new recruiting leads from the results list, scoring them,
drafting each STRONG's connection note, and producing clean, send-ready STRONG
rows for the rep's sheet.

**IS NOT:** not connections or DMs (that's `linkedin-engine-team`, governed by
the 25/day cap — never touched here). Not profile-opening. Not a coach.

---

## HOW SALES NAVIGATOR ACTUALLY BEHAVES (learned live — read first)
This is the hard-won part. Sales Nav actively resists automated reading:
- **`get_page_text` and `read_page` come back essentially EMPTY for the cards.**
  Don't rely on them for lead data. The card bodies aren't exposed as normal text.
- **The list VIRTUALIZES.** A card's text only paints when it is *physically*
  scrolled into view. Setting `scrollTop` in JS does NOT trigger it — you must
  send **real scroll events** (Claude-in-Chrome `computer` action `scroll` over
  the results panel, ~x 800 y 400). After real scrolling, the cards render. A card
  can de-render when it scrolls back out of view, so keep the LONGEST text seen per
  id (overwrite only when new innerText is longer) and scroll slowly top-to-bottom.
- **Extract with `javascript_tool`.** Every rendered card exposes
  `div[data-scroll-into-view*="fs_salesProfile"]` whose value looks like
  `urn:li:fs_salesProfile:(<LEADID>,NAME_SEARCH,<tok>)`. Pull `<LEADID>`. The
  card's text is the `innerText` of the closest `li`:
  `Name | 3rd | Title  Company | City, ST | tenure | About: ... Show more | ...`.
- **Profile URL = `https://www.linkedin.com/in/<slug>` with NO trailing slash** —
  the PUBLIC profile link is the canonical Column D value and the tracker's match
  key. Capture the slash-free /in/ URL at add-time. Sales Nav cards only expose the
  `/sales/lead/<LEADID>` link, not the public slug, so resolve `/in/` separately:
  in a SECOND tab, navigate to
  `https://www.linkedin.com/search/results/people/?keywords=<Name>%20<Company>` and
  read the first `a[href*="/in/"]`. Strip any trailing slash so it matches the
  tracker's slash-free format. A Sales Navigator lead URL
  (`https://www.linkedin.com/sales/lead/<LEADID>`) is a LAST-RESORT fallback only,
  flagged `URL needs /in/`. A real LEADID is a long opaque token, 30+ chars,
  starting `ACw`/`ACo` (example: `ACwAABfBgCsBnq3KPQe6Eo8F_gLgxbxrRv4yEB4`).
- **NEVER build the URL from the person's name, never ship a dead link.** A
  name-built link looks real then dead-ends when the rep clicks to connect (this
  exact fake once shipped 27 dead links). Every row carries a link that actually
  OPENS. If the person's last name is privacy-masked on Sales Nav (e.g. "Alyssa
  Luisa M."), you often can't confidently match a `/in/` — do NOT ship a guessed
  link; resolve it another way, use the `/sales/lead/<LEADID>` fallback flagged
  `URL needs /in/`, or swap that lead for a full-name STRONG you can verify.
  Openable-and-correct beats fake-working.
- **Keep harvest JS SHORT.** Pattern: a few real `computer` scrolls, then a FAST
  JS harvest that skips/updates already-seen ids and accumulates onto
  `window.__acc`. A long JS scroll loop (>~12 iterations of scroll+read) blows the
  ~45s tool timeout — never do that. If a harvest dump comes back
  `[BLOCKED: Cookie/query string data]`, strip `http…` links and `?=&` chars from
  the returned string (keep them in `window.__acc`) and dump 4–5 cards per call.
- **Navigation wipes `window` state.** Changing pages (`&page=N`) clears your
  accumulator and helper functions — re-inject them after every navigation, and
  carry the seen-id list forward in your own context (12-char id prefixes work).
- **Prefer the DOM read (`javascript_tool`)** — it returns text, not images. Use
  a screenshot ONLY if a DOM read genuinely fails, and then take one small
  viewport screenshot at a time — never full-page or high-DPI. **Images over
  ~2000px on any side error out** once several stack into one request, which
  halts the whole run. When in doubt, read the DOM and skip the picture.
- **Paginate** by appending `&page=N` to the saved-search URL.

---

## Auto-triage (do this in the harvest JS to save effort)
Pre-classify each card so you only hand-judge the real candidates:
- **Auto-SKIP** if the card matches: `insurance | investment | crypto |
  blockchain | web3 | hedge fund | private equity | PE | VC | venture capital |
  wealth | financial advisor | fund manage | private market | realty capital |
  securities | trading | annuit | seguros | transamerica | unitedhealth |
  medicare | globe life | quantum wealth | QWB`. (`quantum wealth | QWB` is the team's
  OWN company — never stage QWB people. Rep-only override, reason in column G.)
  The keyword net over-fires: a mortgage loan officer whose About merely lists
  "Investment" as a skill is NOT an insurance/PE lead — use judgment before dropping
  a real candidate.
- **Flag AI → MAYBE** if it matches: `\bA.?I.?\b | artificial intelligence |
  machine learning | \.ai\b | GPT | LLM`.
- Everything else is a **candidate** — apply the full rubric with judgment
  (capability + hunger). Loan officers / mortgage are NOT skips.
- **Already in the pipeline?** If a card is already `· Saved`/`Viewed` on Sales
  Nav, that person is likely already in the rep's tracker — skip them; the name
  dedupe and the importer's URL dedupe will catch them anyway.

---

## THE RUBRIC (verbatim — QWB's edge, do not water down)
**STRONG:** shows proven capability (built or led something: a small business, a
team, top sales or production, realtor, loan officer, cop, firefighter, EMT,
military, personal trainer, coach, contractor, athlete, ministry leader,
recruiter, or a side hustle) AND unmet hunger (growth, building, "more",
mission, "next chapter", "open to opportunities" language). 25 or older, ideally
with family or faith cues and a heart to serve others. Mid-career achievers and
individual contributors are great fits. Note any signals of Coachability,
Commitment, and Character in how they write.

**MAYBE:** some signal but the card is thin or ambiguous, or they look capable
but the hunger isn't clear. Also anybody that says they are in AI needs more
scrutiny.

**SKIP:** anyone in investment or insurance is an automatic SKIP, no exceptions.
Anyone at Quantum Wealth Builders (QWB) is an automatic SKIP unless the rep
explicitly overrides for that person. Also skip: already arrived and comfortable with no growth language, OR no track
record and no hunger, OR all ego no substance, OR clearly the wrong role.

---

## Connect note — the locked rotation (updated 7/19/2026)

Every connection note carries three beats: a casual open that you came across their profile, a CONCRETE specific detail about them pulled from their headline/role (their company, their pivot, or their specialty, never a generic field label like "sales" or "finance"), and a warm, low-pressure close. Rotate the five templates below so a batch never reads templated, never send the same variant twice in a row. No dashes, one sentence, never salesy.

1. "Hey [First], came across your profile and your background [specific] stood out. Would love to connect."
2. "Hey [First], saw your profile and what you've done [specific] caught my eye. Would be great to connect."
3. "Hey [First], your background [specific] jumped out when I came across your profile. Had to reach out."
4. "Hey [First], came across your profile, and [specific] really stood out to me. Would love to connect."
5. "Hey [First], stumbled on your profile and the way you've [specific] caught my attention. Let's connect."

The [specific] must be a real, concrete thing they would recognize about themselves, read straight from column E (Headline/Role), filled so the sentence flows naturally. Examples:
- "Hey Tanveer, came across your profile and your background building your own training platform on top of being a triple board-certified psychiatrist stood out. Would love to connect."
- "Hey Isaiah, saw your profile and what you've done moving from retail sales at AT&T into debt relief caught my eye. Would be great to connect."
- "Hey Moshe, your background building your own firm at Bright Hill jumped out when I came across your profile. Had to reach out."
- "Hey Michelle, came across your profile, and building Clinical Innovation in the healthcare space really stood out to me. Would love to connect."
- "Hey Connor, stumbled on your profile and the way you've built Quantum Wealth Builders caught my attention. Let's connect."

---

## Run flow (attended + manual confirm)
- **Default target: bank 15 STRONG** (hold MAYBEs, drop SKIPs). Draft each
  STRONG's connect note while the card is fresh. Then STOP, show the rep the rows
  WITH their notes, and **ask them to confirm the import.**
- If the rep asks for a different count, honor it. 15 is the default, not a mandate.
- **Yield note:** STRONGs scarce → tighten the search, don't grind.

Never write to the sheet without the rep's explicit go.

---

## Build the STRONG rows
Turn scored STRONG leads into clean, column-aligned output as either **CSV** (for
the QWB Tools importer / URL import — the primary path, header row included) or
**TSV** (for a direct paste into Sheets — no header).

**Prospects tab, PRISTINE columns A→N (v3 grid — Status at I, Booked Date at M,
Connection Note at N, Owner at H, no spacer):**

| Col | Field | Value |
| --- | --- | --- |
| A | Date Added | today, M/D/YYYY |
| B | Name | full name |
| C | Platform | `LinkedIn` |
| D | Profile URL | `https://www.linkedin.com/in/<slug>` — public /in/ link, NO trailing slash (the tracker match key). Sales Nav `/sales/lead/<LEADID>` is a last-resort fallback only, flag `URL needs /in/`; if uncapturable, blank + flag `NEEDS URL`, never name-built |
| E | Headline / Role | `Title at Company \| City ST` |
| F | Personalization Hook | one specific thing from the About |
| G | 3C Notes | the hunger + capability signal |
| H | Owner (Agent) | `YOUR_NAME` |
| I | Status | `Identified` |
| J | Date of Last Touch | blank — filled downstream |
| K | Next Follow-Up Date | blank — filled downstream |
| L | Reply / Conversation Notes | blank — filled downstream |
| M | Booked Date | blank — filled downstream |
| N | Connection Note | the drafted note — `linkedin-engine-team` pastes verbatim |

**Columns O→AD** carry the follow-up cadence — this skill does NOT write them;
leave blank on initial import. **Columns AE→AG** (Open Profile, Channel, Verify)
and **Board Sub-Status** are script-maintained — never write them.

### Format rules (both CSV and TSV)
- **14 columns per row, A→N, in strict order.** J, K, L, M are blank but PRESENT.
- **HEADER ROW REQUIRED on the importer path (v3 change).** The v3 QWB Tools
  importer maps columns by matching your CSV header names to the sheet's headers,
  so the CSV's FIRST line must be the exact 14 header names, in order (see
  `references/operations.md` for the exact line). A file with no header is rejected:
  `ERROR: Wave file missing "Name" or "Profile URL" column.` Only a direct TSV
  paste into the tab omits the header (the tab already has its header at row 1).
- **Column D URL — a slash-free link that OPENS.** Public `/in/<slug>` with no
  trailing slash (the match key), a last-resort Sales Nav `/sales/lead/<LEADID>`
  fallback (flag `URL needs /in/`), or a flagged name-search backup. The slash
  matters: the importer dedupes by exact URL string, so a trailing slash on a
  person already in the tracker creates a duplicate. Truncated slug/id → re-scroll
  before staging. Never synthesize.
- **Column N — no tabs, no newlines inside the note.** One line of plain text.

### TSV / CSV formats

Full layouts live in `references/operations.md`. TSV (direct paste): 14 tab fields,
no header. CSV (importer / URL import): 14 quoted comma fields **with the exact v3
header row as line 1**.

### Column-shift quality gate
- **Header present** on the CSV importer path (line 1 = the 14 exact header names,
  `Date Added` … `Connection Note`). Omit only for direct TSV paste.
- **CSV data row → exactly 13 commas OUTSIDE quoted fields** between 14 fields.
- **TSV row → exactly 13 tab characters** between 14 fields.
- **URL-shape:** field 4 (D) opens and is slash-free — no trailing slash, no
  name-built fake.
Any row off-count or with a slashed/faked URL is misaligned — fix before staging.

---

## How the tracker is wired (v3)
The v3 tracker has: **Command Center** (dashboard, script-rendered FORMULAS
reading from Prospects — never paste leads here), **The Nurture Room**, **Prospects**
(raw table, THIS is where leads go, A–N as above), **Engine Inbox** (upsert
backup), **Settings** (leave alone).

For a lead to surface in the CONNECT QUEUE, its Prospects row needs three columns
right: **E** (Headline/Role), **I** = `Identified`, and **N** (the connect note)
non-blank. Those three are load-bearing.

The v3 QWB Tools importer **requires a header row and maps columns by header name**
(errors `missing "Name" or "Profile URL" column` if the header is absent),
validates every row, and **dedupes by profile URL against the whole tab** (exact
string match — which is why slash-free URLs matter). The durable importer-side fix
for the slash trap is to normalize both sides before comparing, e.g.
`String(u||'').trim().toLowerCase().replace(/[?#].*$/,'').replace(/\/+$/,'')`; this
skill prevents it upstream by always writing slash-free URLs.

---

## Writing to the tracker (PRIMARY PATH — one CSV, one URL, Import → Append)
1. **Build ONE CSV for the wave** (line 1 = the exact 14-column HEADER ROW, then
   one row per STRONG, every field quoted).
2. **Upload to Drive as a raw CSV, NOT a Sheet.** Drive connector `create_file`
   with `contentMimeType: "text/csv"`, `disableConversionToGoogleType: true`
   (LOAD-BEARING), filename ending `.csv`. Base64-encode the content (LinkedIn URLs
   trip the content filter as plain text).
3. **Hand the rep the URL:** `https://drive.google.com/file/d/<FILE_ID>/view`
4. **Rep runs Import** on the Prospects tab: File → Import → paste URL → Insert data.
5. **Rep picks "Append to current sheet"**, separator "Detect automatically",
   Import data. That import is the manual confirm.

Or use **QWB Tools → Import newest wave** if the rep's copy has it (v3 does). If the
QWB Tools menu won't open cleanly (Sheets menus are canvas-rendered and mis-click),
take a fresh screenshot before each click; the built-in "Menus" search does NOT
index custom script menus.

---

## De-dupe before staging (LOAD-BEARING)
1. Run the dedupe fetch from a `docs.google.com` tab (never LinkedIn — CORS).
2. Fetch: `https://docs.google.com/spreadsheets/d/<TRACKER_ID>/gviz/tq?tqx=out:csv&sheet=Prospects`
3. Verify the response is real (≥10 names fresh, ≥50 with history). Fail twice → HARD STOP.
4. Build the dedupe set from **lowercased Name (column B)**.
5. Drop any candidate whose name is in the set; report every dupe caught. (The
   importer also dedupes by URL, but catching dupes by name here saves a re-run.)

---

## Verify the notes landed (non-negotiable)
After every import: gviz-read the tracker back, confirm **column N is non-blank**
for each new row (unless flagged "thin card — write by hand") and Status =
`Identified` mapped into column I. Missing notes → hand the rep a single-column
paste block for `N<first-row>`. Report the check. (The Drive `read_file_content`
can return a cached snapshot — trust the live gviz read.)

---

## Run summary (end every run)
```
=== PROSPECTING RUN — [date] ===
STRONG staged: [n]   Now in tracker: [n]   Dupes skipped: [n]
Notes drafted: [n]   Verified in col N: [n]/[n]   Flagged for hand-written: [n]
Pages read: [n]   Cards reviewed: [n]
MAYBES ([n]): ...
SKIPPED: [n]  (insurance/investment: [n] | AI: [n] | thin/wrong role: [n])
```

---

## Safety & footprint
- Identify = browse-only; never sends connections/DMs.
- Pace like a human, ~5-page ceiling per run.
- Self-contained: never trigger another skill.

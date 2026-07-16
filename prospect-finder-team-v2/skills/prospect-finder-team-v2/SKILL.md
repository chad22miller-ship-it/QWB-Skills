---
name: prospect-finder-team-v2
description: >-
  QWB prospecting engine — each rep on their OWN tracker. Finds and triages NEW
  recruiting leads from the rep's own LinkedIn Sales Navigator saved search,
  scores each STRONG / MAYBE / SKIP on the QWB recruiting rubric, drafts a
  personalized connection note for every STRONG (send-ready for
  linkedin-connect-team), and hands the rep the STRONG leads to drop into their
  own tracker. Triggers when the rep says "find prospects", "run my prospecting",
  "pull leads", "find recruits", "triage my Sales Navigator", "write my connect
  notes", or wants fresh LinkedIn leads scored and logged. Reads lead cards only
  (never opens profiles). Each rep points it at their own saved search and their
  own tracker. Do NOT trigger any other skill.
---
# Prospect Finder — QWB Edition v2 (Sales Navigator → your tracker)

> **Command Center v2.0 grid.** The phantom `Name ` column is gone. The
> Prospects tab runs on the PRISTINE map: **Status = column I**,
> **Connection Note = column N**, **Owner = column H**, **Profile URL = column D**.
> This skill and `linkedin-follow-up-engine-team-v2` share this exact map — they
> must never disagree by a column again. If you are ever pointed at a legacy sheet
> that still has the empty `Name ` column at B, everything shifts +1 (Status=J,
> Note=O); confirm which grid you're on before writing.

You are the rep's lead-sourcing engine. Open their saved Sales Navigator search,
read the results cards, score each person on the QWB rubric, draft a
personalized connect note for every STRONG, and hand the rep send-ready,
column-aligned rows for their own Prospects tracker.

Identify + prep stage only. Find, score, draft the note, and stage the rows. You
never connect, message, open profiles, coach, or trigger another skill. The rep
confirms every write (Import → Append is the approval), and `linkedin-connect-team`
(run separately) sends the invites.

---

## One-time config (fill these in per rep)
- **YOUR_TRACKER_URL:** `<the rep's Command Center v2.0 Google Sheet>` (rows go to
  the `Prospects` tab)
  - Chad's master v2.1: `https://docs.google.com/spreadsheets/d/1uvABw5oJLAvj4zMm5v9BXdeuQeNK4TCUo1hQpM010R4/edit`
  - Team template v2.1: `https://docs.google.com/spreadsheets/d/1B8neA65ktQLoef-Kz59Ry2HrTLUXjgcJF1CTM1-iBgE/edit`
- **SAVED_SEARCH_URL:** `<the rep's Sales Navigator saved-search URL>`
- **YOUR_NAME:** `<goes in Column H (Owner) on every row>`

If `YOUR_TRACKER_URL` or `SAVED_SEARCH_URL` is blank, ask the rep for it before
running. Don't proceed without both — a run without a tracker to dedupe against
is a run that ships duplicates.

---

## Build the saved search

Starter recipe in `references/operations.md`; add the rep's region, save, paste
the URL into `SAVED_SEARCH_URL`.

---

## What this IS / IS NOT
**IS:** sourcing new recruiting leads from the results list, scoring them,
drafting each STRONG's connection note, and producing clean, send-ready STRONG
rows for the rep's sheet.

**IS NOT:** not connections or DMs (that's `linkedin-connect-team`, governed by
the 25/day cap — never touched here). Not profile-opening. Not a coach.

---

## HOW SALES NAVIGATOR ACTUALLY BEHAVES (learned live — read first)
This is the hard-won part. Sales Nav actively resists automated reading:
- **`get_page_text` and `read_page` come back essentially EMPTY for the cards.**
  Don't rely on them for lead data. The card bodies aren't exposed as normal text.
- **The list VIRTUALIZES.** A card's text only paints when it is *physically*
  scrolled into view. Setting `scrollTop` in JS does NOT trigger it — you must
  send **real scroll events** (Claude-in-Chrome `computer` action `scroll` over
  the results panel, ~x 800 y 400). After real scrolling, the cards render.
- **Extract with `javascript_tool`.** Every rendered card exposes
  `div[data-scroll-into-view*="fs_salesProfile"]` whose value looks like
  `urn:li:fs_salesProfile:(<LEADID>,NAME_SEARCH,<tok>)`. Pull `<LEADID>`. The
  card's text is the `innerText` of the closest `li`:
  `Name | 3rd | Title  Company | City, ST | tenure | About: ... Show more | ...`.
- **Profile URL = `https://www.linkedin.com/sales/lead/<LEADID>`** — the DIRECT
  lead link, matching the QWB tracker template and dropping you straight onto the
  person. Pull the full `<LEADID>` from each card's `data-scroll-into-view`
  (`urn:li:fs_salesProfile:(<LEADID>,...)`), then compose **Column D** as
  `https://www.linkedin.com/sales/lead/` + that LEADID, and nothing else — no
  `NAME_SEARCH`, no trailing tokens, no query params. A real LEADID is a long
  opaque token, 30+ chars, starting `ACw`/`ACo` (example:
  `ACwAABfBgCsBnq3KPQe6Eo8F_gLgxbxrRv4yEB4`).
- **NEVER build the URL from the person's name, never ship a dead link.** A
  name-built link looks real then dead-ends when the rep clicks to connect (this exact
  fake once shipped 27 dead links). Every row carries a link that
  actually OPENS. If the real id will not come through: (1) re-scroll and retry;
  (2) people-search their name + company and use the public
  `https://www.linkedin.com/in/<slug>`, flag `URL backfilled`; (3) only then a
  name-search link as a copy-in backup, flag `NEEDS URL`. Openable beats fake-working.
- **Keep harvest JS SHORT.** Pattern: a few real `computer` scrolls, then a FAST
  JS harvest that skips already-seen ids and accumulates onto `window.__acc`.
  A long JS scroll loop (>~12 iterations of scroll+read) blows the ~45s tool
  timeout — never do that.
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
- **Flag AI → MAYBE** if it matches: `\bA.?I.?\b | artificial intelligence |
  machine learning | \.ai\b | GPT | LLM`.
- Everything else is a **candidate** — apply the full rubric with judgment
  (capability + hunger). Loan officers / mortgage are NOT skips.

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

## Draft the connect note (every STRONG gets one)
A STRONG row with a blank note is a dead lead: `linkedin-connect-team` pastes
the note verbatim and SKIPS any row that doesn't have one. Draft the note NOW,
while the card intel is fresh.

**The formula:** one concrete detail about THEM (what they built, led, or
pivoted from; their hunger language from the About) + a warm STATEMENT closer
that says why the rep wants to connect. The note earns a connection, nothing more.

**Two hard rules (zero exceptions):**
- **No dashes. Ever.** No em-dashes, no en-dashes, no hyphens-as-punctuation.
  Use a comma or a period instead. (Hyphens inside real words like
  "people-first" are fine; a dash used as a pause is not.)
- **No questions.** Close with a statement: "Figured we should connect." /
  "Always looking to connect with people who build." The conversation starts
  AFTER they accept, not in the invite.

**Voice rules (baked in — do NOT trigger the voice skill):**
- Reads like the rep texting a friend: warm, direct, a little playful.
- Lead with THEM. Never mention insurance, financial services, a product, "an
  opportunity," or what QWB does. Never pitch in the note.
- Close with a warm statement, never a question. "Figured we should connect" is
  the signature move.
- Loose is right: contractions, the occasional dropped apostrophe, no formal
  greeting, no sign-off, no corporate speak, no emojis.
- **Hard cap 280 characters** (150–250 reads best).

**Examples:**

Card: former firefighter, now a realtor in Tampa, About says "building something
for my family"
Note: `Saw you went from fighting fires to selling homes, thats a wild pivot.
Love that you're building something for your family. Respect the leap, figured
we should connect.`

Card: loan officer 8 yrs, coaches youth football, "open to opportunities"
Note: `A loan officer who coaches football on the side, you clearly like
developing people. Always looking to connect with people who build.`

**Quality gates:**
- The note must reference at least one detail that could ONLY come from their card.
- Scan every note before staging: any dash used as punctuation or any question
  mark is an automatic fail — rewrite it.
- Thin card → leave the note blank and flag the row ("thin card — write note by
  hand") rather than stage something generic.
- Show every note alongside its staged row so the rep can tweak before the import.

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
Turn scored STRONG leads into clean, column-aligned output as either **TSV** (for
direct paste into Sheets) or **CSV** (for URL import via Drive).

**Prospects tab, PRISTINE columns A→N (v2.0 grid — Status at I, Connection Note at
N, Owner at H, NO phantom column):**

| Col | Field | Value |
| --- | --- | --- |
| A | Date Added | today, M/D/YYYY |
| B | Name | full name |
| C | Platform | `LinkedIn` |
| D | Profile URL | `https://www.linkedin.com/sales/lead/<LEADID>` (real id only; if uncapturable, blank + flag `NEEDS URL`, never name-built) |
| E | Headline / Role | `Title at Company \| City ST` |
| F | Personalization Hook | one specific thing from the About |
| G | 3C Notes | the hunger + capability signal |
| H | Owner (Agent) | `YOUR_NAME` |
| I | Status | `Identified` |
| J–M | (last touch, follow-up, reply notes, booked) | blank — filled downstream |
| N | Connection Note | the drafted note — `linkedin-connect-team` pastes verbatim |

**Columns O→AD** carry the follow-up cadence — this skill does NOT write them;
leave blank on initial import. **Columns AE→AG** (Open Profile, Channel, Verify)
are script-maintained — never write them.

### Format rules (both TSV and CSV)
- **14 columns per row, A→N, in strict order.** J, K, L, M are blank but PRESENT.
- **Column D URL — a link that OPENS.** Real `/sales/lead/<LEADID>` (long opaque
  token, not a name), a public `/in/<slug>`, or a flagged name-search backup.
  Truncated id → re-scroll before staging. Never synthesize.
- **Column N — no tabs, no newlines inside the note.** One line of plain text.

### TSV / CSV formats

Full layouts live in `references/operations.md`. TSV: 14 tab fields, no header.
CSV: 14 quoted comma fields. QWB Tools importer: NO header row, ever (junk-row
risk); a header belongs only on the File→Import fallback path.

### Column-shift quality gate
- **TSV row → exactly 13 tab characters** between 14 fields.
- **CSV row → exactly 13 commas OUTSIDE quoted fields** between 14 fields.
Any row off-count is misaligned — fix before staging.

---

## How the tracker is wired (v2.0)
The v2.0 tracker has: **Command Center** (dashboard, script-rendered FORMULAS
reading from Prospects — never paste leads here), **The Nurture Room**, **Prospects**
(raw table, THIS is where leads go, A–N as above), **Engine Inbox** (upsert
backup), **Settings** (leave alone).

For a lead to surface in the CONNECT QUEUE, its Prospects row needs three columns
right: **E** (Headline/Role), **I** = `Identified`, and **N** (the connect note)
non-blank. Those three are load-bearing.

---

## Writing to the tracker (PRIMARY PATH — one CSV, one URL, Import → Append)
1. **Build ONE CSV for the wave** (14 columns, header row, every field quoted).
2. **Upload to Drive as a raw CSV, NOT a Sheet.** Drive connector `create_file`
   with `contentMimeType: "text/csv"`, `disableConversionToGoogleType: true`
   (LOAD-BEARING), filename ending `.csv`.
3. **Hand the rep the URL:** `https://drive.google.com/file/d/<FILE_ID>/view`
4. **Rep runs Import** on the Prospects tab: File → Import → paste URL → Insert data.
5. **Rep picks "Append to current sheet"**, separator "Detect automatically",
   Import data. That import is the manual confirm.

Or use **QWB Tools → Import newest wave** if the rep's copy has it.

---

## De-dupe before staging (LOAD-BEARING)
1. Run the dedupe fetch from a `docs.google.com` tab (never LinkedIn — CORS).
2. Fetch: `https://docs.google.com/spreadsheets/d/<TRACKER_ID>/gviz/tq?tqx=out:csv&sheet=Prospects`
3. Verify the response is real (≥10 names fresh, ≥50 with history). Fail twice → HARD STOP.
4. Build the dedupe set from **lowercased Name (column B)**.
5. Drop any candidate whose name is in the set; report every dupe caught.

---

## Verify the notes landed (non-negotiable)
After every import: gviz-read the tracker back, confirm **column N is non-blank**
for each new row (unless flagged "thin card — write by hand"). Missing notes →
hand the rep a single-column paste block for `N<first-row>`. Report the check.

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

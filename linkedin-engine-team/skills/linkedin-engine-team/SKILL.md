---
name: linkedin-engine-team
description: QWB rep's LinkedIn pipeline engine — verify reality on LinkedIn, draft all due messages in YOUR voice with YOUR DNA, stage them in the tracker, generate reports. Use whenever you say "work my pipeline", "run the board", "who's due", "run my follow-ups", "run my connects", "who accepted", "withdraw check", "what do I send next", "advance [name]", "did they reply", "warm up my leads", or want your next-touch list. Always runs LinkedIn-first to catch accepts/replies/withdrawals before drafting. Never auto-sends — YOU send every message by hand.
---

# LinkedIn Engine — Your Pipeline Brain

**Your one system to move prospects from found to Client via the CCQTTC drip.**

This skill reads your Prospects tab, checks LinkedIn reality (pending invites, accepts, replies, withdrawals), drafts all due messages in YOUR voice with YOUR DNA baked in, stages everything into a wave file, and generates a delta report. You send all messages by hand. The skill verifies they arrived and advances the tracker automatically.

## First Run: Set Your Voice & DNA

Answer two quick questions so every future run sounds like you and follows your cadence:
1. **Your Voice:** How do you communicate? (Direct? Curious? Casual? What's your natural connection opener?)
2. **Your DNA:** When do you nudge? (5 days? 7 days?) When do you withdraw? (14 days?)

The skill locks in YOUR answers and reuses them on every run. Unlike the single-owner engine, nothing here is hard-coded to one person — you own your voice, your tracker, and your folder.

---

## Config — Each Rep, Own Tracker (verified against the v2.0 template, updated 7/17/2026)

- **YOUR TRACKER (single source of truth):** your own copy of the QWB Team Command Center v2.0 template. The **Prospects** tab is the only tab this engine reads or writes. The Command Center board renders FROM Prospects; never write the board directly. Set your tracker URL on first run and keep it.
- **v2.0 column map (Prospects tab):** A=Date Added · B=Name · C=Platform · D=Profile URL (match key) · E=Headline/Role · I=Status · J=Date of Last Touch · K=Next Follow-Up Date · L=Reply/Conversation Notes · M=Booked Date · N=Connection Note · O=Message 1 (Touch 2) Text · R=Touch 3 (Bridge Ask) Text · AD=Stage 4 Next-Move Text. Trailing script-maintained columns (Open Profile, Channel, Verify) are never written by waves.
- **Your wave Drive folder:** each rep uses their own folder (or the shared team folder). The folder id lives in the sheet's QWB Tools script (`FOLDER_ID`).
- **Reads:** gviz CSV fetch in a signed-in browser tab with a cache-buster (`.../gviz/tq?tqx=out:csv&sheet=Prospects&_cb=<timestamp>`). Always verify writes by gviz readback — never trust a dialog alone.
- **Name links open the right person (7/17/2026):** on the updated template, board/Prospects name links resolve to each prospect's stored Profile URL (Sales Nav lead page or /in/ profile), NOT a name-search page — so the Message button always works and never lands on the wrong same-named person. Links repaint on any board rebuild.
- **QWB Tools menu (updated template):** Import newest wave · Clear old rows · Debug: List waves in folder. "Clear old rows" runs the fast status sync (drops deleted prospects, refreshes links) in one pass.
- **Triggers (updated template):** onOpen (builds the menu + warns if stale wave files sit in the folder) · onEdit · time-based nightly board rebuild (~6am, self-cleans deleted prospects off the board). If a rep's sheet is missing the nightly trigger, tell them to add a Time-driven trigger on the board-rebuild function.

## FIRST-RUN SETUP: Importer

If you copied the **updated** team template, the full v2.2 script (fixed importer + one-shot wave lockout + folder-hygiene warning + board self-clean + "Clear old rows" button + nightly rebuild trigger) is **already installed** — skip this section.

If your sheet still has the **old v2.0** importer (symptom: "Import newest wave" always says "No wave file found" even when a wave is present), fix it once: the corrected script is bundled at `assets/QWB_Tools_Importer_v2_1.gs`. On your sheet: Extensions → Apps Script → replace ALL the code with that file's contents → set `FOLDER_ID` at the top to your wave Drive folder id → Save → refresh the sheet. Do this before your first pipeline run.

## The Wave File Contract (verified working 7/17/2026 — do not drift)

The importer (QWB Tools v2.2 — one-shot wave lockout) works like this:

1. **Header row required**, using EXACT tracker column header names (e.g. `Name`, `Profile URL`, `Status`, `Date of Last Touch`, `Next Follow-Up Date`, `Reply / Conversation Notes`, `Message 1 (Touch 2) Text`, `Touch 3 (Bridge Ask) Text`, `Stage 4 Next-Move Text`). Columns are matched BY HEADER NAME, not position — include only the columns you're changing, plus Name and Profile URL.
2. **Every data row needs Name AND Profile URL** or it is skipped. Rows are matched to the tracker by Profile URL. Unmatched rows with a URL are ADDED as new prospects — so never put someone in a wave unless they belong on the tracker.
3. **Notes column overwrites whole** — always write the FULL existing note text plus the appended tag, never just the new fragment.
4. **Rows with no Profile URL in the tracker cannot be waved** (the importer would add a duplicate). Backfill the URL into column D first (grab it read-only from the messaging thread header or Sales Nav lead panel), or hand the rep the exact cells.
5. **Upload:** Drive connector create_file into your wave folder, name `wave_<something>.csv`, mime text/csv, conversion disabled, content passed as base64 (URLs in plain text trip content filters).
6. **One import click per wave — enforced by code (v2.2).** After a successful import the script (a) stamps the import time as a watermark and refuses any wave file older than it, and (b) sweeps ALL remaining wave CSVs into the Imported subfolder. Stale waves can never be re-imported. A double-fire reports "No NEW wave file found" — noise, not failure. On sheet open, the menu also warns if stale/locked wave files are sitting in the folder. The gviz readback is still the only truth.
7. If synthetic menu clicks don't register, hand the rep the one click: QWB Tools → Import newest wave. Never improvise direct cell writes on the live tracker.

## The Laws (non-negotiable)

- **Deletions are FINAL.** If the rep deletes a person from the Prospects tab, they leave the whole system forever — never re-add them via wave, sweep, or reconciliation. If real LinkedIn activity involves someone not on the tracker (including someone deleted), FLAG it in the report and ask; only the rep decides who gets a row. Before staging any new-prospect row, confirm they were never deliberately removed.
- **The board self-cleans (updated template).** When the rep deletes a person from the Prospects tab, the board-sync drops their Command Center card automatically — no orphan ghosts. This runs on the nightly time-based trigger (~6am) and on demand via **QWB Tools → Clear old rows**. No need to manually reconcile board ghosts; if a specific ghost must go immediately, tell the rep to click Clear old rows.
- **Claude clicks the import; the rep clicks LinkedIn.** The tracker write path (wave file + import + readback verify) is the engine's job, automatically, every run. Every send, invite, and withdraw is the rep's hands.
- **Verify-then-advance.** No status advances on memory. Sends verified in the thread (regular inbox first, Sales Nav inbox fallback), accepts verified in pending/degree, then the wave records it.

## What This Skill Does

1. **Read your Prospects tab** — Load all prospects with current status, dates, notes
2. **Check LinkedIn reality** — Pending invites (who's 14+ days), messaging inbox (who replied), accepts
3. **Draft all due messages** — State machine routes each prospect through CCQTTC, determines what's due, drafts the exact message in YOUR voice + DNA
4. **Stage wave file** — Merge LinkedIn changes + message drafts, build a header-keyed CSV per the Wave File Contract, upload to your wave folder, run the import, verify by readback
5. **Generate delta report** — Compare before/after, show what changed, what's next

---

## How to Use

Say any of these:
- "work my pipeline"
- "run the board"
- "who's due"
- "run my follow-ups"
- "run my connects"
- "who accepted"
- "withdraw check"
- "what do I send next"
- "advance [name]"
- "did they reply"
- "warm up my leads"

The skill runs all 5 steps end-to-end, generates report + wave file. You review, send messages by hand, the skill verifies + advances.

---

## Your Voice & DNA (set on first run, then locked)

### Voice Pattern (fill in on first run)

The engine drafts every message in the shape below, swapping in your phrasing. Defaults are curiosity-led and outcome-focused; replace with your own if you communicate differently.

**Connection opening:** "Hey [Name], came across your profile and your background in [field] stood out. Would love to connect."

**Step 2 Converse:** "Thanks for connecting, [name]. I'm curious, what got you into [field] in the first place?"

**Step 2 Nudge (silent N days):** "No worries if you've been slammed, [name]. Just genuinely curious what drew you to [field], always interested to hear how people got started."

**Step 3 Qualify + Transition:** "That's awesome. I'm curious, do you see yourself doing that long-term? Reason I ask, if there was a way to earn additional income on the side, without quitting or risking your full-time job, would you be open to a conversation?"

**Step 3 Voss Question (silent 14 days):** "Hey [name], totally fine if now's not the right time. Did I catch you at a bad moment, or is this just not something you're open to exploring? Either answer's completely cool."

**Lane A Context:** your team's context + a low-pressure 15-minute call invite (two time options). Keep it honest — no promises, just a conversation.

### DNA (fill in on first run)

- **Move fast on clarity, slow on ambiguity.** Clear "no" (withdrawn, no reply to Voss) → move on. Unclear → one more touch. Warm → accelerate.
- **Every message has a purpose.** Step 2 = rapport + curiosity. Step 3 = qualify fit + reveal opportunity. Lane A = context + decision. No filler.
- **Silence is data.** Your nudge window (default 5 days) and withdraw window (default 14 days) are yours to set — don't chase ghosts.
- **Volume + velocity.** Quality connections at scale; work your silences and withdrawals every run.
- **Personal touch beats templates.** Every connection note references something specific about them. No generic openers.

---

## The 5-Step Pipeline Run

### Step 1: Read Prospects Tab
Load all prospects with status, dates, last touch, connection notes.

### Step 2: Check LinkedIn Reality
- Pending invitations (who hasn't accepted, how many days)
- Messenger inbox (who replied, what they said) — regular inbox first, Sales Nav inbox as fallback
- Identify: accepts (→ Connected), replies (→ Step 2), withdrawals due (14+ days pending)

### Step 3: Draft All Due Messages
State machine determines:
- What stage each prospect is at (Identified, Connected, Step 2, Step 3, Lane A, Lane B, Client)
- What's due (new connects, Step 2, nudges, Step 3, Voss, Lane A context, close)
- Drafts the exact message in YOUR voice from your locked library
- Adds silence tags ([nudge1], [voss], [LaneA]) to prevent duplicates

### Step 4: Stage Wave File
Merge state machine output + LinkedIn reconciliation:
- New statuses, dates, messages
- Connection notes
- Silence tags
- Build optimized CSV (Name, Profile URL, + changed columns only)
- Upload to your wave folder, run the import, verify by readback

### Step 5: Generate Delta Report
Before/after snapshot:
- Pending invites changed (new accepts, new replies, withdrawals due)
- Messages staged (by step)
- Tracker rows updated
- Next action (what to send next)

---

## The CCQTTC Drip (9 Stages)

1. **Identified** → Connect invite sent, waiting for accept
2. **Connected** → Invite accepted, ready for Step 2 Converse
3. **Step 2 (Converse)** → Asked "what got you into [field]", waiting for reply
4. **Step 2 (Silence/Nudge)** → Silent past your nudge window, send nudge, waiting for response
5. **Step 3 (Qualify)** → Replied to Step 2, ask about long-term + intro opportunity
6. **Step 3 (Voss Question)** → 14+ days no reply to Qualify, send Voss, waiting for answer
7. **Lane A (Context)** → Open to conversation, send full Lane A context + 15-min call invite
8. **Lane B (Nurture)** → Not interested in opportunity but still a warm contact
9. **Client** → Booked call or beyond

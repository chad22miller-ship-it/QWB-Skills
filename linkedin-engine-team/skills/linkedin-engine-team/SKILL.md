---
name: linkedin-engine-team
description: QWB rep's LinkedIn pipeline engine — verify reality on LinkedIn, draft all due messages in YOUR voice with YOUR DNA, stage them in the tracker, generate reports. Use whenever you say "work my pipeline", "run the board", "who's due", "run my follow-ups", "run my connects", "who accepted", "withdraw check", "what do I send next", "advance [name]", "did they reply", "warm up my leads", or want your next-touch list. Always runs LinkedIn-first to catch accepts/replies/withdrawals before drafting. Never auto-sends — YOU send every message by hand.
---

# LinkedIn Engine — Your Pipeline Brain

**Your one system to move prospects from found to Client via the CCQTTC drip.**

This skill reads your Prospects tab, checks LinkedIn reality (pending invites, accepts, replies, withdrawals), drafts all due messages in YOUR voice with YOUR DNA baked in, stages everything into a wave file, and generates a delta report. You send all messages by hand.

## First Run: Set Your Voice & DNA

Answer two quick questions:
1. **Your Voice:** How do you communicate? (Direct? Curious? Casual?)
2. **Your DNA:** When do you nudge? (5 days? 7 days?) When do you withdraw? (14 days?)

The skill locks in YOUR answers for every future run.

---

## Config — Each Rep, Own Tracker (verified against the v2.0 template 7/16/2026)

- **YOUR TRACKER (single source of truth):** your own copy of the QWB Team Command Center v2.0 template. The **Prospects** tab is the only tab this engine reads or writes. The Command Center board renders FROM Prospects; never write the board directly. Set your tracker URL here on first run and keep it.
- **v2.0 column map (Prospects tab):** A=Date Added · B=Name · C=Platform · D=Profile URL (match key) · E=Headline/Role · I=Status · J=Date of Last Touch · K=Next Follow-Up Date · L=Reply/Conversation Notes · M=Booked Date · N=Connection Note · O=Message 1 (Touch 2) Text · R=Touch 3 (Bridge Ask) Text · AD=Stage 4 Next-Move Text. Trailing script-maintained columns are never written by waves.
- **Your wave Drive folder:** each rep uses their own folder (or the shared team folder). The folder id lives in the sheet's QWB Tools script.
- **Reads:** gviz CSV fetch in a signed-in browser tab with a cache-buster. Always verify writes by gviz readback — never trust a dialog alone.

## FIRST-RUN SETUP: Fix the importer (required once per rep)

The v2.0 template shipped with a broken "Import newest wave" — its file lookup can never find a wave, so imports silently fail with "No wave file found" forever. The fixed script is bundled in this skill at `assets/QWB_Tools_Importer_v2_1.gs`. On your sheet: Extensions -> Apps Script -> replace ALL the code with that file's contents -> set FOLDER_ID at the top to your wave Drive folder id -> Save -> refresh the sheet. Do this before the first pipeline run.

## The Wave File Contract (verified working 7/16/2026 — do not drift)

The fixed importer (QWB Tools v2.1) works like this:

1. **Header row required**, using EXACT tracker column header names (e.g. `Name`, `Profile URL`, `Status`, `Date of Last Touch`, `Next Follow-Up Date`, `Reply / Conversation Notes`, `Message 1 (Touch 2) Text`). Columns match BY HEADER NAME, not position — include only the columns being changed, plus Name and Profile URL.
2. **Every data row needs Name AND Profile URL** or it is skipped. Rows match the tracker by Profile URL. Unmatched rows with a URL are ADDED as new prospects — never put someone in a wave unless they belong on the tracker.
3. **Notes column overwrites whole** — always write the FULL existing note text plus the appended tag, never just the new fragment.
4. **Rows with no Profile URL in the tracker cannot be waved** (the importer would add a duplicate). Backfill the URL into column D first (grab it read-only from the messaging thread header or Sales Nav lead panel), or hand the rep the exact cells.
5. **Upload:** Drive create_file into the rep's wave folder, name `wave_<something>.csv`, mime text/csv, conversion disabled, content passed as base64 (URLs in plain text trip content filters).
6. **One import click per wave.** The importer takes the NEWEST wave file and archives it into `Imported`. A "No wave file found" dialog right after a successful import is a double-fire reading an emptied folder — noise, not failure. The gviz readback is the only truth.
7. If Claude's synthetic menu clicks don't register, hand the rep the one click: QWB Tools -> Import newest wave. Never improvise direct cell writes on the live tracker.

## The Laws (non-negotiable)

- **Deletions are FINAL.** If the rep deletes a person from their Prospects tab, that person leaves the whole system forever — never re-add via wave, sweep, or reconciliation. Real LinkedIn activity from someone not on the tracker gets FLAGGED in the report; only the rep decides who gets a row.
- **Claude clicks the import; the rep clicks LinkedIn.** The tracker write path (wave file + import + readback verify) is Claude's job every run. Every send, invite, and withdraw is the rep's hands.
- **Verify-then-advance.** No status advances on memory. Sends verified in the thread (regular inbox first, Sales Nav inbox fallback), accepts verified in pending/degree, then the wave records it. A connect note visible in a message thread is NOT a Step 2 send — read the actual thread before advancing anyone.

## What This Skill Does

1. Read your Prospects tab
2. Check LinkedIn reality (pending invites, accepts, replies)
3. Draft all due messages in YOUR voice + DNA
4. Stage wave file → QWB Tools folder
5. Generate delta report

You send all messages by hand. Skill verifies + advances tracker.

## How to Use

Say: "work my pipeline" or "who's due" or "run the board"

Skill runs all 5 steps, generates report + wave file. You review, send messages by hand.

## Your Workflow

1. Say "work my pipeline"
2. Skill asks for voice/DNA on first run
3. Skill generates report + wave file
4. You read report
5. You copy messages + send on LinkedIn
6. Skill verifies + advances tracker

**Skill never sends messages. Your hands, every time.**

## The CCQTTC Drip (9 Stages)

1. **Identified** → Connect sent
2. **Connected** → Ready for Step 2
3. **Step 2 (Converse)** → Asked opening question
4. **Step 2 (Nudge)** → Silent X days, send nudge
5. **Step 3 (Qualify)** → Asked about fit + opportunity
6. **Step 3 (Voss)** → Silent X days, send Voss
7. **Lane A (Context)** → Open to conversation
8. **Lane B (Nurture)** → Not interested but warm
9. **Client** → Booked call or beyond

## Silence Tracking

- **[nudge1]** — Step 2 nudge sent (won't repeat)
- **[voss]** — Step 3 Voss sent (won't repeat)
- **[LaneA]** — Lane A context sent (won't repeat)

## What You'll See

```
PENDING INVITES: X prospects waiting
NEW ACCEPTS: X prospects connected
NEW REPLIES: X prospects responded
WITHDRAWALS DUE: X prospects 14+ days pending

MESSAGES STAGED:
Step 2 Converse (X): [copy and send these]
Step 2 Nudges (X): [copy and send these]
Step 3 Qualify (X): [copy and send these]
...

NEXT ACTION: Send X messages by hand
```

## Setup

1. Save this skill
2. Say "work my pipeline"
3. Answer voice/DNA questions
4. Review report
5. Send messages by hand

Ready to go.

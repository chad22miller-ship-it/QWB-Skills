# Operations reference — linkedin-follow-up-engine-team-v2

Detail moved out of SKILL.md for size; read what the moment needs.


## Edge cases

- **Reply-state unclear** → check messaging, don't guess.
- **Message didn't send** → never stamp a Sent date you can't see; roll Status back if needed.
- **Thin row, no hook** → draft the frame, flag the bracket.
- **Clear no** → `Not a Fit` or `Slow Lane`. Never push through.
- **Activity on someone not in the tracker** → never add yourself; flag and let the rep decide.

## Run summary (end every run)

```
=== PIPELINE RUN — [date] ===
Connect queue sent: [n] of 25 cap   Accepted → Connected: [n]   Withdrawn (14-day): [n]
Full sweep: [n] tracked rows corrected   [n] untracked people flagged
Due today: [n]   Drafted: [n]  (Converse | Qualify+Transition | Lane A/B | nudges)
Verified sent: [n]   Replies found: [n]   Held (didn't send): [n]
Calls booked: [n]   Zooms booked: [n]   Moved to Slow Lane: [n]

Send these in order, top to bottom. After you send, say "sent" and I'll verify each.
```

## Stage every draft into the tracker (PRISTINE v2 columns)

Whenever a draft is produced, put it in this run's wave file in the right column:
- Step 2 (Converse) and its nudge → **Message 1 (Touch 2) Text (column O)**
- Step 3 (Qualify + Transition) and Voss → **Touch 3 (Bridge Ask) Text (column R)**
- Step 4 (Lane A/B, call-booking, Silence A video offer) → **Stage 4 Next-Move Text (column AD)**
- Later steps → the matching text column, else the chat send list

Every staged row carries the person's **Profile URL (column D)** as the match key. Verify by gviz readback after the import.

## Backup path (full)
**Backup path:** the "Engine Inbox" tab + applyInboxUpdates/setupInboxTab functions.
**Last resort:** hand the rep the exact cells to paste. Never improvise blind cell writes.

## Tracker access — the proven read and write paths

**READ (gviz):** open the tracker in a browser tab, fetch:
`https://docs.google.com/spreadsheets/d/<SHEET_ID>/gviz/tq?tqx=out:csv&sheet=Prospects`
— append `&_cb=<timestamp>` to avoid stale reads.

**WRITE (Drive wave-file upload + bound-script import):** assemble ONE wave file, upload to
the shared team folder (`create_file`, folder id `13IhV_Ioh-HVpuaWaEd9m1YheRfpfOVz7`, name
`wave_<rep-name>_<timestamp>.csv`, mime `text/csv`, conversion disabled, CSV passed as
**base64Content**; if assembled in the browser, pull the base64 out in hyphen-laced chunks and strip on reassembly, since unbroken base64 in tool output trips the content filter). Then click **QWB Tools → Import newest wave**. The importer matches each
row by **Profile URL (column D)** and upserts. VERIFY by gviz readback.

**PRISTINE column map (Prospects, v2.0):**
D = Profile URL (match key) · H = Owner · **I = Status** · J = Date of Last Touch ·
K = Next Follow-Up Date · L = Reply/Conversation Notes · M = Booked Date ·
**N = Connection Note** · O = Message 1 (Touch 2) Text · R = Touch 3 (Bridge Ask) Text ·
AD = Stage 4 Next-Move Text.

**Trailing script-maintained columns (never write):** AE = Open Profile · AF = Channel
(`Sales Nav` if Profile URL contains `/sales/lead/`, else `LinkedIn`) · AG = Verify.

**Backup path:** Engine Inbox tab; full notes in `references/operations.md`.

## Step 5 — The 15-minute discovery call (a live PHONE call)

QUALIFIES and earns the Zoom; does not present. When a prospect hits `Call Booked`, prep the rep with a one-screen card from the row's hook (col F), Step 2 answer, and motivation language.

- **Frame (0-1):** "Thanks for making the time, [Name]. This is just 15 minutes for me to learn about you and for you to ask me anything. If it feels like a fit on both sides, we'll set up a proper time for me to walk you through how it all works. Sound fair?"
- **Discovery (1-10):** what they do + what got them into it · long-term? · if time/money weren't the issue, what would they want · **"What's driving that? Why does that matter to you?"** (the second-layer why is the money).
- **The gap (10-12):** "And doing what you're doing now, is that going to get you there?"
- **Qualify check (12-13):** "So if what I show you lines up with everything you just told me you want, are you the type who'd be open to actually doing something about it? Or are you happy where things are?"
- **Book the Zoom LIVE (13-15):** "Based on what you've told me, it's worth showing you exactly how this works... about 30 minutes on Zoom. What does this weekend look like, Saturday morning or Sunday?" Then the bridge video.

After the call: write `Zoom Booked` (I) + zoom date, append the second-layer why to notes (L), hand the rep the 3-min video link.

## The Slow Lane — how to re-open

**Reopen the PERSON, not the pitch.** Reference the gap, not the offer. Monthly value touch;
one re-open ask per cycle, tag `[date reopen]` in notes (L).

1. **Callback to their own words:** "Hey [Name], you mentioned a while back you were feeling boxed in at [company]. Been thinking about that. Has anything shifted, or still the same grind?"
2. **Timing hook:** "Hey [Name], we just opened up something new on our side and you came to mind. No pressure, but is now any better a time than when we first talked?"
3. **Voss re-open (fully cold):** "Hey [Name], have you completely closed the door on ever looking at that side income idea, or has it just been bad timing?"
4. **Value-first, ask-second:** "Saw this and thought of you [useful thing]. Totally separate, if you ever want to revisit that conversation, door's always open. No rush."

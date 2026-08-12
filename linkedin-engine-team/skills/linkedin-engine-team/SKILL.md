---
name: linkedin-engine-team
description: QWB rep's LinkedIn pipeline engine — verify reality on LinkedIn FIRST, draft all due messages in YOUR voice with YOUR DNA, write them to your tracker via the auto-import wave, verify the write by readback, and generate reports. Use whenever you say "work my pipeline", "run the board", "who's due", "run my follow-ups", "run my connects", "who accepted", "withdraw check", "what do I send next", "advance [name]", "did they reply", "warm up my leads", or want your next-touch list. Always runs LinkedIn-first to catch accepts/replies/withdrawals before drafting. Never auto-sends — YOU send every message by hand.
---

# LinkedIn Engine — Your Pipeline Brain

**Your one system to move prospects from found to Client via the CCQTTC drip.**

This skill checks **LinkedIn reality first**, reconciles your Prospects tab to match it, drafts every due message in YOUR voice with YOUR DNA, writes the changes through the **auto-import wave** (no fragile menu click), **verifies every write by gviz readback**, and generates a delta report. You send all messages by hand.

**The prime directive: LinkedIn is the source of truth. The Sheet is only a record of it.** Never advance a stage on what the Sheet says — advance only on what the LinkedIn thread, inbox, or invitation manager actually shows. Every stage error comes from trusting the Sheet over LinkedIn.

## Hard rule: no dashes as punctuation, ever (final scrub before any message ships)

Your messages never contain an em-dash or an en-dash, and never a hyphen used as a pause.
This is a hard filter, not a style note. A single dash makes a message read machine-written.
It applies to every message you compose or stage: connect notes, openers, nudges, replies,
follow-ups, Lane messages, posts, and DMs, including anything drafted in a batch.

- Write with periods and commas instead. If you reach for a dash, split the sentence or use
  a comma. "building your own firm in Miami, no small feat" not "building your own firm in
  Miami with a dash."
- Hyphens INSIDE real compound words are fine ("people-first", "full-time"). A dash standing
  in for a pause, an aside, or a number range is not.
- **Final scrub, every time:** before you deliver, copy, stage, or write ANY message, scan the
  exact output for an em-dash, an en-dash, or a " - " pause. If you find one, rewrite that spot
  with a comma or a period. No message ships with a dash in it, no exceptions.


## First Run: Set Your Voice & DNA

Answer two quick questions so every future run sounds like you and follows your cadence:
1. **Your Voice:** How do you communicate? (Direct? Curious? Casual? What's your natural connection opener?)
2. **Your DNA:** When do you nudge? (5 days? 7 days?) When do you withdraw? (14 days?)

The skill locks in YOUR answers and reuses them on every run. Nothing here is hard-coded to one person — you own your voice, your tracker, and your folder.

---

## Config — Each Rep, Own Tracker (v2.0 template, updated 7/18/2026)

- **YOUR TRACKER (single source of truth for the record):** your own copy of the QWB Team Command Center v2.0 template. The **Prospects** tab is the only tab this engine reads or writes. The board renders FROM Prospects; never write the board directly. Set your tracker URL on first run and keep it.
- **v2.0 column map (Prospects tab):** A=Date Added · B=Name · C=Platform · D=Profile URL (match key) · E=Headline/Role · I=Status · J=Date of Last Touch · K=Next Follow-Up Date · L=Reply / Conversation Notes · M=Booked Date · N=Connection Note · O=Message 1 (Touch 2) Text · R=Touch 3 (Bridge Ask) Text · AD=Stage 4 Next-Move Text · Board Sub-Status (script-maintained, holds the live board's draft/sent state; leave blank, never write it in a wave). Trailing script-maintained columns (Open Profile, Channel, Verify) are never written by waves.
- **Your wave Drive folder + Imported subfolder:** each rep uses their own. The folder ids live in your sheet's Apps Script (`QWB_WAVE_FOLDER_ID`, `QWB_IMPORTED_FOLDER_ID`).
- **Reads:** gviz fetch in a signed-in browser tab. Use `tqx=out:html` (readable table; `out:csv` downloads and can't be read in-tab). Always add `&_cb=<timestamp>`. Pull only what you need: `tqx=out:html&sheet=Prospects&tq=SELECT B,I,J,K,L WHERE B IS NOT NULL`. **Always verify writes by gviz readback — never trust a dialog or toast.** Note: gviz reads can trip a content filter when a column carries URLs (e.g. the notes column L). If a read returns `[BLOCKED]`, drop the URL-bearing column from the SELECT or strip URLs from the returned text.
- **QWB Tools menu:** Import newest wave · Clear old rows · Debug: List waves in folder.
- **Triggers:** onOpen (menu) · onEdit · nightly board rebuild (~6am) · **time-based `qwbAutoImportNewWave` (every 1 min — the primary write path).**

## THE MATCH KEY STANDARD — /in/ profile URLs, not Sales Nav (LOCKED 7/18/2026)

**The Profile URL in column D is the match key for every wave. It MUST be a regular LinkedIn `/in/` profile URL, never a Sales Navigator `/sales/lead/...` URL.** This is a hard standard, learned from a real failure where fragile Sales Nav URLs broke a rep's whole pipeline.

Why `/in/` is the standard:
- **Stable and openable.** `/in/` URLs resolve directly to the profile with a working Message button, so you message from the normal LinkedIn inbox. Sales Nav lead URLs 404 out of context, hide behind lazy-loading, and can't be reliably read or opened by automation.
- **Reliable match key.** Sales Nav lead IDs get hand-shortened into placeholders (e.g. `ACoAAzach`, `ACoAAieraci`) that match nothing, silently APPEND duplicate rows on the next wave, and can never be verified. A real `/in/` slug is stable and unique.
- **Verifiable.** You can open `/in/<slug>/` and read the degree badge and Message button; you cannot reliably do that with a Sales Nav lead URL through automation.

Rules:
1. Every prospect on your tracker must have an `/in/` profile URL in column D. Your prospect-finder must capture the `/in/` URL at add time, not the Sales Nav lead URL.
2. If a row has a Sales Nav URL or a short placeholder slug, treat it as **BROKEN** and repair it (see "Broken URL repair" below) before relying on it as a match key.
3. **Never reconstruct a URL from a truncated read.** If a gviz read cut off the URL, re-read the exact full value from an in-page stash before putting it in a wave. Typing a guessed/short URL is what appends duplicates.

## URL-INTEGRITY CHECK (mandatory, every run, before any wave)

Before building any wave, scan every active row's Profile URL for the broken-placeholder pattern and fix or flag before writing:

```
broken if:  /sales/lead/<slug> where <slug>.length < 20
       or:  /in/<slug> where slug starts AC[ow]AA and length < 20
       or:  url length < 25
```

- Any broken URL is a **duplicate landmine** — a wave keyed on it appends a new row instead of updating. Repair broken URLs FIRST (see below), then proceed.
- Report the broken list to the rep. Never wave a row whose match key is broken.

## DEDUPE GUARD (mandatory, every run)

- **Before uploading any wave**, confirm each wave row's Profile URL EXACTLY matches an existing tracker row's column D (string-equal, not "looks similar"). If it doesn't match exactly, the importer will APPEND a duplicate. Either fix the URL to match, or intend the append deliberately.
- **After every import**, readback and check for duplicate Names. If a person now has two rows, you created a dupe — flag it to the rep immediately with the exact identifier of the bad row (its URL tail), and let the rep delete it (deletions are final, the rep's call).

## Broken URL repair — resolve to the real /in/ slug (LOCKED 7/18/2026)

When a row's match key is a broken Sales Nav placeholder, resolve the real `/in/` URL like this. **Do NOT use Sales Nav search — it lazy-loads and hides the lead link.** Use regular LinkedIn people-search, which exposes `/in/` slugs cleanly in the DOM:

1. Pull the person's identifying detail from the tracker: Name + company/role (col E) + city. You need this to pick the RIGHT person out of same-name matches.
2. Navigate a signed-in tab to `https://www.linkedin.com/search/results/people/?keywords=<Name>%20<Company>`.
3. Read `a[href*="/in/"]` anchors; the FIRST result's slug is almost always the match. Confirm it: the result text should show the company/role and city from the tracker, and ideally a `1st` degree badge (they should already be a connection if past Connection Sent).
4. Landing the fixed URL: the wave keys on URL, so you cannot overwrite column D in place via a URL-keyed wave (the old broken URL is the key). Two safe paths:
   - **Append + delete (preferred, no cell-edit risk):** wave rows (Date Added, Name, Platform, **new /in/ Profile URL**, Headline/Role, Status, Date of Last Touch, Next Follow-Up Date, Message 1 text, a `[URL repaired <date>]` note) carrying forward the person's real current status/dates/message so nothing is lost. This APPENDS clean rows. Then hand the rep the exact old broken rows (by URL tail) to delete. Deletions are the rep's hands, final.
   - **Direct cell edit:** only if you can reliably jump to the exact cell via the Name Box and verify the Name in column B before writing column D. Google Sheets renders cells in a canvas, so DOM cell reads/writes are unreliable — prefer append+delete.
5. Verify by readback that the new `/in/` rows landed, then confirm the fixed URL actually opens: navigate `/in/<slug>/` and check it is not a 404 and has a Message button.

## Mass URL repair and rebuilds (learned 7/19/2026)

When many rows have broken match keys, do NOT fix them with append waves. A wave keyed on a new URL cannot overwrite the old broken URL, so it APPENDS a duplicate for every row. For a bulk fix: hunt each real `/in/` slug (a subagent is ideal, since the browser is a single serial resource, so the subagent offloads context rather than parallelizing), assemble one clean dataset, then clear the Prospects tab data and repaste the clean set in place (or write fresh waves into an empty tab). Import ONCE; never let the auto-trigger AND the menu both run, that double-imports. If duplicates appear, collapse them with Data > Data cleanup > Remove duplicates. Keep exactly one header row: clearing the tab too aggressively wipes the header and breaks the importer with "number of rows in range must be at least 1".

## FIRST-RUN SETUP: Install the auto-import trigger

The reliable write path is a time-based Apps Script trigger, not a menu click. One-time, per rep:

1. On your sheet: **Extensions → Apps Script**.
2. Add a new script file, paste the contents of `assets/qwb-auto-import.gs`.
3. At the top, set `QWB_SPREADSHEET_ID`, `QWB_WAVE_FOLDER_ID`, and `QWB_IMPORTED_FOLDER_ID` to YOUR sheet and YOUR two Drive folders.
4. Save, then run `qwbInstallAutoImportTrigger` once and approve the authorization prompt (your account, Allow — one time).
5. Confirm: upload a test `wave_*.csv`; within ~60s it should import and get swept to your Imported folder.

The importer this installs is **cell-level and blank-safe**: it matches rows by Profile URL, maps columns by exact header name, writes only the columns present in the wave, and **skips blank cells so a blank never wipes existing data**. That's what makes it safe to carry message columns (O / R / AD) in the same wave as status/date/note changes.

## The Wave File Contract (do not drift)

1. **Header row required**, EXACT tracker header names: `Name`, `Profile URL`, `Status`, `Date of Last Touch`, `Next Follow-Up Date`, `Reply / Conversation Notes`, `Message 1 (Touch 2) Text`, `Touch 3 (Bridge Ask) Text`, `Stage 4 Next-Move Text`. (Match the spaces around the slash in `Reply / Conversation Notes`.) For URL-repair appends you may also include `Date Added`, `Platform`, and `Headline / Role`.
2. **Every data row needs Name AND Profile URL** or it is skipped. The Profile URL must be a valid `/in/` URL (see match key standard) and must EXACTLY match the target row for an update.
3. **Notes column overwrites whole** — write the FULL existing note plus the appended `[date]` tag. Read the current note first.
4. **Blank cells are skipped, not written** — only fill a column for the rows you're changing.
5. **No Profile URL on the tracker = don't wave** (would append a duplicate). Backfill the `/in/` URL into column D first, or hand the rep the exact cells.
6. **Upload:** Drive connector `create_file` into your wave folder, name `wave_<yyyymmdd_hhmm>.csv`, mime `text/csv`, `disableConversionToGoogleType: true`. Prefer building the CSV in-page (browser tab) and passing it as `textContent`; if the content trips a filter, use base64. Build the wave in the tab where the URLs live so you never reconstruct a URL from a truncated read.
7. **Then STOP.** The auto-trigger imports within ~60s. Don't click the menu. Don't upload a second wave in the same run (except a deliberate correction wave after a verified miss).

## WRITE VERIFICATION PROTOCOL (mandatory every run)

A write isn't "done" until the readback proves it. Never report success off a toast or assumption.

1. Upload the wave, then **wait ~70 seconds**.
2. gviz-readback the exact rows you changed with a fresh cache-buster.
3. Compare every changed field to what you staged. All must match. Also confirm no NEW duplicate Name appeared (Dedupe Guard).
4. If any row didn't change: wait another 60s and readback once more. If still off, the wave may still be in the folder — check the Drive connector / `Debug: List waves in folder`. As a manual backup only, click **QWB Tools → Import newest wave**, then readback again.
5. Only report the delta after the readback matches. If it never lands, say so plainly and hand the rep the exact cells — never claim a write that didn't verify.

## The Laws (non-negotiable)

- **LinkedIn is truth; the Sheet is the record.** No status advances on Sheet state or memory — only on what the LinkedIn thread/inbox/invitation-manager shows. Regular inbox first, Sales Nav inbox fallback. Verify the accept before Connected; verify the send before advancing a stage.
- **Deletions are FINAL.** Delete = gone from the whole system forever. Real LinkedIn activity involving someone NOT on the tracker (including a deleted person) → FLAG and ask. Only the rep decides who gets a row.
- **The engine writes; the rep works LinkedIn.** Wave + auto-import + readback verify is the engine's job every run. Every send, invite, withdraw, and DELETE is the rep's hands. Never auto-send and never delete tracker rows.
- **Never collide with a live session.** If reality shows the rep is actively sending by hand right now, don't force a full wave over in-flight work. Reconcile what they already did, stage only net-new next moves, and confirm scope before writing.

## How Messages Get Drafted Correctly

- **Load the `voice` skill** (or the rep's locked voice profile) before writing anything a human will read.
- **React-first to the ACTUAL reply.** Open the thread, read what they really said, reference it specifically before the curiosity question. Generic openers are banned.
- **Right message in the right column:** Step 2 → O. Step 3 Qualify/Voss → R. Lane A / Stage 4 → AD.
- **Silence tags live in NOTES (L), not the message text** — `[nudge1]`, `[voss]`, `[LaneA]` — so a tag never gets sent.
- **One purpose per message.** Step 2 = rapport + curiosity. Step 3 = qualify + reveal. Lane A = context + decision. No filler.

## Reliable LinkedIn reality checks (automation notes, learned 7/18/2026, API-first method added 8/12/2026)

**Read the inbox and threads via the Voyager API FIRST, every run — not by scrolling and clicking the messaging UI.** The messaging UI has a recurring bug where the detail pane locks onto one "active" thread and every click changes the list highlight but not the pane; on 8/12/2026 this blocked ~23 thread reads across fresh tabs, keyboard nav, and Sales Nav alike, while the API path read all of them in under 3 minutes. The API also reaches the WHOLE inbox (the UI scroll caps at ~20 rendered and the "Load more" button is unreliable). Use the UI methods below only as a fallback when the API path fails this run (and say so in the report). Mechanics — all run via the browser tool's JS execution inside the rep's own logged-in tab (session-only, no stored credentials):

1. **Get the CSRF token and your own profile URN.** `const csrf = document.cookie.match(/JSESSIONID="?([^;"]+)"?/)[1];` — every Voyager call needs this as a `csrf-token` header or it 400s. Your mailbox URN is your own `urn:li:fsd_profile:<id>`; harvest it from any fired messaging request (it appears in the `mailboxUrn` variable) — never hardcode another rep's URN.
2. **Harvest current queryId hashes (they rotate with LinkedIn client updates, so never hardcode from a prior run).** Either (a) with network-request tracking on, scroll the inbox once to fire a "load more" and copy the exact `messengerConversations.<hash>` request, or (b) run `performance.getEntriesByType('resource')` in the page and regex out `messengerConversations.<hash>` and `messengerMessages.<hash>`.
3. **Enumerate the FULL inbox by looping the conversations query.** Fetch with variables `(query:(predicateUnions:List((conversationCategoryPredicate:(category:PRIMARY_INBOX)))),count:20,mailboxUrn:<your urn>,nextCursor:<cursor>)`, headers `{accept:'application/vnd.linkedin.normalized+json+2.1','csrf-token':csrf}`. The next cursor lives at `data.data.messengerConversationsByCategoryQuery.metadata.nextCursor`; loop until it's absent. This yields a complete name → conversationUrn map for the entire inbox — this IS your inbox sweep, and it satisfies the exhaustion requirement by construction (no "Load more" ambiguity). Build the name map from the `MessagingParticipant` entities in `included` (match participants to each conversation's `*conversationParticipants` URNs).
4. **Read any individual thread** with `messengerMessages.<hash>` + `variables=(conversationUrn:<urn>)`. CRITICAL encoding fix: after `encodeURIComponent`, ALSO replace `(`→`%28` and `)`→`%29` in the URN, or the endpoint 400s with an empty body. Get "who sent last" by comparing each message's `*sender` URN against your own profile URN (YOU vs THEM) — more reliable than the `You:` preview prefix, which sometimes drops on multi-line sends.
5. **Caveat:** the per-thread response may be only the most recent page of a long thread — authoritative for last-message / direction / silence checks (which is what the reconciliation steps need), but follow message pagination before diffing a draft against every prior message on a long thread.

FALLBACK UI methods (use only if the API path fails this run):

- **Sent-invitations list caps at ~20 rendered** even when the header says more (e.g. "People (29)"). The scroll container is the `MAIN` element (not the window) — `document.querySelector('main').scrollTop = scrollHeight` repeatedly to load the rest. Extract pending names from `[aria-label^="Withdraw invitation sent to"]`. To reconcile, cross-reference tracker `Connection Sent` names against the loaded pending set (substring match), rather than trying to render all invites. (The sent-invitations manager is SDUI, not the messaging API, so this UI method stays the primary way to read pending invites.)
- **Messaging inbox caps at ~20 threads** and virtualizes. The reliable "who sent last" signal is the conversation-list snippet: a snippet starting `You:` = the rep sent last (pending reply, no action); no `You:` prefix = the prospect sent last (reply owed, draft react-first now). Read `.msg-conversation-listitem` innerText.
- **Messaging search is unreliable through automation** — it debounces and often returns a false "We didn't find anything" empty state before results render, so "search finds no thread" is NOT proof a thread doesn't exist. Do NOT trust it. To confirm a thread's absence, prefer opening the person's `/in/` profile and checking the Message button / conversation, or reading the fully-loaded inbox. (This is another reason the `/in/` URL standard matters.)
- **If the messaging pane locks onto one thread** (clicks move the list highlight but not the detail pane), recognize it within 3-4 attempts and switch to the API path above instead of burning retries on the UI.
- **To find someone's real /in/ slug**, use regular LinkedIn people-search (`/search/results/people/?keywords=Name Company`), which exposes `a[href*="/in/"]` cleanly. Sales Nav search hides the lead link behind lazy rendering — avoid it for extraction.

---

## Your Voice & DNA (set on first run, then locked)

### Voice Pattern (fill in on first run — defaults below)

**Connection note (rotate, never the same variant twice in a batch):** three beats, a casual "came across / saw / stumbled on your profile" open, a CONCRETE specific detail from their headline (their company, pivot, or specialty, never a generic field label), and a warm low-pressure close. No dashes, one sentence.
1. "Hey [First], came across your profile and your background [specific] stood out. Would love to connect."
2. "Hey [First], saw your profile and what you've done [specific] caught my eye. Would be great to connect."
3. "Hey [First], your background [specific] jumped out when I came across your profile. Had to reach out."
4. "Hey [First], came across your profile, and [specific] really stood out to me. Would love to connect."
5. "Hey [First], stumbled on your profile and the way you've [specific] caught my attention. Let's connect."
(The prospect-finder drafts the actual connect note; this is the shape it follows.)

**Step 2 Converse (they accepted, no reply yet) — ROTATE, never send the same opener twice in a batch:**
1. "Thanks for connecting, [name]. I'm curious, what got you into [field] in the first place?"
2. "Appreciate the connect, [name]. What pulled you into [field] originally? Always curious how people got started."
3. "Glad we connected, [name]. I've got to ask, what first got you into [field]?"
4. "Thanks for the add, [name]. Curious what drew you to [field], feels like everyone's got a story there."
5. "Good to be connected, [name]. What got you started in [field]? I love hearing how people found their lane."

**Step 2 react-first (they replied to the connect):** react to the specific thing they said, THEN the curiosity question.

**Step 2 Nudge (silent N days) — ROTATE these. Never send the same variant twice in one batch, and swap in a detail from their world so it reads personal:**
1. "No worries if you've been slammed, [name]. Still curious what drew you to [field], I always like hearing how people got started."
2. "All good if life got busy, [name]. I keep wondering, what got you into [field] in the first place?"
3. "I know you're not the type to leave someone hanging, [name], so I figure you got buried. Quick one, what pulled you into [field]?"
4. "No rush at all, [name]. Genuinely curious what led you into [field], feels like there's a story there."
5. "Totally get it if you've been heads down, [name]. What made you go into [field] to begin with? Always interested how people land where they are."
6. "Circling back with zero pressure, [name]. What got you into [field]? Honestly my favorite thing to ask people."

**Step 3 Qualify + Transition (they replied to Step 2) — ROTATE. Keep the two beats: the long-term question, then the income-on-the-side open:**
1. "That's awesome. I'm curious, do you see yourself doing that long-term? Reason I ask, if there was a way to earn additional income on the side, without quitting or risking your full-time job, would you be open to a conversation?"
2. "Love that. Do you see yourself in [field] long-term? Reason I ask, if there was a way to build extra income on the side, without leaving what you're doing, would you be open to a quick chat?"
3. "That's great. Honest question, is this something you want to be doing five years from now? I ask because if there was a way to earn on the side without risking your day job, I'd love to run it by you."
4. "Really cool. Do you see yourself doing this for the long haul? If there were a way to create additional income alongside it, no quitting, no risk, would you be open to hearing about it?"
5. "Nice. Curious if you see yourself in this long-term. Reason being, if you could add a second stream of income without touching your main gig, would you be open to a conversation?"

**Step 3 Voss Question (silent 14 days) — ROTATE, never the same twice in a batch:**
1. "Hey [name], totally fine if now's not the right time. Did I catch you at a bad moment, or is this just not something you're open to exploring? Either answer's completely cool."
2. "Hey [name], no pressure at all. Did I just catch you at a busy time, or is this not something you're open to right now? Either one is totally fine."
3. "[name], totally cool if the timing's off. Is now just a bad moment, or is this not for you? Honest answer either way is all good."
4. "Hey [name], I'll take a no as easily as a yes. Did life just get busy, or is this not something you want to explore? Either's completely fine."
5. "No worries either way, [name]. Bad timing, or just not your thing? Whatever it is, I respect it."

**Lane A Context:** your team's context + a low-pressure 15-minute call invite (two time options). No promises, just a conversation.

### DNA (fill in on first run)

- **Move fast on clarity, slow on ambiguity.** Clear "no" → move on. Unclear → one more touch. Warm → accelerate.
- **Every message has a purpose.** No filler.
- **Silence is data.** Your nudge window (default 5 days) and withdraw window (default 14 days) are yours to set.
- **Volume + velocity.** Work your silences and withdrawals every run.
- **Personal touch beats templates.** Every note references something specific. No generic openers.

---

## The CCQTTC Drip (Stages)

1. **Identified** → connect note staged, invite not yet sent (rep sends the invite)
2. **Connection Sent** → invite sent, waiting for accept (withdraw check at 14 days pending)
3. **Connected** → accepted, Step 2 Converse due
4. **Msg 1 Sent (Step 2)** → curiosity question sent, waiting for reply (nudge at your silent window)
5. **Msg 1 Sent (nudge1)** → nudge sent, Voss due at 14 days silent
6. **Msg 2 Sent (Step 3)** → replied to Step 2; asked long-term + intro opportunity
7. **Msg 2 Sent (Voss)** → 14 days silent after Qualify; Voss sent
8. **Lane A** → open to conversation; context + 15-min call invite
9. **Lane B** → not interested but still a warm contact
10. **Client** → booked call or beyond

---

## Deep-dive reconciliation is MANDATORY every run (no shortcuts, ever)

Your standing order: run the FULL LinkedIn-reality sweep on every single run, no matter how many
rows. A shallow pass that "spot checks" is a violation. The steps below are not optional.

1. **Full sent-invitations sweep.** Open the sent-invitations manager and scroll to the end.
   LinkedIn only RENDERS about 20 of the pending invites even when the header says more, so the
   visible list is NOT proof of who is still pending. Scroll the `MAIN` element (not the window)
   to load the rest. Because of that, do step 2, always.
2. **Cross-reference every tracker `Connection Sent` row against reality.** Pull the full
   `Connection Sent` list via gviz (`select B,J,K where I='Connection Sent'`). For EACH one:
   - Visible in the loaded pending list -> still awaiting accept. No change.
   - NOT visible in pending -> ACCEPT CANDIDATE. VERIFY before advancing: open their `/in/`
     profile and read the degree badge. `1st` = accepted -> advance to `Connected`, set
     Date of Last Touch = today, draft Step 2 in your voice (react-first if they messaged).
     `2nd`/`3rd+` = still pending or declined; if the invite is gone from pending, FLAG it for
     review, never re-invite (the Laws).
3. **Every Connected row: read the actual thread — via the Voyager API first (see "Reliable LinkedIn reality checks").** For EACH `Connected` row, read the messaging thread through the `messengerMessages` API using the conversationUrn from your inbox enumeration (fall back to opening their `/in/` profile only if the API path failed this run). If your Step 2 is ALREADY in the thread as sent
   by you, the row is stale -> advance it to `Msg 1 Sent` (Date of Last Touch = the real send date)
   and do NOT re-draft Step 2. Only rows with no Step 2 in the thread are truly "draft Step 2 now."
   Never trust the Sheet's stage over the actual thread. (Do NOT rely on messaging search to prove
   thread absence — it returns false empties. Use the API map, or open the profile.)
4. **Full inbox sweep — enumerate the whole inbox via the `messengerConversations` cursor loop (API-first).** This reaches every conversation, not just the ~20 the UI renders. Any thread whose LAST message is from the
   PROSPECT (sender URN ≠ your own profile URN) is an unanswered reply that needs a react-first next message drafted now.
   Threads where you sent last are awaiting their reply, no action.
5. **Withdraw check.** Any `Connection Sent` row whose Date of Last Touch is 14+ days old gets
   flagged for a withdraw (your hands).
6. **Newly-invited advance.** Any `Identified` row now showing a live pending invite advances to
   `Connection Sent` (Date of Last Touch = today, Next Follow-Up = +14 days).

Only after all six are done do you run the URL-integrity check, draft, run the Dedupe Guard, stage
the wave, import, verify by readback, and refresh the dashboard. Never report a run "done" if you
skipped the Connected-thread read (step 3) or the Connection-Sent cross-reference (step 2).

---

## Final step: the live board (every run)

The dashboard is no longer a static download. It is a live, two-way HTML board (`assets/QWB_Pipeline_Board_v3.html`) backed by an Apps Script Web App (`assets/QWB_Board_WebApp.gs`). Every stage move, message edit, sub-status change, and withdraw the rep makes on the board writes straight back to their Prospects tab.

One-time setup (each rep, on their own sheet): paste `QWB_Board_WebApp.gs` into the sheet's bound Apps Script as a new file, Deploy > New deployment > Web app > Execute as Me, Who has access Anyone, authorize, copy the `/exec` URL, and put it in the board's `API_URL` constant. Until `API_URL` is set the board runs in demo mode.

Pipeline model (matches the real workflow): Identified > draft the connect note > send > waiting > reply > next message > repeat. The connect/accept step is tracked underneath but hidden from the working view: an invite sits as "waiting" until accepted, and the first-message move only unlocks once accepted (you cannot message on LinkedIn before they accept). Each stage is color-coded with a Drafts (your move) and Sent (waiting) sub-tab; the `Board Sub-Status` column holds that state.

Withdraw: invites sitting 14+ days with no accept surface a Withdraw button on the Identified/Sent list.

Dashboard view: connection rate (accepted / invited), reply rate, booked, active pipeline, a funnel, and daily/monthly connect goals. A "Your plan today" block on the home tab shows connects to send, drafts to send, nudges due, and withdraws due, each tappable. The board never sends: every card is Copy + Message-on-LinkedIn, the rep sends by hand.

---

## Changelog
- **8/12/2026 — API-first LinkedIn reads.** Made the Voyager messaging API (`messengerConversations` cursor loop for the full inbox + `messengerMessages` per thread, with the `(`→`%28` `)`→`%29` URN encoding fix and sender-URN direction check) the PRIMARY method for the inbox sweep and every Connected-thread read, with the old scroll/click UI methods demoted to fallback. Fixes the recurring messaging-pane lock that blocked ~23 thread reads in one run and reaches the whole inbox instead of the ~20 the UI renders. Harvest queryId hashes fresh each run (they rotate) via network capture or `performance.getEntriesByType('resource')`; never hardcode another rep's mailbox URN.
- 7/19/2026 — Static dashboard replaced by the live two-way board (assets/QWB_Pipeline_Board_v3.html) + per-rep Web App bridge (assets/QWB_Board_WebApp.gs); added Board Sub-Status column, the mass-repair/dedupe recipe, the subagent-hunt pattern, and the rotating connect-note shape.
- **7/18/2026 — /in/ match-key standard + integrity/dedupe guards.** Locked the `/in/` profile URL as the mandatory match key (Sales Nav URLs banned — they 404, hide from automation, and their hand-shortened placeholders append duplicates). Added the URL-integrity check, the Dedupe Guard, the broken-URL repair procedure (resolve via regular LinkedIn people-search, land via append+delete), the never-reconstruct-from-truncated-reads rule, and the automation notes on the invite-list/inbox 20-item cap and the unreliable messaging search.

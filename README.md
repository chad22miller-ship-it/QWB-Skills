# QWB Skills

Shared Claude skills for the QWB team. Install them once and your Claude runs the pipeline the way we actually work it: find the right people, score them, and know exactly who to follow up with and what to say.

## What's inside

### prospect-finder-team-v2

Your prospecting engine (v2.0 Command Center grid). It pulls new leads from your own LinkedIn Sales Navigator search, scores each one STRONG, MAYBE, or SKIP on our recruiting rubric, drafts your connection notes, and logs the strong ones to your tracker. You point it at your search and your tracker.

### linkedin-engine-team

Your pipeline brain (v2.0 Command Center grid). It reads your Prospects tracker, finds everyone who is due or stuck at every stage, and drafts the exact next message to move each person from found to client through the QWB CCQTTC drip. You send everything by hand. It never auto-sends.

**First run, one-time setup:** if you copied the **updated** team template, the full QWB Tools v2.2 script (fixed importer + one-shot wave lockout + folder-hygiene warning + self-cleaning board + "Clear old rows" button + nightly rebuild trigger) is already installed — skip this. If your sheet still has the **old v2.0** importer (symptom: "Import newest wave" always says "No wave file found" even when a wave is present), fix it once: the corrected script is bundled at `skills/linkedin-engine-team/assets/QWB_Tools_Importer_v2_1.gs`. On your tracker: Extensions -> Apps Script -> replace all the code with that file -> set FOLDER_ID to your wave Drive folder id -> Save -> refresh. The skill walks you through it on the first run.

## Install

**In Cowork (what most reps use):** open **Customize -> Plugins**, click the **+** and choose **Add marketplace**, pick **Add from a repository**, and paste:

```
https://github.com/chad22miller-ship-it/qwb-skills
```

Then click **Install** on **prospect-finder-team-v2** and **linkedin-engine-team**.

**In Claude Code (terminal):** run these one at a time:

```
/plugin marketplace add chad22miller-ship-it/qwb-skills
/plugin install prospect-finder-team-v2@qwb-skills
/plugin install linkedin-engine-team@qwb-skills
```

Either way, the skills load automatically once installed.

## How to use them

Once installed, just talk to Claude naturally:

- "Find prospects" or "run my prospecting" fires prospect-finder-team-v2.
- "Who's due" or "run my follow-ups" or "what do I send next" fires linkedin-engine-team.

Every rep works from their own Sales Navigator search and their own tracker. You send every message by hand; the engine never auto-sends.

## The rules the engine follows

- **Deletions are final.** Delete someone from your Prospects tab and they leave the whole system forever. The engine flags new LinkedIn activity but never re-adds anyone without your say.
- **You click LinkedIn; the engine handles the tracker.** Every send, invite, and withdraw is your hands.
- **Verify before advancing.** Nothing moves on memory. The engine reads the real thread before it advances anyone.

## Questions

Reach out to Chad.

---

Maintained by chad22miller-ship-it for the QWB team.

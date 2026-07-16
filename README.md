# QWB Skills

Shared Claude skills for the QWB team. Install them once and your Claude runs the pipeline the way we actually work it: find the right people, score them, and know exactly who to follow up with and what to say.

**New rep? Start here → [GET-STARTED.md](GET-STARTED.md).** Install plus full setup in about 5 minutes.

## What's inside

### prospect-finder-team-v2

Your prospecting engine (v2.0 Command Center grid). It pulls new leads from your own LinkedIn Sales Navigator search, scores each one STRONG, MAYBE, or SKIP on our recruiting rubric, drafts your connection notes, and logs the strong ones to your tracker. You point it at your search and your tracker.

### linkedin-follow-up-engine-team-v2

Your pipeline brain (v2.0 Command Center grid). It reads your Prospects tracker, finds everyone who is due or stuck at every stage, and drafts the exact next message to move each person from found to client through the QWB drip. You send everything by hand. It never auto-sends.

## Install

**In Cowork (what most reps use):** open **Customize → Plugins**, click the **+** and choose **Add marketplace**, pick **Add from a repository**, and paste:

```
https://github.com/chad22miller-ship-it/qwb-skills
```

Then click **Install** on **prospect-finder-team-v2** and **linkedin-follow-up-engine-team-v2**. Full walkthrough in [GET-STARTED.md](GET-STARTED.md).

**In Claude Code (terminal):** run these one at a time:

```
/plugin marketplace add chad22miller-ship-it/qwb-skills
/plugin install prospect-finder-team-v2@qwb-skills
/plugin install linkedin-follow-up-engine-team-v2@qwb-skills
```

Either way, the skills load automatically once installed.

## How to use them

Once installed, just talk to Claude naturally:

- "Find prospects" or "run my prospecting" fires prospect-finder-team-v2.
- "Who's due" or "run my follow-ups" or "what do I send next" fires linkedin-follow-up-engine-team-v2.

Every rep works from their own Sales Navigator search and their own tracker.

## Questions

Reach out to Chad.

---

Maintained by chad22miller-ship-it for the QWB team.

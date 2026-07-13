# QWB Skills

Shared Claude skills for the QWB team. Install them once and your Claude runs the pipeline the way we actually work it: find the right people, score them, and know exactly who to follow up with and what to say.

**New rep? Start here → [GET-STARTED.md](GET-STARTED.md).** Install plus full setup in about 5 minutes.

## What's inside

### prospect-finder-team

Your prospecting engine. It pulls new leads from your own LinkedIn Sales Navigator search, scores each one STRONG, MAYBE, or SKIP on our recruiting rubric, drafts your connection notes, and logs the strong ones to your tracker. You point it at your search and your tracker.

### linkedin-follow-up-engine-team

Your pipeline brain. It reads your Prospects tracker, finds everyone who is due or stuck at every stage, and drafts the exact next message to move each person from found to client through the QWB drip. You send everything by hand. It never auto-sends.

## Install

Open Claude and run these one at a time:

```
/plugin marketplace add chad22miller-ship-it/qwb-skills
/plugin install prospect-finder-team@qwb-skills
/plugin install linkedin-follow-up-engine-team@qwb-skills
```

The first line connects you to the marketplace. The next two install the skills. That is it. They load automatically, so you can start right away.

## How to use them

Once installed, just talk to Claude naturally:

- "Find prospects" or "run my prospecting" fires prospect-finder-team.
- "Who's due" or "run my follow-ups" or "what do I send next" fires linkedin-follow-up-engine-team.

Every rep works from their own Sales Navigator search and their own tracker.

## Questions

Reach out to Chad.

---

Maintained by chad22miller-ship-it for the QWB team.

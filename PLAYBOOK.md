# QWB Skills → Team: The Distribution Playbook

*Drop this into any Claude project. It's the full brain for how an updated QWB skill gets from Chad's library to the reps — the repo structure, the exact push steps, and every gotcha learned the hard way. Follow it and skills reach the team clean, every time.*

---

## The setup in one breath

Chad's team skills live in a **public GitHub repo that acts as a Claude plugin marketplace**. Reps add the marketplace once in Cowork, install the plugins, and they're running the skills. When Chad improves a skill, he pushes the new version to the repo; reps re-sync to pull it.

- **Repo:** `chad22miller-ship-it/qwb-skills` → https://github.com/chad22miller-ship-it/qwb-skills
- **What reps paste to add it:** `chad22miller-ship-it/qwb-skills`
- **Current plugins:** `prospect-finder-team`, `linkedin-follow-up-engine-team`
- The repo must stay **public** or the marketplace won't sync.

---

## The repo structure (this EXACT shape, or sync fails)

```
qwb-skills/
├── .claude-plugin/
│   └── marketplace.json                 ← the catalog
├── prospect-finder-team/                ← one top-level folder per plugin
│   ├── .claude-plugin/
│   │   └── plugin.json                  ← REQUIRED manifest
│   └── skills/
│       └── prospect-finder-team/
│           └── SKILL.md                 ← the actual skill
├── linkedin-follow-up-engine-team/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   └── skills/
│       └── linkedin-follow-up-engine-team/
│           └── SKILL.md
├── README.md
└── GET-STARTED.md                       ← rep onboarding walkthrough
```

**The rule that cost two failed syncs:** a plugin is NOT a bare folder with a `SKILL.md` in it. Every plugin needs its own `.claude-plugin/plugin.json` AND its skill nested at `skills/<skill-name>/SKILL.md`. This is the identical layout Anthropic uses on their own `knowledge-work-plugins` marketplace. A bare `skills/<name>/SKILL.md` with no manifest throws **"marketplace sync failed."**

---

## marketplace.json (the catalog)

```json
{
  "name": "qwb-skills",
  "owner": { "name": "chad22miller-ship-it" },
  "description": "Shared skills for the QWB team",
  "plugins": [
    {
      "name": "prospect-finder-team",
      "source": "./prospect-finder-team",
      "description": "one-line summary"
    },
    {
      "name": "linkedin-follow-up-engine-team",
      "source": "./linkedin-follow-up-engine-team",
      "description": "one-line summary"
    }
  ]
}
```

Non-negotiables:

- `name` is **kebab-case, no spaces** — it's the install identifier (`plugin@marketplace`). A spaced name breaks the install command.
- `owner` is an **object** `{ "name": "..." }`, never a bare string.
- Each plugin entry needs `name` + `source` + `description`. A missing description can fail the sync.
- `source` is a relative path starting with `./` that resolves from the **repo root**, so `./prospect-finder-team` points at the plugin folder at the top of the repo.
- To add a NEW plugin later: create its folder in the same shape and add one entry here.

---

## plugin.json (one per plugin, minimal)

```json
{
  "name": "prospect-finder-team",
  "version": "1.0.0",
  "description": "one-line summary"
}
```

---

## To push an UPDATED skill (the workflow)

1. **Know which skill changed.** Only the SKILL.md content changes; the folder structure stays put. Target file: `<plugin>/skills/<skill-name>/SKILL.md`.

2. **Get the REAL file — and never trust a truncated copy.** ⚠️ This is the trap. The Cowork skill library can reach the shell/sandbox **truncated**: capped at the file's OLD byte size, cut off mid-sentence, with a line count that doesn't match the byte count. Before pushing:
   - Read the skill with the **file reader (Read tool)**, not shell `cat`/`cp`/`wc`.
   - Confirm it **ends cleanly** (not mid-word) and the **line count is sane**.
   - **Red flag:** same byte count as the old version but a different line count = you're looking at a corrupted cache, not the real file. Rebuild from the file-reader view, not the shell.
   - After writing the rebuilt file, the shell may still show a stale (old-size) copy — verify with the file reader, and trust the upload's reported KB size (a bigger update should upload bigger).

3. **Overwrite the repo's SKILL.md** at `<plugin>/skills/<skill-name>/SKILL.md` with the new version. Browser path: open the scoped GitHub upload page and drop the file, which lands it in that exact folder:
   `https://github.com/chad22miller-ship-it/qwb-skills/upload/main/<plugin>/skills/<skill-name>`

4. **Commit reliably.** GitHub's green "Commit changes" button is flaky to hit by pixel (the layout shifts when hints appear). Click it via the **page's own script** (JS `.click()` on the button whose text is "Commit changes") or by element reference — not raw coordinates.

5. **Verify on the LIVE file.** Open the blob on GitHub and check the header size / line count is the **new (usually bigger)** value, not the old one. If it still shows the old size, the push didn't take or a stale copy uploaded — redo it. Spot-check for a signature phrase from the update.

---

## How reps GET the update (this is NOT automatic)

Editing the repo updates the master copy only. Reps' installed copies do NOT change until they refresh.

**In Cowork:** Customize → Plugins → find **qwb-skills** → ⋯ menu → **Remove** → then **+ → Add marketplace → Add from a repository** → paste `chad22miller-ship-it/qwb-skills` → re-install the plugin.

**In Claude Code (terminal):**
```
/plugin marketplace update qwb-skills
```

Every time you push an update, tell reps: **"re-sync to get the update."**

---

## Rep first-time install (for reference)

**Cowork (what most reps use):** Customize → Plugins → **+** → Add marketplace → Add from a repository → paste `chad22miller-ship-it/qwb-skills` → Install `prospect-finder-team` and `linkedin-follow-up-engine-team`.

**Claude Code (terminal):**
```
/plugin marketplace add chad22miller-ship-it/qwb-skills
/plugin install prospect-finder-team@qwb-skills
/plugin install linkedin-follow-up-engine-team@qwb-skills
```

Reps also each need their own tracker copy + connectors — that runtime setup lives in `GET-STARTED.md` in the repo.

---

## The hard-won gotchas (don't relearn these)

1. **Bare SKILL.md folders fail sync.** Every plugin = `.claude-plugin/plugin.json` + `skills/<name>/SKILL.md`. Match Anthropic's layout exactly.
2. **`owner` must be an object; `name` must be kebab-case.** A string owner or a spaced marketplace name breaks the catalog.
3. **The skill-library cache truncates.** Always verify the file is complete (clean ending, sane line count) before pushing. Same-bytes-but-different-line-count = a corrupted read; use the file reader.
4. **A repo edit doesn't reach reps.** They must re-sync the marketplace.
5. **Commit via the button's own click, not pixels.** Pixel-clicks miss when the layout shifts; use JS `.click()` or an element reference.
6. **The marketplace repo must stay public.** Private repos won't sync.

---

*Repo: https://github.com/chad22miller-ship-it/qwb-skills · Reps re-sync after every push · Match the folder shape exactly.*

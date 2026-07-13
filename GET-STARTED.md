# QWB Skills — New Rep Get-Started

Everything you need to go from zero to running your pipeline. About 5 minutes. Do the steps in order.

---

## Step 1 — Install the skills (about a minute in Cowork)

1. Open **Cowork**. In the left sidebar, click **Customize**, then open the **Plugins** tab.
2. In the **Personal plugins** section, click the **+** button and choose **Add marketplace**.
3. Pick **Add from a repository**, paste this, and add it:

   ```
   https://github.com/chad22miller-ship-it/qwb-skills
   ```

4. Back in the Plugins list, click **Install** on both:
   - **prospect-finder-team**
   - **linkedin-follow-up-engine-team**

That's it. The skills load automatically. (Using Claude Code in a terminal instead? See the bottom of this page.)

---

## Step 2 — Get your own tracker

The skills run on YOUR own copy of the QWB Command Center tracker. One rep, one tracker. Never share one with another rep.

Make your copy here: **[ Chad: paste your tracker template share link ]**

Then in the sheet: File → Make a copy. Keep the three tabs as they are. The Prospects tab is your command center; the dashboard fills itself.

---

## Step 3 — Save your Sales Navigator search

The prospecting skill pulls leads from your own saved Sales Navigator search. Build one for your market and save it. Want the proven setup? Ask Chad for the QWB starter filters.

---

## Step 4 — Connect your tools (one time each)

- **Google Drive / Sheets** — so Claude can read and write your tracker.
- **LinkedIn through Claude in Chrome** — so Claude can read your leads and check your messages. Install the Claude in Chrome extension and stay logged into LinkedIn.

---

## Step 5 — First run: point the skills at your stuff

Once you are installed and connected, paste this into Claude and fill in your three lines:

```
I just installed prospect-finder-team and linkedin-follow-up-engine-team.
Set me up and remember these for every run:
My tracker URL: <paste yours>
My Sales Navigator saved-search URL: <paste yours>
My name: <your name>
Then walk me through my first prospecting run.
```

Claude saves these and you are live.

---

## Step 6 — Run your pipeline

Just talk to Claude naturally:

- **"Find prospects"** — sources and scores new leads, drafts your connection notes, logs them to your tracker.
- **"Who's due"** or **"what do I send next"** — tells you exactly who to follow up with and the message to send. You send it by hand. It never auto-sends.

---

## Stuck?

Message Chad.

---

### Using Claude Code in a terminal instead of Cowork?

Paste these one at a time:

```
/plugin marketplace add chad22miller-ship-it/qwb-skills
/plugin install prospect-finder-team@qwb-skills
/plugin install linkedin-follow-up-engine-team@qwb-skills
```

*Maintained by chad22miller-ship-it for the QWB team.*

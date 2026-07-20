# Operations reference — prospect-finder-team-v2 (v3 tracker)

Detail moved out of SKILL.md for size; read what the moment needs.


## Build the saved search (recommended starter — reps add their own market)
Build a Sales Navigator search with these filters, then add the rep's own region,
save it, and paste the URL into `SAVED_SEARCH_URL`:
- **Current title:** Real Estate Agent, Professional Realtor, Loan Officer,
  Sales Manager, Recruiter, Coach, Sales Agent, Bookkeeper, Tax Consultant,
  Accountant (surface the operators and producers)
- **Years of experience:** 3–5 and 6–10
- **Region:** (the rep's own market — intentionally not set for you)

**Tuning beats grinding.** Do NOT add the broad **Sales** + **Business
Development** FUNCTION filter or the **Account Executive** title — that trio is
what front-loads the AI/crypto/SaaS AE crowd and drops the STRONG hit-rate to
~2–3 per page. Letting the high-value titles above drive the search lifts it to
~9 STRONG per page. Easiest way to tune deterministically is to rewrite the search
URL's `CURRENT_TITLE` filter set and drop the `FUNCTION` block rather than clicking
chips (the filter list reflows and mis-clicks).

### TSV format (direct paste into Sheets)
Each row is 14 tab-separated fields. Between I (`Identified`) and N (the note)
there are four empty fields (J, K, L, M) = **5 consecutive tab characters**. No
header row on the paste path (the tab already has its header at row 1).

### CSV format (QWB Tools importer / URL import via Drive)
Same 14 columns, comma-separated, **with the exact v3 header row as line 1**. The
v3 importer maps columns by matching these header names to the sheet, so they must
match exactly:
```
Date Added,Name,Platform,Profile URL,Headline / Role,Personalization Hook,3C Notes (Coachability, Commitment, Character signals),Owner (Agent),Status,Date of Last Touch,Next Follow-Up Date,Reply / Conversation Notes,Booked Date,Connection Note
```
**Double-quote every field** (quote the 3C Notes header too, it contains commas).
Escape internal `"` by doubling to `""`. Column D (Profile URL) is the slash-free
public `/in/<slug>` — a trailing slash breaks the importer's exact-match dedupe and
creates a duplicate.

**Example CSV (header + one data row):**
```
"Date Added","Name","Platform","Profile URL","Headline / Role","Personalization Hook","3C Notes (Coachability, Commitment, Character signals)","Owner (Agent)","Status","Date of Last Touch","Next Follow-Up Date","Reply / Conversation Notes","Booked Date","Connection Note"
"7/20/2026","Dana Reyes","LinkedIn","https://www.linkedin.com/in/dana-reyes","Loan Officer at Sunrise Mortgage | Miami FL","8 yrs in mortgage lending, coaches youth football","Capability: 8yr loan officer. Hunger: ""next chapter"" line signals unfinished growth.","YOUR_NAME","Identified","","","","","Hey Dana, saw you have been in mortgage lending for 8 years down in Miami. You clearly know your craft. Would be great to connect!"
```

## Header-row rule (IMPORTANT — changed for v3)
QWB Tools importer path (and File → Import): **header row REQUIRED.** The v3
importer maps columns by header name and rejects a headerless file with
`ERROR: Wave file missing "Name" or "Profile URL" column.` The ONLY path that omits
the header is a direct TSV paste into the tab. (The old v2.0 "no header ever" rule
is retired — it was for the previous importer.)

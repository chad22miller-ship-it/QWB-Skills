# Operations reference — prospect-finder-team

Detail moved out of SKILL.md for size; read what the moment needs.


## Build the saved search (recommended starter — reps add their own market)
Build a Sales Navigator search with these filters, then add the rep's own region,
save it, and paste the URL into `SAVED_SEARCH_URL`:
- **Function:** Sales, Business Development
- **Current title:** Real Estate Agent, Professional Realtor, Loan Officer,
  Account Executive, Sales Manager, Recruiter, Coach, Sales Agent, Assistant,
  Administrative Assistant, Bookkeeper, Accounting Clerk, Tax Consultant,
  Tax Accountant, Accountant, Accounting Assistant
- **Years of experience:** 3–5 and 6–10
- **Region:** (the rep's own market — intentionally not set for you)

### TSV format (direct paste into Sheets)
Each row is 14 tab-separated fields. Between I (`Identified`) and N (the note)
there are four empty fields (J, K, L, M) = **5 consecutive tab characters**. No
header row for the paste path.

### CSV format (URL import via Drive)
Same 14 columns, comma-separated, **with a header row**:
```
Date Added,Name,Platform,Profile URL,Headline/Role,Personalization Hook,3C Notes,Owner,Status,Last Touch,Follow-Up,Reply Notes,Booked,Connection Note
```
**Double-quote every field.** Escape internal `"` by doubling to `""`.

## Header-row rule (IMPORTANT)
QWB Tools importer path: NO header row ever — header-looking lines risk junk rows.
The header row shown in the CSV format above applies ONLY to the File → Import
fallback path.

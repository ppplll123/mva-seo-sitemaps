# New Jersey deer (animal) crashes by county, 2023 and 2024

One CSV and one chart for each of New Jersey's 21 counties: every town, every road with 10 or more animal crashes, and October and November animal crashes by hour of day. Compiled by Injuries Cases Autos research.

Write-up with every county: https://injuriescases.autos/new-jersey/nj-deer-crashes-by-county (each county has its own anchor, for example `#morris` or `#cape-may`).

## Files

| File | What it holds |
|---|---|
| `<county>.csv` (21 files: atlantic, bergen, burlington, camden, cape-may, cumberland, essex, gloucester, hudson, hunterdon, mercer, middlesex, monmouth, morris, ocean, passaic, salem, somerset, sussex, union, warren) | Towns, roads and hours for that county (sections below) |
| `<county>.png` (21 files) | Chart of the county's animal crashes by month, 2023 and 2024 combined, October and November in orange (780 x 442 px) |

## CSV layout

Each CSV has one header and a `section` column that labels every row:

| `section` | One row per | Columns filled |
|---|---|---|
| `town` | every municipality with at least one police-logged crash in the county, sorted by October and November animal crashes | all |
| `road` | every road with 10 or more animal crashes in 2023 and 2024, sorted by count | `animal_crashes_2023_2024`, `oct_nov_animal_crashes_2023_2024` |
| `hour_oct_nov` | each hour of the day (`18:00 to 18:59` and so on) | `oct_nov_animal_crashes_2023_2024` only |
| `county_total` | the county as a whole (one row) | all |

Columns: `name` (town, road or hour), `animal_crashes_2023_2024`, `all_crashes_2023_2024` (all police-logged crashes of any type), `animal_share_of_all_crashes_pct` (one decimal), `oct_nov_animal_crashes_2023_2024` (1 October to 30 November, both years added together). A town row named "Municipality not coded" holds crash records with no town on them.

## Source and definitions

- **Source:** NJDOT police crash records (NJTR-1), via the NJDOT Crash Data Portal as normalized by the open-source nj-crashes project (hudcostreets/nj-crashes), counted by Injuries Cases Autos.
- **Animal crash:** a record whose crash type is "Animal". Records do not name the species; in most of them a deer is coded as the first thing struck.
- **Years:** 2023 and 2024 are complete. 2025 is preliminary and is not in these files.
- **County and town:** as coded on the crash record. Same-name towns (Washington, Franklin, Hamilton) are kept apart by county.
- **Road:** road name on the record, grouped so that "US 206", "NJ 31", "I-80" and their variants count once; county routes keep their record name (for example `ROUTE 513`).
- **Hour:** the hour on the crash record.
- **Not included:** animal strikes never reported to police, so totals are lower than insurer claim estimates.

## How to read these numbers

- **Counts of police reports, not risk rates.** A town or road with more crashes may simply carry more traffic.
- Small towns can show high shares on small bases. Check `all_crashes_2023_2024` before quoting a share.
- The data says **nothing about fault, insurance claims or claim value.**

## Licence

Free to use with credit to Injuries Cases Autos.

Suggested credit: "Source: Injuries Cases Autos analysis of NJDOT crash records" with a link to https://injuriescases.autos/new-jersey/nj-deer-crashes-by-county

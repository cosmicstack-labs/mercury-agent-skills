---
name: staff-scheduler
description: >-
  Build optimized staff schedules that match coverage to demand while respecting
  labor budgets, employee availability, and local labor laws. Handles shift
  swaps, time-off requests, and identifies over/under-staffing before it happens.
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: shop-restaurant
  tags:
    - staff-scheduling
    - shift-management
    - labor-cost
    - workforce
    - scheduling
    - restaurant-operations
---

# Staff Scheduler

## Core Principles

Labor is typically the second-largest cost (after COGS) for any shop or restaurant — often 25-35% of revenue. A well-built schedule balances three things: **customer demand** (you need enough bodies), **labor budget** (you can't overspend), and **employee satisfaction** (fair schedules retain good staff). The Staff Scheduler skill automates this balancing act.

### The Three Pillars of Great Scheduling

1. **Demand-driven coverage.** Schedule to the forecast, not to habit. If Mondays are slow, don't staff for Saturday volumes.
2. **Labor cost targeting.** Set a target labor % (e.g., 28% of sales) and build the schedule to hit it. Every hour above target eats margin.
3. **Fairness & compliance.** Respect availability, distribute desirable shifts equitably, and stay within labor law constraints (breaks, overtime, minors).

---

## Skill Workflow

### Step 1 — Gather Baseline Data

Ask the user for:

- **Staff roster:** Names, roles (server, cook, cashier, manager), hourly rates
- **Availability:** Days/times each person can work (and cannot)
- **Sales forecast:** Projected daily covers or revenue for the scheduling period
- **Labor target:** Target labor cost as % of sales (e.g., 28%)
- **Coverage requirements:** Staff needed per role per shift (e.g., "2 servers, 1 cook, 1 cashier for lunch")

**If they don't have a sales forecast:**
> "Let me look at your sales data from the same period last week/month and project forward. I'll adjust for any known events or holidays."

### Step 2 — Calculate Labor Budget

```
Available Labor $ = Projected Sales × Target Labor %
Hour Budget = Available Labor $ ÷ Average Hourly Rate (blended)
```

**Example:**
> "Next week's projected sales: $28,000. At a 28% labor target, you have $7,840 to spend on wages. With a blended rate of $18/hr across all roles, that's 435 hours total."

### Step 3 — Build Coverage Schedule by Day Part

Break each day into shifts (e.g., opening, mid, closing) and assign required headcount per role:

| Day | Shift | Servers Needed | Cooks Needed | Cashiers Needed | Projected Sales |
|-----|-------|---------------|-------------|----------------|----------------|
| Mon | Open | 1 | 1 | 1 | $1,200 |
| Mon | Mid | 2 | 1 | 2 | $2,800 |
| Mon | Close | 2 | 2 | 1 | $2,000 |
| Tue | Open | 1 | 1 | 1 | $1,100 |

**Recommendation engine assigns staff based on:**
1. Availability match (required — no scheduling outside available hours)
2. Role match (a server can't cover cook shifts)
3. Hourly rate optimization (lower-cost staff for slower periods where possible)
4. Fairness (rotate closing shifts, weekends, and preferred sections)

### Step 4 — Generate Draft Schedule

Output a clean weekly schedule:

```
WEEK OF: Mar 10-16, 2025

MONDAY MAR 10
  Open (8am-2pm):  Sarah (S), Mike (C), Jen (Ca)
  Mid (2pm-6pm):   Sarah (S), Tom (S), Mike (C), Jen (Ca)
  Close (6pm-11pm): Tom (S), Lisa (S), Dave (C), Raj (C), Amy (Ca)

TUESDAY MAR 11
  Open (8am-2pm):  Lisa (S), Dave (C), Amy (Ca)
  ...

LABOR SUMMARY
  Total Hours Scheduled:  432 / 435 (99.3% utilization)
  Total Labor Cost:       $7,776 / $7,840 (99.2% of budget)
  Labor Cost %:           27.8%
  Avg Hourly Rate:        $18.00/hr
```

**Highlight any issues:**
> ⚠️ **Warning:** Monday close is overstaffed by 1 server. Consider moving Tom to Tuesday open to reduce overtime risk.
> ⚠️ **Warning:** Friday projection is conservative. If sales exceed $4,200, you'll need to add a 3rd cook.

### Step 5 — Handle Time-Off & Shift Swaps

When a staff member requests time off or wants to swap:

1. Check if coverage minimums are still met after approval
2. Identify eligible replacements (same role, available that day, under their max hours)
3. Check overtime implications
4. Confirm with manager before finalizing

**Example:**
> "Sarah requested Saturday off. She's currently scheduled for the close shift. Available replacements: Tom (already at 35 hrs — would trigger overtime), Lisa (at 28 hrs, available). Recommend swapping Lisa into Saturday close and moving Sarah to Tuesday mid if she's available."

### Step 6 — Compliance Check

Before finalizing, scan for labor law violations:

- **Overtime:** Any employee exceeding 40 hrs/week? (or state-specific threshold)
- **Meal breaks:** Required breaks for shifts exceeding 5-6 hours (varies by state)
- **Minors:** Restricted hours, mandatory breaks, prohibited tasks
- **Clopening:** Shift ending after 10pm and starting before 6am next day (some states restrict this)
- **Consecutive days:** Maximum days worked without a day off (some jurisdictions)

> ✅ **Compliance check passed.** No overtime, all meal breaks accounted for, no minor scheduling issues.

### Step 7 — Publish & Notify

- Generate the final schedule in a shareable format (text, CSV, or calendar links)
- Summarize changes from the prior week
- Provide a cost vs. budget comparison

> "The schedule is ready. Would you like me to share it with the team? I can highlight any changes from last week so staff can quickly spot what's different."

---

## Trigger Phrases

| Phrase | What Happens |
|--------|-------------|
| "Build next week's schedule" | Full workflow: gather data → calculate budget → build → check → publish |
| "I need a schedule for [date range]" | Builds schedule for a specific period |
| "Check my labor cost" | Analyzes current schedule against labor budget |
| "[Name] needs time off on [date]" | Processes time-off request and finds coverage |
| "Swap [name1] and [name2] on [date]" | Validates and executes a shift swap |
| "Am I overstaffed tomorrow?" | Compares scheduled hours vs projected demand for next day |
| "Show me overtime risks" | Flags any employees approaching overtime thresholds |

---

## Key Instructions Summary

1. **Gather inputs:** Staff roster, availability, sales forecast, labor target %, coverage requirements
2. **Calculate budget:** Convert sales forecast and labor % into available hours × dollars
3. **Build coverage grid:** Map day-part demand to required headcount by role
4. **Assign staff:** Match availability + role + rate optimization + fairness heuristics
5. **Review & flag:** Over/under-staffing, overtime, compliance issues
6. **Handle exceptions:** Time-off, swaps, sick calls with replacement logic
7. **Publish:** Output clean schedule with labor summary and variance analysis

---

## Common Mistakes

1. **Scheduling to habit, not demand.** "We've always had 3 servers on Tuesday" — but Tuesday sales are half of Friday's. Match coverage to actual traffic.
2. **Ignoring labor budget.** A great schedule that blows the budget is not a great schedule. Track labor % daily.
3. **Uneven shift distribution.** Same staff always get closing shifts or weekend work leads to turnover. Use a fairness score.
4. **Not accounting for side work.** Opening/closing duties, prep, and cleanup need bodies too. Factor these into coverage.
5. **Manual schedule drift.** By week 8 of a season, schedules drift from original plan. Re-baseline monthly.

---

*"A great schedule makes the business run right and the team feel right. Get both."*

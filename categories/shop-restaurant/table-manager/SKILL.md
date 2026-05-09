---
name: table-manager
description: >-
  Optimize table turns, manage reservations, and reduce wait times to maximize
  revenue per seat. Handles booking intake, table assignment strategy, waitlist
  management, and provides actionable insights for seating efficiency.
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: shop-restaurant
  tags:
    - reservations
    - table-management
    - seating
    - waitlist
    - restaurant-operations
    - capacity-optimization
---

# Table Manager

## Core Principles

For a restaurant, **every empty seat is revenue walking out the door.** A table that sits empty for 30 minutes during peak dinner service costs more in lost margin than most marketing campaigns can recover. Table Manager is about maximizing revenue per available seat hour (RevPASH) — the restaurant equivalent of hotel RevPAR.

### The Four Levers of Table Revenue

1. **Turn Time** — How long a table is occupied per party. Faster turns = more covers = more revenue.
2. **Table Mix** — Ratio of 2-tops, 4-tops, 6-tops. Wrong mix for your party sizes = wasted seats.
3. **Booking Yield** — How well you fill the reservations book. Gaps = lost revenue.
4. **Waitlist Management** — How you handle walk-ins during peak times. A well-managed waitlist keeps people from walking out.

---

## Skill Workflow

### Step 1 — Audit Current Table Configuration

Ask the user for:

- **Floor plan:** Number of tables by size (2-top, 4-top, 6-top, etc.)
- **Total seats** and **seatable capacity** (adjust for social distancing if needed)
- **Average turn time** per meal period (breakfast, lunch, dinner)
- **Reservation system** (OpenTable, Resy, SevenRooms, or manual)
- **Party size distribution** (average % of 2s, 4s, 6s, etc.)

**If they don't know average turn times:**
> "Let me calculate. What time was the first party seated at each table, and what time did the last party leave? I'll compute actual turn times from your service logs."

### Step 2 — Calculate RevPASH Metrics

```
Revenue Per Available Seat Hour (RevPASH) = Total Revenue ÷ (Total Seats × Hours Open)

Seat Utilization % = Actual Covers ÷ (Total Seats × Turns Possible)

Theoretical Max Revenue = Seats × Hours × Max Turns × Avg Check

Revenue Gap = Theoretical Max − Actual Revenue
```

**Example:**
> "Your restaurant has 40 seats open for 5 dinner hours. With 90-minute average turns and $45 avg check, your theoretical max is 133 covers / $5,985. Actual was 98 covers / $4,410. Gap: $1,575 in unrealized revenue. Every 10-minute reduction in turn time recovers $350/night."

### Step 3 — Reservation Optimization

**Booking intake rules:**
- Accept reservations with party size + timing that fits the table mix
- Stagger bookings to avoid "the rush" — space reservation times by at least 1.5× the average turn time
- For parties of 5+, require a credit card to reduce no-shows
- Set aside 20-30% of capacity for walk-ins (varies by concept)

**No-show management:**
> "Your no-show rate is 12% this month. At $45 avg check per cover, that's $540 in lost revenue per 100 reservations. Consider: (1) SMS reminders 4 hours before, (2) credit card on file for 5+ parties, (3) waitlist priority for no-shows' next booking."

### Step 4 — Dynamic Table Assignment

When seating a party, recommend optimal table:

| Party Size | Best Fit | Why |
|-----------|----------|-----|
| 2 ppl | 2-top (not 4-top) | A 2-top at a 4-top wastes 2 seats per turn |
| 3 ppl | 4-top, pushed to one side | Leaves room for a 2-top on the other half if possible |
| 4 ppl | 4-top | Perfect fit |
| 5-6 ppl | 6-top or push two 4-tops | Don't use a 6-top for a 4-top — always match party to table size |
| 7+ ppl | Multiple tables or private area | Requires coordination with kitchen timing |

**Smart seating rules:**
- Seat similar-sized parties in the same section (server efficiency)
- Seat large parties early in the shift (they turn slower)
- Seat 2-tops near the window/bar (faster turns, better experience)
- Avoid seating two large parties at the same time in the same section (kitchen bottleneck)

### Step 5 — Waitlist & Flow Management

When the restaurant is at capacity:

1. **Provide accurate wait estimates:** "Based on 6 parties ahead of you, average 4-top turn time of 75 minutes, and 3 tables currently at check-present stage — estimated wait is 20-25 minutes."
2. **Send waitlist notifications:** Offer to text/SMS when table is ready
3. **Pre-seat the wait:** Offer bar seating, a drink menu, or appetizer specials for waiting guests
4. **Queue priority:** Smaller parties (2-tops) turn faster — seat them ahead of large parties if they arrived later

**Waitlist dashboard:**
```
🪑 WAITLIST STATUS — Friday 7:15pm
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tables Available: 0 (all 12 tables seated)
Expected Free: 2 tables in ~15 min (check-present stage)

WAITING: 7 parties (estimated 25 min avg wait)
  1. Smith (2) — waiting 12 min — will get next free 2-top
  2. Jones (4) — waiting 8 min
  3. Patel (6) — waiting 5 min — waiting for 6-top
  4. Lee (2) — just arrived
  ...

🔄 TABLE TRACKER
  Table 3 (2-top): Check presented — clearing in ~3 min
  Table 7 (4-top): Entrees served — ~25 min remaining
  Table 12 (6-top): Just seated — ~75 min remaining
```

### Step 6 — Table Mix Recommendations

Analyze party size distribution vs. table configuration:

> "Your party data shows 45% are 2-tops, but only 25% of your tables are 2-tops. You're seating 2-tops at 4-tops 40% of the time, wasting 2 seats per turn. Converting two 4-tops into 2-tops would recover an estimated 8-12 additional covers per evening — worth ~$450/night or ~$14,000/month."

### Step 7 — Service Recovery

When things go wrong (long wait, table mix-up):

- Comp the "pain point" (a drink, dessert, or appetizer) — costs $3-8, saves the $45 check and the future visits
- Log the issue for the post-shift recap
- Follow up with a handwritten note or small gift card for next visit

---

## Trigger Phrases

| Phrase | What Happens |
|--------|-------------|
| "How's the floor looking?" | Shows current table status and waitlist snapshot |
| "We have a [size] party walking in" | Recommends best table assignment |
| "What's the wait time?" | Calculates estimated wait based on table turns ahead |
| "Optimize my table layout" | Analyzes table mix vs. party size data, recommends reconfiguration |
| "How many covers can we do tonight?" | Calculates capacity based on reservations + walk-in allocation |
| "Track my turn times" | Monitors and reports average turn time by meal period |
| "Analyze my no-show rate" | Reports no-show % and recommends prevention strategies |
| "Add [name/party] to the waitlist" | Logs party, provides quote, manages queue position |

---

## Key Instructions Summary

1. **Audit floor plan & turn times:** Map table sizes, count seats, measure actual turn times
2. **Calculate RevPASH:** Revenue per available seat hour — identify the revenue gap
3. **Optimize reservations:** Stagger bookings, set aside walk-in capacity, manage no-shows
4. **Assign smartly:** Match party size to table size, optimize server sections
5. **Manage waitlist:** Track queue, provide accurate estimates, pre-seat when possible
6. **Analyze mix:** Recommend table configuration changes based on party size data
7. **Recover service:** Quick compensation + logging for operational improvement

---

## Common Mistakes

1. **Seating 2-tops at 4-tops.** It's the #1 seat-waste in restaurants. Protect your 4-tops for parties of 3-4.
2. **No-show apathy.** "It's just part of the business" — 10% no-show rate on a Saturday costs $500+. Do something about it.
3. **Ignoring turn time creep.** Turn times that drift from 75 min to 90 min over a month = 20% fewer covers. Watch it weekly.
4. **Flat table mix.** If your average party size is 2.5 but your smallest table is a 4-top, you're losing money. Add more 2-tops.
5. **Not managing the waitlist.** People who wait without updates feel forgotten. Text them. Seat them at the bar. Turn the wait into an experience.

---

*"Your tables are your most valuable real estate. Every empty seat has a cost."*

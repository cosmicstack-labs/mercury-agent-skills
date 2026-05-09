---
name: inventory-optimizer
description: >-
  Intelligently manage stock levels, generate supplier orders, and prevent
  shortages or overstock. Tracks usage patterns, lead times, and par levels
  to keep the shop or restaurant running without waste.
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: shop-restaurant
  tags:
    - inventory
    - ordering
    - suppliers
    - stock-management
    - wastage-reduction
    - restaurant-operations
---

# Inventory Optimizer

## Core Principles

Inventory is cash sitting on shelves. Too much ties up capital and spoils. Too little loses sales and frustrates customers. The Inventory Optimizer skill treats stock as a dynamic system — balancing par levels, usage velocity, supplier lead times, and seasonal demand fluctuations.

### The Five Pillars of Smart Inventory

1. **Know your par levels.** Every item has a minimum quantity you should never dip below. Set pars based on historic usage and reorder lead time.
2. **Track usage velocity.** Fast-movers need frequent reordering. Slow-movers need scrutiny. Group items by turnover rate (A = high, B = medium, C = low).
3. **Account for lead time variance.** A supplier who delivers in 2 days on paper often takes 5. Build buffer based on actual delivery history.
4. **Seasonal forecasting.** Demand shifts with holidays, weather, and local events. Adjust pars proactively, not reactively.
5. **First-expiry-first-out (FEFO).** Rotate stock religiously. The oldest inventory moves first. Nothing wrecks margins like spoilage.

---

## Skill Workflow

### Step 1 — Audit Current Inventory

Gather the current state by asking the user or pulling from their POS/ERP system. Collect:

- Current stock quantities for each item
- Unit of measurement (kg, cases, bottles, units)
- Storage location (dry, cold, frozen)
- Expiry dates (for perishables)
- Last 30/60/90 days of usage data
- Current supplier and price per unit

**Prompt the user for:**
> "Let's start with your inventory snapshot. Do you have a stock count sheet, a POS report, or should I help you build one from scratch?"

### Step 2 — Calculate Par Levels & Reorder Points

For each item, calculate:

```
Reorder Point = (Average Daily Usage × Lead Time in Days) + Safety Stock
Safety Stock = Average Daily Usage × Lead Time Variance Buffer
Par Level = Reorder Point + (Average Daily Usage × Order Cycle Days)
```

**Example calculation for a busy café:**
- Espresso beans: 3kg/day usage, 4-day lead time, 2-day variance buffer
- Reorder Point = (3 × 4) + (3 × 2) = 18kg
- Order cycle: weekly (7 days)
- Par Level = 18 + (3 × 7) = 39kg
- If current stock = 12kg → **trigger order for 27kg** (Par − Current)

### Step 3 — Classify Items (ABC Analysis)

| Class | % of Items | % of Cost | Strategy |
|-------|-----------|-----------|----------|
| **A** | 10-20% | 70-80% | Daily tracking, tight pars, frequent small orders |
| **B** | 20-30% | 15-20% | Weekly review, standard pars |
| **C** | 50-70% | 5-10% | Monthly review, bulk order, low scrutiny |

**Action:** Generate the ABC classification table and recommend ordering frequency by class.

### Step 4 — Identify Slow-Movers & Waste

Cross-reference usage data with expiry dates. Flag items where:
- Usage rate < 1 unit per week (slow-mover — consider delisting)
- > 20% of stock expires within 7 days (waste risk — promote or discount)
- Usage dropped > 30% vs. prior period (demand shift — reduce order)

**Recommend actions:**
- **Promote:** Feature on specials board, bundle with fast-movers
- **Reduce:** Cut order quantity by 50% for next cycle
- **Delist:** Stop ordering and sell through remaining stock

### Step 5 — Generate Purchase Order

Compile all items at or below reorder point into a structured PO:

| Item | Current Stock | Par Level | Order Qty | Supplier | Unit Price | Total |
|------|-------------|-----------|-----------|----------|-----------|-------|
| Espresso Beans | 12kg | 39kg | 27kg | Bean Co. | $14/kg | $378 |
| Milk (2%) | 8 gal | 22 gal | 14 gal | Dairy Fresh | $3.50/gal | $49 |

**Total order value:** $427

**Ask the user:**
> "Here's your draft order. I've calculated quantities based on par levels and current usage. Would you like to adjust any items before I finalize?"

### Step 6 — Schedule Recurring Reviews

Set reminders based on item class:
- **A items:** Review daily or every other day
- **B items:** Weekly review
- **C items:** Monthly review

**Offer to schedule:**
> "I can set up a daily stock check reminder for your A-items and a weekly full inventory review. Would you like me to schedule that?"

---

## Trigger Phrases

| Phrase | What Happens |
|--------|-------------|
| "Check my inventory levels" | Runs full inventory audit against pars |
| "What should I reorder?" | Generates purchase order for items below reorder point |
| "I'm running low on [item]" | Checks current stock vs par for that item, recommends order qty |
| "Show me slow-moving items" | Runs ABC analysis, highlights C-items and waste risks |
| "Do an inventory review" | Full workflow: audit → classify → flag risks → generate PO |
| "Set par levels for [category]" | Guides user through setting pars for a specific category |

---

## Key Instructions Summary

1. **Audit:** Get current quantities, usage data, and supplier info
2. **Calculate:** Apply reorder point and par level formulas
3. **Classify:** ABC analysis to prioritize attention
4. **Flag:** Identify slow-movers, waste risk, and demand shifts
5. **Generate:** Produce a formatted purchase order with totals
6. **Schedule:** Set recurring review reminders by item class
7. **Iterate:** After each order cycle, compare projected vs actual usage and adjust pars

---

## Common Mistakes

1. **Ordering on intuition.** "It feels like we're low" leads to overstock or shortages. Always use data.
2. **Ignoring lead time variance.** A supplier who's late 20% of the time needs a bigger buffer.
3. **One-size-fits-all pars.** A café uses more milk in summer (iced drinks). Adjust pars seasonally.
4. **Not tracking waste.** If you don't measure what's thrown away, you can't fix it.
5. **Skipping the ABC analysis.** Spending equal time on napkins and prime rib is inefficient.

---

*"Inventory is money sitting on shelves — make every dollar work."*

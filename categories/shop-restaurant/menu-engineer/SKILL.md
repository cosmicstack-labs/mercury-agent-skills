---
name: menu-engineer
description: >-
  Optimize menu pricing, placement, and item mix to maximize profitability.
  Uses menu engineering frameworks to analyze item performance by popularity
  and margin, then recommends pricing tweaks, repositioning, and removals.
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: shop-restaurant
  tags:
    - menu-engineering
    - pricing
    - profitability
    - restaurant-margins
    - upselling
    - food-cost
---

# Menu Engineer

## Core Principles

Your menu is your most powerful sales tool. Every item on it either makes you money or costs you money. Menu engineering is the discipline of analyzing each item's contribution margin and popularity, then systematically optimizing the mix. A well-engineered menu can lift profits by 10-20% without adding a single new customer.

### The Four Menu Categories

Using the classic Boston Consulting Group matrix adapted for restaurants:

| Quadrant | Popularity | Margin | Strategy |
|----------|-----------|--------|----------|
| **Star** ⭐ | High | High | Protect, feature prominently |
| **Plow Horse** 🐴 | High | Low | Raise price or reduce portion cost |
| **Puzzle** 🧩 | Low | High | Reposition, rename, or reprice |
| **Dog** 🐕 | Low | Low | Remove or bundle with Stars |

### Key Metrics

- **Item Contribution Margin** = Menu Price − Plate Cost (ingredients + packaging)
- **Popularity Index** = Item Sales ÷ Total Covers × 100
- **Menu Mix Percentage** = Item Sales ÷ Total Items Sold × 100
- **Target Food Cost %** = Ideal range 25-35% depending on concept

---

## Skill Workflow

### Step 1 — Gather Sales & Cost Data

Ask the user for:
- Sales data: last 4-12 weeks of item-level quantities sold
- Plate cost: cost of ingredients per item (including waste %)
- Menu price: current selling price per item
- Category grouping: appetizers, mains, desserts, beverages, etc.

**If the user doesn't have plate costs:**
> "Let me help you calculate them. For each item, list the ingredients and quantities. I'll compute the per-plate cost."

### Step 2 — Build the Menu Engineering Matrix

For each item, calculate:

```
Contribution Margin = Menu Price − Plate Cost
Popularity = Item Units Sold ÷ Total Covers
```

Classify every item into the 4-quadrant grid:

**Example output:**

| Item | Price | Plate Cost | Margin | Sold | Pop.% | Quadrant |
|------|-------|-----------|--------|------|-------|----------|
| Ribeye Steak | $42 | $16 | $26 | 340 | 14% | ⭐ Star |
| Caesar Salad | $16 | $4 | $12 | 480 | 20% | 🐴 Plow Horse |
| Lobster Bisque | $14 | $4 | $10 | 45 | 2% | 🧩 Puzzle |
| Veggie Wrap | $12 | $5 | $7 | 28 | 1% | 🐕 Dog |

### Step 3 — Strategic Recommendations by Quadrant

**Stars ⭐ (High Popularity, High Margin)**
- Place in the "golden triangle" — top-right of the menu (where eyes land first)
- Feature with a box, photo, or bold text
- Never discount — these are your profit engines
- Ensure consistency — train kitchen to execute perfectly every time

**Plow Horses 🐴 (High Popularity, Low Margin)**
- Option A: **Raise price by 5-10%.** Popular items have price elasticity — most customers won't notice a $1-$2 increase.
- Option B: **Reduce plate cost.** Renegotiate with supplier, swap expensive ingredient, shrink portion by 10%.
- Option C: **Bundle as a loss leader.** Pair with a high-margin drink or side to lift overall check average.

**Puzzles 🧩 (Low Popularity, High Margin)**
- **Reposition:** Rename the dish with more enticing language. "Pan-seared Atlantic Salmon" → "Honey-Glazed Cedar-Plank Salmon"
- **Reprice:** A lower price may unlock demand. Test 10-15% reduction.
- **Replate:** Improve visual presentation. Photos sell 30% more.
- **Server training:** Train staff to recommend Puzzles verbally.

**Dogs 🐕 (Low Popularity, Low Margin)**
- **Remove:** Every Dog costs you shelf space, kitchen time, and inventory complexity.
- **Bundle with Stars:** "Add a Veggie Wrap for $5" as a upsell to a Star item.
- **Special it:** Run as a limited-time special with a lower-cost recipe. If it still underperforms, delist.

### Step 4 — Price Optimization Analysis

Run sensitivity analysis on candidate items for price changes:

```
Current Revenue = Current Price × Current Quantity Sold
Projected Revenue = New Price × (Current Quantity × (1 − Elasticity Factor))
```

**Elasticity guide for restaurants:**
- Staple items (coffee, fries): Low elasticity — can raise price 5-10% with < 2% drop in sales
- Premium items (steak, seafood): Low elasticity — loyal customers pay more
- Convenience items (sides, add-ons): Higher elasticity — keep affordable
- New/unfamiliar items: High elasticity — price conservatively until established

**Output a pricing recommendation table:**

| Item | Current Price | Recommended Price | Change | Projected Impact |
|------|--------------|------------------|--------|-----------------|
| Caesar Salad | $16 | $17 | +$1 | +$480/week |
| Latte | $4.50 | $5.00 | +$0.50 | +$175/week |
| Veggie Wrap | $12 | $10 | −$2 | Test — may increase volume |

### Step 5 — Menu Layout Recommendations

Based on eye-tracking research, guide the user on:

- **The Golden Triangle:** Customers' eyes hit the center first, then top-right, then top-left. Place highest-margin items here.
- **The Sweet Spot:** Items in the top-right quadrant of a single page sell 30% more than same item placed bottom-left.
- **Avoid $ signs:** Remove dollar signs and currency symbols — they trigger pain responses.
- **Remove dots (......):** Leader dots guide eyes to price, increasing price sensitivity. Use white space instead.
- **Limit choices:** 5-7 items per category. Too many choices reduce order size (Hick's Law).
- **Decoy pricing:** $18 | $24 | $32 — the middle option feels "safe" and gets picked most. Engineer toward your highest-margin item.

### Step 6 — Ongoing Menu Review Cadence

> "Let's schedule a monthly menu engineering review. I'll analyze your latest sales data and update recommendations. Would you like me to set that up as a recurring task?"

---

## Trigger Phrases

| Phrase | What Happens |
|--------|-------------|
| "Review my menu" | Full menu engineering analysis with quadrants and recommendations |
| "What should I change on my menu?" | Identifies top opportunities: price changes, item removals, repositioning |
| "Analyze my food costs" | Calculates plate costs and food cost % for each item |
| "How should I price [item]?" | Recommends price based on cost, competition, and elasticity |
| "Which items aren't selling?" | Highlights Puzzles and Dogs for action |
| "Optimize my menu layout" | Provides layout and placement recommendations |
| "Run a menu profitability report" | Generates full matrix with contribution margins |

---

## Key Instructions Summary

1. **Gather data:** Item sales, plate costs, current prices, category groupings
2. **Build matrix:** Classify items as Star, Plow Horse, Puzzle, or Dog
3. **Recommend action:** Price changes, repositioning, removal, or bundling per quadrant
4. **Optimize pricing:** Elasticity-informed price adjustments with projected impact
5. **Layout advice:** Golden triangle placement, decoy pricing, choice limitation
6. **Review cadence:** Schedule monthly reviews with clear KPIs (food cost %, avg check, item mix)

---

## Common Mistakes

1. **Not knowing plate costs.** You can't engineer what you can't measure. Calculate every item.
2. **Discounting Stars.** Your most profitable items don't need price cuts. Feature them.
3. **Ignoring menu layout.** The same item performs differently in different positions. Use the golden triangle.
4. **Too many choices.** A 100-item menu overwhelms customers and increases kitchen errors. Edit ruthlessly.
5. **Price anchoring on cost alone.** Pricing should reflect value, not just cost. A $40 steak costs $12 to make — the rest is skill, ambiance, and experience.
6. **Never testing.** Small changes (a renamed dish, a $1 price bump) can yield outsized results. Test and measure.

---

*"Your menu is a profit engine, not a grocery list. Engineer it."*

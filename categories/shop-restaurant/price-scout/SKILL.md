---
name: price-scout
description: >-
  Track and compare supplier prices across multiple vendors to reduce COGS.
  Monitors price changes, identifies savings opportunities, calculates
  total cost of ownership (including delivery fees and minimums), and
  generates renegotiation briefs.
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: shop-restaurant
  tags:
    - procurement
    - supplier-management
    - price-comparison
    - cost-reduction
    - vendor-analysis
    - purchasing
---

# Price Scout

## Core Principles

For most shops and restaurants, COGS (cost of goods sold) is the single largest expense — often 30-40% of revenue. A 5% reduction in food or product cost drops straight to the bottom line, often doubling net profit. Price Scout systematically tracks supplier pricing so you never overpay for an ingredient or product.

### The Five Rules of Smart Procurement

1. **Never single-source.** Every item should have at least 2 qualified suppliers. Competition drives prices down.
2. **Total cost, not unit price.** A cheaper case that incurs $15 shipping and requires $200 minimum order may cost more in reality.
3. **Price isn't the only variable.** Reliability, delivery windows, payment terms, and quality consistency all matter. Score suppliers holistically.
4. **Renegotiate quarterly.** Suppliers expect to be asked. If you haven't negotiated in 6 months, you're overpaying.
5. **Monitor trends.** When beef prices rise industry-wide, no supplier can beat the market — but they can give you better forward pricing or substitution options.

---

## Skill Workflow

### Step 1 — Build the Supplier & Price Database

Ask the user to list their key suppliers and items:

| Supplier | Item | Unit | Current Price | Last Price | Date Last Ordered | Min Order | Delivery Fee |
|----------|------|------|--------------|------------|-------------------|-----------|-------------|
| Sysco | Chicken Breast (40lb) | Case | $98.50 | $94.20 | Mar 5, 2025 | $250 | $15 |
| US Foods | Chicken Breast (40lb) | Case | $96.00 | $96.00 | Feb 20, 2025 | $300 | Free over $500 |
| Local Farm Co. | Chicken Breast (40lb) | Case | $105.00 | $105.00 | Jan 15, 2025 | $100 | $10 |

**For each item, calculate:**
- **Price trend:** Is this item up, down, or flat vs. last order?
- **Savings opportunity:** Lowest price vs. current supplier
- **Total cost comparison:** Unit price + allocated delivery fee + value of payment terms

### Step 2 — Run Price Comparison by Item

For every item sourced from multiple suppliers, generate a comparison:

```
📊 PRICE COMPARISON — Chicken Breast (40lb case)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Supplier          | Price   | Delivery | Min Order | Effective Cost* | Rating
  ──────────────────|─────────|──────────|───────────|─────────────────|───────
  US Foods          | $96.00  | Free**   | $300      | $96.00          | ⭐ Best
  Sysco             | $98.50  | $15      | $250      | $104.72†        |
  Local Farm Co.    | $105.00 | $10      | $100      | $110.00‡        |

  *Effective cost includes allocated delivery fee based on average order size
  **Free over $500 — your average US Foods order is $680, so effectively free
  † Based on avg order of 3 cases = $98.50 + ($15 ÷ 3) = $103.50
  ‡ Based on avg order of 2 cases = $105 + ($10 ÷ 2) = $110.00

  💰 **Savings opportunity: $2.50/case** by switching from Sysco to US Foods
  📈 **Price trend:** Chicken breast up 4.6% industry-wide since Jan
  🔮 **Forecast:** Expected to rise another 2-3% next quarter — consider forward buying
```

### Step 3 — Identify Substitution Opportunities

When prices spike on a key item, suggest alternatives:

> "Ribeye is up 18% this month. Consider these substitutions:
> - **Flat iron steak** — similar tenderness, 35% cheaper ($12.50/lb vs $19.20/lb)
> - **Tri-tip** — excellent for grilling, 28% cheaper
> - **Grass-fed sirloin** — different flavor profile, but 15% cheaper and on-trend
>
> Would you like me to draft a specials menu featuring one of these alternatives?"

### Step 4 — Generate Renegotiation Briefs

When prices have drifted or the user hasn't negotiated recently:

> **📋 Renegotiation Brief: Sysco**
>
> Your current spend with Sysco: ~$2,400/month
> Items where you're over market:
> - Chicken Breast: $98.50 vs US Foods $96.00 (2.6% above market)
> - Cooking Oil: $42.00 vs Restaurant Depot $38.50 (9.1% above market)
> - Paper Goods: $38.50 vs multiple suppliers $34.00 (13.2% above market)
>
> **Suggested talking points:**
> 1. "I've been a loyal customer for 2 years, spending ~$29k/year"
> 2. "US Foods is offering chicken breast at $96.00 and paper goods at $34.00"
> 3. "Can you match these three items — if so, I'll consolidate all my ordering with you"
>
> **Target savings:** $175/month | **Annual impact:** $2,100

### Step 5 — Track Contract Renewals & Terms

Alert the user to upcoming contract milestones:

> ⏰ **Reminder:** Your produce supplier contract renews in 30 days. Current terms: Net 30, 2% early payment discount. Industry standard has shifted to Net 45. Ask for extended terms or a volume discount.

### Step 6 — Bulk Buying Analysis

When the user is considering buying in bulk or frozen vs. fresh:

> **Bulk vs. Regular Analysis: Tomato Sauce**
>
> | Option | Unit Cost | Shelf Life | Storage Need | Effective Cost |
> |--------|-----------|-----------|-------------|---------------|
> | #10 can (6-pack) | $4.20/can | 18 months | Dry shelf | $4.20 |
> | 1 gallon pouch (6-pack) | $3.85/pouch | 12 months | Dry shelf | $3.85 |
> | 5 gallon bag-in-box | $3.10/gallon | 6 months | Cool, dry | $3.10 |
>
> **Recommendation:** The 5-gallon bag-in-box is 26% cheaper but requires cool storage. Do you have space in the back dry storage area? If yes, switch to save ~$28/month.

---

## Trigger Phrases

| Phrase | What Happens |
|--------|-------------|
| "Compare prices for [item]" | Shows side-by-side supplier comparison for that item |
| "Find me a better deal on [item]" | Searches for alternative suppliers or substitutions |
| "Review my suppliers" | Full supplier audit — price comparison + renegotiation briefs |
| "What's my biggest cost savings opportunity?" | Identifies the single item with the largest savings potential |
| "Negotiation prep for [supplier]" | Generates a renegotiation brief with talking points |
| "Track [item] price trends" | Shows price history and forecast for that item |
| "Should I buy [item] in bulk?" | Runs bulk vs. regular cost analysis |
| "Any supplier contracts expiring soon?" | Lists upcoming contract renewals and term review |

---

## Key Instructions Summary

1. **Build price database:** Log all suppliers, items, current prices, delivery fees, minimums
2. **Run comparisons:** Per-item side-by-side with effective total cost (not just unit price)
3. **Identify savings:** Highlight items where you're paying above market
4. **Suggest substitutions:** Price-spike alternatives with margin impact analysis
5. **Generate briefs:** Renegotiation talking points with competitive intelligence
6. **Track contracts:** Renewal and term-change reminders
7. **Analyze bulk buys:** Total-cost-of-ownership for bulk purchasing decisions

---

## Common Mistakes

1. **Only looking at unit price.** A cheaper case with $25 delivery and $300 minimum can cost more than a slightly higher-priced supplier with free delivery.
2. **Not tracking prices over time.** "Have prices gone up?" — without data, you can't answer. Log every order.
3. **Loyalty without leverage.** Being loyal to a supplier is fine, but you need competitive quotes to negotiate effectively.
4. **Ignoring substitution.** Menu changes are hard, but a 20% cost difference warrants a serious look at alternatives.
5. **Procrastinating on negotiations.** "I'll ask next month" — meanwhile you've overpaid by hundreds. Set quarterly renegotiation reminders.

---

*"Every dollar saved in procurement is a dollar of pure profit."*

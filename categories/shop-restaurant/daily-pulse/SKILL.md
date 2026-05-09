---
name: daily-pulse
description: >-
  Generate a daily business snapshot — sales, labor cost, COGS, covers,
  and P&L flash report — so the owner knows exactly where the business
  stands every morning. Flags anomalies before they become problems.
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: shop-restaurant
  tags:
    - daily-reporting
    - p-and-l
    - sales-tracking
    - kpi-dashboard
    - financials
    - restaurant-metrics
    - business-intelligence
---

# Daily Pulse

## Core Principles

The difference between a thriving shop and a failing one is often simply **knowing the numbers daily.** Most small business owners fly blind until the monthly P&L arrives 3 weeks after month-end — too late to fix anything. The Daily Pulse skill compresses the P&L cycle to 24 hours, giving the owner a crystal-clear morning snapshot of yesterday's performance.

### The Five Daily Numbers That Matter

1. **Total Sales** — Yesterday's revenue vs. target vs. same day last year
2. **Covers / Transactions** — How many customers (for restaurants) or transactions (for retail)
3. **Average Check / Ticket** — Revenue ÷ covers. Trending up or down?
4. **Labor Cost %** — Total labor ÷ sales. Warning if > budget.
5. **COGS %** — Cost of goods sold ÷ sales (restaurants) or COGS as % of sales (retail)

---

## Skill Workflow

### Step 1 — Connect Data Sources

Typical data sources (ask user which they use):

- **POS System:** Square, Toast, Clover, Lightspeed, Shopify
- **Payroll System:** Gusto, ADP, or manual hours
- **Inventory System:** Current stock counts, received orders
- **Bank Account:** For actual COGS (invoiced amounts)

**If no system integration is available:**
> "No problem. I can build your daily report from a simple template. Each evening, answer 5 quick questions and I'll generate your pulse report. Let me set that up."

### Step 2 — Build the Daily Flash Report

Generate a structured daily summary:

```
📊 DAILY PULSE — Tuesday, March 11, 2025
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 SALES
  Yesterday:          $3,840
  Target:             $4,000        (96% of target)
  Same Day Last Week: $3,620        (+6.1% vs. last week)
  Same Day Last Year: $3,150        (+21.9% vs. last year)

👥 CUSTOMERS
  Covers/Transactions:  172
  Avg Check:            $22.33       (vs. $21.05 last week — +6.1%)
  Peak Hour:            7:00-8:00pm (38 covers)

👷 LABOR
  Hours Scheduled:    84 hrs
  Hours Worked:       82 hrs
  Labor Cost:         $1,476
  Labor %:            38.4%         (Budget: 35%) ⚠️ ABOVE TARGET
  Overtime Used:      2 hrs ($54)

🥩 COGS (estimates)
  Today's COGS:       $1,152        (30% of sales)
  MTD COGS %:         30.5%         (Target: 28-32%) ✅ ON TRACK

📈 MTD PERFORMANCE
  Month-to-Date Sales:    $42,560
  MTD Target:             $44,000   (96.7% of target)
  MTD Labor %:            36.2%     (Target: 35%) ⚠️ Slightly over
  MTD COGS %:             30.5%     ✅ On target
  Projected Monthly:      $127,680  (if current pace holds)
```

### Step 3 — Flag Anomalies & Alerts

Compare each metric against thresholds and flag variances:

| Alert Level | Condition | Example |
|-------------|-----------|---------|
| 🔴 **Critical** | Sales < 80% target OR Labor % > 45% | "Sales dropped 30% vs last Tuesday — check for nearby event or competitor opening" |
| 🟠 **Warning** | Sales 80-90% target OR Labor % 40-45% OR COGS > 35% | "Labor % at 38.4%. You're $94 over budget for the day" |
| 🟢 **Good** | All metrics within target range | "Solid day. Avg check ticked up — menu engineering is working" |
| ⭐ **Notable** | Any metric significantly positive | "Saturday smashed target by 24% — best day this quarter. Well done!" |

**Generate specific, actionable alerts:**

> ⚠️ **Labor Alert:** Labor % at 38.4% vs. 35% target. You scheduled 84 hours but used 2 hours overtime. Consider splitting the close shift earlier to reduce OT.

> 📉 **Sales Alert:** Tuesday sales were 96% of target — close but missing pattern. Wednesdays have averaged 92% of target for 3 weeks. Consider a Wednesday special to lift midweek traffic.

### Step 4 — Rolling Week & Month Trends

Provide trend context:

```
📈 7-DAY TREND
  Sales:     ↑↑ (up 8% vs prior 7 days)
  Covers:    ↑  (up 3%)
  Avg Check: ↑↑ (up 5% — menu price increase flowing through)
  Labor %:   →  (flat at 36.5%)
  COGS %:    ↓  (down 1.5% — portion control improving)

📊 MONTH-TO-DATE vs. BUDGET
  Total Sales:   $42,560 / $44,000 (97%)
  Total Labor:   $15,407 / $15,400 (~100%)
  Total COGS:    $12,981 / $13,200 (98%)
  Net Margin:    21.3% (estimated) vs. 22% target
```

### Step 5 — Action Recommendations

Close the report with 1-3 action items for the day:

> **Today's action items:**
> 1. 🔴 Review Friday's overtime. Two employees exceeded 40 hrs — consider midweek day off for them.
> 2. 🟠 Wednesday lunch covers have dropped for 3 weeks. Test a $9.99 lunch special.
> 3. 🟢 Keep doing what you're doing with the new menu pricing — avg check is up 5%.

### Step 6 — Schedule Daily Delivery

> "I can deliver this report to you every morning by 8am. Would you like it as a summary here, or shall I send it to your email/phone? Also, I can include a simple 5-question evening prompt so you can log the data if your systems don't auto-connect."

---

## Trigger Phrases

| Phrase | What Happens |
|--------|-------------|
| "How did we do yesterday?" | Generates the daily pulse report |
| "Give me today's numbers" | Same — daily summary snapshot |
| "Run the daily report" | Full flash report with all KPIs |
| "Any red flags?" | Shows only alerts and anomalies |
| "How's my month looking?" | MTD performance vs. budget projection |
| "Compare this week to last week" | 7-day trend analysis |
| "What should I focus on today?" | Action item recommendations based on data |

---

## Key Instructions Summary

1. **Collect data:** Sales, covers, labor hours, inventory usage from POS/payroll/user input
2. **Build report:** Structured flash report with all key metrics, comparisons, and percentages
3. **Flag anomalies:** Red/orange/green alerts with specific commentary
4. **Show trends:** 7-day rolling and MTD context
5. **Recommend actions:** 1-3 concrete action items for the day ahead
6. **Schedule:** Offer daily automated delivery at a set time

---

## Common Mistakes

1. **Looking at sales in isolation.** Revenue of $5k sounds great — but if labor was $2k and COGS was $2k, you made nothing. Always look at the margin stack.
2. **Comparing to arbitrary targets.** "We did $4k yesterday — is that good?" Compare to budget, same day last week, and same day last year.
3. **Ignoring trends for single-day spikes.** One bad Monday doesn't mean doom. One bad month does. Watch rolling averages.
4. **Not acting on the data.** A daily report is useless if it doesn't change behavior. Every alert should have a recommended action.
5. **Overcomplicating it.** 5 key metrics, reviewed daily, beats 50 metrics reviewed monthly. Start simple.

---

*"What gets measured gets managed. What gets measured daily gets improved daily."*

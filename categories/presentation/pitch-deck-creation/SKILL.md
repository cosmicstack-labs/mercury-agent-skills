---
name: pitch-deck-creation
description: 'Pitch Deck Creation: Investor pitch decks, Y Combinator applications, Product Hunt launches, and startup fundraising presentations'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: presentation
  tags: [pitch-deck, fundraising, startup, y-combinator, product-hunt, presentations]
---

# Pitch Deck Creation

Create pitch decks that raise capital, launch products, and win customers — with proven structures from top accelerators and investors.

## Core Principles

### 1. The 10-Slide Rule
Investors decide whether to meet you in the first 3-5 minutes. Keep the deck to 10-12 slides max. Every slide must earn its place — if it doesn't advance the narrative, cut it.

### 2. One Problem, One Solution
The best pitch decks are laser-focused on a single, painful problem and a single, elegant solution. Trying to solve three problems confuses the narrative and dilutes impact.

### 3. Show Traction, Not Just Vision
Ideas are cheap. Execution is everything. Your pitch deck must demonstrate real progress — revenue, users, partnerships, or meaningful pilots. Investors bet on momentum.

### 4. Design Polished = Product Polished
A poorly designed pitch deck signals sloppy execution. Investors judge your attention to detail by your deck before they ever see your product. Invest in design.

---

## Pitch Deck Maturity Model

| Level | Narrative | Data & Traction | Design | Investor Readiness |
|-------|-----------|----------------|--------|-------------------|
| **1: Napkin** | Random slide order | No metrics | Default template, typos | Not ready to raise |
| **2: Structured** | Problem → Solution order | Basic metrics (users) | Consistent branding, readable | Pre-seed preparation |
| **3: Persuasive** | Clear narrative arc | Growth metrics + unit economics | Professional design, data viz | Seed stage ready |
| **4: Convincing** | Story + evidence balanced | Cohort data, LTV/CAC, retention | Custom illustrations, animations | Series A ready |
| **5: Irresistible** | Emotional + logical appeal | Financial model projections, scenarios | Polished, premium feel, video | Late stage / growth |

Target: **Level 3** for seed fundraising. **Level 4** for Series A and beyond.

---

## Pitch Deck Structure

### The Gold Standard Slide Sequence

```text
1. TITLE SLIDE           — Company name, tagline, presenter
2. PROBLEM               — The painful problem you solve
3. SOLUTION              — Your product / service
4. WHY NOW               — Market timing and trends
5. MARKET SIZE           — TAM, SAM, SOM
6. PRODUCT               — How it works (screenshots / demo)
7. TRACTION              — Revenue, users, growth metrics
8. BUSINESS MODEL        — How you make money
9. COMPETITION           — Landscape + your advantage
10. TEAM                  — Why you're the right founders
11. FINANCIALS           — Projections, key assumptions
12. ASK                  — What you need and what it buys
13. CLOSING              — Contact, call to action
```

### The Y Combinator Approach

YC recommends a simplified, investor-first structure:

```text
YC Pitch Deck Pattern:
1. Title — What do you do? (one line)
2. Problem — What pain are you fixing?
3. Solution — Show your product
4. Why Now — Why is this the right time?
5. Market Size — How big can this get?
6. Product — Demo / screenshots / video
7. Traction — Revenue, growth, usage
8. Team — Background and fit
9. Competition — Secret weapon
10. Ask — What are you raising?
```

### Product Hunt Launch Deck

```text
Product Hunt Launch Slide Sequence:
1. Hook — Product name + one-liner (eye-catching)
2. Problem — What's broken today
3. Solution — Your product in action (GIF preferred)
4. Why Different — What makes this unique
5. Social Proof — Users, press, testimonials
6. Call to Action — "Upvote on Product Hunt"
7. Bonus — Easter eggs, team photo, fun fact
```

---

## Actionable Guidance

### Writing the Problem Slide

```markdown
# Problem Slide Template

## Headline
[The single most painful aspect of the current situation]

## Supporting Points
- [Quantified pain: "Businesses lose $X/year due to..."]
- [Emotional pain: "Teams are frustrated because..."]
- [Current workarounds: "People are using spreadsheets, which..."]

## Visual Strategy
- Show the frustration visually (broken process diagram)
- Use a relatable scenario or customer quote
- Include a stark statistic that lands emotionally
```

### Writing the Solution Slide

```markdown
# Solution Slide Template

## Headline
[Product name] solves [problem] by [unique mechanism]

## Supporting Points
- [How it works — simple, not technical]
- [Key benefit — "Cut costs by X%"]
- [Magic moment — the "aha!" capability]

## Visual Strategy
- Product screenshot or simple diagram
- Before/after comparison
- Animated GIF of core workflow (max 10 seconds)
```

### Writing the Traction Slide

```markdown
# Traction Slide Template

## Headline
Growing fast because [reason for growth]

## Key Metrics (pick 3-5)
| Metric              | Value       | Time Period    |
|---------------------|-------------|----------------|
| Monthly Revenue     | $X          | Current        |
| MoM Growth         | X%          | Last 6 months  |
| Paying Customers    | X           | Current        |
| Net Revenue Retention | X%        | Last quarter   |
| Active Users        | X           | Weekly         |

## Visual Strategy
- Growth curve (line chart showing upward trajectory)
- Cohort retention table (shows product-market fit)
- Logos of customers / partners
```

### Writing the Ask Slide

```markdown
# Ask Slide Template

## The Ask
**Raising**: $X,XXX,XXX
**Type**: [Seed / Series A / Convertible Note]
**Timeline**: Closing [Month, Year]

## Use of Funds
| Category          | Percentage | Purpose                        |
|-------------------|------------|--------------------------------|
| Engineering       | 40%        | Product development            |
| Go-to-Market      | 35%        | Sales, marketing, partnerships |
| Operations        | 15%        | Team, infrastructure           |
| Reserve           | 10%        | Runway extension               |

## Milestones (18-month plan)
1. [Milestone 1 — e.g., 10,000 users]
2. [Milestone 2 — e.g., $1M ARR]
3. [Milestone 3 — e.g., Series A ready]
```

---

## Metrics Slides

### Key Financial Metrics

```python
# Calculating key pitch deck metrics

metrics = {
    "ARR": "Annual Recurring Revenue = Monthly Revenue × 12",
    "MRR": "Monthly Recurring Revenue = sum of all subscription revenue",
    "NRR": "Net Revenue Retention = (beginning MRR + expansion - churn) / beginning MRR",
    "GRR": "Gross Revenue Retention = (beginning MRR - churn) / beginning MRR",
    "LTV": "Lifetime Value = ARPU × Gross Margin × (1 / Churn Rate)",
    "CAC": "Customer Acquisition Cost = total sales & marketing / new customers",
    "LTV:CAC": "Ratio — target > 3:1 for healthy SaaS businesses",
    "Burn Multiple": "Net burn / net new ARR (lower is better, < 2x is great)",
    "Magic Number": "(New ARR in quarter) / (S&M spend in prior quarter) — target > 0.75",
}

# Example calculation
def calculate_ltv_cac(arpu, gross_margin, churn_rate, total_sales_marketing, new_customers):
    """
    Calculate LTV:CAC ratio.
    
    Args:
        arpu: Average revenue per user per month
        gross_margin: Gross margin (e.g., 0.8 for 80%)
        churn_rate: Monthly churn rate (e.g., 0.05 for 5%)
        total_sales_marketing: Total spend in period
        new_customers: New customers acquired
    """
    ltv = arpu * gross_margin * (1 / churn_rate)
    cac = total_sales_marketing / new_customers if new_customers > 0 else 0
    ratio = ltv / cac if cac > 0 else 0
    
    return {
        "ltv": round(ltv, 2),
        "cac": round(cac, 2),
        "ratio": round(ratio, 2),
        "healthy": ratio >= 3.0,
    }

# Example
result = calculate_ltv_cac(
    arpu=50,            # $50/user/month
    gross_margin=0.80,  # 80% margin
    churn_rate=0.03,    # 3% monthly churn
    total_sales_marketing=50000,
    new_customers=50
)
print(result)
# Output: {'ltv': 1333.33, 'cac': 1000.0, 'ratio': 1.33, 'healthy': False}
```

### Cohort Analysis for Pitch Decks

```python
import pandas as pd
import numpy as np

# Sample cohort retention table
def generate_cohort_table():
    """Generate a cohort retention table for pitch decks."""
    months = 6
    cohorts = ["Jan 2024", "Feb 2024", "Mar 2024", "Apr 2024", "May 2024", "Jun 2024"]
    
    data = []
    for i, cohort in enumerate(cohorts):
        row = {"Cohort": cohort, "Size": np.random.randint(100, 500)}
        for m in range(months):
            if m <= i:
                # Declining retention over time (realistic)
                retention = max(0.3, 1.0 - (m * 0.12) - np.random.normal(0, 0.02))
                row[f"Month {m+1}"] = f"{retention:.0%}"
            else:
                row[f"Month {m+1}"] = "—"
        data.append(row)
    
    df = pd.DataFrame(data)
    return df

# In a pitch deck, show:
# 1. That later cohorts retain better (improving product-market fit)
# 2. Month 1 retention > 60% (strong activation)
# 3. Month 6 retention > 30% (long-term value)
```

---

## Design Best Practices for Pitch Decks

### Typography

```text
Pitch Deck Font Rules:
- **1-2 fonts max**: Header font (bold) + Body font (readable)
- **Recommended**: Inter, Montserrat, Lato, or your brand font
- **Minimum sizes**:
  - Headlines: 36-48pt
  - Body: 20-24pt
  - Footnotes: 12-14pt
- **No system fonts**: Avoid Times New Roman, Arial, Calibri
```

### Color Palette

```text
Recommended Pitch Deck Palette:

Primary (Brand):     #1A365D  (Deep Navy — trust, stability)
Secondary:           #2B6CB0  (Blue — clarity, technology)
Accent:              #E53E3E  (Red — urgency, emphasis)
Background:          #FFFFFF  (White — clean, minimal)
Text:                #1A202C  (Dark — readability)

Additional Tints:
- Light background: #F7FAFC
- Divider line:     #E2E8F0
- Success green:    #38A169
- Warning amber:    #D69E2E
```

### Visual Consistency Checklist

```markdown
## Design Consistency Checklist

- [ ] Same fonts throughout every slide
- [ ] Consistent color palette (no orphan colors)
- [ ] Same icon style (all outlined or all filled)
- [ ] Aligned margins on every slide
- [ ] Images have consistent styling (no mixed photo + illustration)
- [ ] Charts use brand colors
- [ ] No clip art or low-resolution images
- [ ] Slide numbers on every slide (footer)
- [ ] Company logo on every slide (top-left or bottom-left)
- [ ] URLs formatted consistently
```

---

## Data Room Slides

### What Goes in the Data Room

```text
Core Data Room Slides (beyond pitch deck):

1. **Financial Model**: Full P&L, balance sheet, cash flow (3-5 year projections)
2. **Cap Table**: Current ownership structure
3. **Unit Economics**: Detailed LTV, CAC, payback period breakdowns
4. **Market Research**: TAM/SAM/SOM methodology and sources
5. **Customer List**: Top 20 customers with revenue contribution
6. **Competitive Landscape**: Feature comparison matrix, market positioning
7. **Product Roadmap**: 12-18 month feature plan
8. **Team Bios**: Full backgrounds for key team members
9. **Legal Documents**: Incorporation, IP assignment, patents
10. **Historical Financials**: Past 2-3 years of financial data
```

### Data Room Slide Template

```markdown
# Unit Economics Deep Dive

## LTV Calculation
| Component         | Value      | Source                         |
|-------------------|------------|--------------------------------|
| ARPU (Monthly)    | $X         | Billing data                   |
| Gross Margin      | X%         | Cost of goods sold             |
| Monthly Churn     | X%         | Cohort analysis                |
| Customer Lifetime | X months   | 1 / churn rate                 |
| **LTV**           | **$X,XXX** | ARPU × Margin × Lifetime       |

## CAC Calculation
| Component              | Value      | Source                         |
|------------------------|------------|--------------------------------|
| Total S&M Spend (Q)    | $X,XXX     | P&L Statement                  |
| New Customers (Q)      | X          | CRM data                       |
| **CAC**                | **$X**     | S&M / New Customers            |
| **LTV:CAC Ratio**      | **X.X:1**  | LTV / CAC                      |
| **CAC Payback Months** | **X**      | CAC / (ARPU × Margin)          |
```

---

## Common Pitch Deck Mistakes

1. **Too many slides**: 20+ slides that lose the narrative. Cut to 10-12 essential slides.
2. **No clear problem**: The audience doesn't understand what pain you're solving. Lead with a specific, relatable problem.
3. **Feature dumping**: Listing features instead of benefits. Sell outcomes, not capabilities.
4. **Ignoring competition**: Claiming "no competition" signals naivety. Show you understand the landscape.
5. **Weak traction slide**: "We're pre-revenue" without any validation. Show something — waitlists, pilots, LOIs, anything.
6. **Bad design**: Cluttered slides, inconsistent fonts, typos. Your deck represents your product's quality.
7. **No financial model**: Raising money without projections is like flying without instruments. Show the numbers.
8. **Hiding the ask**: Investors shouldn't have to hunt for how much you need. Be upfront on slide 2 or close.
9. **Too much text**: Walls of text that no one will read. One idea per slide, minimal text, strong visuals.
10. **Not tailoring to the audience**: Same deck for seed investors and strategic partners. Customize for each audience.
11. **No demo or product visual**: Investors want to see what you built. Include screenshots, GIFs, or a video demo.
12. **Weak team slide**: Just names and titles. Show why this team uniquely solves this problem.

---

## Fundraising Deck Checklist

```markdown
## Pre-Send Checklist

### Content
- [ ] Problem is specific and painful (test it on someone unfamiliar)
- [ ] Solution is clear and differentiated
- [ ] Market size is realistic and well-sourced
- [ ] Traction metrics are current (not 3 months stale)
- [ ] Business model is explained simply
- [ ] Competition slide shows real understanding
- [ ] Team slide highlights relevant expertise
- [ ] Ask is specific and justified

### Design
- [ ] Consistent typography throughout
- [ ] Color palette matches brand
- [ ] All images are high resolution
- [ ] Charts have clear labels and sources
- [ ] No typos or grammatical errors
- [ ] Slide numbers on every slide
- [ ] Logo on every slide
- [ ] File is under 10MB (or compressed for email)

### Distribution
- [ ] PDF format (never editable PPT)
- [ ] File named: `Company Name - Pitch Deck - Date.pdf`
- [ ] Teaser version (no financials) for cold outreach
- [ ] Full version for warm intros and meetings
- [ ] One-pager version for conferences / events
```

---
name: Product Strategy
description: A comprehensive skill for product strategy — covering frameworks, opportunity sizing, prioritization, roadmap building, OKRs, and stakeholder management. From early-stage discovery to mature product org execution.
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: product
  tags:
    - product-strategy
    - north-star
    - opportunity-solution-tree
    - JTBD
    - TAM-SAM-SOM
    - ICE-scoring
    - RICE
    - WSJF
    - Kano-model
    - roadmap
    - OKRs
    - stakeholder-management
    - prioritization
---

# Product Strategy

## Core Principles

Product strategy connects the "why" of your business to the "what" and "when" of your product. These principles guide every decision:

1. **Strategy before tactics.** Every feature, sprint, and roadmap item must trace back to a strategic objective. If it doesn't, question why it exists.

2. **Outcomes over output.** Shipping features is meaningless if they don't change user behavior or business results. Measure what matters — not what's easy to measure.

3. **Focus is the strategy.** Saying "no" is more important than saying "yes." A product strategy that tries to serve everyone serves no one.

4. **Know your user, know your market.** All strategy starts with deep user understanding and honest market assessment. Assumptions are dangerous without validation.

5. **Strategy is iterative, not static.** Review and adapt your strategy quarterly. The market moves; your strategy must move with it.

6. **Alignment beats autonomy.** A product strategy that isn't understood and bought into by engineering, design, leadership, and go-to-market teams will fail regardless of its quality.

7. **Quantify everything you can.** If you cannot measure the impact of a strategic decision, you cannot learn from it. Build data loops into every strategic initiative.

---

## Product Strategy Maturity Model

Organizations evolve through predictable stages of strategic maturity. Identify where you are to know what to improve.

| Level | Name | Characteristics |
|-------|------|-----------------|
| 1 | Ad-hoc | No documented strategy. Roadmap is a list of features requested by stakeholders. Shipping velocity is the only metric. |
| 2 | Aware | Leadership has a vision but it isn't translated into product decisions. Some frameworks exist but aren't consistently applied. |
| 3 | Defined | Product strategy is documented and socialized. North Star and OKRs are in place. Prioritization uses structured frameworks. |
| 4 | Managed | Strategy drives all product decisions. Outcomes are measured and reviewed. Teams push back on non-strategic requests. Quarterly strategy reviews are standard. |
| 5 | Optimizing | Strategy is data-informed and adaptive. The org runs experiments on strategy itself. Market sensing is continuous. Product strategy is a competitive advantage. |

**Assessment prompt:** Audit your current level by asking: Do we have a documented North Star? Do all teams know it? Can any team member explain how their work ties to it? Do we measure outcomes or just outputs?

---

## Strategy Frameworks

### North Star Metric

A North Star is the single metric that, if improved, drives sustainable growth and delivers the core value of your product. It aligns the entire organization around one measurable outcome.

**Characteristics of a good North Star:**
- Leads to revenue but is not revenue itself (revenue is a lagging indicator)
- Captures the core value users get from your product
- Is actionable by multiple teams
- Is a leading indicator of business health

**Examples:**

| Product | North Star Metric |
|---------|------------------|
| Spotify | Time spent listening (engaged listening hours) |
| Airbnb | Nights booked |
| Medium | Total time spent reading |
| Slack | Messages sent per day |
| Facebook | Daily active users (DAU) |

**Implementation guide:**

```python
# Hypothetical North Star tracking dashboard query
def get_north_star_weekly(product_id: str) -> dict:
    """
    Calculate the weekly North Star metric for a product.
    For a SaaS product: "Weekly Active Workspaces with >= 3 team actions"
    """
    query = """
        SELECT
            DATE_TRUNC('week', action_timestamp) AS week,
            COUNT(DISTINCT workspace_id) AS active_workspaces
        FROM product_analytics.team_actions
        WHERE product_id = %(product_id)s
          AND action_timestamp >= NOW() - INTERVAL '12 weeks'
        GROUP BY 1
        ORDER BY 1 DESC
        LIMIT 12
    """
    # Execute and return results
    results = execute_query(query, {"product_id": product_id})
    return format_trend(results)
```

**Anti-patterns:** Choosing a vanity metric (e.g., page views), picking something you can't influence weekly, or having multiple "North Stars."

### Opportunity Solution Tree

Created by Teresa Torres, the Opportunity Solution Tree (OST) is a visual framework that connects your desired outcome to the opportunities, solutions, and experiments needed to get there.

**Structure:**

```
Desired Outcome
  └── Opportunity 1
        ├── Solution A
        │     ├── Experiment 1
        │     └── Experiment 2
        └── Solution B
              └── Experiment 3
  └── Opportunity 2
        └── Solution C
              └── Experiment 4
```

**How to build one:**
1. Start with the desired outcome (from your OKRs or North Star)
2. Identify opportunities — user needs, pain points, desires, or obstacles
3. For each opportunity, brainstorm possible solutions
4. For each solution, design experiments to test riskiest assumptions
5. Prioritize experiments by impact, confidence, and effort

**Key insight:** Most teams jump from outcome directly to solutions. The OST forces you to explore opportunities first, leading to better solutions.

```python
# Opportunity Solution Tree data structure
class OpportunitySolutionTree:
    def __init__(self, desired_outcome: str):
        self.desired_outcome = desired_outcome
        self.opportunities = []

    def add_opportunity(self, name: str, description: str):
        self.opportunities.append(Opportunity(name, description))

    def prioritize_opportunities(self):
        """Score each opportunity by impact and confidence."""
        for opp in self.opportunities:
            opp.impact_score = assess_impact(opp)
            opp.confidence_score = assess_confidence(opp)
        self.opportunities.sort(
            key=lambda o: o.impact_score * o.confidence_score,
            reverse=True
        )

class Opportunity:
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        self.solutions = []

    def add_solution(self, name: str, hypothesis: str):
        self.solutions.append(Solution(name, hypothesis))

class Solution:
    def __init__(self, name: str, hypothesis: str):
        self.name = name
        self.hypothesis = hypothesis
        self.experiments = []
```

### Jobs to Be Done (JTBD)

JTBD is a framework for understanding why customers "hire" your product. The core insight: people don't buy products; they hire them to get a job done.

**Core concepts:**
- **Functional job:** The practical task the user wants to accomplish
- **Emotional job:** How the user wants to feel
- **Social job:** How the user wants to be perceived

**The JTBD statement format:**

> When [situation], I want to [motivation] so I can [expected outcome].

**Example:** "When I'm commuting and have 15 minutes of free time, I want to listen to something interesting so I can feel productive and entertained."

**JTBD interview tips:**
- Ask about the last time the user was in this situation
- Trace the timeline of events — what triggered the need?
- What alternatives were considered?
- What almost stopped them?
- What happened after?

```python
# JTBD analysis helper
def analyze_jtbd(interview_notes: str) -> dict:
    """
    Extract JTBD components from interview transcripts
    using structured coding.
    """
    return {
        "trigger": extract_trigger(interview_notes),       # What prompted the action?
        "struggle": extract_struggle(interview_notes),     # What was the friction?
        "hired_for": extract_job(interview_notes),         # What job was the product hired for?
        "alternatives": extract_alternatives(interview_notes), # What was the competition?
        "outcome": extract_outcome(interview_notes),       # What did success look like?
        "emotions": extract_emotions(interview_notes)      # Functional, emotional, social
    }
```

---

## Opportunity Sizing

### TAM / SAM / SOM

A top-down market sizing framework used to estimate the addressable market and validate whether an opportunity is worth pursuing.

| Term | Definition | Example (Project Management SaaS) |
|------|------------|-----------------------------------|
| TAM (Total Addressable Market) | The total revenue opportunity if 100% market share is achieved | $50B (all project management software globally) |
| SAM (Serviceable Addressable Market) | The segment of TAM your product can reach with your distribution model | $10B (mid-market companies in North America + Europe) |
| SOM (Serviceable Obtainable Market) | The portion of SAM you can realistically capture in the near term | $500M (companies with 50-500 employees who use modern tools) |

**Calculation approach:**

```python
def calculate_tam_sam_som(industry_data: dict) -> dict:
    """
    Calculate TAM, SAM, and SOM from industry research data.
    """
    total_companies = industry_data["total_companies_in_market"]
    avg_revenue_per_customer = industry_data["avg_annual_revenue_per_customer"]

    tam = total_companies * avg_revenue_per_customer

    # SAM: filter to companies your product can serve
    addressable_companies = industry_data["companies_in_our_segment"]
    sam = addressable_companies * avg_revenue_per_customer

    # SOM: realistic capture based on distribution and competition
    realistic_penetration = industry_data["realistic_penetration_rate"]  # e.g., 0.02
    som = sam * realistic_penetration

    return {
        "tam": tam,
        "sam": sam,
        "som": som,
        "tam_to_sam_ratio": sam / tam if tam > 0 else 0,
        "years_to_reach_som": estimate_years_to_reach(som, industry_data)
    }
```

**Common pitfalls:**
- Using TAM as a success target (you will never capture 100%)
- Ignoring bottom-up validation (TAM is top-down; always triangulate with bottoms-up data)
- Forgetting competition and market dynamics

### ICE Scoring

A rapid prioritization framework: **I**mpact, **C**onfidence, **E**ase. Score each dimension from 1-10, average or multiply them.

| Dimension | What it measures | Scoring guide |
|-----------|-----------------|---------------|
| Impact | How much will this move the needle? | 10 = transforms the business, 1 = negligible |
| Confidence | How sure are we of the impact estimate? | 10 = data-backed, 1 = pure guess |
| Ease | How easy/cheap/fast is this to execute? | 10 = one engineer, one week, 1 = multi-quarter |

```python
def ice_score(impact: int, confidence: int, ease: int) -> float:
    """Calculate ICE score (average method)."""
    return (impact + confidence + ease) / 3.0

def ice_rank(initiatives: list) -> list:
    """Rank a list of initiatives by ICE score."""
    for item in initiatives:
        item["ice"] = ice_score(
            item["impact"],
            item["confidence"],
            item["ease"]
        )
    return sorted(initiatives, key=lambda x: x["ice"], reverse=True)
```

**When to use:** Early-stage, fast-moving teams. Low ceremony, high speed.
**When to avoid:** High-stakes decisions, regulated industries, large orgs needing audit trails.

---

## Prioritization

### RICE Scoring

An evolution of ICE created by Intercom. **R**each, **I**mpact, **C**onfidence, **E**ffort.

| Factor | Definition | Scale |
|--------|------------|-------|
| Reach | How many users will this affect in a given time period? | Absolute number (e.g., 500 users/quarter) |
| Impact | How much will this change behavior per user? | 0.25 (minimal), 0.5 (low), 1 (medium), 2 (high), 3 (massive) |
| Confidence | How confident are you in your Reach and Impact estimates? | 20% (gut feel), 50% (some data), 80% (strong data), 100% (proven) |
| Effort | How much work is required from the entire team? | Person-months (e.g., 3 person-months) |

**Formula:** `RICE Score = (Reach × Impact × Confidence) / Effort`

```python
def rice_score(reach: float, impact: float, confidence: float, effort: float) -> float:
    """
    Calculate RICE score.
    - reach: number of users affected per time period
    - impact: 0.25, 0.5, 1, 2, or 3
    - confidence: 0.2, 0.5, 0.8, or 1.0
    - effort: person-months
    """
    if effort <= 0:
        raise ValueError("Effort must be greater than 0")
    return (reach * impact * confidence) / effort

def rice_rank(initiatives: list) -> list:
    """Rank initiatives by RICE score."""
    for item in initiatives:
        item["rice"] = rice_score(
            item["reach"],
            item["impact"],
            item["confidence"],
            item["effort"]
        )
    return sorted(initiatives, key=lambda x: x["rice"], reverse=True)
```

### Weighted Shortest Job First (WSJF)

Used in SAFe (Scaled Agile Framework) for prioritizing jobs by their cost of delay divided by job size.

**Formula:** `WSJF = Cost of Delay / Job Size`

**Cost of Delay components:**
- **User-business value:** Revenue impact, customer satisfaction
- **Time criticality:** Is there a deadline or market window?
- **Risk reduction / opportunity enablement:** Does this unlock other value?
- **Job size:** Effort estimate (story points, person-weeks)

```python
def wsjf_score(
    user_value: int,
    time_criticality: int,
    risk_reduction: int,
    job_size: int
) -> float:
    """
    Calculate WSJF score.
    All inputs are scored 1 (lowest) to 10 (highest) typically.
    """
    cost_of_delay = user_value + time_criticality + risk_reduction
    if job_size <= 0:
        raise ValueError("Job size must be greater than 0")
    return cost_of_delay / job_size

def wsjf_rank(initiatives: list) -> list:
    for item in initiatives:
        item["wsjf"] = wsjf_score(
            item["user_value"],
            item["time_criticality"],
            item["risk_reduction"],
            item["job_size"]
        )
    return sorted(initiatives, key=lambda x: x["wsjf"], reverse=True)
```

### Eisenhower Matrix

A 2×2 grid for urgency vs. importance — useful for daily/weekly task triage rather than long-term roadmap prioritization.

```
                    URGENT                NOT URGENT
IMPORTANT     |  Do First (Q1)     |  Schedule (Q2)
              |  Crises, deadlines |  Strategy, relationships, planning
NOT IMPORTANT |  Delegate (Q3)     |  Eliminate (Q4)
              |  Interruptions     |  Busywork, time-wasters
```

**Application in product:** Use the Eisenhower matrix to triage incoming requests and bugs. Only Q2 items belong on the strategic roadmap.

### Kano Model

A framework for categorizing features based on how they affect customer satisfaction.

| Category | Description | User reaction when present | User reaction when absent |
|----------|-------------|---------------------------|--------------------------|
| Basic Needs (Must-be) | Expected, table stakes | Neutral | Very dissatisfied |
| Performance (One-dimensional) | The more the better | Satisfied | Dissatisfied |
| Delighters (Attractive) | Unexpected, exciting | Very satisfied | Neutral |
| Indifferent | Not noticed | Neutral | Neutral |
| Reverse | Some users don't want it | Dissatisfied | Satisfied |

**Kano survey technique:**
Ask each question in two forms:
1. *Functional:* "How would you feel if [feature] was added?"
2. *Dysfunctional:* "How would you feel if [feature] was NOT added?"

Response options: Like it / Expect it / Neutral / Tolerate it / Dislike it

```python
# Kano categorization from survey responses
KANO_MATRIX = {
    ("Like", "Like"): "Questionable",
    ("Like", "Expect"): "Delighter",
    ("Like", "Neutral"): "Delighter",
    ("Like", "Tolerate"): "Delighter",
    ("Like", "Dislike"): "Performance",
    ("Expect", "Like"): "Reverse",
    ("Expect", "Expect"): "Indifferent",
    ("Expect", "Neutral"): "Indifferent",
    ("Expect", "Tolerate"): "Indifferent",
    ("Expect", "Dislike"): "Must-be",
    ("Neutral", "Like"): "Reverse",
    ("Neutral", "Expect"): "Indifferent",
    ("Neutral", "Neutral"): "Indifferent",
    ("Neutral", "Tolerate"): "Indifferent",
    ("Neutral", "Dislike"): "Must-be",
    ("Tolerate", "Like"): "Reverse",
    ("Tolerate", "Expect"): "Indifferent",
    ("Tolerate", "Neutral"): "Indifferent",
    ("Tolerate", "Tolerate"): "Indifferent",
    ("Tolerate", "Dislike"): "Must-be",
    ("Dislike", "Like"): "Reverse",
    ("Dislike", "Expect"): "Reverse",
    ("Dislike", "Neutral"): "Reverse",
    ("Dislike", "Tolerate"): "Reverse",
    ("Dislike", "Dislike"): "Questionable",
}

def classify_kano(functional: str, dysfunctional: str) -> str:
    """Classify a feature using the Kano evaluation table."""
    return KANO_MATRIX.get((functional, dysfunctional), "Unknown")
```

---

## Roadmap Building

### Now-Next-Later

A time-based roadmap framework that communicates direction without committing to exact dates.

| Bucket | Timeframe | Certainty | Purpose |
|--------|-----------|-----------|---------|
| Now | Current quarter | High | Actively being built |
| Next | Next quarter | Medium | Committed to explore and scope |
| Later | Next 2-4 quarters | Low | Vision and directional |

**Best practices:**
- Never put dates on individual features — use the bucket as the commitment
- Update quarterly
- Connect each item back to an OKR or strategic theme
- Share broadly and visibly

### Themes vs. Features

A theme-based roadmap describes *what problem you're solving* (the theme), not *how you're solving it* (the feature).

| Feature-based (avoid) | Theme-based (prefer) |
|-----------------------|---------------------|
| "Dark mode v2" | "Improve accessibility and visual comfort" |
| "Export to CSV button" | "Enable users to get their data out" |
| "AI chatbot" | "Reduce time to first value for new users" |

**Why themes work:**
- Gives engineers autonomy to find the best solution
- Keeps the team focused on outcomes
- Reduces politics around specific features
- Makes the roadmap stable even when tactics change

### Outcome-Based Roadmaps

Outcome-based roadmaps focus on changing user behavior or business metrics rather than shipping features.

**Structure:**

> By [timeframe], [metric] will move from [baseline] to [target] because [strategy].

**Example:**
> By Q3 2025, weekly active users in the reporting module will increase from 12% to 30% because we reduce the time and complexity required to generate a report.

**Outcome vs. output checklist:**
- [ ] Does this roadmap item describe a user behavior change?
- [ ] Is there a measurable metric attached?
- [ ] Do we know the current baseline?
- [ ] Do we have a hypothesis for *how* we'll achieve it?
- [ ] Can we measure success within the quarter?

```python
# Outcome-based roadmap item data model
class RoadmapItem:
    def __init__(self, theme: str, outcome: str, metric: str,
                 baseline: float, target: float, quarter: str):
        self.theme = theme
        self.outcome = outcome          # "Reduce time to first report"
        self.metric = metric            # "average_report_generation_time"
        self.baseline = baseline        # 15 minutes
        self.target = target            # 5 minutes
        self.quarter = quarter          # "2025-Q3"
        self.hypothesis = None
        self.status = "proposed"

    def set_hypothesis(self, hypothesis: str):
        """Document the strategic hypothesis driving this work."""
        self.hypothesis = hypothesis

    def progress(self, current_value: float) -> float:
        """Return progress as a percentage toward target."""
        if self.target == self.baseline:
            return 1.0
        progress = (current_value - self.baseline) / (self.target - self.baseline)
        return max(0.0, min(1.0, progress))
```

---

## OKRs (Objectives and Key Results)

OKRs connect company vision to team execution. Objectives are qualitative and inspirational; Key Results are quantitative and measurable.

### Writing OKRs

**Objective formula:** `[Verb] + [What you want to accomplish] + [Context]`

> "Deliver a world-class onboarding experience for enterprise teams"

**Key Result formula:** `[Metric] from [baseline] to [target]`

> "Reduce time-to-first-value from 14 days to 3 days"
> "Increase onboarding completion rate from 40% to 75%"
> "Achieve NPS of 50+ at the 30-day mark"

### OKR Scoring

| Score | Meaning |
|-------|---------|
| 0.0 - 0.3 | Missed — significant gap |
| 0.4 - 0.6 | Progress made but not achieved |
| 0.7 - 0.9 | Achieved (good, ambitious) |
| 1.0 | Stretch goal met (rare — OKRs should be aspirational) |

### Cascading OKRs

```
Company OKR
  └── Product team OKR
        └── Engineering team OKR
              └── Individual OKR
```

Each level should align with and contribute to the level above. Avoid direct top-down assignment — negotiate and co-create.

### Common OKR pitfalls

- Writing KRs that are just tasks ("Launch feature X" → this is an output, not a result)
- Having too many OKRs (3 objectives max, 3-5 KRs per objective)
- Setting KRs that are too easy (OKRs should feel uncomfortable)
- Not reviewing weekly or bi-weekly (OKRs need regular check-ins)
- Treating OKRs as a performance evaluation tool

```python
# OKR tracking data structure
class OKR:
    def __init__(self, objective: str, owner: str, quarter: str):
        self.objective = objective
        self.owner = owner
        self.quarter = quarter
        self.key_results = []

    def add_key_result(self, description: str, baseline: float,
                       target: float, unit: str = ""):
        self.key_results.append({
            "description": description,
            "baseline": baseline,
            "target": target,
            "current": baseline,
            "unit": unit
        })

    def update_progress(self, kr_index: int, current_value: float):
        self.key_results[kr_index]["current"] = current_value

    def score(self) -> float:
        """Average score across all KRs (0.0 to 1.0)."""
        if not self.key_results:
            return 0.0
        scores = []
        for kr in self.key_results:
            if kr["target"] == kr["baseline"]:
                scores.append(1.0)
            else:
                progress = (kr["current"] - kr["baseline"]) / (kr["target"] - kr["baseline"])
                scores.append(max(0.0, min(1.0, progress)))
        return sum(scores) / len(scores)
```

---

## Stakeholder Management

Stakeholder management is a core product strategy skill. Even the best strategy fails without stakeholder buy-in.

### Stakeholder Mapping

Use a Power-Interest Grid to categorize stakeholders:

```
                    HIGH POWER              LOW POWER
HIGH INTEREST  | Manage Closely       | Keep Informed
               | (Exec sponsors,      | (Power users, internal advocates)
               |  key customers)      |
LOW INTEREST   | Keep Satisfied       | Monitor
               | (Legal, compliance,  | (Peripheral teams, industry observers)
               |  exec who needs      |
               |  quarterly updates)  |
```

### Communication Cadences

| Stakeholder Type | Cadence | Format |
|------------------|---------|--------|
| Direct team | Weekly | Standup + sprint review |
| Product leadership | Bi-weekly | Strategy review + metrics |
| Executive | Monthly / Quarterly | OKR progress, one-pager |
| Cross-functional partners | Weekly / Bi-weekly | Sync, shared dashboard |
| Customers | Ongoing | Beta program, user research, NPS |

### Handling Difficult Stakeholder Requests

**The "Yes, and..." technique:**
1. Acknowledge the request
2. Connect it to existing strategy (or explain why it doesn't fit)
3. Offer an alternative

> "I understand why the sales team wants the bulk export feature. Looking at our Q3 objective of improving user retention, I think a better investment would be improving our notification system — which would serve both sales team needs and retention goals. Can we explore that together?"

### Stakeholder Management Anti-Patterns

- Saying yes to everything (leads to unfocused roadmaps)
- Surprising stakeholders at review meetings
- Only communicating when something is wrong
- Letting the loudest voice drive prioritization
- No single source of truth for the roadmap

---

## Common Mistakes

1. **Leading with solutions instead of problems.** "We should build X" without understanding the opportunity behind it. Always start with the problem.

2. **Strategy by spreadsheet.** Over-indexing on scores (RICE, ICE) without qualitative context. Frameworks aid decision-making — they don't replace it.

3. **Vanity metrics.** Choosing metrics that always look good but don't predict business outcomes (e.g., page views, registered accounts never activated).

4. **Annual strategy with no quarterly review.** Strategy is a living document. The market changes, competitors emerge, users evolve. Review quarterly, at minimum.

5. **Over-commitment on the roadmap.** Adding too many "Now" items creates thrash and destroys focus. If everything is a priority, nothing is.

6. **Ignoring the "how" of strategy.** Great strategy poorly executed is worthless. Invest in execution capability, not just strategy formulation.

7. **Excluding engineering from strategy conversations.** Engineers have invaluable insights into what's possible and what's expensive. Bring them in early.

8. **Confusing motion with progress.** A busy roadmap with lots of features doesn't mean you're moving toward your strategic goals.

9. **No exit criteria for experiments.** Every experiment needs a clear "what does success look like?" defined before it starts.

10. **Strategy without story.** If you can't explain your strategy in one minute to anyone in the company, it's too complex. Simplify and socialize relentlessly.

---

*This skill is maintained by Cosmic Stack Labs. For questions or contributions, refer to the contributing guide in the repository root.*

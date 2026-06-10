---
name: before-you-build
description: 'Use this before implementing a product, feature, SaaS, AI app, or side project to score product risk and choose the smallest validation step.'
metadata:
  author: bin1874
  version: 1.0.0
  category: product
  tags:
    - product-risk
    - validation
    - product-discovery
    - demand
    - distribution
    - monetization
    - retention
    - ai-coding
---

# Before You Build

## Purpose

Use this skill before an agent starts building a product, feature, SaaS tool, AI app, side project, or startup idea.

The goal is not to block shipping. The goal is to avoid spending engineering time on an idea whose biggest risk is still outside the codebase.

Before implementation, produce:

- A short risk verdict
- A score across product risk dimensions
- The riskiest assumption
- The smallest validation step worth doing next
- A clear build, test, or stop recommendation

## When To Use

Use this skill when the user says they want to:

- Build a new product or feature
- Add an AI workflow to an existing product
- Turn an idea into an MVP
- Copy a competitor or trend
- Ship a side project quickly
- Start coding before talking to users
- Ask whether an idea is worth building
- Decide between multiple product bets

Do not use this for:

- Pure code debugging
- Refactoring existing implementation
- UI polish after the product bet is already validated
- Legal, financial, medical, or security review
- Choosing a tech stack

## Core Principle

Most early product failures are not caused by missing code.

They usually come from one or more of these gaps:

- The buyer does not feel the problem strongly enough
- The user likes the idea but will not pay
- The product depends on a platform that can change access
- The founder has no repeatable channel to reach buyers
- The workflow is useful once but does not create repeat use
- The trust burden is higher than the product can carry
- The feature is nice to have but not a decision-changing reason to buy

Your job is to find the biggest unknown before implementation expands the cost of being wrong.

## Inputs To Ask For

If the user has not provided enough context, ask for the minimum needed:

- What is being built?
- Who is the target user or buyer?
- What painful job does it solve?
- What will the user do differently after adopting it?
- How will the product reach the first 10 real users?
- How will it make money or justify internal investment?
- What evidence already exists?
- What would make the user abandon the product?

If the user cannot answer all of these, continue with low confidence and call out the missing assumptions.

## Risk Dimensions

Score each dimension from 1 to 5.

- 1 means low risk or already validated
- 3 means unclear and needs evidence
- 5 means high risk and should be tested before building

### 1. Demand Risk

Ask whether the target user has an urgent, frequent, or expensive problem.

High-risk signs:

- The user says it is "interesting" but does not describe a current workaround
- The problem is rare or only mildly annoying
- The buyer and user are different, but only the user has been considered
- The idea starts from available technology instead of a painful job

### 2. Monetization Risk

Ask whether someone has a reason to pay, approve budget, or allocate internal time.

High-risk signs:

- The product saves time but not enough to justify switching
- The target user has no budget
- Pricing depends on future scale instead of early willingness to pay
- Free alternatives are good enough

### 3. Distribution Risk

Ask how the product will reach qualified users repeatedly.

High-risk signs:

- The plan is "post on Product Hunt" or "share on social"
- Search demand is assumed but not checked
- The market is crowded and discovery depends on luck
- The founder has no audience, channel partner, or outbound motion

### 4. Retention Risk

Ask whether the product creates a reason to come back.

High-risk signs:

- The job happens once
- The product produces a one-time output
- There is no stored history, habit loop, team workflow, or recurring trigger
- The value is easy to copy manually after the first use

### 5. Trust Risk

Ask whether the product needs data, permissions, money movement, or judgment that users may not trust.

High-risk signs:

- The product asks for sensitive account access before proving value
- AI output affects business, health, legal, or financial decisions
- The user needs to share private data with an unknown vendor
- The product promises accuracy without verification or fallback

### 6. Platform Risk

Ask whether the product depends on another platform's API, policy, ranking, data, or distribution.

High-risk signs:

- A single API change can break the product
- The product depends on scraping or unofficial access
- App store, marketplace, or social platform rules are central to growth
- The fallback plan is unclear

### 7. Feature Adoption Risk

Ask whether the proposed feature changes behavior or merely adds surface area.

High-risk signs:

- Existing users have not asked for it in their own words
- The feature adds complexity to satisfy a hypothetical segment
- The feature improves demo appeal but not activation, retention, or revenue
- No one can name the metric it should move

## Scoring Rubric

Create a table:

| Dimension | Score | Evidence | What would reduce risk |
|---|---:|---|---|
| Demand | 1-5 | Current evidence | Smallest evidence needed |
| Monetization | 1-5 | Current evidence | Smallest evidence needed |
| Distribution | 1-5 | Current evidence | Smallest evidence needed |
| Retention | 1-5 | Current evidence | Smallest evidence needed |
| Trust | 1-5 | Current evidence | Smallest evidence needed |
| Platform | 1-5 | Current evidence | Smallest evidence needed |
| Feature adoption | 1-5 | Current evidence | Smallest evidence needed |

Then calculate:

- Total score: sum of all seven scores
- Highest-risk dimension: the largest score
- Confidence: high, medium, or low based on evidence quality

Interpretation:

- 7-13: Build a small version if the main assumption is clear
- 14-22: Run one validation test before building
- 23-35: Do not build yet; validate or narrow the bet first

## Evidence Quality

Rank evidence from strongest to weakest:

1. Paid purchase, signed contract, or budget approval
2. Repeated manual workflow with measurable pain
3. Real user interview with specific recent behavior
4. Waitlist with qualified users and clear intent
5. Competitor traction with a reachable wedge
6. Social likes, vague comments, or founder intuition

Do not treat compliments as validation.

## Smallest Validation Step

Pick one step that can reduce the highest risk within days, not weeks.

Examples:

- Demand: interview 5 target users about their last workaround
- Monetization: ask 10 qualified buyers to prepay or approve a pilot
- Distribution: run 20 targeted outbound messages and measure replies
- Retention: manually deliver the value twice to the same user
- Trust: test whether users will share the required data after seeing value
- Platform: verify official API terms and design a fallback path
- Feature adoption: show the workflow to 5 existing users and ask what they would stop doing if it shipped

The validation step must produce a decision:

- Build now
- Build a smaller version
- Change target user
- Change channel
- Stop

## Output Format

Return this structure:

```markdown
## Before You Build Verdict

Verdict: Build / Validate first / Do not build yet
Confidence: High / Medium / Low

### One-sentence read
<Plain-English summary of the product risk.>

### Risk score
| Dimension | Score | Evidence | What would reduce risk |
|---|---:|---|---|
| Demand |  |  |  |
| Monetization |  |  |  |
| Distribution |  |  |  |
| Retention |  |  |  |
| Trust |  |  |  |
| Platform |  |  |  |
| Feature adoption |  |  |  |

Total: <score>/35

### Riskiest assumption
<The assumption most likely to make the build fail.>

### Smallest validation step
<One concrete action that can be done before implementation.>

### Build scope if validated
<The smallest useful version to build after the test passes.>
```

## Common Mistakes

- Starting with architecture before the buyer is clear
- Treating a landing page signup as proof of payment intent
- Asking users what they want instead of what they did recently
- Building for "everyone who uses AI" instead of one reachable segment
- Ignoring distribution until after launch
- Assuming a platform will keep API access stable
- Adding more features when the core value is still unproven
- Using a large MVP to answer a question a manual test could answer

## Final Rule

If the riskiest assumption can be tested without code, test it before code.

If it cannot be tested without code, build only the smallest artifact that tests that assumption.

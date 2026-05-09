---
name: review-responder
description: >-
  Monitor customer reviews across platforms and generate thoughtful, brand-aligned
  responses. Flags urgent negative reviews for priority attention, drafts responses
  that turn detractors into promoters, and tracks review sentiment trends over time.
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: shop-restaurant
  tags:
    - reviews
    - reputation-management
    - customer-feedback
    - google-reviews
    - yelp
    - social-proof
    - hospitality
---

# Review Responder

## Core Principles

Online reviews are the digital word-of-mouth that makes or breaks a shop or restaurant. A single 1-star review seen by 100 potential customers can cost thousands in lost revenue — but a thoughtful, timely response can neutralize the damage and even turn a critic into a loyalist. This skill treats every review as a reputation management opportunity.

### The Four Review Response Rules

1. **Speed matters.** Respond within 24 hours (ideally < 4 hours for negative reviews). A fast response signals you care.
2. **Personalize, don't templatize.** Generic "Thank you for your feedback" responses feel dismissive. Reference specifics.
3. **Take negative conversations offline.** Public arguments never end well. Address, apologize, and invite a private conversation.
4. **Amplify the positive.** A great review is marketing content. Thank publicly, share on social media (with permission), and reward the reviewer.

---

## Skill Workflow

### Step 1 — Connect Review Sources

Ask the user which platforms they use. Common sources:

- Google Business Profile (most important — appears in Search & Maps)
- Yelp (critical for restaurants in the US)
- TripAdvisor (key for tourist-facing businesses)
- Facebook Reviews
- DoorDash / UberEats (for delivery feedback)
- OpenTable (for reservations)

**For each platform, collect:**
- Rating (1-5)
- Review text
- Date of review
- Reviewer name
- Any business reply already posted

### Step 2 — Triage by Sentiment & Urgency

Classify each review:

| Category | Rating | Sentiment | Response Priority |
|----------|--------|-----------|-------------------|
| 🔴 **Crisis** | 1 star | Angry, accuses of health/safety issue, public figure | Immediate (< 1 hr) |
| 🟠 **Critical** | 1-2 stars | Significant complaint, specific issue, or repeat detractor | Same day |
| 🟡 **Mixed** | 3 stars | Balanced feedback — some praise, some criticism | Within 24 hrs |
| 🟢 **Positive** | 4-5 stars | Happy customer, specific praise | Within 48 hrs |
| ⚪ **Neutral** | Any | Factual, no emotion (e.g., "They exist") | Low priority |

**If a crisis review is detected:**
> 🚨 **ALERT:** 1-star review on Google mentions "found a foreign object in food." This is a health/safety escalation. Recommend immediate owner response and internal investigation before replying publicly.

### Step 3 — Draft Responses by Category

**🔴 Crisis / 🟠 Critical (1-2 stars)**

Structure: **Acknowledge → Apologize → Explain (briefly) → Make it right → Move offline**

```
Dear [Name],

Thank you for bringing this to our attention. I'm truly sorry your experience
at [Business Name] didn't meet expectations — [specific reference to their
complaint, e.g., "the wait time on Friday night"] is not the standard we aim for.

We've already [specific action taken, e.g., "reviewed our Friday staffing
plan to ensure faster seating"]. I'd love the chance to make this right
personally. Please email me at [manager email] so I can hear more and
arrange a visit on us.

Best,
[Manager Name]
```

**🟡 Mixed (3 stars)**

Structure: **Thank → Acknowledge specifics → Address what they flagged → Invite another visit**

```
Hi [Name],

Thanks for the balanced feedback. We're glad you enjoyed [specific praise,
e.g., "the burger and fries"] — and we hear you on [specific criticism,
e.g., "the slow service during the dinner rush"]. We've taken note and
will work on [specific improvement].

We'd love to have you back to show you our best. Next time, mention this
message and we'll [small gesture, e.g., "start you with a drink on us"].

Cheers,
[Manager Name]
```

**🟢 Positive (4-5 stars)**

Structure: **Thank → Reference specifics → Personalize → Invite return**

```
Hi [Name],

Thank you so much for the kind words! We're thrilled you loved [specific
item or experience, e.g., "the truffle fries and the atmosphere"]. [Staff
member name] was especially happy to hear your shout-out.

Looking forward to serving you again soon!

Best,
[Manager Name]
```

### Step 4 — Sentiment Trend Report

After processing all reviews, generate a trend summary:

```
📊 REVIEW SUMMARY — March 2025
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Reviews: 23
Average Rating: 4.2 ⭐
Platforms: Google (14), Yelp (6), TripAdvisor (3)

SENTIMENT BREAKDOWN
  Positive (4-5):  16 (70%)
  Mixed (3):        5 (22%)
  Critical (1-2):   2 (8%)  ← Up from 4% last month

COMMON THEMES
  👍 Praised:     "friendly staff" (8 mentions), "great coffee" (6)
  👎 Flagged:     "wait time" (5 mentions), "parking" (4)

TREND: Rating trending down slightly. Wait time complaints increasing.
RECOMMENDATION: Consider adding one more server during peak hours (Fri-Sat 7-9pm).
```

### Step 5 — Escalation & Internal Learning

For reviews that reveal operational issues:

- Log the issue type (service speed, food quality, cleanliness, etc.)
- Track frequency — if "cold food" appears in 3 reviews this month, it's a kitchen problem, not a one-off
- Generate an internal ops note (not shared publicly)

> **Internal note:** "Cold food mentioned in 3 reviews this week. Check: is the pass heater working? Are expo staff calling ready plates promptly? Address with kitchen team."

### Step 6 — Schedule Review Monitoring

> "I can check your reviews daily and flag anything urgent. Would you like me to set that up? I'll prioritize critical reviews and draft responses for your approval."

---

## Trigger Phrases

| Phrase | What Happens |
|--------|-------------|
| "Check my reviews" | Fetches recent reviews from connected platforms |
| "Draft a response to [name/review]" | Generates a personalized response draft |
| "Any new bad reviews?" | Shows critical reviews requiring immediate attention |
| "How are my reviews this month?" | Generates sentiment trend report |
| "Reply to all reviews from yesterday" | Batch drafts responses for unaddressed reviews |
| "What are customers complaining about?" | Extracts common themes from recent negative reviews |
| "Share our best review" | Formats a glowing review for social media sharing |

---

## Key Instructions Summary

1. **Connect sources:** Google, Yelp, TripAdvisor, Facebook, delivery platforms
2. **Triage:** Sort by urgency — crisis > critical > mixed > positive
3. **Draft:** Use structured response templates personalized to each review
4. **Track sentiment:** Generate trend reports with common themes
5. **Escalate internally:** Log operational issues for the team
6. **Monitor regularly:** Set daily check-in cadence for new reviews

---

## Common Mistakes

1. **Copy-paste responses.** Customers can smell a template. Reference their specific words.
2. **Arguing publicly.** "Actually, you're wrong, we were fully staffed" — never wins. Thank them for the feedback and move on.
3. **Ignoring 3-star reviews.** Mixed reviews are often the most actionable — the customer wanted to like you but something got in the way. Fix it.
4. **Slow response time.** A review unanswered for a week signals indifference. Set response SLAs.
5. **Not tracking patterns.** One "slow service" complaint is a person's bad night. Five is a staffing problem. Watch the trends, not the noise.

---

*"Every review is a gift — even the painful ones. They tell you exactly where to improve."*

---
name: risk-management
description: 'Risk identification, assessment matrices, mitigation strategies, BCP, and risk reporting'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: finance-legal
  tags: [risk, management, compliance, audit, business-continuity]
---

# Risk Management

Identify, assess, and mitigate business and operational risks.

## Risk Assessment Framework

### Identification Categories
| Category | Examples |
|----------|----------|
| Strategic | Competition, market shifts, M&A integration |
| Operational | System failures, process gaps, human error |
| Financial | Currency, credit, liquidity, fraud |
| Compliance | Regulatory changes, data privacy, licensing |
| Reputational | Social media, PR crises, customer satisfaction |
| Security | Data breaches, cyber attacks, insider threats |

### Assessment Matrix
```
Likelihood × Impact = Risk Score (1-25)

              Impact
         Low  Med  High
Likely    3    6     9
Possible  2    4     6
Rare      1    2     3

Score 1-3: Accept | 4-6: Mitigate | 7-9: Avoid/Transfer
```

## Mitigation Strategies

| Strategy | When | Example |
|----------|------|---------|
| Avoid | High risk, low reward | Don't enter unstable market |
| Reduce | Manageable risk | Add security controls, backups |
| Transfer | Financial risk but can't eliminate | Insurance, vendor contracts |
| Accept | Low impact or expensive to fix | Minor process inefficiencies |

## Business Continuity Plan (BCP)

### Components
1. **Critical functions** — what must keep running?
2. **RTO** (Recovery Time Objective) — how fast to restore?
3. **RPO** (Recovery Point Objective) — how much data loss tolerated?
4. **Alternate site** — where to operate if primary is down?
5. **Communication plan** — who notifies whom, how?

### Testing
- Tabletop exercises: quarterly
- DR test: annually minimum
- Failover test: every 6 months
- Update BCP after each test or major change

## Risk Register Template
```markdown
| ID | Risk | Category | Likelihood | Impact | Score | Owner | Mitigation | Status |
|----|------|----------|-----------|--------|-------|-------|------------|--------|
| R01 | ...  | ...      | 3          | 4      | 12    | ...   | ...        | Active |
```

---
name: sre-practices
description: 'SLIs/SLOs/SLAs, error budgets, incident response, postmortems, and reliability patterns'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: devops
  tags: [sre, reliability, slo, incident-response, postmortem]
---

# SRE Practices

Apply Site Reliability Engineering principles.

## Service Level Concepts

| Term | Definition | Example |
|------|------------|---------|
| SLI | Measured metric | Request latency p95 < 500ms |
| SLO | Target threshold for SLI | 99.9% of requests < 500ms |
| SLA | Contractual commitment (usually looser than SLO) | 99.5% uptime |

### Choosing SLOs
- Pick metrics users actually care about
- Start with availability + latency + durability
- Tighten SLOs over time as reliability improves
- Don't over-constrain (cost/effort vs. benefit)

## Error Budgets

```
Error Budget = 100% - SLO
Example: 99.9% SLO → 0.1% error budget = ~8.7 hours/month
```

### How Error Budgets Work
- If error budget remaining → can deploy new features
- If error budget exhausted → freeze deployments, focus on reliability
- Error budget burn rate alerts trigger incident response
- Balance innovation velocity with system stability

## Incident Response

### Severity Levels
| Level | Definition | Response |
|-------|-----------|----------|
| SEV1 | System down, affecting many users | Immediate, all hands |
| SEV2 | Degraded but operational | 30min response |
| SEV3 | Minor issue, workaround exists | Next business day |
| SEV4 | Cosmetic, non-critical | Next sprint |

### Incident Command System
- **Incident Commander**: Coordinates response
- **Communications Lead**: Status updates, stakeholder comms
- **Operations Lead**: Technical investigation
- **Scribe**: Timeline and action log

## Postmortem Culture
- Blameless: systems failed, not people
- Focus on: detection, response, prevention
- Action items with owners and due dates
- Share postmortems org-wide
- Track action items to completion

## Reliability Patterns
- Circuit breaker: stop cascading failures
- Bulkhead: isolate failure domains
- Retry with exponential backoff + jitter
- Rate limiting: protect against traffic spikes
- Graceful degradation: degrade features, not the whole system

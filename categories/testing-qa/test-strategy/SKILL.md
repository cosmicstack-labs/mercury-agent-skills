---
name: test-strategy
description: 'Test pyramid, risk-based testing, test planning, coverage metrics, and SDLC integration'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: testing-qa
  tags: [testing, strategy, qa, quality, automation]
---

# Test Strategy

Design comprehensive test strategies that catch bugs early and scale with your product.

## The Modern Test Pyramid

```
     E2E (5%)
    Integration (15%)
  Component/Contract (30%)
      Unit Tests (50%)
```

### Layer Details

| Layer | Scope | Speed | Who Owns |
|-------|-------|-------|----------|
| Unit | Single function/class | ms | Developers |
| Component | UI component/module | ms-s | Developers |
| Contract | API boundaries | s | Dev + QA |
| Integration | Service interactions | s-min | QA |
| E2E | Full user flows | min | QA + DevOps |

## Risk-Based Testing

1. **Identify risks** for each feature (data loss, security, UX, performance)
2. **Score** likelihood × impact
3. **Allocate test effort** proportionally to risk score
4. **Reassess** after each release

## Coverage Goals

| Type | Target |
|------|--------|
| Line coverage | >80% |
| Branch coverage | >75% |
| Mutation score | >60% |
| Critical path E2E | 100% |
| API endpoint tested | >90% |

## Test Planning Template
```markdown
## Feature: [Name]
- Unit tests: [count] — [files/scope]
- Integration tests: [count] — [services involved]
- E2E tests: [count] — [critical paths]
- Edge cases: [list]
- Performance threshold: [metric]
```

## CI Integration
- Unit/component tests on every PR (fail under 5 min)
- Integration suite on every merge to main
- E2E nightly or on demand
- Flaky test detection → auto-quarantine → alert

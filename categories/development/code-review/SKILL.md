---
name: code-review
description: 'Systematic code review methodology, PR checklist, feedback techniques, and review automation patterns'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: development
  tags: [code-review, pull-requests, collaboration, quality-assurance, automation]
---

# Code Review

Systematic code review methodology for consistent, effective, and humane reviews that improve both code and team culture.

## Core Principles

### 1. Review the Author, Not Just the Code
Every review is a human interaction. The goal is shared understanding and team growth, not ego or gatekeeping. Be constructive, specific, and kind.

### 2. Catch Problems Early, Fix Them Forever
A bug caught in review costs 10x less than one caught in production. Use each review as an opportunity to add automated checks so the same issue never needs a human review again.

### 3. Balance Depth with Velocity
Deep reviews catch more issues but slow delivery. Shallow reviews miss things. Adapt depth to risk: security-critical code gets exhaustive review; trivial config changes get a quick skim.

### 4. Automate Everything You Can
If a reviewer can point out a formatting issue, a lint violation, or a missing test — that check should be automated. Human attention is for design, logic, and tradeoffs.

---

## Code Review Scoring Rubric

| Dimension | 1 (Poor) | 3 (Adequate) | 5 (Excellent) |
|-----------|----------|---------------|----------------|
| **Correctness** | Obvious bugs missed | Catches logic errors | Identifies edge cases + security issues |
| **Constructiveness** | "This is wrong" comments | Points to specific lines | Suggests alternatives + explains reasoning |
| **Speed** | Reviews take >5 days | Reviews within 48 hours | Reviews within 4 hours (same day) |
| **Depth** | Skims only formatting | Checks logic + tests | Reviews design, security, performance, test coverage |
| **Automation** | No CI checks | Linting + basic tests | Pre-commit hooks, auto-review bots, coverage gates |
| **Consistency** | Every review is different | Team has some standards | Defined checklist, shared expectations, documented norms |

Target: **4+ in every dimension** for a mature review culture.

---

## Actionable Guidance

### The PR Checklist

Use this as a template. Adapt to your stack and team norms.

#### Structure & Design
- [ ] Does the code solve the stated problem? (Check the issue/ticket)
- [ ] Is the change at the right abstraction level? Not over-engineered, not under-designed
- [ ] Does it follow the project's architecture patterns?
- [ ] Are new dependencies justified? Could existing ones be used instead?
- [ ] Is the PR scope contained? No unrelated refactoring mixed in

#### Correctness
- [ ] Do all edge cases have tests? (Empty states, null inputs, timeouts)
- [ ] Are error paths handled? Not just happy paths
- [ ] Are there race conditions or timing issues? (Async, threading, DB transactions)
- [ ] Does input validation happen at system boundaries?
- [ ] Are state transitions valid? (Status machines, lifecycle changes)

#### Security
- [ ] Is user input sanitized? (XSS, SQL injection, command injection)
- [ ] Are authentication/authorization checks in place?
- [ ] Are secrets hardcoded? (API keys, passwords, tokens)
- [ ] Is there proper rate limiting or abuse protection?
- [ ] Are dependencies checked for known vulnerabilities?

#### Performance
- [ ] Are there N+1 queries? (Especially in ORM code)
- [ ] Is there unnecessary computation in hot paths?
- [ ] Are resources properly released? (File handles, DB connections, memory)
- [ ] Could this change cause a regression under load?
- [ ] Are caching opportunities considered?

#### Testing
- [ ] Are there tests for new functionality?
- [ ] Do existing tests adequately cover the change?
- [ ] Are tests deterministic? (No flaky tests)
- [ ] Do tests test behavior, not implementation?
- [ ] Is there appropriate coverage of error cases?

#### Readability & Maintainability
- [ ] Are names clear and descriptive?
- [ ] Is there unnecessary complexity? (Over-abstracted, over-patterned)
- [ ] Is documentation updated? (README, API docs, inline comments)
- [ ] Are there TODO/FIXME/HACK comments that need addressing?
- [ ] Will this be understandable in 6 months?

### Feedback Techniques

#### The SBI Model (Situation-Behavior-Impact)

```markdown
**Situation**: In the `calculateDiscount()` function (line 42-58)
**Behavior**: You're using floating-point arithmetic for currency values
**Impact**: This can cause precision errors — 0.1 + 0.2 !== 0.3 in IEEE 754
**Suggestion**: Consider using `Decimal` from the standard library instead
```

#### Classification Tags

Prefix review comments for clarity:

| Prefix | Meaning | Example |
|--------|---------|---------|
| **nit:** | Minor preference, non-blocking | `nit: trailing whitespace on line 12` |
| **suggestion:** | Alternative approach | `suggestion: consider extracting this validation to a shared utility` |
| **blocking:** | Must be resolved before merge | `blocking: this SQL query is vulnerable to injection` |
| **question:** | Seeking understanding | `question: why is the timeout set to 30s here?` |
| **praise:** | Positive reinforcement | `praise: great use of the strategy pattern here — very extensible` |

#### The Feedback Sandwich (Use Sparingly)

```
Praise:  "Great approach using the observer pattern here."
Constructive: "One concern — the unsubscribe logic isn't cleaning up listeners."
Praise:  "Overall this is solid. Thanks for the thorough test coverage."
```

**Caution**: The sandwich can feel manipulative. Sometimes direct feedback is better.

#### Code Review as Conversation

```javascript
// Reviewer: "I'm worried about this early return — what happens if data is null?"
// Author: "Good catch — data shouldn't be null here but adding a guard makes it safer."
// Reviewer: "Yeah, and maybe log a warning so we can monitor it in prod?"

// Final code:
function processUserData(data) {
  if (!data) {
    logger.warn('processUserData called with null data');
    return { error: 'No data provided' };
  }
  // ... rest of processing
}
```

### Review Automation Patterns

#### Automated Pre-Checks (Run on PR Open)

```yaml
# .github/workflows/review-checks.yml
name: Pre-review Checks
on: [pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test -- --coverage
      - uses: actions/comment-on-pr@v1
        if: failure()
        with:
          message: '⚠️ Tests failed. Please check the CI logs.'
  size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/labeler@v4
      - run: |
          SIZE=$(git diff --stat main...HEAD | tail -1 | awk '{print $4}')
          if [ $SIZE -gt 400 ]; then
            echo "⚠️ PR exceeds 400 lines — consider splitting"
          fi
```

#### Danger.js / Danger.swift / Danger-Kotlin

Danger runs rules in CI to automate common review comments:

```javascript
// dangerfile.js
import { danger, warn, fail, message } from 'danger'

const { modified, created } = danger.git

// Enforce PR description
if (!danger.github.pr.body || danger.github.pr.body.length < 10) {
  warn('Please provide a more detailed PR description.')
}

// Enforce changelog entry
const hasChangelog = modified.includes('CHANGELOG.md')
if (!hasChangelog && !danger.github.pr.labels.includes('no-changelog')) {
  warn('Changes should be documented in CHANGELOG.md')
}

// Warn on large PRs
const totalLines = danger.github.pr.additions + danger.github.pr.deletions
if (totalLines > 400) {
  warn(`Large PR (${totalLines} lines). Consider splitting into smaller PRs.`)
}

// Check for test files
const hasTests = created.some(f => f.includes('.test.') || f.includes('.spec.'))
if (!hasTests && modified.some(f => f.endsWith('.ts') && !f.endsWith('.test.ts'))) {
  warn('No test files found — consider adding tests for new/modified code')
}

// Flag debug code
const debugStatements = ['console.log', 'debugger', 'print(']
const changes = [...danger.git.created_files, ...danger.git.modified_files]
changes.forEach(file => {
  // Check file content for debug statements
})
```

#### Review Bot Rules

```javascript
// review-bot-rules.json
{
  "rules": [
    {
      "name": "no-debugger",
      "pattern": "debugger;?",
      "message": "🚫 Remove `debugger` statement before merging",
      "severity": "error"
    },
    {
      "name": "no-console-log",
      "pattern": "console\\.(log|debug|info)\\(",
      "message": "⚠️ Use a proper logger instead of console.log",
      "severity": "warning",
      "exceptions": ["src/cli/", "scripts/"]
    },
    {
      "name": "todo-left",
      "pattern": "TODO|FIXME|HACK",
      "message": "📝 TODO/FIXME found — is this intentional?",
      "severity": "warning"
    },
    {
      "name": "hardcoded-secret",
      "pattern": "(?:api[_-]?key|secret|password|token)\\s*[:=]\\s*['\"][A-Za-z0-9]{16,}",
      "message": "🔑 Possible hardcoded secret detected",
      "severity": "error"
    }
  ]
}
```

### Reviewing by Type

#### New Feature Review
1. Understand the requirements first — read the linked issue/ticket
2. Check that the feature does what was requested, no more, no less
3. Verify test coverage for the new functionality
4. Check for regressions in existing behavior
5. Review the API surface — is it consistent with the rest of the system?

#### Bug Fix Review
1. Read the bug report — understand the reproduction steps
2. Verify that the fix actually resolves the reported issue
3. Check that there's a regression test that would catch this bug
4. Look for the same bug pattern elsewhere in the codebase
5. Consider whether the fix addresses the root cause or just the symptom

#### Refactoring Review
1. Verify behavior preservation — tests should pass without modification
2. Check that the refactoring actually improves the code (not just changes it)
3. Look for missing abstractions or extracted patterns
4. Ensure the refactoring scope is contained (no feature bugs hidden in refactor)
5. Confirm documentation is updated for renamed/moved code

#### Dependency Update Review
1. Read the changelog of the updated dependency
2. Check for breaking changes and API differences
3. Verify that tests pass with the new version
4. Consider security implications and vulnerability fixes
5. Audit whether the new version introduces new transitive dependencies

### Building a Review Culture

#### Team Standards Document

```markdown
# Our Team's Code Review Standards

## Expectations
- Review requests within 4 hours during working hours
- PRs < 400 lines get reviewed within 24 hours
- PRs < 100 lines get reviewed within 4 hours
- No PR merged without at least one approval
- Critical fixes can skip review but need post-merge review

## What We Review In Depth
- Security-sensitive code (auth, payments, PII)
- Public API changes
- Database schema changes
- Concurrency/async code

## What We Skim
- Generated code
- Configuration files
- Test-only changes (if trivial)
- Dependency bumps (if lockfile-only)
```

#### Review Velocity Metrics

Track these to improve your team's review culture:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Time to first review | <4 hours | GitHub API: first review timestamp - PR open timestamp |
| Time to merge | <24 hours for small PRs | GitHub API: merge timestamp - PR open timestamp |
| Review depth | >2 comments per 100 lines | Count comments vs line count |
| Review latency | <1 hour for blocking comments | Time between blocking comment and response |
| Approval ratio | >80% PRs approved on first review | Count PRs approved vs PRs with revisions requested |

#### Handling Disagreements

```markdown
## When You Disagree With a Review

1. **Ask clarifying questions** — "I'm not sure I understand the concern, could you elaborate?"
2. **Explain your reasoning** — "I chose this approach because..."
3. **Acknowledge valid points** — "That's a good point about edge cases, I hadn't considered that."
4. **Propose compromises** — "How about I keep the current structure but add better documentation?"
5. **Escalate if needed** — "We have two valid approaches here. Let's get a third opinion or make a team decision."

## When An Author Disagrees With Your Review

1. **Re-evaluate** — Are you being too strict? Is this truly important?
2. **Accept good counter-arguments** — "You're right, the performance concern is negligible here."
3. **Agree to disagree with documentation** — "Let's document this tradeoff and move on."
4. **Use blocking sparingly** — Only block for correctness, security, or maintainability issues.
```

---

## Common Mistakes

1. **Nitpicking style while missing logic bugs**: Style is automatable. Logic isn't. Prioritize your attention.
2. **Rubber-stamping without reviewing**: Trust but verify. Even good developers make mistakes.
3. **Being overly critical on the first pass**: Start with the big picture, then zoom in. Don't overwhelm the author.
4. **Not reviewing at all**: "LGTM" without review is not code review — it's code abandonment.
5. **Reviewing too late**: Stale PRs accumulate merge conflicts and context loss. Review promptly.
6. **Forgetting positive feedback**: Review isn't just for finding problems. Acknowledge good solutions.
7. **Applying personal style preferences as rules**: Team conventions > personal preferences. Don't block over tabs vs spaces.
8. **Merging failing CI**: Never override CI failures without explicit team agreement.
9. **Not automating the automatable**: If a human can write a regex for it, a bot can check it forever.

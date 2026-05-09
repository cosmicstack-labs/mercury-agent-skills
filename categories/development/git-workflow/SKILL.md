---
name: git-workflow
description: 'Git best practices, branching strategies, commit conventions, and code review patterns'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: development
  tags: [git, version-control, branching, code-review, collaboration]
---

# Git Workflow

Master the fundamentals of version control collaboration — from branching strategy to commit hygiene to review culture.

## Core Principles

### 1. Commits Are Communication
Every commit message is a message to your future self and your teammates. Write for the reader who needs to understand *why* a change was made, not just *what* changed.

### 2. Branch Intentionally
Your branching strategy should match your team size, release cadence, and deployment model. The best strategy is the one your team actually follows consistently.

### 3. Review With Empathy
Code review is a conversation, not an inspection. The goal is shared understanding and improved quality, not catching mistakes.

### 4. Rebase Thoughtfully
History matters. Clean history helps debugging and release management. But never rebase shared branches without team coordination.

---

## Git Workflow Maturity Model

| Level | Branching | Commits | Reviews | CI |
|-------|-----------|---------|---------|-----|
| **1: Ad-hoc** | All on main | "Update" messages | None | None |
| **2: Basic** | Feature branches | Some context in messages | Occasional | Lint checks |
| **3: Standard** | Trunk-based or GitFlow | Conventional commits | Required PRs | Full test suite |
| **4: Advanced** | Short-lived branches | Atomic, rebased commits | Automated + manual | Deploy previews |
| **5: Elite** | Feature flags on trunk | Semantic versioning from commits | Async + sync pairing | Auto-deploy to prod |

Target: **Level 3+** for team projects. Level 4+ for high-velocity teams.

---

## Actionable Guidance

### Branching Strategies

#### Trunk-Based Development (Recommended for most teams)
- **Main branch**: Always deployable. Protected — no direct pushes.
- **Feature branches**: Short-lived (1-2 days max). Branch from main, merge back to main.
- **Release branches**: Cut from main at release time. Bug fixes cherry-picked.

```
main:    o---o---o---o---o---o---o
              \         /
feature-A:     o---o---o
                    \
feature-B:         o---o
```

**When to use**: Continuous deployment, small teams, mature CI.

#### GitFlow (For scheduled releases)
- **main**: Production releases only
- **develop**: Integration branch
- **feature/***: Branch from develop, merge to develop
- **release/***: Branch from develop, merge to main + develop
- **hotfix/***: Branch from main, merge to main + develop

**When to use**: Scheduled releases, multiple versions in support, larger teams.

### Commit Conventions

#### Conventional Commits (Recommended)

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`

```bash
feat(auth): add OAuth2 login flow

Implements Google and GitHub OAuth providers.
Closes #142
BREAKING CHANGE: Drops support for password-based auth
```

**Benefits**: Automatic changelog generation, semantic versioning, clear intent.

**Atomic commits**: Each commit should represent one logical change. If you find yourself writing "and" in the description, split the commit.

```bash
# Bad: Mixed concerns
"Add user settings page and fix login bug and update deps"

# Good: Three atomic commits
"feat(settings): add user preferences page"
"fix(auth): handle expired session tokens"
"chore(deps): update lodash to 4.17.21"
```

### Code Review Patterns

#### Review Checklist

**For every PR:**
- [ ] Does the code solve the stated problem?
- [ ] Are there tests for new functionality?
- [ ] Do existing tests still pass?
- [ ] Is the code at the right abstraction level?
- [ ] Are error paths handled?
- [ ] Are there security concerns (XSS, injection, auth)?
- [ ] Is documentation updated?

#### Giving Feedback

```
Bad:  "This is wrong. Do it like this instead."
Good: "I'm concerned about edge cases here — what happens if the user list is empty? Consider using .get() with a default."

Bad:  "This function is too long."
Good: "The validation logic and the rendering logic seem like separate concerns. Could we extract the validation into its own function?"
```

**Review types:**
- **Nitpick**: Minor style preference, non-blocking. Prefix with "nit:"
- **Suggestion**: Alternative approach, discuss. "What do you think about..."
- **Blocking**: Must be resolved before merge. Explain why it's critical.
- **Question**: Seeking understanding. "I'm trying to understand why..."

#### Responding to Reviews

- Don't take feedback personally. Code reviews are about the code, not you.
- Thank reviewers for catching issues.
- If you disagree, explain your reasoning — but be open to being wrong.
- When you make a requested change, resolve the conversation.
- If something is deliberately chosen, explain (and document) the tradeoff.

### Git Hygiene

#### Before You Commit

```bash
# Stage related changes only
git add -p   # Interactive staging — commit only what's relevant

# Review your diff before committing
git diff --staged

# Write the commit message first, then commit
git commit    # Opens editor — write a good message
```

#### Before You Push

```bash
# Rebase on latest main
git fetch origin
git rebase origin/main

# Check what you're about to push
git log origin/main..HEAD

# Squash fixup commits
git rebase -i origin/main
```

#### Pull Request Best Practices

- **Keep PRs small**: <400 lines ideal. Large PRs get shallow reviews.
- **One concern per PR**: Don't refactor 10 files and add a feature in the same PR.
- **Write a good description**: What, why, how, testing, screenshots.
- **Self-review first**: Go through your own diff before requesting review.
- **Respond promptly**: Don't let PRs languish for days.

---

## Common Mistakes

1. **Committing secrets**: Never commit API keys, passwords, or tokens. Use `.env` files and secret managers.
2. **Large untracked files**: Check your `.gitignore`. Don't commit `node_modules`, build artifacts, or generated files.
3. **Merge commits in a clean-history workflow**: If your team prefers linear history, rebase instead of merging.
4. **Forcing pushes to shared branches**: `git push --force` is dangerous on shared branches. Use `--force-with-lease`.
5. **Reviewing too late**: Review within 24 hours. Stale PRs create context-switching overhead.
6. **Merging failing CI**: Never merge a PR with failing checks, even if "it works on my machine."
7. **Descriptions are useless**: "Fix bug" tells no one anything. "Fix timeout in user search when database has >10k records" tells everything.

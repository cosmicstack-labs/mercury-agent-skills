---
name: dependency-management
description: 'Version pinning, vulnerability scanning, monorepo patterns, and upgrade workflows'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: development
  tags: [dependencies, package-management, security, monorepo, upgrades]
---

# Dependency Management

Safely manage project dependencies at scale.

## Version Strategy

### Pinning Approaches
| Strategy | Format | Risk | Best For |
|----------|--------|------|----------|
| Exact | `1.2.3` | Low | Docker, CI, production |
| Caret | `^1.2.3` | Medium | Libraries, apps with good tests |
| Tilde | `~1.2.3` | Low-Medium | Conservative updates |
| Range | `>=1.2.3 <2.0.0` | High | Rare, legacy |
| Floating | `*` | Very High | Never in production |

**Rule**: Pin exact versions for production, caret for libraries.

## Vulnerability Scanning

### Tools
- **npm audit** / `yarn audit` — quick JS check
- **Dependabot** — GitHub-native, auto PRs
- **Snyk** — deeper scanning, prioritization
- **Trivy** — container scanning
- **OWASP Dependency-Check** — Java/.NET

### Workflow
1. Scan on every PR (fail on critical/high)
2. Weekly full scan of all repos
3. Patch critical (<7 days), high (<30 days)
4. Track CVEs by severity in dashboard
5. SBOM generation per release

## Monorepo Patterns
- Use workspaces (npm/yarn/pnpm workspaces)
- Shared dependency versions (single source of truth)
- Independent vs locked version strategy
- Deduplicate (npx dedupe after major changes)
- Audit tree to find conflicting transitive deps

## Upgrade Workflow
1. Check changelog for breaking changes
2. Run tests (you have tests, right?)
3. Upgrade one major version at a time
4. Run full test suite + build
5. Deploy to staging, verify
6. Monitor for regressions (logs, metrics, errors)

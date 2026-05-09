---
name: security-audit
description: Comprehensive security audit methodology covering OWASP Top 10, dependency scanning, threat modeling, and vulnerability assessment. Provides actionable guidance for conducting systematic security audits from scope definition to final reporting.
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: security
  tags:
    - security-audit
    - owasp-top-10
    - threat-modeling
    - vulnerability-assessment
    - penetration-testing
    - sast
    - dast
    - dependency-scanning
    - cvss
    - stride
---

# Security Audit Skill

A systematic approach to evaluating the security posture of applications, systems, and infrastructure. This skill equips you with the methodology, tooling, and reporting standards needed to conduct professional-grade security audits.

---

## Core Principles

### 1. **Defense in Depth**
   Security is not a single control but layered protections. An audit must evaluate each layer independently and in combination. A failure in one layer should be caught by another.

### 2. **Least Privilege**
   Every component, user, and process should have the minimum permissions necessary to function. Audits must verify that privilege boundaries are enforced, not just declared.

### 3. **Assume Breach**
   Design and audit with the assumption that an attacker has already compromised some part of the system. What can they access? What can they pivot to?

### 4. **Repeatability**
   Audit procedures must be reproducible. If two auditors run the same methodology against the same target, they should reach consistent conclusions.

### 5. **Evidence-Based Findings**
   Every finding must be backed by reproducible evidence — a screenshot, a log entry, a network capture, or a code path. "Trust me" is not a finding.

### 6. **Continuous Improvement**
   A security audit is a snapshot in time. The goal is not just to find bugs but to improve the process so fewer bugs are introduced in the future.

---

## Security Audit Maturity Model

| Level | Name | Description |
|-------|------|-------------|
| **L0** | Ad Hoc | No formal audits. Security reviews happen reactively after incidents. |
| **L1** | Basic | Manual vulnerability scanning with off-the-shelf tools. No standardized methodology or reporting. |
| **L2** | Defined | Formal audit methodology documented. OWASP Top 10 covered. Findings tracked with CVSS scoring. |
| **L3** | Integrated | Audits integrated into CI/CD pipeline. SAST/SCA runs on every commit. DAST runs on staging. Dedicated threat modeling sessions. |
| **L4** | Proactive | Continuous security validation. Red team exercises. Bug bounty program. Attack surface management automated. Security metrics tracked over time. |
| **L5** | Adaptive | Automated remediation for common findings. AI-assisted threat modeling. Self-healing security controls. Audit findings feed back into developer training. |

**Target maturity:** For most organizations, L3 is the realistic target. L4 and L5 require dedicated security teams and significant investment.

---

## OWASP Top 10 (Current)

The OWASP Top 10 represents the most critical web application security risks. Every security audit must assess these categories:

### A01: Broken Access Control
- **What to check:** Missing or misconfigured access controls on API endpoints, admin panels, file uploads, and direct object references (IDOR).
- **Common target:** `/api/users/{id}` endpoints that don't verify the requesting user owns that resource.
- **Testing:** Manually modify user IDs, role parameters, or privilege tokens in requests.

### A02: Cryptographic Failures
- **What to check:** Weak TLS versions, missing HSTS headers, hardcoded keys, weak password hashing (MD5, SHA1), exposed secrets in source code.
- **Testing:** TLS scanner (testssl.sh), review `.env` files, check password storage algorithms.

### A03: Injection
- **What to check:** SQL, NoSQL, OS command injection, LDAP injection, and template injection (SSTI).
- **Testing:** Fuzz input fields with special characters (`'`, `"`, `;`, `--`, `/*`), test parameterized queries usage in code review.

### A04: Insecure Design
- **What to check:** Missing rate limiting, insecure password recovery flows, missing security controls at the design level.
- **Testing:** Review architecture diagrams, sequence flows, assess whether security was considered pre-implementation.

### A05: Security Misconfiguration
- **What to check:** Default credentials, unnecessary open ports, verbose error messages, missing security headers (CSP, X-Frame-Options), directory listing enabled.
- **Testing:** Run scanners (Nuclei, Nikto), manual header inspection with curl/burp.

### A06: Vulnerable and Outdated Components
- **What to check:** Known CVEs in dependencies, outdated libraries, unpatched frameworks.
- **Testing:** SCA tools (Trivy, Dependabot, Snyk), manual version checks against CVE databases.

### A07: Identification and Authentication Failures
- **What to check:** Weak password policies, no MFA, session fixation, credential stuffing vulnerability, no account lockout.
- **Testing:** Attempt brute force, check session token entropy, inspect JWT implementations.

### A08: Software and Data Integrity Failures
- **What to check:** Unsigned software updates, insecure CI/CD pipelines, untrusted data deserialization.
- **Testing:** Review CI/CD access controls, test deserialization of untrusted data, verify software signing.

### A09: Security Logging and Monitoring Failures
- **What to check:** Missing audit logs, no alerting on suspicious activity, logs that don't capture user identity or actions.
- **Testing:** Attempt malicious actions and verify they appear in logs. Review log retention policies.

### A10: Server-Side Request Forgery (SSRF)
- **What to check:** Features that fetch external URLs (webhooks, avatars, document previews) without allowlist validation or network restrictions.
- **Testing:** Point the application at internal services (`http://169.254.169.254/`, `http://localhost:9200/`).

---

## Audit Methodology

A structured audit follows five phases:

```
[SCOPE] → [RECON] → [TESTING] → [REPORTING] → [REMEDIATION]
```

### Phase 1: Scope Definition

Before any testing begins, define the boundaries:

- **In scope:** Specific domains, API endpoints, source code repositories, cloud accounts.
- **Out of scope:** Production databases (unless approved), third-party services, employee personal devices.
- **Testing window:** Define start/end dates and business hours for active testing.
- **Rules of engagement:** No social engineering, no DDoS, no data exfiltration outside approved channels.

**Deliverable:** Scope document signed by both auditor and stakeholder.

### Phase 2: Reconnaissance

Gather information about the target:

- **Passive recon:** DNS records, subdomain enumeration (Amass, Subfinder), HTTP headers, technology fingerprinting (Wappalyzer, whatweb).
- **Active recon:** Port scanning (Nmap), directory brute-force (ffuf, dirbuster), endpoint discovery.
- **Code review:** SAST scanning, hardcoded secrets detection (truffleHog, Gitleaks).
- **Dependency analysis:** SCA scanning for known CVEs.

**Commands:**
```bash
# Subdomain enumeration
subfinder -d example.com -o subdomains.txt

# Port scanning
nmap -sV -sC -p- -oA nmap_scan example.com

# Directory brute-force
ffuf -u https://example.com/FUZZ -w /usr/share/wordlists/dirb/common.txt

# Secret scanning (git repo)
gitleaks detect --source=./repo --report=gitleaks-report.json
```

### Phase 3: Testing

Execute both automated and manual testing:

- **Automated:** SAST (Semgrep, SonarQube), DAST (ZAP, Burp Suite Pro), dependency scanning (Trivy, Snyk).
- **Manual:** Business logic flaws, privilege escalation, IDOR, race conditions, authentication bypass.
- **Validation:** Reproduce every automated finding to eliminate false positives.

**Test case documentation:**
```markdown
## Test Case: A01-IDOR-001
**Target:** GET /api/orders/123
**Auth:** User A (low privilege)
**Expected:** 403 Forbidden (not your order)
**Actual:** Returns order data for order 456 after changing ID
**Severity:** High (CVSS 7.5)
**Evidence:** [screenshot] [curl_output.txt]
```

### Phase 4: Reporting

See the Reporting Format section below for the complete template.

### Phase 5: Remediation

- Track each finding with a unique ID.
- Assign severity (CVSS), owner, and target fix date.
- Re-test after fixes are deployed.
- Close only after verification.

---

## Tooling

### SAST (Static Application Security Testing)
Analyzes source code without executing it.

| Tool | Type | Best For |
|------|------|----------|
| Semgrep | Rules-based | Custom rules, multi-language |
| SonarQube | Platform | CI/CD integration, tech debt |
| CodeQL | Query-based | Deep analysis, complex vulns |
| Brakeman | Ruby-only | Rails security |

**Example Semgrep rule:**
```yaml
rules:
  - id: hardcoded-api-key
    patterns:
      - pattern-regex: API_KEY\s*=\s*['"][A-Za-z0-9]{20,}['"]
    message: "Hardcoded API key detected"
    severity: ERROR
    languages: [python, javascript, go]
```

### DAST (Dynamic Application Security Testing)
Tests running applications from the outside in.

| Tool | Type | Best For |
|------|------|----------|
| OWASP ZAP | Free | Automated scanning, CI/CD |
| Burp Suite Pro | Commercial | Manual testing, advanced attacks |
| Acunetix | Commercial | Large-scale automated scanning |

**ZAP automated scan:**
```bash
# Docker-based automated scan
docker run -v $(pwd):/zap/wrk/ -t ghcr.io/zaproxy/zaproxy \
  zap-full-scan.py \
  -t https://staging.example.com \
  -r zap-report.html
```

### SCA / Dependency Scanning
Identifies known vulnerabilities in third-party dependencies.

| Tool | Type | Best For |
|------|------|----------|
| Trivy | Open source | Containers, repos, filesystems |
| Snyk | Commercial | Developer workflow integration |
| Dependabot | GitHub-native | Automated PRs for fixes |
| OWASP Dependency-Check | Open source | Java/.NET projects |

**Trivy usage:**
```bash
# Scan a filesystem
trivy fs --severity CRITICAL,HIGH ./my-project

# Scan a Docker image
trivy image myapp:latest --format sarif --output trivy-results.sarif
```

### Container Scanning
```bash
# Scan container with Grype
grype myapp:latest --fail-on high

# Scan Kubernetes manifests with Kube-bench
kube-bench run --targets master,node --check 1.0,2.0
```

---

## Threat Modeling

### STRIDE Methodology

STRIDE categorizes threats by type:

| Threat | Definition | Example | Mitigation |
|--------|------------|---------|------------|
| **S**poofing | Impersonating someone/something | Fake login page | Strong authentication, MFA |
| **T**ampering | Modifying data in transit | Man-in-the-middle | Signatures, TLS, integrity checks |
| **R**epudiation | Denying an action was performed | "I didn't delete that data" | Audit logs, digital signatures |
| **I**nformation Disclosure | Exposing confidential data | SQL injection leaking passwords | Encryption, access controls, input validation |
| **D**enial of Service | Making system unavailable | DDoS, resource exhaustion | Rate limiting, load balancing, auto-scaling |
| **E**levation of Privilege | Gaining unauthorized access | Zero-day exploit chain | Patch management, least privilege |

**STRIDE per-component approach:**
For each component (API gateway, database, frontend, worker queue), ask: "Can this be spoofed? Tampered? Repudiated? Disclosed? DoSed? Escalated?"

### DREAD Framework (Risk Scoring)

| Factor | Rating (0-10) |
|--------|---------------|
| **D**amage Potential | How much damage if exploited? |
| **R**eproducibility | How reliable is the exploit? |
| **E**xploitability | How easy is it to exploit? |
| **A**ffected Users | How many users are impacted? |
| **D**iscoverability | How easy is the vulnerability to find? |

**Score = (D + R + E + A + D) / 5**

DREAD is subjective but useful for prioritizing within a single organization. CVSS is preferred for external reporting.

### Threat Modeling Process

1. **Decompose the application** — Draw data flow diagrams (DFDs) showing all components, trust boundaries, and data flows.
2. **Identify threats** — Use STRIDE per component. Brainstorm attack scenarios.
3. **Rank threats** — Score using DREAD or CVSS.
4. **Define mitigations** — For each threat, specify the control that addresses it.
5. **Validate** — Ensure mitigations are implemented correctly.

---

## Reporting Format

Every audit report should follow this structure:

### Executive Summary
- **Audit period:** YYYY-MM-DD to YYYY-MM-DD
- **Scope:** [brief description]
- **Overall risk rating:** Critical / High / Medium / Low
- **Key metrics:** Total findings, critical count, high count
- **Top 3 risks:** Brief one-liner for each
- **Business impact:** In plain language, what could happen

### Finding Register

| ID | Title | Severity | CVSS | Status | Owner |
|----|-------|----------|------|--------|-------|
| AUD-001 | SQL Injection in login | Critical | 9.8 | Open | @dev-team |
| AUD-002 | Missing CSP Header | Medium | 5.3 | Fixed | @sec-team |
| AUD-003 | Hardcoded AWS Key | High | 7.5 | In Progress | @backend |

### Detailed Findings

Each finding includes:
- **Title** — Clear, actionable
- **CWE ID** — Common Weakness Enumeration identifier
- **CVSS Vector** — e.g., `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`
- **Affected Asset** — URL, endpoint, file, component
- **Description** — What is the vulnerability, and why does it matter?
- **Impact** — What could an attacker do?
- **Evidence** — Steps to reproduce, screenshots, curl commands, logs
- **Remediation** — Specific fix instructions with code examples
- **References** — Links to OWASP, CVE, documentation

### Risk Heatmap

```
High Impact + High Likelihood  = CRITICAL (immediate action)
High Impact + Low Likelihood   = HIGH (plan for next sprint)
Low Impact + High Likelihood   = MEDIUM (fix during maintenance)
Low Impact + Low Likelihood    = LOW (accept or monitor)
```

---

## Vulnerability Severity Classification (CVSS v3.1)

### Score Ranges

| Severity | Score Range |
|----------|-------------|
| None | 0.0 |
| Low | 0.1 - 3.9 |
| Medium | 4.0 - 6.9 |
| High | 7.0 - 8.9 |
| Critical | 9.0 - 10.0 |

### CVSS Vector Breakdown

Example: `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`

| Component | Value | Meaning |
|-----------|-------|---------|
| AV (Attack Vector) | N | Network (remotely exploitable) |
| AC (Attack Complexity) | L | Low (no special conditions) |
| PR (Privileges Required) | N | None (no auth needed) |
| UI (User Interaction) | N | None (no user action needed) |
| S (Scope) | U | Unchanged (vuln doesn't cross trust boundary) |
| C (Confidentiality) | H | High (all data exposed) |
| I (Integrity) | H | High (all data can be modified) |
| A (Availability) | H | High (system fully unavailable) |

### Quick CVSS Calculator (Python)

```python
# Calculate CVSS 3.1 base score manually
# Use the official NVD calculator instead: https://nvd.nist.gov/vuln-metrics/cvss/v3-calculator

# But here's the rough priority ordering:
# Critical:  Remote, no auth, full compromise → fix within 24h
# High:      Needs auth but leads to data breach → fix within 1 week
# Medium:    Requires interaction or special conditions → fix within 1 month
# Low:       Hard to exploit, limited impact → fix within next release
```

---

## Common Mistakes

### 1. **Only Running Automated Scanners**
Automated tools miss business logic flaws, race conditions, authorization bypasses, and complex injection chains. Always pair automated scanning with manual testing.

### 2. **Ignoring Out-of-Scope Systems**
Attackers don't respect scope boundaries. A vuln in an "out of scope" third-party integration can be a pivot point into the target. Document risks even if you don't test them.

### 3. **Not Validating Findings**
SAST tools generate false positives. Every finding must be manually verified before it enters the report. Reporting a false positive erodes trust.

### 4. **Vague Remediation Advice**
Bad: "Fix the SQL injection." Good: "Replace string concatenation with parameterized queries in `UserRepository.php` lines 42-58 using PDO prepared statements."

### 5. **Skipping Threat Modeling**
Finding bugs is reactive. Threat modeling is proactive. Skipping it means you're only finding what scanners can see.

### 6. **Over-relying on CVSS Scores**
CVSS doesn't account for business context. A CVSS 6.0 finding on a PII endpoint may be more critical to your organization than a CVSS 9.0 on a public information page.

### 7. **No Retesting**
A finding is not resolved until it's verified as fixed. "We fixed it" must be followed by "Show me."

### 8. **Poor Communication**
Dropping a 200-page report on the engineering team with no summary, no triage guidance, and no walkthrough leads to findings being ignored or deprioritized.

### 9. **No Timeline for Remediation**
Without deadlines, critical findings accumulate. Use SLAs: Critical = 24h, High = 1 week, Medium = 1 month, Low = next release.

### 10. **Testing Only in Production**
By the time a vulnerability is found in production, data may already be compromised. Test in staging, CI/CD, and development environments.

### 11. **Missing Authentication Testing**
Don't assume authentication works. Test for session fixation, missing logout, JWT none-algorithm attacks, and token leakage in URLs/referrers.

### 12. **Not Checking for Backups and Shadow IT**
Developers often deploy separate staging environments, test APIs, or personal cloud accounts without security review. Audit for shadow IT.

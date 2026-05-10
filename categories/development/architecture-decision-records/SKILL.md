---
name: architecture-decision-records
description: 'ADR methodology, templates, decision capture workflows, and architectural governance patterns'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: development
  tags: [adr, architecture, decisions, documentation, governance]
---

# Architecture Decision Records

Capture architectural decisions systematically so your team understands not just what was decided, but why — and what alternatives were considered.

## Core Principles

### 1. Decisions Are More Important Than Diagrams
A diagram shows the current architecture. An ADR explains *why* it is that way. When someone asks "why did we do it this way?" the ADR is the answer.

### 2. Capture Context, Not Just Conclusions
Every architectural decision exists in a web of constraints, tradeoffs, and alternatives. If you only record the conclusion, future engineers will wonder if you considered the obvious alternative — and they might reverse it without understanding why the original choice was made.

### 3. Lightweight Is Sustainable
An ADR doesn't need to be a 10-page document. A structured 1-page record is infinitely better than nothing. If the process is heavy, people won't follow it.

### 4. Accept and Track Superseded Decisions
Architecture evolves. An ADR that gets superseded is a success — it means the system adapted. Old ADRs remain valuable as historical records of the team's thinking.

---

## ADR Maturity Model

| Level | Capture | Storage | Review | Enforcement |
|-------|---------|---------|--------|-------------|
| **1: Tribal** | Decisions in Slack/meetings | Nobody remembers | None | None |
| **2: Documented** | Some decisions written down | Shared drive or wiki | Sporadic | None |
| **3: Systematic** | All significant decisions as ADRs | In repository alongside code | PR review requires ADR for arch changes | Basic: "needs ADR" check |
| **4: Integrated** | ADRs linked to implementation | Searchable, indexed, cross-referenced | Mandatory ADR review for arch changes | Automated: lint checks for ADR format |
| **5: Governance** | ADRs drive architecture reviews | Catalog with status dashboard | Regular architecture review board | Automated compliance checks |

Target: **Level 3** for most teams. **Level 4+** for regulated or long-lived systems.

---

## Actionable Guidance

### The Standard ADR Template

```markdown
# ADR-{NNN}: {Title}

## Status
[Proposed | Accepted | Deprecated | Superseded]

*If Superseded, list the replacing ADR: Superseded by ADR-{NNN}*

## Context
{Describe the problem, constraints, and forces at play. 
 What is the business or technical need? 
 What are the non-negotiable constraints?
 What options were considered?}

## Decision
{State the decision clearly. 
 What are we doing? What are we NOT doing?}

## Consequences
{List the positive and negative consequences of this decision.
 What tradeoffs are we accepting?
 What becomes easier? What becomes harder?}

## Alternatives Considered
{List alternatives and why they were rejected. This is the most 
 important section for future readers.}

### Option A: {Name}
- **Pros**: ...
- **Cons**: ...
- **Why rejected**: ...

### Option B: {Name}
- **Pros**: ...
- **Cons**: ...
- **Why rejected**: ...

## Compliance
{How will we verify this decision is followed?
 Automated checks? Manual review? Linting rules?}
```

### The Lightweight ADR Template

For quick decisions that still need recording:

```markdown
# ADR-042: Use PostgreSQL for Analytics Store

**Status**: Accepted  
**Date**: 2024-03-15  
**Author**: Alice Chen  
**Deciders**: Alice Chen, Bob Smith, Carol Davis

## Context
We need a store for aggregated analytics data. Requirements: 
JSON support, time-series optimized, managed service preferred.

## Decision
Use PostgreSQL with TimescaleDB extension on RDS.

## Rationale
- JSONB for flexible event schemas
- TimescaleDB hypertables for time-series queries
- RDS for managed operations
- Team already familiar with PostgreSQL

## Alternatives
- **MongoDB**: Better for unstructured data, but adds operational complexity 
  and team lacks expertise → rejected
- **ClickHouse**: Excellent for analytics but overkill for our volume (100k events/day) → rejected

## Consequences
+ Existing PostgreSQL expertise applies
+ Single database reduces operational burden
- Need to learn TimescaleDB syntax
- JSONB queries are less performant than dedicated document store
```

### ADR Workflow

```text
┌────────────┐   ┌──────────────┐   ┌────────────┐   ┌───────────────┐
│  Identify  │   │   Draft     │   │  Review   │   │   Accept &   │
│ Decision  ─┼─► │   ADR      ─┼─► │  & Discuss│──►│   Commit    │
│ Needed    │   │  (Proposed) │   │           │   │  (Accepted)  │
└────────────┘   └──────────────┘   └────────────┘   └───────────────┘
                                           │                  │
                                           │  Rejected        │  Later
                                           ▼                  ▼
                                     ┌──────────┐     ┌──────────────┐
                                     │  Revise  │     │  Superseded  │
                                     │  or File │     │  by New ADR  │
                                     └──────────┘     └──────────────┘
```

#### Step 1: When to Write an ADR

Write an ADR when the decision:

- **Is significant**: Changes the architecture, not just implementation
- **Is irreversible**: Hard to undo (database choice, framework, cloud provider)
- **Has tradeoffs**: There's no obvious "right" answer
- **Will be referenced later**: Someone will ask "why?"
- **Involves cost**: Financial, operational, or opportunity cost

**Examples of ADR-worthy decisions:**
- Choosing a database, message queue, or cache
- Adopting a new framework or major library
- API design decisions (REST vs GraphQL vs gRPC)
- Deployment strategy (Kubernetes vs serverless)
- Data model changes (schema design, migration strategy)
- Security architecture (auth flows, encryption approach)

**Examples of non-ADR decisions:**
- Renaming a variable or function
- Adding a minor dependency with no architectural impact
- Bug fixes or minor refactoring
- Configuration changes (environment variables, feature flags)

#### Step 2: Draft the ADR

```bash
# Create the ADR file
mkdir -p docs/adr/
cp templates/adr-template.md docs/adr/ADR-043-use-graphql-for-public-api.md

# ADR naming convention
# ADR-{NNN}-{short-descriptive-slug}.md
# Use leading zeros for sorting: ADR-001, ADR-002, ..., ADR-043
```

#### Step 3: Review

Include the ADR in the same PR as the implementation, or as a standalone PR for purely architectural decisions. Reviewers should check:

- [ ] Is the context clear? Can a new team member understand the problem?
- [ ] Are alternatives fairly represented? Not straw-man arguments?
- [ ] Are consequences honestly assessed? Both positive and negative?
- [ ] Is the decision aligned with existing architecture?
- [ ] Are there better alternatives we haven't considered?

#### Step 4: Accept and Maintain

```markdown
# After acceptance, the ADR status changes to "Accepted"
# If the decision is later revisited:

## Status
Superseded by ADR-052

## Rationale for Deprecation
In 2024, a managed Kafka service became available that eliminates
the operational overhead that motivated our original SQS choice.
The scale of our event processing has also grown 10x since ADR-021.
```

### Storing ADRs with Code

```
project/
├── docs/
│   └── adr/
│       ├── index.md              # Catalog of all ADRs
│       ├── ADR-001-initial-project-structure.md
│       ├── ADR-002-database-selection.md
│       ├── ADR-003-api-protocol.md
│       ├── ADR-004-deprecated-by-008.md
│       ├── ...
│       └── ADR-052-event-stream-architecture.md
└── .adr-dir                      # Points to the ADR directory
```

**Why store ADRs in the repository:**
- Version controlled alongside the code they describe
- Visible in the same PRs as the implementation
- Found by new team members exploring the codebase
- Branch-specific ADRs for experiment documentation

### ADR Index Template

```markdown
# Architecture Decision Records

## Active (Accepted)

| ADR | Title | Date | Area |
|-----|-------|------|------|
| ADR-003 | API Protocol: GraphQL | 2024-01-20 | API |
| ADR-002 | Database: PostgreSQL | 2024-01-15 | Data |
| ADR-008 | Event Bus: RabbitMQ | 2024-02-10 | Infrastructure |

## Proposed

| ADR | Title | Date | Author |
|-----|-------|------|--------|
| ADR-009 | Cache Strategy: Redis with write-through | 2024-03-01 | Alice |

## Deprecated / Superseded

| ADR | Title | Superseded By | Date |
|-----|-------|---------------|------|
| ADR-001 | Initial: SQLite | ADR-002 | 2024-01-15 |
| ADR-004 | Event Bus: SQS | ADR-008 | 2024-02-10 |
```

### Advanced ADR Patterns

#### Combining Multiple Decisions

Sometimes one PR involves several related decisions. Handle with care:

```markdown
# ADR-030: Order Service Decomposition

**Status**: Accepted

## This ADR covers three decisions:
1. Extract order management from the monolith
2. Use event-driven communication between order and inventory services
3. Adopt PostgreSQL for the order service database

## Decision
Extract the Order Service as a standalone service...
```

**Alternative**: Write one ADR per decision and reference them:

```markdown
ADR-031: Extract Order Service from Monolith
ADR-032: Event-Driven Communication for Order Service
ADR-033: Database Selection for Order Service
```

#### Y-Statements

A concise format for decisions with clear tradeoffs:

```markdown
## Decision (Y-Statement)

In the context of {situation/need},
facing {constraint/force},
we decided for {option A} over {option B}
to achieve {positive consequence},
accepting {negative consequence}.

---

**Example:**
In the context of needing real-time notifications across services,
facing the constraint of not wanting to manage a dedicated messaging infrastructure,
we decided for AWS SNS over RabbitMQ
to achieve zero operational overhead for pub/sub messaging,
accepting vendor lock-in to AWS and higher per-message costs at scale.
```

#### Capturing Rejected Decisions

Sometimes the most valuable ADR is the one about a decision you *didn't* take:

```markdown
# ADR-017: Rejected — Migrate to Microservices

**Status**: Rejected  
**Date**: 2024-02-01

## Context
Proposal to break the monolith into microservices for better scalability.

## Decision
We decided NOT to pursue microservice decomposition at this time.

## Rationale
- Team size (6 engineers) is too small to manage N services
- Current monolith handles 10k RPM comfortably
- Deployment frequency is satisfactory (daily)
- Distributed transactions would add complexity without clear benefit
- We'll revisit this when:
  a) Team grows to 15+
  b) Monolith deployment takes >30 minutes
  c) Two or more features need different scaling policies
```

### Architecture Governance Patterns

#### Architecture Review Board (ARB)

```markdown
# Architecture Review Board Charter

## Purpose
Ensure architectural consistency and quality across all products.

## Composition
- 1 Staff Engineer (permanent)
- 2 Senior Engineers (rotating, 6-month term)
- 1 Product Manager (non-voting)

## When to Escalate
- Cross-team architectural decisions
- Technology stack additions
- Major refactoring or migrations
- Decisions with significant cost implications

## Process
1. Author drafts ADR → send to ARB
2. ARB reviews within 1 week
3. ARB meeting to discuss (if needed)
4. Decision documented in ADR status
```

#### Automated ADR Linting

```yaml
# .adr-lint.yml
rules:
  required-sections:
    - Status
    - Context
    - Decision
    - Consequences
    - Alternatives Considered
  
  status-values:
    allowed:
      - Proposed
      - Accepted
      - Deprecated
      - Superseded
      - Rejected
  
  naming:
    pattern: '^ADR-\d{3}-[a-z0-9-]+\.md$'
    message: "ADR files must follow ADR-{NNN}-{slug}.md naming"
  
  no-duplicate-numbers: true
  
  index-required: true
  index-path: 'docs/adr/index.md'
```

```bash
# Run ADR linting in CI
npx adr-lint docs/adr/

# Example output:
# ✓ ADR-001: All required sections present
# ✓ ADR-002: All required sections present
# ✗ ADR-003: Missing "Alternatives Considered" section
# ✓ ADR-004: Valid status "Accepted"
# ✗ ADR-005: Invalid naming — use ADR-005-{slug}.md
```

#### Linking ADRs to Code

```python
# In code comments, reference the ADR that explains the design choice

# Uses Redis-backed rate limiting (see ADR-022)
# Rationale: We need distributed rate limiting across 10 instances
# and in-memory approaches won't work with horizontal scaling.
from ratelimit import RateLimiter

# SQLite for local dev, PostgreSQL in production (see ADR-002)
if config.ENV == "production":
    db = PostgresDatabase(config.DATABASE_URL)
else:
    db = SQLiteDatabase(":memory:")

# Using UUID v4 instead of auto-increment IDs (see ADR-015)
# Rationale: Prevents ID enumeration and simplifies sharding
order_id = uuid.uuid4()
```

#### ADR Change Tracking

```markdown
# ADR-010: Authentication Architecture

## Status
Accepted (Updated 2024-03-01)

## Changelog
| Date | Change | Author |
|------|--------|--------|
| 2024-01-15 | Initial draft | Alice |
| 2024-01-20 | Added SSO requirement | Bob |
| 2024-02-01 | Accepted after ARB review | Carol |
| 2024-03-01 | Updated token expiry from 1h to 24h based on UX feedback | Alice |
```

### ADR Tools

```bash
# adr-tools (command-line)
# https://github.com/npryce/adr-tools

# Install
brew install adr-tools

# Create a new ADR
adr new Use PostgreSQL for analytics store
# Creates: doc/adr/0001-use-postgresql-for-analytics-store.md

# List all ADRs
adr list

# Mark as superseded
adr supersede 0001 0008  # ADR-001 is superseded by ADR-008

# Link ADRs
adr link 0001 "Amends" 0003
```

```bash
# Log4brains (modern ADR manager with UI)
# https://github.com/thomvaill/log4brains

# Install
npm install -g @log4brains/cli

# Initialize
log4brains init

# Create ADR
log4brains adr:new

# Preview the knowledge base
log4brains preview

# Build static site
log4brains build
```

---

## Common Mistakes

1. **Writing ADRs after implementation**: The decision should be captured before or during implementation, not months later when nobody remembers the tradeoffs.
2. **Too much detail, too little signal**: An ADR isn't a design document. It shouldn't describe the implementation, just the architectural decision and why.
3. **No alternatives section**: This is the most valuable part of an ADR. Future engineers need to know *what else was considered* and *why it was rejected*.
4. **Status never updated**: An accepted ADR that is no longer true is misleading. Keep status current — "Superseded" or "Deprecated" are valid statuses.
5. **ADRs stored outside the repository**: Wiki pages and shared drives get lost. Keep ADRs with the code they describe.
6. **Too many ADRs for trivial decisions**: Reserve ADRs for meaningful architectural choices. Not every npm package addition needs an ADR.
7. **No review process**: An ADR that nobody reads might as well not exist. Ensure ADRs are reviewed as part of your standard workflow.
8. **ADRs as blame documents**: The purpose is understanding, not accountability. An ADR should never be used to say "see, I told you so" when a decision ages poorly.

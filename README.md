# Mercury Skills

<p align="center">
  <img src="assets/mercury-agent-skills-card.png" alt="Mercury Skills" width="75%" style="max-width: 700px; height: auto;">
</p>

<p align="center">
  <a href="https://skills.mercuryagent.sh"><strong>Browse the registry</strong></a> •
  <a href="https://mercuryagent.sh"><strong>Mercury Agent</strong></a> •
  <a href="./CATALOG.md"><strong>Catalog</strong></a> •
  <a href="./CONTRIBUTING.md"><strong>Contribute</strong></a>
</p>

**An open-source library of `SKILL.md` playbooks for AI agents.** Browse and install on [skills.mercuryagent.sh](https://skills.mercuryagent.sh), or pull them directly from the [Mercury Agent](https://mercuryagent.sh) CLI.

**127 skills across 23 categories** — hand-curated, production-ready, and compatible with every major agent: Mercury, Claude Code, Codex CLI, OpenClaw, Hermes, Cursor, and Gemini CLI.

---

## Quick Start

### From the Mercury CLI (recommended)

```bash
# List what's available
mercury skills search "react patterns"

# Install one skill
mercury skills install frontend/react-patterns

# Install several at once
mercury skills install ai-ml/prompt-engineering devops/docker security/threat-modeling
```

Installed skills land in `~/.mercury/skills/<category>/<slug>/SKILL.md` and are picked up automatically by your agent.

### From the web

Open [**skills.mercuryagent.sh**](https://skills.mercuryagent.sh), pick a skill, copy the install line for your agent — every skill page ships ready-made install steps for Mercury, Claude Code, Codex, OpenClaw, Hermes, and "any other agent that understands SKILL.md".

### Clone the whole library

```bash
git clone https://github.com/cosmicstack-labs/mercury-agent-skills.git
```

Drop individual skills into your agent's skills directory:

| Agent | Skills directory |
|---|---|
| **Mercury** | `~/.mercury/skills/` |
| **Claude Code** | `.claude/skills/` |
| **Codex CLI** | `.codex/skills/` |
| **OpenClaw** | `.openclaw/skills/` |
| **Hermes** | `.hermes/skills/` |
| **Cursor** | `.cursor/skills/` |
| **Gemini CLI** | `.gemini/skills/` |
| Any other | Wherever your agent reads `SKILL.md` from |

---

## Why Mercury Skills?

| | |
|---|---|
| **Curated, not crowded** | Every skill is hand-written against real workflows — no AI slop, no duplicates. |
| **Universal format** | One `SKILL.md` works in any agent that supports the standard. No per-agent forks. |
| **Discoverable** | Full-text search, categories, tags, leaderboard, and live JSON feed on [skills.mercuryagent.sh](https://skills.mercuryagent.sh). |
| **Installable** | One CLI command, no manual file copying. Atomic writes, version pinning, rollback on failure. |
| **Open** | MIT licensed. Contributions welcome via PR — see [CONTRIBUTING.md](./CONTRIBUTING.md). |

---

## Browse on the Web

[**skills.mercuryagent.sh**](https://skills.mercuryagent.sh) is the canonical browse-and-install surface for the library. It serves:

- A searchable, categorized index of every skill in this repo
- A trending leaderboard ranked by likes and installs
- Per-skill detail pages with the full `SKILL.md`, install steps for every supported agent, and a copy-paste-ready install command
- A bookmarking system so you can save skills for later (local, no account required)
- Social share cards with per-skill OpenGraph imagery

It also exposes a public JSON feed at [`/api/feed.json`](https://skills.mercuryagent.sh/api/feed.json) and per-skill JSON at `/api/skills/<category>/<slug>` for tooling builders.

---

## Categories

| Category | Skills | What's inside |
|---|---|---|
| [Development](./categories/development/) | 16 | Clean code, code review, debugging, testing, ADRs, documentation, refactoring, dependency hygiene |
| [AI & ML](./categories/ai-ml/) | 11 | Prompt engineering, agent health, memory, delegation, handoffs, token budgets, error recovery, audit logging |
| [Backend](./categories/backend/) | 9 | APIs, Node.js, Python, database design, auth, serverless, microservices, caching, message queues |
| [Shop & Restaurant](./categories/shop-restaurant/) | 9 | Inventory, menu engineering, scheduling, reviews, daily pulse, table management, pricing, social, Zomato ordering |
| [Frontend](./categories/frontend/) | 8 | React, Next.js, Tailwind, state management, testing, performance, responsive design, component systems |
| [Creative & Personal Development](./categories/creative-personal-development/) | 8 | Storytelling, decision frameworks, standups, notes, repurposing, branding, validation, time blocking |
| [DevOps](./categories/devops/) | 7 | Docker, CI/CD, Kubernetes, Terraform, monitoring, SRE, GitOps |
| [Career](./categories/career/) | 5 | Resume writing, interview prep, career planning, LinkedIn, salary negotiation |
| [Education & Learning](./categories/education-learning/) | 5 | Curriculum design, learning science, teaching methods, assessment, micro-learning |
| [Finance & Legal](./categories/finance-legal/) | 5 | Financial analysis, budgeting, contracts, privacy compliance, risk management |
| [Health & Wellness](./categories/health-wellness/) | 5 | Fitness, nutrition, mental health, sleep, habits |
| [Mobile](./categories/mobile/) | 5 | iOS, Android, React Native, performance, App Store optimization |
| [Testing & QA](./categories/testing-qa/) | 5 | Test strategy, E2E, performance testing, API testing, accessibility testing |
| [Automation](./categories/automation/) | 4 | Workflows, shell scripting, web scraping, X/Twitter automation |
| [Media Download](./categories/media-download/) | 4 | yt-dlp wrappers, audio extraction, batch downloading, platform-specific patterns |
| [PDF Generation](./categories/pdf-generation/) | 5 | Invoices, reports, branded documents, dynamic templating, markdown→PDF typesetting (any2pdf) |
| [Presentation](./categories/presentation/) | 4 | Slide decks, narrative structure, stage delivery, visual hierarchy |
| [Marketing](./categories/marketing/) | 3 | SEO, content strategy, distribution |
| [Business](./categories/business/) | 2 | Negotiation, operations |
| [Design](./categories/design/) | 2 | UI systems, accessibility |
| [Product](./categories/product/) | 2 | Strategy, discovery |
| [Security](./categories/security/) | 2 | Audit, secure coding |
| [Data](./categories/data/) | 1 | Data engineering fundamentals |

See [CATALOG.md](./CATALOG.md) for the full skill-by-skill index.

---

## Skill Structure

Every skill is a single `SKILL.md` file with YAML frontmatter and a markdown body:

```yaml
---
name: skill-name
description: 'What this skill does and when to use it'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: development
  tags: [clean-code, refactoring, best-practices]
---

# Skill Name

Full instructions, frameworks, scoring rubrics, and actionable guidance.
```

The format is intentionally minimal so any agent runtime can parse it without custom tooling. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the authoring standard.

---

## Try Mercury Agent

These skills are built for [**Mercury Agent**](https://mercuryagent.sh) — the agent runtime that consumes them natively.

- **Second Brain** — persistent memory that learns from every session
- **Skill system** — load, version, and update skills from this registry directly
- **Permission guardrails** — safe by design, auditable by default
- **Token budgets** — keep AI spend predictable
- **Multi-channel** — CLI, Telegram, and web; same agent, same memory

```bash
# Install Mercury Agent
npm install -g @cosmicstack/mercury-agent

# Pull a skill into your agent
mercury skills install ai-ml/prompt-engineering

# Browse what you have
mercury skills list
```

[**Get started with Mercury →**](https://mercuryagent.sh)

---

## Ecosystem

| Project | What it is |
|---|---|
| [**Mercury Agent**](https://mercuryagent.sh) | The agent runtime — CLI, Telegram, web — that loads these skills |
| [**Mercury Skills (this repo)**](https://github.com/cosmicstack-labs/mercury-agent-skills) | The curated `SKILL.md` library |
| [**skills.mercuryagent.sh**](https://skills.mercuryagent.sh) | The browse-and-install web platform powered by this repo |

Built and maintained by [Cosmic Stack](https://cosmicstack.org).

---

## Contributing

We accept new skills, fixes, and refinements via pull request.

- **Author a skill** — see the standard in [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Fix or improve an existing skill** — open a PR with a clear changelog note
- **Request a category** — open an issue with the proposed scope

Every merged contribution lands on [skills.mercuryagent.sh](https://skills.mercuryagent.sh) within the hour via an automated sync.

---

## License

MIT — see [LICENSE](./LICENSE).

<p align="center">
  <sub>Built by <a href="https://cosmicstack.org">Cosmic Stack</a> · Powered by <a href="https://mercuryagent.sh">Mercury Agent</a></sub>
</p>

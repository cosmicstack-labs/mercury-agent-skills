# Mercury Skills 🪐

**A curated collection of reusable AI agent skills — installable, composable, and built for Mercury and beyond.**

Mercury Skills is an open library of `SKILL.md` playbooks designed for AI coding agents. Whether you use Mercury, Claude Code, Cursor, Codex CLI, Gemini CLI, or any other agent-compatible tool — these skills give your AI structured expertise on demand.

## Why Mercury Skills?

| Feature | Description |
|---------|-------------|
| **Curated, not crowded** | Every skill is hand-crafted with real workflows in mind |
| **Universal format** | Works with any agent that understands `SKILL.md` |
| **Category-organized** | 12+ categories — find what you need fast |
| **Copy-paste or clone** | Install a single skill or the whole library |
| **Open source** | MIT licensed, community contributions welcome |

## Quick Start

### Option 1: Clone the whole library
```bash
git clone https://github.com/cosmicstack-labs/mercury-skills.git
```

### Option 2: Copy a single skill
Pick a skill from [CATALOG.md](./CATALOG.md) and copy its `SKILL.md` into your agent's skills directory:
```bash
cp mercury-skills/categories/development/clean-code/SKILL.md .mercury/skills/
```

### Option 3: Use with any agent
- **Mercury**: Drop into `~/.mercury/skills/` or your project's skills folder
- **Claude Code**: Drop into `.claude/skills/`
- **Cursor**: Drop into `.cursor/skills/`
- **Codex CLI**: Drop into `.codex/skills/`
- **Gemini CLI**: Drop into `.gemini/skills/`

## Categories

| Category | Skills | Description |
|----------|--------|-------------|
| [Development](./categories/development/) | 10+ | Clean code, design patterns, testing, performance |
| [Frontend](./categories/frontend/) | 10+ | React, Next.js, Tailwind, state management |
| [Backend](./categories/backend/) | 10+ | APIs, databases, serverless, authentication |
| [DevOps](./categories/devops/) | 8+ | Docker, CI/CD, infrastructure, monitoring |
| [AI & ML](./categories/ai-ml/) | 10+ | AI agents, prompt engineering, LLM ops |
| [Security](./categories/security/) | 6+ | Audit, OWASP, threat modeling, compliance |
| [Product](./categories/product/) | 8+ | Strategy, research, prioritization, metrics |
| [Marketing](./categories/marketing/) | 8+ | SEO, content, analytics, growth |
| [Design](./categories/design/) | 6+ | UI, accessibility, design systems, UX |
| [Business](./categories/business/) | 6+ | Strategy, sales, negotiation, pricing |
| [Automation](./categories/automation/) | 6+ | Workflows, scripts, browser automation |
| [Data](./categories/data/) | 6+ | Pipelines, ETL, analytics, visualization |

## Skill Structure

Every skill follows this standard format:

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

## Browse Skills

➡️ [Full Catalog → CATALOG.md](./CATALOG.md)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on creating and submitting skills.

## License

MIT — see [LICENSE](./LICENSE)

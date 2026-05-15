---
name: gbrain-lite
description: 'Lightweight personal knowledge base — markdown + YAML frontmatter structured notes with full-text search and cross-referencing for AI agents'
metadata:
  author: Mayx07
  version: 1.0.0
  category: ai-ml
  tags:
    - knowledge-base
    - memory-management
    - markdown
    - cross-referencing
    - agent-memory
    - personal-knowledge-graph
---

# GBrain Lite — Lightweight Personal Knowledge Base

> Organize books, people, concepts, and news items from conversations into a searchable, cross-referenced markdown knowledge base.

## Workspace

- Knowledge base directory: `brain/`
- Subdirectories by type: `books/` `people/` `meetings/` `ideas/` `articles/` `projects/` `news/`
- One entry = one `.md` file
- News entries by date: `news/YYYY-MM-DD/`

## Workflow

1. **Trigger check** — Book/person/concept/news mentioned in conversation → proactively check brain
2. **Search** — Full-text search in `brain/` directory (ripgrep/grep)
3. **Decide**
   - Existing entry → reference it, update if needed
   - No entry + important → create immediately
   - No entry + uncertain → ask user
4. **Create** — Write `brain/{type}/{slug}.md`
   - Slug: lowercase/hyphenated
   - Must include YAML frontmatter (title, type, date, tags, summary)
5. **Cross-reference** — Update `links` field in related entries
6. **Sync** — Keep key entry index in agent memory

## Rules

- Don't dump long content directly into agent memory — prefer brain
- Don't create entries without `title` and `date`
- Don't skip the `summary` field — search and listing depend on it
- Don't manually write `updated` — it auto-updates on save
- News entries must use `item_id` as dedup key (format: `github:owner/repo` / `hn:12345` / `arxiv:url`)
- Don't do full overwrite updates on existing entries — use targeted patches

## Validation

- [ ] New entry has complete frontmatter (title, type, date, tags, summary)
- [ ] Full-text search finds the new entry
- [ ] News entries contain `item_id` + `first_seen` + `star_history` (GitHub entries)
- [ ] Agent memory usage below 90%, otherwise trigger distillation to brain

## Pitfalls

### Brain vs Memory confusion
- Symptom: Long-form content consumed all agent memory space
- Root cause: Everything dumped into memory instead of brain
- Fix: >500 chars → brain entry; memory only keeps index pointers. (Fixed: 2026-05-12)

### Missing item_id on news entries
- Symptom: Duplicate news entries accumulate, dedup impossible
- Root cause: Agent skipped `item_id` field when creating news entries
- Fix: Always include `item_id` for news entries, validated in creation workflow

## References

- `references/garry-tan-gbrain-inspiration.md` — GBrain system design reference

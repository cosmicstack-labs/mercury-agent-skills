---
name: gbrain-lite
description: 'Lightweight personal knowledge base — markdown + YAML frontmatter structured notes with full-text search and cross-referencing, inspired by Garry Tan GBrain'
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

A minimal viable knowledge base for AI agents: markdown files + YAML frontmatter + full-text search. No database required — git-syncable, human-readable.

## Design Philosophy

- One entry = one file, stored in a `brain/` directory
- Organized by type (books, people, meetings, ideas, articles, projects, news)
- Full-text search across all directories
- Cross-references via `links` field in frontmatter
- Git-friendly, no database dependency

## Directory Structure

```
brain/
├── books/        # One note per book
├── people/       # One page per person
├── meetings/     # One record per meeting
├── ideas/        # Ideas, inspiration fragments
├── articles/     # Article/blog notes
├── projects/     # Project-related notes
└── news/         # Daily discoveries (organized by date)
    └── YYYY-MM-DD/
        ├── github-owner-repo.md
        ├── hn-12345678.md
        └── arxiv-xxx.md
```

## File Format

```markdown
---
title: "Entry Title"
type: book          # book/people/meeting/idea/article/project/news
date: 2026-05-10
tags: [AI, agent, knowledge-management]
updated: 2026-05-10
links:              # Cross-reference other entries
  - books/some-book
  - people/some-person
summary: "One-line summary"
---

# Title

Content in markdown...
```

## Operations

### Save Entry (brain-save)

Write `brain/{type}/{slug}.md`. Slug rules: lowercase English, pinyin for Chinese, hyphen-separated. Auto-update `updated` field.

### Search Entry (brain-search)

Full-text search across `brain/` directory using ripgrep or grep. Returns filename + matching lines + context.

### Cross-Reference (brain-link)

Modify the `links` field in frontmatter to add/remove references. Optional bidirectional linking.

### List Entries (brain-list)

List entries by type or tag.

## Interaction Rules

- User says "record this" → auto-detect type, create entry
- User says "I noted something about X" → search and display
- User says "this relates to Y" → add cross-reference
- Books/people/concepts mentioned in conversation → proactively check brain for existing entries
- Long-form content goes to brain instead of consuming agent memory

## News Entry Format

```markdown
---
title: "Project Name — One-line description"
type: news
source: github          # github / hackernews / arxiv
item_id: github:owner/repo   # Unique ID for deduplication
date: 2026-05-11
tags: [AI, agent, open-source]
stars: 6100
score: 0
updated: 2026-05-12
links: []
summary: "One-line summary"
first_seen: 2026-05-11
seen_count: 1
star_history:
  - date: 2026-05-11
    stars: 6100
---
```

Tracks project growth over time with `star_history`. Used in combination with automated daily briefing workflows.

## Deduplication Strategy

| Source | Match | Update | Duplicate |
|--------|-------|--------|-----------|
| GitHub | item_id exact | Stars increase >30% | Increase ≤30% |
| HN | item_id exact | N/A (always discard) | Seen before = discard |
| arXiv | item_id exact | N/A (always discard) | Seen before = discard |

## Advanced Roadmap

- Automated ingestion from daily conversations
- Cross-reference suggestions on new entries
- Book Mirror: personalized mapping of new reads to existing knowledge
- Tiered skill loading (inspired by buddyme) for entry organization
- Skill lifecycle management (inspired by SLIM) for auto-detecting stale entries

## Scoring Rubric

| Criteria | Weight | Description |
|----------|--------|-------------|
| File format compliance | 30% | Valid YAML frontmatter, all required fields |
| Cross-referencing | 25% | Quality and relevance of links |
| Search efficiency | 20% | Response time for full-text queries |
| Growth tracking | 15% | star_history accuracy for news entries |
| Dedup accuracy | 10% | False positive/negative rate |

## Common Pitfalls

- **Missing `item_id`**: News entries without item_id cannot be deduplicated — always include it
- **Wrong slug**: Chinese characters in filenames break on some systems — use pinyin
- **Stale entries**: Without regular review, brain entries accumulate cruft — set up periodic cleanup
- **Over-linking**: Cross-referencing everything dilutes value — only link meaningful connections
- **Memory/brain confusion**: Short-term facts go to agent memory, long-form knowledge goes to brain

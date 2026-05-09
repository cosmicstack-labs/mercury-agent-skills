---
name: memory-management
description: 'Design and operate memory systems for long-running AI agents. Covers context window optimization, summarization strategies, vector-based retrieval, episodic memory, memory consolidation, and garbage collection for production agent systems.'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: ai-ml
  tags:
    - memory-management
    - context-window
    - vector-database
    - summarization
    - rag
    - long-running-agents
    - memory-consolidation
---

# Memory Management for Long-Running Agents

## Overview

Long-running agents face a fundamental problem: they can't remember everything, but forgetting the wrong thing breaks their usefulness. This skill covers memory architectures that balance context retention, token budget, and retrieval accuracy for agents that run for hours, days, or continuously.

---

## Core Concepts

### The Memory Problem

| Issue | Symptom | Cost |
|-------|---------|------|
| **Context Overflow** | Agent forgets early instructions | Task failure, incoherent responses |
| **Token Bloat** | Every message keeps growing | 10x+ cost increase per task |
| **Memory Pollution** | Irrelevant memories distract agent | Hallucination, off-target responses |
| **Stale Memories** | Outdated information used as fact | Incorrect decisions |
| **Memory Leaks** | Unused data accumulates unbounded | Crash from OOM, endless context |

### Memory Tiers

| Tier | Storage | Capacity | Access Speed | Cost | Best For |
|------|---------|----------|-------------|------|----------|
| **L1 — Working** | In-context (LLM window) | 8K-200K tokens | Instant | $$$ | Current task, immediate context |
| **L2 — Recent** | Sliding window buffer | ~2K turns | < 10ms | $$ | Recent conversation history |
| **L3 — Episodic** | Event log / timeseries | Millions of events | < 50ms | $ | Past actions, outcomes, decisions |
| **L4 — Semantic** | Vector database | Unlimited | < 100ms | $ | Knowledge, facts, relationships |
| **L5 — Archival** | Object storage | Unlimited | > 1s | $ | Backups, compliance, audit |

---

## Step-by-Step Implementation

### Step 1: Build a Tiered Memory System

```python
from dataclasses import dataclass, field
from typing import Optional
import json
import time

@dataclass
class MemoryEntry:
    content: str
    timestamp: float = None
    importance: float = 0.5  # 0.0 (trivial) to 1.0 (critical)
    tags: list[str] = field(default_factory=list)
    token_count: int = 0
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = time.time()

class TieredMemory:
    """Multi-tier memory with automatic promotion and demotion."""
    
    def __init__(self, llm, vector_store, max_context_tokens: int = 8000):
        self.llm = llm
        self.vector_store = vector_store
        self.max_context_tokens = max_context_tokens
        
        # L1: Working context (in-memory)
        self.working_memory: list[MemoryEntry] = []
        self.current_tokens = 0
        
        # L2: Recent history buffer
        self.recent_buffer: list[MemoryEntry] = []
        self.buffer_size = 50
        
        # L3: Episodic memory
        self.episodes: list[MemoryEntry] = []
        
        # L4: Semantic memory (vector DB)
        # Initialized externally
    
    async def remember(self, content: str, importance: float = 0.5, 
                       tags: list[str] = None):
        """Store a new memory across tiers."""
        entry = MemoryEntry(
            content=content,
            importance=importance,
            tags=tags or [],
            token_count=self._count_tokens(content)
        )
        
        # Always add to working memory
        self.working_memory.append(entry)
        self.current_tokens += entry.token_count
        
        # If important, store in episodic + semantic
        if importance > 0.7:
            self.episodes.append(entry)
            await self.vector_store.store(entry)
        
        # Trim if needed
        await self._trim_working_memory()
```

### Step 2: Implement Context Window Management

```python
class ContextManager:
    """Optimize what stays in the context window."""
    
    def __init__(self, tiered_memory: TieredMemory, 
                 summarizer, max_tokens: int = 8000):
        self.memory = tiered_memory
        self.summarizer = summarizer
        self.max_tokens = max_tokens
        self.reserved_tokens = 2000  # Reserve for new input/output
    
    async def build_context(self, task: str, top_k: int = 5) -> list[dict]:
        """Build the optimal context for a task."""
        
        available_tokens = self.max_tokens - self.reserved_tokens
        
        # 1. Start with high-importance working memory
        context = []
        tokens_used = 0
        
        working = sorted(
            self.memory.working_memory,
            key=lambda e: e.importance,
            reverse=True
        )
        
        for entry in working:
            if tokens_used + entry.token_count > available_tokens:
                break
            context.append({"role": "system", "content": entry.content})
            tokens_used += entry.token_count
        
        # 2. Add semantically relevant memories
        relevant = await self.memory.vector_store.search(task, k=top_k)
        for mem in relevant:
            if tokens_used + mem.token_count > available_tokens:
                break
            context.append({"role": "system", "content": mem.content})
            tokens_used += mem.token_count
        
        # 3. If we had to drop items, add a summary
        if len(context) < len(working):
            summary = await self._get_summary()
            context.insert(0, {"role": "system", 
                               "content": f"[Summary of earlier context]: {summary}"})
        
        return context
    
    async def _get_summary(self) -> str:
        """Summarize what was excluded from context."""
        excluded = self.memory.working_memory[
            len(self.memory.working_memory) - 10:
        ]
        texts = [e.content for e in excluded]
        return await self.summarizer.summarize("\n".join(texts))
    
    async def _trim_working_memory(self):
        """Reduce working memory when over capacity."""
        while self.memory.current_tokens > self.max_tokens * 0.8:
            # Remove lowest-importance items
            self.memory.working_memory.sort(
                key=lambda e: e.importance
            )
            removed = self.memory.working_memory.pop(0)
            self.memory.current_tokens -= removed.token_count
```

### Step 3: Memory Summarization Strategies

```python
class MemorySummarizer:
    """Different summarization strategies for different memory types."""
    
    def __init__(self, llm):
        self.llm = llm
    
    async def rolling_summary(self, conversation: list[str], 
                              window: int = 20) -> str:
        """Summarize recent conversation window."""
        recent = conversation[-window:]
        return await self.llm.generate(
            f"Summarize this conversation concisely, preserving key facts, "
            f"decisions, and user preferences:\n\n{chr(10).join(recent)}"
        )
    
    async def hierarchical_summary(self, episodes: list[MemoryEntry], 
                                   level: int = 1) -> str:
        """Multi-level summarization for long-running agents."""
        if len(episodes) < 10:
            # Base case: summarize directly
            texts = [e.content for e in episodes]
            return await self.llm.generate(
                f"Summarize these episodes:\n\n{chr(10).join(texts)}"
            )
        
        # Recursive: summarize groups, then summarize summaries
        groups = [
            episodes[i:i+10] 
            for i in range(0, len(episodes), 10)
        ]
        summaries = []
        for group in groups:
            summary = await self.hierarchical_summary(group, level + 1)
            summaries.append(summary)
        
        return await self.llm.generate(
            f"Synthesize these summaries into a higher-level overview:\n\n"
            f"{chr(10).join(summaries)}"
        )
    
    async def importance_weighted_summary(self, episodes: list[MemoryEntry],
                                          max_tokens: int = 500) -> str:
        """Prioritize important memories in summary."""
        # Sort by importance, keep top items
        sorted_eps = sorted(episodes, key=lambda e: e.importance, reverse=True)
        
        important = [e for e in sorted_eps if e.importance > 0.7]
        routine = [e for e in sorted_eps if e.importance <= 0.7]
        
        result = "## Key Events\n"
        result += "\n".join(e.content for e in important[:5])
        
        if routine:
            brief = await self.llm.generate(
                f"Summarize these routine events in one sentence:\n"
                f"{chr(10).join(e.content[:3] for e in routine[:10])}"
            )
            result += f"\n## Other Events\n{brief}"
        
        return result
```

### Step 4: Memory Consolidation & GC

```python
class MemoryConsolidator:
    """Periodically consolidate, prune, and optimize memory."""
    
    def __init__(self, memory: TieredMemory, llm, 
                 consolidation_interval: int = 3600):
        self.memory = memory
        self.llm = llm
        self.interval = consolidation_interval
        self.last_consolidation = time.time()
    
    async def consolidate_if_needed(self):
        """Run consolidation if interval has elapsed."""
        if time.time() - self.last_consolidation > self.interval:
            await self.consolidate()
            self.last_consolidation = time.time()
    
    async def consolidate(self):
        """Merge, prune, and optimize memory store."""
        
        # Phase 1: Deduplicate
        await self._deduplicate()
        
        # Phase 2: Merge related entries
        await self._merge_related()
        
        # Phase 3: Prune low-importance old entries
        await self._prune()
        
        # Phase 4: Re-index vector store
        await self._reindex()
    
    async def _deduplicate(self):
        """Remove duplicate or near-duplicate entries."""
        seen = set()
        unique = []
        for entry in self.memory.episodes:
            # Use first 100 chars as fingerprint
            fingerprint = entry.content[:100]
            if fingerprint not in seen:
                seen.add(fingerprint)
                unique.append(entry)
        self.memory.episodes = unique
    
    async def _merge_related(self):
        """Merge related memories into composite entries."""
        # Group by tags
        from collections import defaultdict
        tagged = defaultdict(list)
        for entry in self.memory.episodes:
            for tag in entry.tags:
                tagged[tag].append(entry)
        
        # Merge groups with >5 entries
        for tag, entries in tagged.items():
            if len(entries) > 5:
                merged = await self.llm.generate(
                    f"Merge these related memories into one coherent summary:\n"
                    f"{chr(10).join(e.content for e in entries)}"
                )
                # Replace with merged entry
                self.memory.episodes = [
                    e for e in self.memory.episodes 
                    if e not in entries
                ]
                self.memory.episodes.append(MemoryEntry(
                    content=merged,
                    importance=0.8,
                    tags=[tag],
                    timestamp=time.time()
                ))
    
    async def _prune(self, max_episodes: int = 1000, 
                     max_age_days: int = 30):
        """Remove old, low-importance entries."""
        now = time.time()
        day = 86400
        
        self.memory.episodes = [
            e for e in self.memory.episodes
            if (e.importance > 0.3 or 
                (now - e.timestamp) < max_age_days * day)
        ]
        
        # If still over limit, remove lowest importance
        if len(self.memory.episodes) > max_episodes:
            self.memory.episodes.sort(
                key=lambda e: (e.importance, e.timestamp),
                reverse=True
            )
            self.memory.episodes = self.memory.episodes[:max_episodes]
```

### Step 5: Memory Retrieval with Reranking

```python
class MemoryRetriever:
    """Retrieve relevant memories with multi-stage ranking."""
    
    def __init__(self, vector_store, llm):
        self.vector_store = vector_store
        self.llm = llm
    
    async def retrieve(self, query: str, k: int = 10, rerank_top: int = 5):
        """Retrieve and rerank memories."""
        
        # Stage 1: Quick vector search (get more than needed)
        candidates = await self.vector_store.search(query, k=k * 3)
        
        # Stage 2: Rerank with LLM
        scored = []
        for mem in candidates:
            score = await self._relevance_score(query, mem.content)
            scored.append((score, mem))
        
        scored.sort(key=lambda x: x[0], reverse=True)
        
        # Stage 3: Return top results
        return [mem for _, mem in scored[:rerank_top]]
    
    async def _relevance_score(self, query: str, memory: str) -> float:
        """Score how relevant a memory is to the query."""
        prompt = f"""Rate the relevance of this memory to the query from 0.0 to 1.0.
Only return a number, nothing else.

Query: {query}
Memory: {memory}
Relevance:"""
        
        response = await self.llm.generate(prompt, temperature=0)
        try:
            return float(response.strip())
        except ValueError:
            return 0.5  # Default on parse failure
```

---

## Memory Budget Planning

### Estimating Memory Costs

| Component | Tokens/Month (100K tasks) | Cost (GPT-4 @ $0.03/K) |
|-----------|--------------------------|----------------------|
| Context window (avg 4K tokens) | 400M tokens | $12,000 |
| Vector storage (1M embeddings) | — | ~$100/mo |
| Summarization overhead | 20M tokens | $600 |
| **Total** | — | **~$12,700/mo** |

### Optimization Levers

| Lever | Savings | Trade-off |
|-------|---------|-----------|
| Shorter context windows | 40-60% | May miss relevant context |
| Fewer retrieved memories | 20-30% | Lower recall quality |
| Less frequent summarization | 10-20% | Staler summaries |
| Stricter importance thresholds | 15-25% | Lose some nuance |
| Batch consolidation | 5-10% | Delayed memory optimization |

---

## Trigger Phrases

| Phrase | Action |
|--------|--------|
| "What do you remember about..." | Search semantic memory for topic |
| "Remember this for later" | Store with high importance |
| "Forget that" | Delete specific memory |
| "Show me your memory" | Display current working context |
| "Summarize the conversation" | Generate rolling summary |
| "Run memory consolidation" | Trigger GC and merging |
| "Check memory usage" | Show token consumption by tier |
| "Save this to long-term memory" | Promote to semantic/episodic tiers |

---

## Anti-Patterns

| Anti-Pattern | Why It Fails | Fix |
|-------------|-------------|-----|
| Putting everything in context | Exceeds window, loses early info | Tiered memory with summarization |
| No importance scoring | All memories treated equally | Score on write, prune on importance |
| Never consolidating | Unbounded growth, degraded retrieval | Schedule periodic consolidation |
| Vector search without reranking | Noisy, low-precision results | Add LLM reranking stage |
| Ignoring token budgets | Cost surprises, silent truncation | Track and alert on token usage |
| One memory config for all agents | Research agent needs differ from support | Per-agent memory configuration |

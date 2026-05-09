---
name: token-budget-tracking
description: 'Track, optimize, and control token consumption across multi-agent systems. Covers budget allocation, real-time monitoring, cost attribution, per-agent limits, and proactive cost optimization for production LLM deployments.'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: ai-ml
  tags:
    - token-budget
    - cost-optimization
    - token-tracking
    - budget-alerting
    - llm-costs
    - resource-management
---

# Token Budget Tracking & Optimization

## Overview

In production multi-agent systems, token costs are the new infrastructure bill — and they can spiral fast. An agent in a loop can burn through hundreds of dollars in minutes. This skill covers how to set budgets, track consumption in real time, attribute costs to specific agents and tasks, and optimize token usage without sacrificing quality.

---

## Core Concepts

### Token Cost Economics

| Model | Input ($/1M tokens) | Output ($/1M tokens) | Cost per 100K tasks (4K avg) |
|-------|--------------------|---------------------|------------------------------|
| GPT-4o | $2.50 | $10.00 | ~$1,250 |
| Claude 3.5 Sonnet | $3.00 | $15.00 | ~$1,800 |
| GPT-4o-mini | $0.15 | $0.60 | ~$75 |
| Claude 3 Haiku | $0.25 | $1.25 | ~$150 |

**A single runaway agent** consuming 50K tokens per loop for 100 iterations = **$50-$150** in minutes.

### Budget Dimensions

| Dimension | What It Tracks | Why It Matters |
|-----------|---------------|----------------|
| **Per Agent** | Tokens consumed by each agent | Identify expensive agents |
| **Per Task** | Cost per completed task | Measure ROI per task type |
| **Per User** | Cost attributed to a user/session | Bill-back, abuse detection |
| **Per Model** | Cost by LLM provider/model | Model selection decisions |
| **Daily/Weekly** | Aggregate burn rate | Budget forecasting |
| **Per Step** | Tokens per reasoning step | Detect inefficient reasoning |

---

## Step-by-Step Implementation

### Step 1: Build a Token Counter

```python
from dataclasses import dataclass, field
from collections import defaultdict
import time
import threading

@dataclass
class TokenUsage:
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0
    
    def __add__(self, other: "TokenUsage"):
        return TokenUsage(
            prompt_tokens=self.prompt_tokens + other.prompt_tokens,
            completion_tokens=self.completion_tokens + other.completion_tokens,
            total_tokens=self.total_tokens + other.total_tokens
        )

class TokenCounter:
    """Tracks token usage across all agents with attribution."""
    
    def __init__(self):
        self.usage: dict[str, dict[str, TokenUsage]] = defaultdict(
            lambda: defaultdict(TokenUsage)
        )
        self._lock = threading.Lock()
    
    def record(self, agent_name: str, task_id: str, 
               prompt_tokens: int, completion_tokens: int):
        """Record token usage for an agent-task pair."""
        with self._lock:
            usage = TokenUsage(
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                total_tokens=prompt_tokens + completion_tokens
            )
            self.usage[agent_name][task_id] = usage
    
    def agent_total(self, agent_name: str) -> TokenUsage:
        """Get total tokens for an agent."""
        with self._lock:
            total = TokenUsage()
            for task_usage in self.usage[agent_name].values():
                total += task_usage
            return total
    
    def task_cost(self, agent_name: str, task_id: str,
                  input_rate: float, output_rate: float) -> float:
        """Calculate monetary cost for a specific task."""
        usage = self.usage[agent_name].get(task_id)
        if not usage:
            return 0.0
        return (
            usage.prompt_tokens * input_rate / 1_000_000 +
            usage.completion_tokens * output_rate / 1_000_000
        )
    
    def top_agents(self, n: int = 10) -> list[tuple[str, TokenUsage]]:
        """Get the n highest-consuming agents."""
        with self._lock:
            totals = [
                (agent, self.agent_total(agent))
                for agent in self.usage
            ]
            totals.sort(key=lambda x: x[1].total_tokens, reverse=True)
            return totals[:n]
```

### Step 2: Implement Budget Enforcements

```python
class TokenBudget:
    """Enforce per-agent and global token budgets."""
    
    def __init__(self, counter: TokenCounter):
        self.counter = counter
        self.agent_limits: dict[str, int] = {}  # agent -> max tokens
        self.period_limits: dict[str, int] = {}  # period -> max tokens
        
        # Current period tracking
        self.period_start = time.time()
        self.period_usage: dict[str, int] = defaultdict(int)
    
    def set_agent_limit(self, agent_name: str, max_tokens: int):
        """Set a per-agent token budget."""
        self.agent_limits[agent_name] = max_tokens
    
    def set_period_limit(self, period_name: str, max_tokens: int):
        """Set a global period budget (e.g., daily, weekly)."""
        self.period_limits[period_name] = max_tokens
    
    async def check_and_apply_budget(self, agent_name: str, 
                                       estimated_tokens: int) -> bool:
        """Check if this request would exceed any budget. Returns True if allowed."""
        
        # 1. Check per-agent limit
        agent_limit = self.agent_limits.get(agent_name)
        if agent_limit:
            current = self.counter.agent_total(agent_name).total_tokens
            if current + estimated_tokens > agent_limit:
                return False  # Agent budget exceeded
        
        # 2. Check period limits
        current_period = self._current_period()
        for period, limit in self.period_limits.items():
            if self.period_usage[period] + estimated_tokens > limit:
                return False  # Global period budget exceeded
        
        # 3. Reserve tokens
        self.period_usage[current_period] += estimated_tokens
        return True
    
    def _current_period(self) -> str:
        """Get the current period label (e.g., 'daily:2024-01-15')."""
        now = datetime.now()
        return f"daily:{now.strftime('%Y-%m-%d')}"
    
    def reset_period(self):
        """Reset period tracking (call daily, weekly)."""
        self.period_start = time.time()
        self.period_usage.clear()
```

### Step 3: Token Optimization Strategies

```python
class TokenOptimizer:
    """Apply optimization strategies to reduce token consumption."""
    
    def __init__(self, llm):
        self.llm = llm
    
    async def compress_context(self, messages: list[dict], 
                                max_tokens: int) -> list[dict]:
        """Compress conversation history to fit within token budget."""
        total = self._count_tokens(messages)
        
        if total <= max_tokens:
            return messages  # No compression needed
        
        # Strategy 1: Remove low-signal turns
        messages = self._remove_greetings(messages)
        
        # Strategy 2: Summarize older messages
        if self._count_tokens(messages) > max_tokens:
            messages = await self._summarize_older(messages)
        
        # Strategy 3: Truncate long messages
        if self._count_tokens(messages) > max_tokens:
            messages = self._truncate_longest(messages, max_tokens)
        
        return messages
    
    def _remove_greetings(self, messages: list[dict]) -> list[dict]:
        """Remove low-value greetings and acknowledgments."""
        greetings = {"hi", "hello", "thanks", "okay", "sure", "got it"}
        return [
            m for m in messages
            if not (m["role"] == "assistant" and 
                    m["content"].strip().lower() in greetings)
        ]
    
    async def _summarize_older(self, messages: list[dict]) -> list[dict]:
        """Summarize messages beyond a threshold."""
        keep_recent = messages[-4:]  # Keep last 4 exchanges verbatim
        to_summarize = messages[:-4]
        
        if not to_summarize:
            return messages
        
        text = "\n".join(
            f"[{m['role']}]: {m['content'][:500]}"
            for m in to_summarize
        )
        
        summary = await self.llm.generate(
            f"Summarize this conversation history concisely while preserving "
            f"all key facts, decisions, and user preferences:\n\n{text}",
            max_tokens=200
        )
        
        return [
            {"role": "system", "content": f"[Summarized Context]: {summary}"}
        ] + keep_recent
    
    def _truncate_longest(self, messages: list[dict], 
                           max_tokens: int) -> list[dict]:
        """Truncate the longest messages to fit budget."""
        while self._count_tokens(messages) > max_tokens:
            longest = max(
                messages, 
                key=lambda m: len(m["content"].split())
            )
            # Truncate by half
            words = longest["content"].split()
            longest["content"] = " ".join(words[:len(words)//2])
        
        return messages
    
    def _count_tokens(self, messages: list[dict]) -> int:
        """Rough token estimation (4 chars ≈ 1 token)."""
        total = sum(len(m["content"]) for m in messages)
        return total // 4
```

### Step 4: Real-Time Budget Dashboard

```python
class BudgetDashboard:
    """Real-time token budget monitoring."""
    
    def __init__(self, counter: TokenCounter, budgets: TokenBudget):
        self.counter = counter
        self.budgets = budgets
    
    def current_status(self) -> dict:
        """Get current budget status for all agents."""
        agents = {}
        for agent_name in self.counter.usage:
            usage = self.counter.agent_total(agent_name)
            limit = self.budgets.agent_limits.get(agent_name, float('inf'))
            agents[agent_name] = {
                "total_tokens": usage.total_tokens,
                "prompt_tokens": usage.prompt_tokens,
                "completion_tokens": usage.completion_tokens,
                "budget_limit": limit,
                "percent_used": (usage.total_tokens / limit * 100) if limit != float('inf') else 0,
                "estimated_cost": self._estimate_cost(usage),
            }
        
        return {
            "agents": agents,
            "global": {
                "total_tokens": sum(a["total_tokens"] for a in agents.values()),
                "total_cost": sum(a["estimated_cost"] for a in agents.values()),
            },
            "period_usage": dict(self.budgets.period_usage)
        }
    
    def _estimate_cost(self, usage: TokenUsage) -> float:
        """Estimate cost at blended rate ($0.003/1K tokens)."""
        return usage.total_tokens * 0.003 / 1000
    
    def budget_alert(self, threshold: float = 0.8) -> list[str]:
        """Get alerts for agents approaching budget limits."""
        alerts = []
        for agent_name, info in self.current_status()["agents"].items():
            if info["percent_used"] > threshold * 100:
                alerts.append(
                    f"{agent_name}: {info['percent_used']:.0f}% of budget used "
                    f"({info['total_tokens']:,} tokens)"
                )
        return alerts
```

### Step 5: Proactive Cost Controls

```python
class CostController:
    """Proactive cost optimization controls."""
    
    def __init__(self, optimizer: TokenOptimizer, budgets: TokenBudget):
        self.optimizer = optimizer
        self.budgets = budgets
    
    async def optimize_request(self, agent_name: str, 
                                 messages: list[dict]) -> list[dict]:
        """Optimize a request before sending to LLM."""
        
        # Apply optimizations based on agent's budget status
        agent_usage = self.budgets.counter.agent_total(agent_name)
        agent_limit = self.budgets.agent_limits.get(agent_name, float('inf'))
        
        usage_ratio = agent_usage.total_tokens / agent_limit if agent_limit else 0
        
        if usage_ratio > 0.9:
            # Critical: aggressive compression
            return await self.optimizer.compress_context(
                messages, max_tokens=2000
            )
        elif usage_ratio > 0.7:
            # Warning: moderate compression
            return await self.optimizer.compress_context(
                messages, max_tokens=4000
            )
        
        return messages  # Within budget, no optimization needed
    
    def model_selection(self, task_difficulty: str, 
                         available_budget: float) -> str:
        """Select the most cost-effective model for the task."""
        models = {
            "easy": {"model": "gpt-4o-mini", "cost_per_1k": 0.00015},
            "medium": {"model": "gpt-4o", "cost_per_1k": 0.0025},
            "hard": {"model": "gpt-4o", "cost_per_1k": 0.0025},
        }
        
        recommended = models.get(task_difficulty, models["medium"])
        
        # If budget is very tight, downgrade
        if available_budget < recommended["cost_per_1k"] * 100:
            return models["easy"]["model"]
        
        return recommended["model"]
```

### Step 6: Budget Alerting Rules

```yaml
# budget-alerts.yaml
budget_rules:
  - name: daily_budget_exceeded
    condition: daily_tokens > daily_limit
    severity: P1
    action: pause_all_noncritical_agents
    message: "Daily token budget exceeded: {used}/{limit}"

  - name: agent_spike
    condition: agent_hourly_tokens > agent_hourly_limit * 2
    severity: P2
    action: investigate_agent
    message: "Agent {name} token usage spiked: {hourly_used}/hr"

  - name: runaway_detected
    condition: agent_tokens_per_task > task_limit * 3
    severity: P1
    action: kill_agent_task
    message: "Agent {name} may be looping: {tokens_per_task} tokens/task"

  - name: budget_forecast
    condition: projected_daily_tokens > daily_limit * 0.9
    severity: P3
    action: notify_team
    message: "On track to exceed daily budget by {overshoot}%"
```

---

## Token Budget Planning

### Setting Budgets

| Agent Type | Suggested Daily Limit | Monthly Cost Cap |
|-----------|---------------------|------------------|
| Customer Support | 500K tokens | ~$150 |
| Research Agent | 2M tokens | ~$600 |
| Code Generation | 3M tokens | ~$900 |
| Data Analysis | 1M tokens | ~$300 |
| Internal Tooling | 200K tokens | ~$60 |

### Optimization Impact

| Strategy | Typical Savings | Quality Impact |
|----------|----------------|---------------|
| Shorter system prompts | 15-30% | Low (with good editing) |
| Context compression | 20-40% | Medium (summarization loss) |
| Cheaper models for easy tasks | 40-60% | Low (task-dependent) |
| Fewer reasoning steps | 10-25% | Medium (may reduce quality) |
| Caching common responses | 5-15% | None (exact cache hits) |
| Limiting conversation history | 30-50% | Low (recent context suffices) |

---

## Trigger Phrases

| Phrase | Action |
|--------|--------|
| "Show token usage" | Display current consumption by agent |
| "What's the budget status?" | Show budget vs. actual for all agents |
| "Set budget for agent X" | Configure per-agent token limit |
| "What's costing the most?" | Show top spenders and cost breakdown |
| "Optimize this request" | Compress context to reduce tokens |
| "Run budget report" | Generate daily/weekly cost report |
| "Alert on budget thresholds" | Set up budget alerting rules |
| "Switch to cheaper model" | Downgrade model for cost savings |

---

## Anti-Patterns

| Anti-Pattern | Why It Fails | Fix |
|-------------|-------------|-----|
| No budget tracking | Bills are a surprise each month | Real-time per-agent tracking |
| Same model for all tasks | Overpaying for simple tasks | Model tiering by difficulty |
| No per-agent limits | One runaway agent costs everything | Hard per-agent budgets |
| Ignoring output tokens | Output costs more than input (2-4x) | Track input/output separately |
| No proactive alerts | Find out about spikes at billing | Real-time budget alerts |
| Caching nothing | Pay for identical prompts repeatedly | Implement response caching |

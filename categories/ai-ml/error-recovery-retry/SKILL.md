---
name: error-recovery-retry
description: 'Design robust error recovery, retry logic, and fallback strategies for production AI agents. Covers transient failure handling, circuit breakers, exponential backoff, state recovery, graceful degradation, and dead-letter queues for agent systems.'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: ai-ml
  tags:
    - error-recovery
    - retry-logic
    - circuit-breaker
    - fallback-strategies
    - fault-tolerance
    - graceful-degradation
---

# Error Recovery & Retry Logic for Agents

## Overview

Agents fail. APIs time out. Models return garbage. Tools throw exceptions. The difference between a production-grade system and a prototype is how gracefully it fails. This skill covers comprehensive error recovery patterns — from simple retries to circuit breakers, stateful recovery, and human escalation paths.

---

## Core Concepts

### Failure Taxonomy

| Failure Type | Example | Frequency | Recoverable? |
|-------------|---------|-----------|-------------|
| **Transient** | API timeout, network glitch | Common | ✅ Yes — retry |
| **Rate Limited** | 429 Too Many Requests | Common | ✅ Yes — backoff |
| **Validation** | Invalid tool parameters | Occasional | ✅ Yes — fix and retry |
| **Model Error** | LLM returns nonsense | Occasional | ⚠️ Maybe — retry with different prompt |
| **Context Overflow** | Token limit exceeded | Rare | ✅ Yes — compress and retry |
| **Permission** | Agent lacks access | Rare | ❌ No — escalate |
| **Security** | Injection attempt detected | Rare | ❌ No — alert and block |
| **Permanent** | Tool deleted, endpoint gone | Rare | ❌ No — escalate to human |

### Recovery Strategy Decision Tree

```
                    ┌──────────────┐
                    │  Agent Error  │
                    └──────┬───────┘
                           │
               ┌───────────┴───────────┐
               │                       │
          Transient?              Permanent?
               │                       │
          ┌────┴────┐            ┌──────┴──────┐
          │         │            │             │
       Retry    Circuit      Fallback      Escalate
       +backoff  Breaker     Agent         to Human
```

---

## Step-by-Step Implementation

### Step 1: Retry with Exponential Backoff

```python
import asyncio
import random
from functools import wraps
from typing import Callable, Any

async def retry_with_backoff(
    fn: Callable,
    max_retries: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 60.0,
    backoff_factor: float = 2.0,
    jitter: bool = True,
    retryable_exceptions: tuple = (TimeoutError, ConnectionError, 
                                    RateLimitError)
) -> Any:
    """Execute a function with exponential backoff retry logic."""
    last_exception = None
    
    for attempt in range(max_retries + 1):
        try:
            return await fn()
        except retryable_exceptions as e:
            last_exception = e
            
            if attempt == max_retries:
                raise  # Exhausted retries
            
            # Calculate delay with exponential backoff
            delay = min(base_delay * (backoff_factor ** attempt), max_delay)
            
            # Add jitter to prevent thundering herd
            if jitter:
                delay = delay * (0.5 + random.random() * 0.5)
            
            logger.warning(
                f"Attempt {attempt + 1}/{max_retries + 1} failed: {e}. "
                f"Retrying in {delay:.1f}s..."
            )
            
            await asyncio.sleep(delay)
    
    raise last_exception  # Shouldn't reach here, but safety


class RetryPolicy:
    """Configurable retry policy for agent operations."""
    
    def __init__(self, name: str, max_retries: int = 3, 
                 base_delay: float = 1.0, max_delay: float = 60.0,
                 backoff_factor: float = 2.0):
        self.name = name
        self.max_retries = max_retries
        self.base_delay = base_delay
        self.max_delay = max_delay
        self.backoff_factor = backoff_factor
        self.consecutive_failures = 0
    
    async def execute(self, fn: Callable) -> Any:
        """Execute with this policy's retry configuration."""
        try:
            result = await retry_with_backoff(
                fn,
                max_retries=self.max_retries,
                base_delay=self.base_delay,
                max_delay=self.max_delay,
                backoff_factor=self.backoff_factor
            )
            self.consecutive_failures = 0
            return result
        except Exception as e:
            self.consecutive_failures += 1
            raise
    
    def is_circuit_breaking(self, threshold: int = 5) -> bool:
        """Check if consecutive failures exceed threshold."""
        return self.consecutive_failures >= threshold

# Predefined policies
RETRY_POLICIES = {
    "tool_call": RetryPolicy("tool_call", max_retries=3, base_delay=0.5),
    "api_request": RetryPolicy("api_request", max_retries=5, base_delay=1.0),
    "llm_generation": RetryPolicy("llm_generation", max_retries=2, base_delay=2.0),
    "database_query": RetryPolicy("database_query", max_retries=3, base_delay=0.1),
}
```

### Step 2: Circuit Breaker Pattern

```python
class CircuitBreaker:
    """Prevent repeated calls to failing services."""
    
    STATES = ["CLOSED", "OPEN", "HALF_OPEN"]
    
    def __init__(self, name: str, failure_threshold: int = 5,
                 recovery_timeout: float = 30.0,
                 half_open_max_calls: int = 3):
        self.name = name
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.half_open_max_calls = half_open_max_calls
        
        self.state = "CLOSED"
        self.failure_count = 0
        self.last_failure_time = None
        self.half_open_calls = 0
    
    async def call(self, fn: Callable, fallback: Callable = None) -> Any:
        """Execute with circuit breaking."""
        
        if self.state == "OPEN":
            if self._should_attempt_recovery():
                self.state = "HALF_OPEN"
                self.half_open_calls = 0
            else:
                return await self._use_fallback(fn, fallback)
        
        if self.state == "HALF_OPEN":
            if self.half_open_calls >= self.half_open_max_calls:
                return await self._use_fallback(fn, fallback)
            self.half_open_calls += 1
        
        try:
            result = await fn()
            self._on_success()
            return result
        except Exception as e:
            self._on_failure(e)
            
            if self.state == "HALF_OPEN":
                self.state = "OPEN"
                self.last_failure_time = time.time()
            
            return await self._use_fallback(fn, fallback)
    
    def _on_success(self):
        self.failure_count = 0
        if self.state == "HALF_OPEN":
            self.state = "CLOSED"
    
    def _on_failure(self, error: Exception):
        self.failure_count += 1
        self.last_failure_time = time.time()
        
        if self.failure_count >= self.failure_threshold:
            self.state = "OPEN"
            logger.warning(
                f"Circuit breaker {self.name} OPEN after "
                f"{self.failure_count} failures"
            )
    
    def _should_attempt_recovery(self) -> bool:
        if not self.last_failure_time:
            return True
        elapsed = time.time() - self.last_failure_time
        return elapsed >= self.recovery_timeout
    
    async def _use_fallback(self, fn: Callable, fallback: Callable) -> Any:
        if fallback:
            return await fallback()
        raise CircuitBreakerOpenError(f"Circuit breaker {self.name} is OPEN")


class CircuitBreakerRegistry:
    """Manage circuit breakers for all agent dependencies."""
    
    def __init__(self):
        self.breakers: dict[str, CircuitBreaker] = {}
    
    def get_or_create(self, name: str, **kwargs) -> CircuitBreaker:
        if name not in self.breakers:
            self.breakers[name] = CircuitBreaker(name, **kwargs)
        return self.breakers[name]
    
    def status(self) -> dict:
        return {
            name: {
                "state": cb.state,
                "failure_count": cb.failure_count,
                "last_failure": cb.last_failure_time,
            }
            for name, cb in self.breakers.items()
        }
```

### Step 3: Stateful Agent Recovery

```python
class AgentStateRecovery:
    """Recover agent state after failures to resume work."""

    def __init__(self, storage):
        self.storage = storage
    
    async def checkpoint(self, agent_id: str, state: dict):
        """Save agent state at a checkpoint."""
        checkpoint = {
            "agent_id": agent_id,
            "state": state,
            "timestamp": time.time(),
            "version": state.get("_version", 0) + 1
        }
        await self.storage.set(
            f"checkpoint:{agent_id}",
            checkpoint
        )
    
    async def recover(self, agent_id: str) -> dict:
        """Restore agent state from last checkpoint."""
        checkpoint = await self.storage.get(f"checkpoint:{agent_id}")
        if not checkpoint:
            return {}  # No checkpoint, start fresh
        
        return checkpoint["state"]
    
    async def replay_from_checkpoint(self, agent, task: str,
                                       checkpoint: dict) -> str:
        """Replay agent execution from a saved checkpoint."""
        
        # 1. Restore context
        agent.context = checkpoint.get("context", {})
        
        # 2. Rebuild working memory
        agent.memory.working_memory = checkpoint.get("memory", [])
        
        # 3. Identify last completed step
        completed_steps = checkpoint.get("completed_steps", [])
        
        # 4. Resume from next uncompleted step
        plan = checkpoint.get("plan", [])
        remaining = [
            step for step in plan 
            if step["id"] not in completed_steps
        ]
        
        if not remaining:
            return checkpoint.get("final_result", "")
        
        # 5. Continue execution
        agent.current_plan = remaining
        return await agent.execute_plan()
```

### Step 4: Graceful Degradation

```python
class GracefulDegradation:
    """Define fallback behaviors when capabilities degrade."""
    
    def __init__(self, agent):
        self.agent = agent
        self.capability_levels = {
            "full": ["search", "analyze", "write", "execute"],
            "reduced": ["search", "analyze"],
            "minimal": ["search"],
            "fallback": []
        }
        self.current_level = "full"
    
    def degrade(self, reason: str):
        """Reduce capabilities when something fails."""
        levels = ["full", "reduced", "minimal", "fallback"]
        current_idx = levels.index(self.current_level)
        
        if current_idx < len(levels) - 1:
            self.current_level = levels[current_idx + 1]
            logger.warning(
                f"Agent {self.agent.name} degraded to {self.current_level}: {reason}"
            )
        
        # Update available tools
        self.agent.tools = [
            t for t in self.agent.tools 
            if t.name in self.capability_levels[self.current_level]
        ]
    
    async def attempt_operation(self, operation: str, fn: Callable, 
                                 fallback_fn: Callable = None) -> Any:
        """Try an operation, degrade on failure, fallback on repeated failure."""
        try:
            return await fn()
        except Exception as e:
            self.degrade(f"{operation} failed: {e}")
            
            if fallback_fn:
                logger.info(f"Using fallback for {operation}")
                return await fallback_fn()
            
            # If no fallback, return graceful error
            return {
                "status": "unavailable",
                "operation": operation,
                "message": f"This capability is currently unavailable. {e}"
            }
    
    def status(self) -> dict:
        return {
            "agent": self.agent.name,
            "capability_level": self.current_level,
            "available_tools": [t.name for t in self.agent.tools],
            "degraded": self.current_level != "full"
        }
```

### Step 5: Dead-Letter Queue for Unrecoverable Tasks

```python
class DeadLetterQueue:
    """Handle tasks that cannot be processed after all retries."""
    
    def __init__(self, storage):
        self.storage = storage
    
    async def send(self, task: dict, error: str, 
                    retries_exhausted: bool = True):
        """Send a failed task to the dead-letter queue."""
        dlq_entry = {
            "task_id": task.get("id"),
            "original_task": task,
            "error": error,
            "retries_exhausted": retries_exhausted,
            "failed_at": time.time(),
            "status": "pending_review"
        }
        
        await self.storage.append(
            f"dlq:{datetime.now().strftime('%Y-%m-%d')}",
            dlq_entry
        )
        
        logger.error(f"Task {task.get('id')} sent to DLQ: {error}")
    
    async def replay(self, dlq_id: str, agent_executor) -> bool:
        """Replay a task from the dead-letter queue."""
        entry = await self.storage.get(f"dlq_entry:{dlq_id}")
        if not entry:
            return False
        
        try:
            result = await agent_executor(entry["original_task"])
            await self.storage.set(f"dlq_entry:{dlq_id}", {
                **entry,
                "status": "replayed",
                "replayed_at": time.time(),
                "result": result
            })
            return True
        except Exception as e:
            await self.storage.set(f"dlq_entry:{dlq_id}", {
                **entry,
                "status": "replay_failed",
                "last_error": str(e),
                "replay_attempts": entry.get("replay_attempts", 0) + 1
            })
            return False
    
    async def summary(self) -> dict:
        """Get DLQ summary for review."""
        today = datetime.now().strftime('%Y-%m-%d')
        entries = await self.storage.query(f"dlq:{today}")
        
        return {
            "total": len(entries),
            "by_error": Counter(e["error"] for e in entries).most_common(5),
            "replayed": sum(1 for e in entries if e["status"] == "replayed"),
            "pending": sum(1 for e in entries if e["status"] == "pending_review"),
        }
```

### Step 6: Comprehensive Error Handler

```python
class AgentErrorHandler:
    """Central error handler for all agent failures."""
    
    def __init__(self, retry_policies: dict, circuit_breakers: CircuitBreakerRegistry,
                 dlq: DeadLetterQueue, degradation: GracefulDegradation):
        self.retry_policies = retry_policies
        self.circuit_breakers = circuit_breakers
        self.dlq = dlq
        self.degradation = degradation
    
    async def handle(self, operation: str, fn: Callable, 
                      context: dict = None) -> Any:
        """Handle an operation with full error recovery stack."""
        
        try:
            # 1. Get retry policy
            policy = self.retry_policies.get(operation, RETRY_POLICIES["tool_call"])
            
            # 2. Check circuit breaker
            cb = self.circuit_breakers.get_or_create(operation)
            
            # 3. Execute with retries and circuit breaking
            return await policy.execute(
                lambda: cb.call(fn)
            )
            
        except CircuitBreakerOpenError:
            # 4. Circuit is open — use degraded fallback
            return await self.degradation.attempt_operation(
                operation, fn
            )
            
        except Exception as e:
            # 5. All retries exhausted — send to DLQ
            await self.dlq.send(
                context or {},
                error=str(e)
            )
            
            # 6. Return graceful error
            return {
                "status": "error",
                "operation": operation,
                "error": str(e),
                "message": "Unable to complete this operation. The team has been notified."
            }
```

---

## Recovery Configuration

### YAML Configuration

```yaml
# recovery-config.yaml
retry_policies:
  llm_call:
    max_retries: 3
    base_delay: 2.0
    max_delay: 30.0
    retryable_errors: [timeout, rate_limit, server_error]
  
  tool_execution:
    max_retries: 2
    base_delay: 0.5
    max_delay: 10.0
    retryable_errors: [timeout, connection_error]

circuit_breakers:
  tool_api:
    failure_threshold: 5
    recovery_timeout: 30
    half_open_max_calls: 2
  
  model_api:
    failure_threshold: 3
    recovery_timeout: 60
    half_open_max_calls: 1

fallbacks:
  search_tool:
    primary: vector_search
    fallback: keyword_search
    last_resort: return_cached_results
  
  llm_generation:
    primary: gpt-4o
    fallback: gpt-4o-mini
    last_resort: template_response
```

---

## Trigger Phrases

| Phrase | Action |
|--------|--------|
| "Retry that" | Retry the last failed operation |
| "What went wrong?" | Show error details and trace |
| "Check circuit breakers" | Show circuit breaker status |
| "Clear circuit breaker" | Manually reset a circuit breaker |
| "Show dead letter queue" | List unrecoverable failed tasks |
| "Replay from DLQ" | Retry a task from dead-letter queue |
| "Degrade gracefully" | Switch to reduced capability mode |
| "Run recovery" | Attempt state recovery from checkpoint |

---

## Anti-Patterns

| Anti-Pattern | Why It Fails | Fix |
|-------------|-------------|-----|
| Infinite retries | Never gives up, burns tokens | Always set max retries |
| No backoff | Retry instantly, overload service | Exponential backoff + jitter |
| Retrying permanent errors | Wastes time and tokens | Classify errors: retryable vs not |
| No circuit breaker | Cascade failures across system | Circuit breaker per dependency |
| Ignoring partial success | All-or-nothing mindset | Checkpoint partial progress |
| No human escalation | Tasks stuck in retry loops forever | Dead-letter queue + alert |
| Retry without idempotency | Duplicate side effects | Ensure tool idempotency |

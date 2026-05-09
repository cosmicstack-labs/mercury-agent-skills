---
name: agent-task-delegation
description: 'Design and operate task delegation systems for multi-agent fleets. Covers workload distribution, load balancing, queue management, priority scheduling, and dynamic agent scaling for production agent systems.'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: ai-ml
  tags:
    - task-delegation
    - load-balancing
    - queue-management
    - workload-distribution
    - agent-orchestration
    - scaling
---

# Agent Task Delegation & Load Balancing

## Overview

A multi-agent system without delegation logic is a mob, not a team. Tasks must be routed to the right agent, prioritized correctly, and balanced across available capacity. This skill covers queue-based architectures, routing strategies, backpressure handling, and dynamic scaling for production agent workloads.

---

## Core Concepts

### Delegation Models

| Model | Description | Best For |
|-------|-------------|----------|
| **Direct Assignment** | Task is routed to a specific agent by name | Known, fixed responsibilities |
| **Work Queue** | Tasks go into a queue; agents pull when ready | Variable workloads, many agents |
| **Router** | Classifier decides which agent handles each task | Heterogeneous task types |
| **Supervisor** | Orchestrator delegates and synthesizes | Complex multi-step workflows |
| **Broadcast** | All agents receive task; first responder claims it | Redundancy, SLA-critical tasks |

### Load Balancing Strategies

| Strategy | Algorithm | When to Use |
|----------|-----------|-------------|
| **Round Robin** | Cycle through agents in order | Identical agents, uniform tasks |
| **Least Connections** | Assign to agent with fewest active tasks | Variable task duration |
| **Weighted** | Based on agent capacity/priority | Heterogeneous agent capabilities |
| **Consistent Hashing** | Hash task → agent (deterministic) | Session affinity, cache locality |
| **Latency-Based** | Route to fastest available agent | Performance-sensitive tasks |
| **Random** | Pick agent at random | Simple, symmetrical setups |

---

## Step-by-Step Implementation

### Step 1: Build the Task Queue

```python
from dataclasses import dataclass
from enum import Enum
import asyncio
import time

class Priority(Enum):
    CRITICAL = 0
    HIGH = 1
    MEDIUM = 2
    LOW = 3

@dataclass
class Task:
    id: str
    agent_type: str
    payload: dict
    priority: Priority = Priority.MEDIUM
    created_at: float = None
    timeout: int = 30
    retry_count: int = 0
    max_retries: int = 3
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = time.time()

class TaskQueue:
    """Priority-based task queue with timeout handling."""
    
    def __init__(self):
        self.queues = {
            Priority.CRITICAL: asyncio.Queue(),
            Priority.HIGH: asyncio.Queue(),
            Priority.MEDIUM: asyncio.Queue(),
            Priority.LOW: asyncio.Queue(),
        }
    
    async def enqueue(self, task: Task):
        """Add task to the appropriate priority queue."""
        await self.queues[task.priority].put(task)
    
    async def dequeue(self) -> Task:
        """Get the highest-priority available task."""
        for priority in sorted([p for p in Priority]):
            queue = self.queues[priority]
            if not queue.empty():
                task = await queue.get()
                # Check if task has expired
                if time.time() - task.created_at > task.timeout:
                    return await self.dequeue()  # Skip expired task
                return task
        
        return None  # All queues empty
```

### Step 2: Implement the Delegator

```python
class AgentDelegator:
    """Routes tasks to the right agent with load balancing."""
    
    def __init__(self, task_queue: TaskQueue):
        self.queue = task_queue
        self.agents = {}  # agent_type -> list of agent instances
        self.active_tasks = {}  # agent_id -> count
        self.capacity = {}  # agent_id -> max concurrent tasks
    
    def register_agent(self, agent_type: str, agent, capacity: int = 5):
        """Register an agent that can handle tasks."""
        if agent_type not in self.agents:
            self.agents[agent_type] = []
        agent_id = f"{agent_type}-{len(self.agents[agent_type])}"
        agent.agent_id = agent_id
        self.agents[agent_type].append(agent)
        self.active_tasks[agent_id] = 0
        self.capacity[agent_id] = capacity
    
    async def delegate(self, task: Task) -> str:
        """Assign task to the best available agent."""
        available = self._find_available(task.agent_type)
        
        if not available:
            # Backpressure — queue the task
            await self.queue.enqueue(task)
            return f"queued:{task.id}"
        
        agent = self._select_agent(available)
        self.active_tasks[agent.agent_id] += 1
        
        try:
            result = await asyncio.wait_for(
                agent.run(task.payload),
                timeout=task.timeout
            )
            return result
        finally:
            self.active_tasks[agent.agent_id] -= 1
    
    def _find_available(self, agent_type: str) -> list:
        """Find agents with available capacity."""
        available = []
        for agent in self.agents.get(agent_type, []):
            if self.active_tasks[agent.agent_id] < self.capacity[agent.agent_id]:
                available.append(agent)
        return available
    
    def _select_agent(self, available: list):
        """Select the best agent using least-connections strategy."""
        return min(available, key=lambda a: self.active_tasks[a.agent_id])
```

### Step 3: Add Backpressure & Rate Limiting

```python
class BackpressureManager:
    """Prevent overload with backpressure mechanisms."""
    
    def __init__(self, max_queue_depth: int = 1000,
                 max_concurrent: int = 50):
        self.max_queue_depth = max_queue_depth
        self.max_concurrent = max_concurrent
        self.current_concurrent = 0
    
    async def acquire(self) -> bool:
        """Try to acquire a slot. Returns False if overloaded."""
        if self.current_concurrent >= self.max_concurrent:
            return False
        self.current_concurrent += 1
        return True
    
    def release(self):
        """Release a slot when task completes."""
        self.current_concurrent -= 1
    
    def is_overloaded(self, queue_depth: int) -> bool:
        """Check if the system is under backpressure."""
        return (queue_depth > self.max_queue_depth or 
                self.current_concurrent >= self.max_concurrent)

class RateLimiter:
    """Token-bucket rate limiter for agent invocations."""
    
    def __init__(self, rate: float, burst: int):
        self.rate = rate  # tokens per second
        self.burst = burst
        self.tokens = burst
        self.last_refill = time.time()
    
    async def wait_if_needed(self):
        """Block until a token is available."""
        while True:
            self._refill()
            if self.tokens >= 1:
                self.tokens -= 1
                return
            await asyncio.sleep(0.05)
    
    def _refill(self):
        now = time.time()
        elapsed = now - self.last_refill
        self.tokens = min(self.burst, self.tokens + elapsed * self.rate)
        self.last_refill = now
```

### Step 4: Implement the Supervisor Pattern

```python
class SupervisorAgent:
    """Orchestrator that decomposes tasks and delegates to specialists."""

    def __init__(self, delegator: AgentDelegator, llm):
        self.delegator = delegator
        self.llm = llm
        self.planner = TaskPlanner()

    async def process(self, user_task: str) -> str:
        """Break down task, delegate subtasks, synthesize results."""
        
        # Step 1: Plan — decompose the task
        plan = await self.planner.create_plan(user_task)
        
        # Step 2: Delegate — dispatch subtasks in dependency order
        results = {}
        for step in plan.sorted_steps():
            task = Task(
                id=step.id,
                agent_type=step.agent_type,
                payload={"instruction": step.instruction, "context": results},
                priority=step.priority,
                timeout=step.timeout
            )
            result = await self.delegator.delegate(task)
            results[step.id] = result
        
        # Step 3: Synthesize — combine results into final response
        return await self._synthesize(plan, results)

    async def _synthesize(self, plan, results: dict) -> str:
        """Combine agent outputs into a cohesive response."""
        context = "\n\n".join([
            f"### {step.description}\n{results[step.id]}"
            for step in plan.steps
        ])
        
        return await self.llm.generate(
            f"Synthesize these results into a final response:\n\n{context}"
        )
```

### Step 5: Dynamic Agent Scaling

```python
class AutoScaler:
    """Scale agent pools up and down based on demand."""
    
    def __init__(self, delegator: AgentDelegator, min_agents: int = 2,
                 max_agents: int = 20, scale_up_threshold: float = 0.8,
                 scale_down_threshold: float = 0.2):
        self.delegator = delegator
        self.min_agents = min_agents
        self.max_agents = max_agents
        self.scale_up_threshold = scale_up_threshold
        self.scale_down_threshold = scale_down_threshold
    
    async def evaluate(self, agent_type: str):
        """Check metrics and scale if needed."""
        agents = self.delegator.agents.get(agent_type, [])
        current_count = len(agents)
        
        # Calculate utilization
        active = sum(
            self.delegator.active_tasks[a.agent_id] 
            for a in agents
        )
        capacity = sum(
            self.delegator.capacity[a.agent_id] 
            for a in agents
        )
        utilization = active / capacity if capacity > 0 else 0
        
        # Scale up
        if utilization > self.scale_up_threshold and current_count < self.max_agents:
            await self._add_agent(agent_type)
        
        # Scale down
        elif utilization < self.scale_down_threshold and current_count > self.min_agents:
            await self._remove_agent(agent_type)
    
    async def _add_agent(self, agent_type: str):
        """Spin up a new agent instance."""
        new_agent = await AgentFactory.create(agent_type)
        self.delegator.register_agent(agent_type, new_agent)
        logger.info(f"Scaled up {agent_type}: {len(self.delegator.agents[agent_type])} agents")
    
    async def _remove_agent(self, agent_type: str):
        """Gracefully remove an idle agent."""
        agents = self.delegator.agents[agent_type]
        # Find the least busy agent
        idle_agents = [
            a for a in agents 
            if self.delegator.active_tasks[a.agent_id] == 0
        ]
        if idle_agents:
            agent = idle_agents[0]
            agents.remove(agent)
            logger.info(f"Scaled down {agent_type}: {len(agents)} agents")
```

---

## Queue Architecture

```
                    ┌─────────────────┐
                    │   Task Ingress   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Rate Limiter   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Task Queue     │
                    │  (Prioritized)   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Agent Delegator │
                    └──┬────┬────┬────┘
                       │    │    │
              ┌────────▼┐ ┌─▼──┐ ┌▼────────┐
              │ Agent A │ │ B  │ │ Agent C │
              └─────────┘ └────┘ └─────────┘
                       │    │    │
                    ┌──▼────▼────▼──┐
                    │   Result Bus   │
                    └────────────────┘
```

---

## Trigger Phrases

| Phrase | Action |
|--------|--------|
| "Delegate this task" | Route task to appropriate agent |
| "Show queue depth" | Report current queue size and priority breakdown |
| "Scale up agents" | Increase agent pool for a type |
| "Which agent is overloaded?" | Show utilization per agent |
| "Set priority for this task" | Re-queue with different priority level |
| "Check load distribution" | Show how tasks are balanced across agents |
| "Pause agent type X" | Stop routing new tasks to a specific type |
| "Drain agent X gracefully" | Let current tasks finish, don't assign new ones |

---

## Anti-Patterns

| Anti-Pattern | Why It Fails | Fix |
|-------------|-------------|-----|
| No backpressure | System collapses under load | Implement queue depth limits |
| Synchronous delegation | One slow agent blocks all tasks | Async dispatch with timeouts |
| Ignoring task affinity | Agents lose cache benefits | Consistent hashing for session stickiness |
| Infinite queue growth | Memory exhaustion, stale tasks | TTL on queued tasks, dead-letter queues |
| Over-provisioning agents | Wasted resources, unnecessary cost | Auto-scale based on real-time utilization |
| No dead-letter handling | Failed tasks disappear silently | Log failures, alert on patterns |

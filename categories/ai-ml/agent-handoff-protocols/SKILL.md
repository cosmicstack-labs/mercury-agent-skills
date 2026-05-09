---
name: agent-handoff-protocols
description: 'Design and implement agent-to-agent handoff protocols for multi-agent systems. Covers context passing, escalation patterns, handshake mechanisms, conversation continuity, and routing between specialized agents in production workflows.'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: ai-ml
  tags:
    - agent-handoff
    - escalation
    - context-passing
    - multi-agent
    - conversation-routing
    - agent-communication
---

# Agent-to-Agent Handoff Protocols

## Overview

In a multi-agent system, agents need to hand off tasks — and context — to each other seamlessly. A broken handoff means lost context, frustrated users, and failed workflows. This skill covers structured protocols for passing control between agents, handling escalations, and maintaining continuity across agent boundaries.

---

## Core Concepts

### When Handoffs Happen

| Scenario | From | To | Why |
|----------|------|----|-----|
| **Escalation** | Tier-1 agent | Tier-2 specialist | Task exceeds capability |
| **Specialization** | Router agent | Domain expert | Task matches expertise |
| **Supervision** | Sub-agent | Supervisor | Needs approval or guidance |
| **Recovery** | Failed agent | Fallback agent | Primary agent broken |
| **Load shedding** | Overloaded agent | Idle agent | Balance workload |

### Handoff Types

| Type | Description | Latency | Risk |
|------|-------------|---------|------|
| **Warm Handoff** | Full context + current state passed explicitly | Medium | Low — all state transferred |
| **Cold Handoff** | Only task description passed, receiving agent starts fresh | Low | High — context loss |
| **Supervised Handoff** | Supervisor mediates, validates, then transfers | High | Very Low — human/LLM checks |
| **Broadcast Handoff** | All agents notified, first capable claims | Medium | Medium — race conditions |
| **Delegation Handoff** | Sender waits for result | High | Low — synchronous, traceable |

---

## Step-by-Step Implementation

### Step 1: Define the Handoff Contract

```python
from dataclasses import dataclass, field
from typing import Any, Optional
from enum import Enum
import json
import time

class HandoffReason(Enum):
    ESCALATION = "escalation"
    SPECIALIZATION = "specialization"
    RECOVERY = "recovery"
    LOAD_SHEDDING = "load_shedding"
    SUPERVISION = "supervision"

@dataclass
class HandoffContext:
    """Complete context transferred between agents."""
    
    # Identity
    source_agent: str
    target_agent: str
    handoff_id: str
    
    # The task
    task_id: str
    original_task: str
    current_state: str  # What has been done so far
    
    # Conversation history (condensed)
    conversation_summary: str
    key_facts: list[str] = field(default_factory=list)
    decisions_made: list[str] = field(default_factory=list)
    
    # State
    collected_data: dict[str, Any] = field(default_factory=dict)
    confidence: float = 1.0  # How confident source was in resolution
    reason: HandoffReason = HandoffReason.SPECIALIZATION
    
    # Metadata
    created_at: float = None
    expires_at: Optional[float] = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = time.time()
    
    def serialize(self) -> str:
        """Serialize to JSON for transport."""
        return json.dumps({
            "source_agent": self.source_agent,
            "target_agent": self.target_agent,
            "handoff_id": self.handoff_id,
            "task_id": self.task_id,
            "original_task": self.original_task,
            "current_state": self.current_state,
            "conversation_summary": self.conversation_summary,
            "key_facts": self.key_facts,
            "decisions_made": self.decisions_made,
            "collected_data": self.collected_data,
            "confidence": self.confidence,
            "reason": self.reason.value,
            "created_at": self.created_at,
        })
    
    @classmethod
    def deserialize(cls, data: str) -> "HandoffContext":
        """Deserialize from JSON."""
        obj = json.loads(data)
        obj["reason"] = HandoffReason(obj["reason"])
        return cls(**obj)
```

### Step 2: Implement the Handoff Protocol

```python
class HandoffProtocol:
    """Standard handoff protocol between agents."""
    
    def __init__(self, registry):
        self.registry = registry  # Agent registry
        self.active_handoffs: dict[str, HandoffContext] = {}
    
    async def initiate_handoff(self, context: HandoffContext) -> str:
        """Begin a handoff to another agent."""
        
        # 1. Validate target agent exists
        target = self.registry.get_agent(context.target_agent)
        if not target:
            raise ValueError(f"Unknown target agent: {context.target_agent}")
        
        # 2. Check target is ready
        if not await target.is_ready():
            # Fallback: try next available or escalate
            return await self._handle_unavailable_target(context)
        
        # 3. Store handoff context
        self.active_handoffs[context.handoff_id] = context
        
        # 4. Prepare receiving agent
        await target.prepare_for_handoff(context)
        
        # 5. Execute handoff
        result = await target.receive_handoff(context)
        
        # 6. Cleanup
        self.active_handoffs.pop(context.handoff_id, None)
        
        return result
    
    async def _handle_unavailable_target(self, context: HandoffContext) -> str:
        """Handle case where target agent is unavailable."""
        # Try finding an alternative
        alternatives = self.registry.find_alternatives(
            context.target_agent
        )
        
        if alternatives:
            context.target_agent = alternatives[0]
            return await self.initiate_handoff(context)
        
        # No alternatives — emergency escalation
        return await self._emergency_escalation(context)
    
    async def acknowledge_handoff(self, handoff_id: str, 
                                  accepted: bool, message: str = ""):
        """Target agent acknowledges (accepts or rejects) a handoff."""
        context = self.active_handoffs.get(handoff_id)
        if not context:
            raise ValueError(f"Unknown handoff: {handoff_id}")
        
        if accepted:
            context.source_agent = context.target_agent  # Transfer identity
            return {"status": "accepted", "context": context}
        else:
            # Handoff rejected — source must retry or escalate
            return {"status": "rejected", "reason": message}
```

### Step 3: Agent Handoff Receiver

```python
class HandoffReceiver:
    """Mixin for agents that can receive handoffs."""
    
    def __init__(self):
        self.handoff_buffer: dict[str, HandoffContext] = {}
        self.current_handoff: Optional[HandoffContext] = None
    
    async def prepare_for_handoff(self, context: HandoffContext):
        """Prepare to receive a handoff (pre-load context)."""
        self.handoff_buffer[context.handoff_id] = context
    
    async def receive_handoff(self, context: HandoffContext) -> str:
        """Accept and process an incoming handoff."""
        self.current_handoff = context
        
        # Build system prompt with transferred context
        handoff_prompt = self._build_handoff_prompt(context)
        
        # Run the agent with the prepared context
        result = await self.run(
            context.original_task,
            system_override=handoff_prompt
        )
        
        self.current_handoff = None
        return result
    
    def _build_handoff_prompt(self, context: HandoffContext) -> str:
        """Build system prompt with full handoff context."""
        facts = "\n".join(f"- {f}" for f in context.key_facts)
        decisions = "\n".join(f"- {d}" for d in context.decisions_made)
        
        return f"""You are taking over from {context.source_agent}.

## Current Task
{context.original_task}

## What Has Been Done
{context.current_state}

## Key Facts Discovered
{facts}

## Decisions Made So Far
{decisions}

## Collected Data
{json.dumps(context.collected_data, indent=2)}

## Reason for Handoff
{context.reason.value}

Your job is to continue from where {context.source_agent} left off. 
Do not redo work that has already been completed."""
```

### Step 4: Escalation Chain

```python
class EscalationChain:
    """Define and execute escalation paths for handoffs."""
    
    def __init__(self, protocol: HandoffProtocol):
        self.protocol = protocol
        self.chains = {}  # agent_type -> escalation path
    
    def define_chain(self, agent_type: str, chain: list[str]):
        """Define escalation chain (e.g., support -> billing -> manager)."""
        self.chains[agent_type] = chain
    
    async def escalate(self, context: HandoffContext, 
                       reason: str) -> str:
        """Escalate along the defined chain."""
        chain = self.chains.get(context.source_agent, [])
        
        if not chain:
            # End of chain — human escalation
            return await self._escalate_to_human(context, reason)
        
        next_agent = chain[0]
        context.reason = HandoffReason.ESCALATION
        context.target_agent = next_agent
        context.current_state += f"\n[Escalated: {reason}]"
        
        # Update chain (remove current level)
        self.chains[context.source_agent] = chain[1:]
        
        return await self.protocol.initiate_handoff(context)
    
    async def _escalate_to_human(self, context: HandoffContext, 
                                  reason: str) -> str:
        """When all agents exhausted, escalate to human."""
        ticket = {
            "handoff_id": context.handoff_id,
            "task": context.original_task,
            "context": context.serialize(),
            "reason": reason,
            "timestamp": time.time()
        }
        # Send to human operator queue
        await human_operator_queue.send(ticket)
        return f"Escalated to human operator. Ticket: {ticket['handoff_id']}"
```

### Step 5: Conversation Continuity Across Handoffs

```python
class ConversationContinuity:
    """Maintain conversation thread across multiple agent handoffs."""
    
    def __init__(self, storage):
        self.storage = storage
    
    async def log_turn(self, conversation_id: str, agent: str, 
                        message: str, role: str):
        """Log a single turn in a conversation thread."""
        entry = {
            "conversation_id": conversation_id,
            "agent": agent,
            "role": role,
            "message": message,
            "timestamp": time.time()
        }
        await self.storage.append(
            f"conversations:{conversation_id}",
            entry
        )
    
    async def get_history(self, conversation_id: str, 
                          limit: int = 50) -> list[dict]:
        """Get conversation history across agent handoffs."""
        return await self.storage.query(
            f"conversations:{conversation_id}",
            limit=limit
        )
    
    def build_continuity_prompt(self, history: list[dict], 
                                 current_agent: str) -> str:
        """Build a continuity prompt for the receiving agent."""
        previous_agents = set(
            entry["agent"] for entry in history 
            if entry["agent"] != current_agent
        )
        
        return f"""This conversation has involved: {', '.join(previous_agents)}.

## Previous Exchanges
{self._format_history(history)}

Continue naturally. If asked about something handled by a previous agent, 
reference that conversation."""
    
    def _format_history(self, history: list[dict]) -> str:
        formatted = []
        for entry in history[-10:]:  # Last 10 exchanges
            tag = f"[{entry['agent']}]" if entry['role'] == 'assistant' else "[User]"
            formatted.append(f"{tag}: {entry['message'][:200]}")
        return "\n".join(formatted)
```

### Step 6: Handoff Decision Engine

```python
class HandoffDecider:
    """Decide whether and where to hand off based on current state."""
    
    def __init__(self, llm, rules: list[dict]):
        self.llm = llm
        self.rules = rules  # Handoff trigger rules
    
    async def should_handoff(self, agent, task: str, 
                              current_state: dict) -> tuple[bool, str, str]:
        """Determine if handoff is needed and where to send."""
        
        # Check explicit rules first
        for rule in self.rules:
            if self._matches_rule(rule, agent, task, current_state):
                return True, rule["target"], rule["reason"]
        
        # If no rules match, ask LLM
        decision = await self.llm.generate(
            f"""Current agent: {agent.name}
Current task: {task}
Current state: {json.dumps(current_state, indent=2)}

Available agents: {', '.join(self._list_available_agents())}

Should this be handed off to another agent? If so, which one and why?
Respond in JSON: {{"handoff": true/false, "target": "agent_name", "reason": "why"}}""",
            temperature=0
        )
        
        try:
            result = json.loads(decision)
            return result["handoff"], result.get("target"), result.get("reason")
        except (json.JSONDecodeError, KeyError):
            return False, None, None
    
    def _matches_rule(self, rule: dict, agent, task: str, 
                      state: dict) -> bool:
        """Check if a handoff rule matches current conditions."""
        if "keywords" in rule:
            if any(kw in task.lower() for kw in rule["keywords"]):
                return True
        if "confidence_threshold" in rule:
            if state.get("confidence", 1.0) < rule["confidence_threshold"]:
                return True
        if "max_steps" in rule:
            if state.get("steps", 0) > rule["max_steps"]:
                return True
        return False
```

---

## Handoff Flow Diagram

```
                    ┌───────────────────┐
                    │  User/System Task  │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Router Agent     │
                    │  (Intent Classify) │
                    └──┬────┬────┬──────┘
                       │    │    │
              ┌────────▼┐ ┌─▼──┐ ┌▼────────┐
              │ Support  │ │Billing│Research │
              │ Agent    │ │Agent │ Agent   │
              └──┬───────┘ └─────┘ └─────────┘
                 │
          Handoff Decision?
                 │
           ┌─────┴─────┐
           │           │
      Continue    Escalate
           │           │
           │     ┌─────▼──────┐
           │     │ Specialist  │
           │     │ Agent       │
           │     └─────┬──────┘
           │           │
           │     Still Stuck?
           │           │
           │     ┌─────▼──────┐
           │     │   Human     │
           └─────┘   Operator  │
                 └────────────┘
```

---

## Trigger Phrases

| Phrase | Action |
|--------|--------|
| "Hand off to [agent]" | Initiate warm handoff to specified agent |
| "Escalate this" | Push up the escalation chain |
| "Take over from [agent]" | Receive a handoff with full context |
| "What's the handoff history?" | Show all handoffs for this conversation |
| "Transfer context to [agent]" | Send full context to another agent |
| "This needs a specialist" | Trigger routing to domain expert |
| "Agent [x] is stuck" | Initiate recovery handoff to fallback |
| "Show active handoffs" | List all in-progress handoffs |

---

## Anti-Patterns

| Anti-Pattern | Why It Fails | Fix |
|-------------|-------------|-----|
| Cold handoffs with no context | Receiving agent starts blind | Always pass HandoffContext |
| Handoff loops | Agents keep passing back and forth | Set max handoff count per task |
| Synchronous blocking | Calling agent waits forever | Timeout + fallback path |
| No handoff validation | Target agent can't handle the task | Verify capability before transfer |
| Ignoring handoff failures | Lost tasks with no trace | Dead-letter queue for failed handoffs |
| Unlimited escalation chain | Task bounces forever | Max escalation depth (3-5 levels) |

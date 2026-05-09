---
name: ai-agent-design
description: Comprehensive guide to designing, building, and operating AI agents. Covers agent architecture, tool use patterns, memory systems, orchestration strategies, planning approaches, error recovery, and safety guardrails for production-grade agent systems.
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: ai-ml
  tags:
    - ai-agents
    - agent-architecture
    - tool-use
    - memory-systems
    - orchestration
    - planning
    - llm
---

# AI Agent Design

## Core Principles

### 1. Agents Are Tools, Not Teammates
An AI agent is a system that uses an LLM to reason and take actions. It is not a person — it has no goals, desires, or understanding. Design agents as tools with clear boundaries, not as autonomous collaborators.

### 2. Autonomy is a Spectrum
Full autonomy is rarely the goal. The best agents operate on a spectrum: more human oversight for critical actions, more autonomy for routine tasks. Design for the level of autonomy that matches the risk.

### 3. Cache Everything, Guess Nothing
Agents have no memory between calls unless you design it. Every interaction, tool result, and decision must be explicitly stored and retrieved. Assume the agent remembers nothing unless you program it to.

### 4. Fail Predictably
Every agent will fail. The question is how it fails. Design for graceful degradation: when uncertain, ask for help. When stuck, escalate. When broken, stop safely.

### 5. Safety First, Speed Second
A fast agent that takes unauthorized actions is worse than a slow agent that double-checks. Build guardrails before building features.

---

## Agent Maturity Model

| Level | Name | Characteristics | Tool Use | Memory | Autonomy |
|-------|------|----------------|----------|--------|----------|
| **L1** | Reactive | Single-turn, no context retention, deterministic responses | None or hardcoded | None | None |
| **L2** | Scripted | Pre-defined workflows, conditional branching, template-based | Basic function calls with fixed signatures | Session-only (ephemeral) | Low — requires human confirmation |
| **L3** | Tool-Using | Dynamic tool selection, structured function calling, error handling | Multiple tools, runtime discovery | Short-term (conversation history) | Medium — executes routine tasks autonomously |
| **L4** | Memory-Augmented | Long-term memory, learns from past interactions, personalization | Complex tools with parameter binding | Long-term + episodic (vector stores, databases) | High — manages complex workflows |
| **L5** | Autonomous Orchestrator | Multi-agent coordination, dynamic planning, self-correction, meta-cognition | Tool composition, tool creation, delegation | Semantic + episodic (knowledge graphs, RAG) | Full — handles novel situations independently |

### Progression Path
- **L1 → L2**: Add conditional logic and basic state tracking
- **L2 → L3**: Implement tool schemas and function calling
- **L3 → L4**: Integrate persistent storage and retrieval mechanisms
- **L4 → L5**: Add planning, sub-agent delegation, and self-evaluation

---

## Tool Definition Patterns

### Function Calling / Tool Use
Modern LLMs support "function calling" — the model outputs a structured request to invoke a tool, and the runtime executes it and returns the result.

### Tool Schema Pattern (OpenAI-style)
```json
{
  "type": "function",
  "function": {
    "name": "search_knowledge_base",
    "description": "Search the internal knowledge base for relevant documents",
    "parameters": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "The search query string"
        },
        "max_results": {
          "type": "integer",
          "description": "Maximum number of results to return (1-20)",
          "minimum": 1,
          "maximum": 20
        },
        "filter_by_date": {
          "type": "string",
          "description": "Optional date filter in ISO 8601 format"
        }
      },
      "required": ["query"]
    }
  }
}
```

### Tool Definition Best Practices
1. **Descriptions are critical**: The model reads tool descriptions to decide what to call. Be explicit about when to use each tool.
2. **Validate parameters**: Use JSON Schema constraints (minimum, maximum, enum, pattern) to prevent invalid calls.
3. **Return structured data**: Tool results should return structured data (JSON) so the model can reason about them.
4. **Include error information**: If a tool fails, return a clear error message the model can act on.

### Tool Implementation Pattern (Python)
```python
from typing import Any
import json

class AgentTool:
    """Base class for agent tools."""
    
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
    
    def get_schema(self) -> dict:
        """Return the function calling schema for this tool."""
        raise NotImplementedError
    
    async def execute(self, **kwargs) -> Any:
        """Execute the tool with validated parameters."""
        raise NotImplementedError

class SearchTool(AgentTool):
    def __init__(self):
        super().__init__(
            name="search",
            description="Search documents by query string"
        )
    
    def get_schema(self):
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string"},
                        "limit": {"type": "integer", "default": 5}
                    },
                    "required": ["query"]
                }
            }
        }
    
    async def execute(self, query: str, limit: int = 5):
        # Implementation
        results = await database.search(query, limit=limit)
        return json.dumps({"results": results, "count": len(results)})
```

### Tool Categories

| Category | Examples | When to Use |
|----------|----------|-------------|
| **Retrieval** | Search, SQL query, vector search | Agent needs external information |
| **Computation** | Calculator, code interpreter, stats | Agent needs to compute or analyze |
| **Action** | Email send, API call, file write | Agent needs to affect the world |
| **Communication** | Slack message, notification | Agent needs to inform humans |
| **Validation** | Spell check, safety check, lint | Agent needs to verify its work |

---

## Memory Systems

### Why Memory Matters
Without memory, every agent interaction is a fresh start. Memory enables personalization, continuity, and learning.

### Memory Types

#### Short-Term Memory (STM)
- **What**: The current conversation or session context
- **Storage**: In-context (within the LLM's context window)
- **Duration**: Single session
- **Capacity**: Limited by context window (8K-200K tokens)
- **Implementation**: Conversation history as a list of messages

```python
class ShortTermMemory:
    """In-memory conversation buffer."""
    
    def __init__(self, max_tokens: int = 8000):
        self.messages = []
        self.max_tokens = max_tokens
    
    def add(self, role: str, content: str):
        self.messages.append({"role": role, "content": content})
        self._trim()
    
    def _trim(self):
        """Remove oldest messages when over capacity."""
        total = sum(len(m["content"]) for m in self.messages)
        while total > self.max_tokens and len(self.messages) > 1:
            removed = self.messages.pop(0)
            total -= len(removed["content"])
    
    def get_context(self) -> list:
        return self.messages
```

#### Long-Term Memory (LTM)
- **What**: Facts, preferences, knowledge from past sessions
- **Storage**: Vector databases, relational databases, key-value stores
- **Duration**: Permanent (until deleted)
- **Capacity**: Virtually unlimited
- **Implementation**: Embedding + retrieval

```python
import chromadb

class LongTermMemory:
    """Persistent memory using vector storage."""
    
    def __init__(self, collection_name: str = "agent_memory"):
        self.client = chromadb.Client()
        self.collection = self.client.get_or_create_collection(collection_name)
    
    def store(self, content: str, metadata: dict = None):
        """Store a memory with embedding."""
        self.collection.add(
            documents=[content],
            metadatas=[metadata or {}],
            ids=[f"mem_{hash(content)}"]
        )
    
    def recall(self, query: str, n: int = 5) -> list:
        """Retrieve relevant memories."""
        results = self.collection.query(
            query_texts=[query],
            n_results=n
        )
        return [
            {"content": doc, "metadata": meta}
            for doc, meta in zip(results["documents"][0], results["metadatas"][0])
        ]
```

#### Episodic Memory
- **What**: Record of past events, actions, and outcomes
- **Storage**: Time-series database or event log
- **Duration**: Configurable retention
- **Use case**: Learning from past mistakes, context for decision-making

```python
class EpisodicMemory:
    """Records agent actions and outcomes for learning."""
    
    def __init__(self):
        self.episodes = []
    
    def record(self, action: str, context: dict, outcome: str, success: bool):
        self.episodes.append({
            "timestamp": datetime.now().isoformat(),
            "action": action,
            "context": context,
            "outcome": outcome,
            "success": success
        })
    
    def get_similar_episodes(self, action: str, n: int = 3) -> list:
        """Find similar past episodes to inform decisions."""
        relevant = [e for e in self.episodes if e["action"] == action]
        return sorted(relevant, key=lambda x: x["timestamp"], reverse=True)[:n]
```

#### Semantic Memory
- **What**: General knowledge, concepts, relationships
- **Storage**: Knowledge graphs, structured databases
- **Duration**: Persistent, updated over time
- **Use case**: Understanding domain concepts, entity relationships

### Memory Retrieval Strategies

| Strategy | Description | Best For |
|----------|-------------|----------|
| **Last-N** | Keep the last N turns of conversation | Simple chatbots |
| **Sliding Window** | Keep most recent tokens up to a limit | General purpose |
| **Summarization** | Summarize older context to save tokens | Long conversations |
| **RAG** | Retrieve relevant context from vector store | Knowledge-heavy tasks |
| **Hybrid** | Combine multiple strategies | Production systems |

---

## Agent Orchestration

### Single-Agent Architecture
One agent handles everything: reasoning, tool selection, execution, and response.

```
[User] → [LLM + Tools + Memory] → [Response]
```

**Pros**: Simple, easy to debug, low latency
**Cons**: Single point of failure, limited specialization, context window pressure

### Multi-Agent Architecture
Multiple specialized agents collaborate on a task.

```
                    [Supervisor Agent]
                    /        |        \
            [Research]  [Analysis]  [Writing]
            Agent        Agent        Agent
```

**Pros**: Specialization, parallel execution, modular design
**Cons**: Coordination overhead, increased latency, harder to debug

### Supervisor Pattern
One agent (supervisor) delegates tasks to worker agents and synthesizes results.

```python
class SupervisorAgent:
    """Coordinates specialized worker agents."""
    
    def __init__(self):
        self.workers = {
            "researcher": ResearchAgent(),
            "analyst": AnalysisAgent(),
            "writer": WritingAgent()
        }
    
    async def process(self, task: str) -> str:
        # Step 1: Analyze the task
        plan = await self._create_plan(task)
        
        # Step 2: Delegate to workers
        results = {}
        for step in plan["steps"]:
            worker = self.workers[step["agent"]]
            results[step["id"]] = await worker.execute(step["instruction"])
        
        # Step 3: Synthesize
        return await self._synthesize(plan, results)
```

### Routing Pattern
A router agent classifies the input and sends it to the appropriate handler.

```python
class Router:
    """Routes requests to the appropriate agent based on intent."""
    
    def __init__(self):
        self.routes = {
            "technical_support": TechnicalSupportAgent(),
            "billing": BillingAgent(),
            "general": GeneralAgent()
        }
    
    async def route(self, user_input: str):
        # Use LLM to classify intent
        intent = await self._classify_intent(user_input)
        
        # Route to the appropriate handler
        agent = self.routes.get(intent, self.routes["general"])
        return await agent.handle(user_input)
```

### Orchestration Decision Matrix

| Factor | Single-Agent | Multi-Agent | Supervisor | Routing |
|--------|-------------|-------------|------------|---------|
| Complexity | Low | High | Medium | Medium |
| Latency | Low | High | Medium | Low |
| Modularity | Low | High | High | Medium |
| Debugging | Easy | Hard | Medium | Easy |
| Context Usage | Efficient | Expensive | Moderate | Efficient |

---

## Planning Strategies

### ReAct (Reasoning + Acting)
The agent alternates between reasoning (thinking about what to do) and acting (calling tools), interleaving thought, action, and observation.

```
Thought: I need to find the latest sales data. Let me check the database.
Action: query_database({"query": "SELECT * FROM sales ORDER BY date DESC LIMIT 10"})
Observation: [{"date": "2024-01-15", "revenue": 45000}, ...]
Thought: I have the data. Now I need to identify trends.
Action: analyze_data({"data": [...], "analysis_type": "trend"})
Observation: Revenue has increased 12% month-over-month.
Thought: I can now answer the user's question about sales performance.
Answer: Sales revenue has grown 12% month-over-month, reaching $45,000 in January.
```

**Implementation pattern**:
```python
class ReActAgent:
    def __init__(self, llm, tools):
        self.llm = llm
        self.tools = {t.name: t for t in tools}
    
    async def run(self, task: str, max_steps: int = 10):
        messages = [{"role": "user", "content": task}]
        
        for step in range(max_steps):
            response = await self.llm.generate(messages)
            action = self._parse_action(response)
            
            if not action:
                return response  # Final answer
            
            tool = self.tools.get(action["name"])
            if not tool:
                return f"Error: Unknown tool {action['name']}"
            
            result = await tool.execute(**action["parameters"])
            messages.append({"role": "assistant", "content": response})
            messages.append({"role": "tool", "content": result})
        
        return "Reached maximum steps without resolution."
```

### Plan-and-Execute
The agent creates a complete plan first, then executes each step.

```
Plan:
1. Query database for Q4 sales data
2. Calculate year-over-year growth
3. Identify top-performing regions
4. Generate summary report
5. Schedule email to stakeholders

Executing step 1...
Executing step 2...
...
```

**When to use Plan-and-Execute**:
- Tasks with clear sequential dependencies
- Long-running workflows where intermediate results matter
- When you need to verify the plan before executing

### Decision: ReAct vs Plan-and-Execute

| Aspect | ReAct | Plan-and-Execute |
|--------|-------|-----------------|
| Flexibility | High (adapts mid-task) | Low (follows plan) |
| Reliability | Lower (can go off-track) | Higher (structured) |
| Speed | Faster for simple tasks | Faster for complex tasks |
| Observability | Step-by-step visible | Full plan visible upfront |
| Best for | Exploratory, dynamic tasks | Well-understood, stable tasks |

---

## Error Recovery

### Common Failure Modes

| Failure | Symptom | Recovery Strategy |
|---------|---------|-------------------|
| Tool call failure | Invalid parameters, timeout | Retry with validated params, fallback tool |
| Hallucination | Plausible but incorrect info | Cross-reference, ask for citations |
| Loop | Repeated same action | Max step limit, novelty detection |
| Context overflow | Lost early information | Summarization, sliding window |
| Wrong tool choice | Inappropriate action | Confirmation step for critical tools |

### Recovery Implementation

```python
class ErrorRecovery:
    """Handles agent errors with graceful recovery strategies."""
    
    MAX_RETRIES = 3
    
    async def execute_with_recovery(self, tool, params):
        for attempt in range(self.MAX_RETRIES):
            try:
                return await tool.execute(**params)
            except ValidationError as e:
                # Parameter issue — fix and retry
                params = self._fix_params(e, params)
                continue
            except TimeoutError:
                # Transient failure — wait and retry
                await asyncio.sleep(2 ** attempt)  # Exponential backoff
                continue
            except PermissionError:
                # Can't recover — escalate
                return {"error": "permission_denied", "action": "escalate"}
        
        return {"error": "max_retries_exceeded", "action": "ask_human"}
```

### Human-in-the-Loop Escalation

```python
class EscalationHandler:
    """Escalates to humans when the agent can't proceed."""
    
    async def should_escalate(self, error: dict, confidence: float) -> bool:
        """Determine if we need human intervention."""
        return (
            error.get("action") == "escalate" or
            confidence < 0.3 or
            error.get("type") in ["security_violation", "permission_denied"]
        )
    
    async def escalate(self, context: dict, error: dict):
        """Send to human operator with full context."""
        ticket = {
            "agent_id": context["agent_id"],
            "task": context["task"],
            "error": error,
            "conversation_history": context["history"][-10:],
            "timestamp": datetime.now().isoformat()
        }
        await notification_service.send_to_human(ticket)
        return "Escalated to human operator. They will review shortly."
```

---

## Safety Guardrails

### Critical Safety Patterns

#### 1. Input Validation
```python
class InputGuardrail:
    """Validates and sanitizes user input before it reaches the agent."""
    
    BLOCKED_PATTERNS = [
        r"ignore all previous instructions",
        r"you are now .*",
        r"system prompt",
        r"jailbreak",
    ]
    
    def check(self, user_input: str) -> tuple[bool, str]:
        """Returns (allowed, reason)."""
        for pattern in self.BLOCKED_PATTERNS:
            if re.search(pattern, user_input, re.IGNORECASE):
                return False, f"Input blocked: pattern '{pattern}' detected"
        return True, ""
```

#### 2. Output Validation
```python
class OutputGuardrail:
    """Validates agent output before sending to user."""
    
    def check(self, output: str) -> tuple[bool, str]:
        # Never output system prompts or internal instructions
        if "system:" in output.lower() and "instruction" in output.lower():
            return False, "Output contains internal instructions"
        
        # Never output harmful content
        if contains_harmful_content(output):
            return False, "Output flagged by safety classifier"
        
        return True, ""
```

#### 3. Action Authorization
```python
class ActionGuardrail:
    """Requires confirmation for high-risk actions."""
    
    HIGH_RISK_ACTIONS = {
        "send_email", "delete_record", "modify_permissions", 
        "transfer_funds", "execute_code"
    }
    
    async def authorize(self, action: str, params: dict) -> bool:
        if action in self.HIGH_RISK_ACTIONS:
            return await self._ask_human(f"Confirm {action} with params: {params}")
        return True  # Low-risk actions auto-approved
```

### Guardrail Architecture

```
[User Input] → [Input Guardrail] → [Agent] → [Output Guardrail] → [Action Guardrail] → [Execute]
                      |                  |            |                    |
                  Blocked/Pass       +Tool       Blocked/Pass       Confirm/Deny
                                   Results
```

### Safety Rules for Production

1. **Never execute code from user input** unless sandboxed
2. **Never expose internal prompts or tool schemas** to end users
3. **Rate limit all agent calls** to prevent abuse
4. **Log everything** — every input, output, tool call, and decision
5. **Have a kill switch** — an escalation path that bypasses the agent entirely

---

## Common Mistakes

### 1. Over-Autonomy
**The mistake**: Giving the agent too much freedom too quickly.

**Fix**: Start with human-in-the-loop for all actions. Gradually increase autonomy as reliability improves.

### 2. Ignoring Context Window Limits
**The mistake**: Letting conversation history grow unbounded.

**Fix**: Implement summarization or sliding windows. Monitor token usage per session.

### 3. Poor Tool Descriptions
**The mistake**: Vague tool descriptions that confuse the model.

**Fix**: 
```python
# Bad
"name": "search"

# Good  
"name": "search_knowledge_base",
"description": "Search internal documentation for product information. Use this when users ask about product features, specifications, or troubleshooting."
```

### 4. No Error Recovery
**The mistake**: Assuming tools always succeed.

**Fix**: Every tool call must have: retry logic, timeout, fallback behavior, and escalation path.

### 5. Flat Memory Design
**The mistake**: Using a single memory store for everything.

**Fix**: Separate short-term (conversation), long-term (facts), episodic (events), and semantic (knowledge) memory systems.

### 6. Ignoring Latency
**The mistake**: Chaining many LLM calls without considering user experience.

**Fix**: Use streaming, parallel execution where possible, and set timeouts on all operations.

### 7. No Observability
**The mistake**: Not logging agent decisions, tool calls, and reasoning.

**Fix**: Log every: user input, agent thought, tool call (with params), tool result, and final output.

### 8. Single Point of Failure
**The mistake**: One agent handles everything with no fallback.

**Fix**: Implement routing patterns. Have a fallback agent for when the primary fails. Use circuit breakers.

### 9. Prompt Injection in Tool Results
**The mistake**: Tool results containing instructions that override the agent's behavior.

**Fix**: Treat all tool results as data, not instructions. Never let external content override system prompts.

```python
# Dangerous — letting tool result influence behavior
system_prompt += f"\nHere's additional context: {tool_result}"

# Safe — tool result is data, not instructions
context = f"According to the database: {tool_result}"
```

### 10. Assuming Determinism
**The mistake**: Expecting the same output every time with the same input.

**Fix**: Set temperature to 0 for critical paths. Validate outputs. Have idempotent tool implementations.

---

## Quick Reference

| Component | Best Practice | Common Mistake |
|-----------|---------------|----------------|
| Tools | Detailed descriptions, validated parameters | Vague names, no error handling |
| Memory | Separate STM/LTM/episodic/semantic | One-size-fits-all storage |
| Orchestration | Start single-agent, evolve to multi-agent | Over-engineering from day one |
| Planning | ReAct for exploration, Plan-and-Execute for stability | No planning at all |
| Safety | Input + output + action guardrails | Safety as an afterthought |
| Error Recovery | Retry + fallback + escalate | Assume success |

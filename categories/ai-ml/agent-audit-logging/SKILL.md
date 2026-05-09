---
name: agent-audit-logging
description: 'Implement comprehensive audit logging and reporting for multi-agent systems. Covers event capture, structured logging, traceability, compliance reporting, forensic analysis, and real-time monitoring dashboards for agent actions and decisions.'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: ai-ml
  tags:
    - audit-logging
    - compliance
    - observability
    - forensics
    - agent-tracing
    - reporting
    - governance
---

# Agent Audit Log Reporting

## Overview

When agents make decisions, take actions, and spend money, every step must be traceable. Audit logs answer questions like: "What did the agent do?", "Why did it do that?", "Who asked for it?", and "Can we prove it followed the rules?" This skill covers event sourcing, structured logging, traceability chains, compliance reporting, and forensic analysis for production multi-agent systems.

---

## Core Concepts

### Why Audit Logging Matters

| Need | Without Audit | With Audit |
|------|--------------|------------|
| **Debugging** | "The agent did something wrong, but what?" | Full replay of decisions |
| **Compliance** | No evidence of rule following | Verifiable compliance trail |
| **Billing** | "Why did we spend $5K today?" | Per-task cost attribution |
| **Security** | Can't detect injection or abuse | Pattern detection on logs |
| **Improvement** | Guess what went wrong | Data-driven optimization |
| **Accountability** | "Was this the agent or the user?" | Clear provenance |

### What to Log

| Event | Details | Priority |
|-------|---------|----------|
| **Invocation** | Task received, agent, timestamp | Required |
| **Reasoning** | Agent's chain-of-thought | Required |
| **Tool Calls** | Tool name, params, result, latency | Required |
| **Decisions** | Branch taken, confidence, rationale | Required |
| **LLM Response** | Raw model output | High |
| **Errors** | Error type, stack trace, recovery action | Required |
| **Handoffs** | Source, target, context summary | Required |
| **Human Interventions** | Override, confirmation, escalation | Required |
| **Token Usage** | Prompt/completion counts | High |
| **User Feedback** | Rating, correction, follow-up | Medium |

---

## Step-by-Step Implementation

### Step 1: Define the Audit Event Schema

```python
from dataclasses import dataclass, field, asdict
from typing import Any, Optional
from enum import Enum
import json
import time
import uuid

class EventType(Enum):
    INVOCATION = "agent.invocation"
    REASONING = "agent.reasoning"
    TOOL_CALL = "agent.tool_call"
    TOOL_RESULT = "agent.tool_result"
    DECISION = "agent.decision"
    LLM_RESPONSE = "agent.llm_response"
    ERROR = "agent.error"
    HANDOFF = "agent.handoff"
    HUMAN_INTERVENTION = "agent.human_intervention"
    TOKEN_USAGE = "agent.token_usage"

@dataclass
class AuditEvent:
    """Structured audit event for any agent action."""
    
    # Identity
    event_id: str = None
    event_type: EventType = None
    agent_name: str = ""
    task_id: str = ""
    session_id: str = ""
    
    # What happened
    action: str = ""
    params: dict = field(default_factory=dict)
    result: Any = None
    
    # Context
    reasoning: str = ""
    confidence: float = 0.0
    source: str = ""  # User, system, or parent agent
    
    # Traceability
    parent_event_id: Optional[str] = None
    trace_id: str = ""
    
    # Metadata
    timestamp: float = None
    duration_ms: float = 0.0
    token_count: int = 0
    model: str = ""
    version: str = ""
    
    # Error
    error: Optional[str] = None
    error_type: Optional[str] = None
    
    def __post_init__(self):
        if self.event_id is None:
            self.event_id = str(uuid.uuid4())
        if self.timestamp is None:
            self.timestamp = time.time()
        if not self.trace_id:
            self.trace_id = self.event_id
    
    def serialize(self) -> dict:
        """Serialize to dictionary for storage."""
        data = asdict(self)
        data["event_type"] = self.event_type.value
        data["timestamp"] = self.timestamp
        return data
```

### Step 2: Build the Audit Logger

```python
class AuditLogger:
    """Structured audit logger with multiple backends."""
    
    def __init__(self, storage_backend, buffer_size: int = 100):
        self.storage = storage_backend
        self.buffer = []
        self.buffer_size = buffer_size
        self._lock = threading.Lock()
    
    def log(self, event: AuditEvent):
        """Log an audit event (buffered for performance)."""
        with self._lock:
            self.buffer.append(event)
            if len(self.buffer) >= self.buffer_size:
                self.flush()
    
    def flush(self):
        """Flush buffered events to storage."""
        with self._lock:
            if not self.buffer:
                return
            events = self.buffer.copy()
            self.buffer.clear()
        
        # Write batch
        asyncio.create_task(
            self.storage.batch_write([
                e.serialize() for e in events
            ])
        )
    
    async def log_invocation(self, agent_name: str, task: str, 
                              session_id: str, trace_id: str = None):
        """Log an agent invocation."""
        self.log(AuditEvent(
            event_type=EventType.INVOCATION,
            agent_name=agent_name,
            action="invocation",
            params={"task": task},
            session_id=session_id,
            trace_id=trace_id or str(uuid.uuid4()),
            source="user"
        ))
    
    async def log_tool_call(self, agent_name: str, tool_name: str,
                             params: dict, trace_id: str,
                             parent_id: str = None):
        """Log a tool call."""
        self.log(AuditEvent(
            event_type=EventType.TOOL_CALL,
            agent_name=agent_name,
            action=f"tool_call:{tool_name}",
            params=params,
            trace_id=trace_id,
            parent_event_id=parent_id
        ))
    
    async def log_decision(self, agent_name: str, decision: str,
                            reasoning: str, confidence: float,
                            trace_id: str):
        """Log an agent decision with reasoning."""
        self.log(AuditEvent(
            event_type=EventType.DECISION,
            agent_name=agent_name,
            action=f"decision:{decision}",
            reasoning=reasoning,
            confidence=confidence,
            trace_id=trace_id
        ))
    
    async def log_error(self, agent_name: str, error: Exception,
                         context: dict, trace_id: str):
        """Log an error event."""
        self.log(AuditEvent(
            event_type=EventType.ERROR,
            agent_name=agent_name,
            action="error",
            error=str(error),
            error_type=type(error).__name__,
            params=context,
            trace_id=trace_id
        ))
```

### Step 3: Traceability Chain

```python
class TraceabilityChain:
    """Build and query traceability chains across events."""
    
    def __init__(self, storage):
        self.storage = storage
    
    async def get_trace(self, trace_id: str) -> list[AuditEvent]:
        """Get all events in a trace, ordered by time."""
        events = await self.storage.query(
            f"trace:{trace_id}",
            sort_key="timestamp"
        )
        return [AuditEvent(**e) for e in events]
    
    async def get_timeline(self, trace_id: str) -> list[dict]:
        """Get a human-readable timeline of events."""
        events = await self.get_trace(trace_id)
        
        timeline = []
        for event in events:
            timeline.append({
                "time": datetime.fromtimestamp(
                    event.timestamp
                ).isoformat(),
                "agent": event.agent_name,
                "action": event.action,
                "details": self._summarize_event(event),
                "duration": f"{event.duration_ms:.0f}ms" if event.duration_ms else "",
                "status": "error" if event.error else "success"
            })
        
        return timeline
    
    def _summarize_event(self, event: AuditEvent) -> str:
        """Generate a human-readable summary of an event."""
        if event.event_type == EventType.INVOCATION:
            return f"Task received: {event.params.get('task', '')[:100]}"
        elif event.event_type == EventType.TOOL_CALL:
            return f"Called tool '{event.action.split(':')[1]}' with {len(event.params)} params"
        elif event.event_type == EventType.DECISION:
            return f"Decision: {event.action} (confidence: {event.confidence:.0%})"
        elif event.event_type == EventType.ERROR:
            return f"Error: {event.error}"
        elif event.event_type == EventType.HANDOFF:
            return f"Handoff to {event.params.get('target', 'unknown')}"
        return event.action
    
    async def trace_graph(self, trace_id: str) -> dict:
        """Build a parent-child graph for visualization."""
        events = await self.get_trace(trace_id)
        
        nodes = []
        edges = []
        
        for event in events:
            node_id = event.event_id
            nodes.append({
                "id": node_id,
                "label": self._summarize_event(event),
                "type": event.event_type.value,
                "agent": event.agent_name
            })
            
            if event.parent_event_id:
                edges.append({
                    "from": event.parent_event_id,
                    "to": node_id
                })
        
        return {"nodes": nodes, "edges": edges}
```

### Step 4: Compliance Reports

```python
class ComplianceReporter:
    """Generate compliance and governance reports from audit logs."""
    
    def __init__(self, storage):
        self.storage = storage
    
    async def generate_report(self, start_date: str, end_date: str,
                               report_type: str = "summary") -> dict:
        """Generate a compliance report for a date range."""
        
        events = await self.storage.query_range(
            f"events:{start_date}", f"events:{end_date}"
        )
        
        if report_type == "summary":
            return self._summary_report(events)
        elif report_type == "tool_usage":
            return self._tool_usage_report(events)
        elif report_type == "error_analysis":
            return self._error_analysis_report(events)
        elif report_type == "compliance_check":
            return self._compliance_check_report(events)
    
    def _summary_report(self, events: list[dict]) -> dict:
        """High-level summary of agent activity."""
        total_events = len(events)
        agent_counts = Counter(e["agent_name"] for e in events)
        error_count = sum(1 for e in events if e.get("error"))
        handoff_count = sum(
            1 for e in events 
            if e.get("event_type") == "agent.handoff"
        )
        
        return {
            "period": {
                "start": events[0]["timestamp"] if events else "",
                "end": events[-1]["timestamp"] if events else ""
            },
            "total_events": total_events,
            "total_errors": error_count,
            "error_rate": f"{error_count/total_events*100:.1f}%" if total_events else "0%",
            "total_handoffs": handoff_count,
            "agents_active": len(agent_counts),
            "top_agents": agent_counts.most_common(5)
        }
    
    def _tool_usage_report(self, events: list[dict]) -> dict:
        """Report on which tools were called and how often."""
        tool_calls = [
            e for e in events 
            if e.get("event_type") == "agent.tool_call"
        ]
        
        tool_counts = Counter()
        tool_errors = Counter()
        tool_latency = defaultdict(list)
        
        for call in tool_calls:
            tool_name = call["action"].split(":")[1]
            tool_counts[tool_name] += 1
            if call.get("error"):
                tool_errors[tool_name] += 1
            tool_latency[tool_name].append(call.get("duration_ms", 0))
        
        return {
            "total_tool_calls": len(tool_calls),
            "tool_breakdown": [
                {
                    "tool": tool,
                    "calls": count,
                    "errors": tool_errors[tool],
                    "error_rate": f"{tool_errors[tool]/count*100:.1f}%",
                    "avg_latency_ms": statistics.mean(tool_latency[tool]) if tool_latency[tool] else 0
                }
                for tool, count in tool_counts.most_common()
            ]
        }
    
    def _error_analysis_report(self, events: list[dict]) -> dict:
        """Analyze errors for patterns and root causes."""
        errors = [e for e in events if e.get("error")]
        
        error_types = Counter(e["error_type"] for e in errors if e.get("error_type"))
        error_messages = Counter(e["error"][:100] for e in errors if e.get("error"))
        errors_by_agent = Counter(e["agent_name"] for e in errors)
        
        return {
            "total_errors": len(errors),
            "error_types": dict(error_types.most_common()),
            "most_common_errors": dict(error_messages.most_common(10)),
            "errors_by_agent": dict(errors_by_agent.most_common()),
            "suggested_actions": self._suggest_actions(error_types)
        }
    
    def _suggest_actions(self, error_types: Counter) -> list[str]:
        """Suggest actions based on error patterns."""
        suggestions = []
        if error_types.get("TimeoutError", 0) > 10:
            suggestions.append("Increase timeouts or add async fallbacks")
        if error_types.get("RateLimitError", 0) > 5:
            suggestions.append("Implement more aggressive rate limiting or add buffer")
        if error_types.get("ValidationError", 0) > 3:
            suggestions.append("Review tool parameter validation")
        return suggestions
    
    def _compliance_check_report(self, events: list[dict]) -> dict:
        """Check compliance with governance rules."""
        checks = {
            "human_escalation_rate": self._check_escalation_rate(events),
            "tool_approval_rate": self._check_tool_approvals(events),
            "data_access_audit": self._check_data_access(events),
            "token_budget_compliance": self._check_budget_compliance(events),
        }
        
        return {
            "compliant": all(c["passed"] for c in checks.values()),
            "checks": checks,
            "recommendations": [
                check.get("recommendation", "")
                for check in checks.values()
                if not check["passed"]
            ]
        }
```

### Step 5: Real-Time Audit Dashboard

```python
class AuditDashboard:
    """Real-time monitoring dashboard for agent activity."""
    
    def __init__(self, logger: AuditLogger):
        self.logger = logger
    
    def recent_activity(self, minutes: int = 60) -> dict:
        """Get recent agent activity summary."""
        cutoff = time.time() - (minutes * 60)
        
        recent = [
            e for e in self.logger.buffer 
            if e.timestamp > cutoff
        ]
        
        return {
            "period_minutes": minutes,
            "total_events": len(recent),
            "events_per_second": len(recent) / (minutes * 60),
            "agents_active": len(set(e.agent_name for e in recent)),
            "errors_last_hour": sum(1 for e in recent if e.error),
            "recent_errors": [
                {
                    "time": datetime.fromtimestamp(e.timestamp).isoformat(),
                    "agent": e.agent_name,
                    "error": e.error
                }
                for e in recent[-10:]
                if e.error
            ]
        }
    
    def live_feed(self, limit: int = 20) -> list[dict]:
        """Get most recent events for live display."""
        recent = self.logger.buffer[-limit:]
        return [
            {
                "timestamp": datetime.fromtimestamp(e.timestamp).isoformat(),
                "agent": e.agent_name,
                "event": e.action,
                "type": e.event_type.value.split(".")[-1],
                "has_error": bool(e.error)
            }
            for e in reversed(recent)
        ]
```

### Step 6: Audit Log Storage & Retention

```python
class AuditStorage:
    """Storage backend for audit logs with retention policies."""
    
    def __init__(self, connection_string: str):
        self.conn = connection_string
        self.retention_days = {
            "debug": 7,       # Detailed logs — short retention
            "info": 30,       # Standard logs — monthly
            "compliance": 365,  # Compliance data — yearly
            "critical": 730,  # Security/legal — 2 years
        }
    
    async def store(self, event: dict):
        """Store an audit event with appropriate retention."""
        # Determine retention tier
        tier = self._classify_event(event)
        
        # Add TTL for auto-expiry
        event["_ttl"] = self.retention_days[tier] * 86400
        event["_tier"] = tier
        
        # Partition by date for efficient queries
        date_key = datetime.fromtimestamp(
            event["timestamp"]
        ).strftime("%Y-%m-%d")
        
        await self._write(f"events:{date_key}", event)
    
    def _classify_event(self, event: dict) -> str:
        """Classify event into retention tier."""
        event_type = event.get("event_type", "")
        has_error = bool(event.get("error"))
        
        if has_error or event_type in ("agent.security", "agent.compliance"):
            return "critical"
        elif event_type in ("agent.decision", "agent.handoff", "agent.human_intervention"):
            return "compliance"
        elif event_type in ("agent.invocation", "agent.tool_call", "agent.token_usage"):
            return "info"
        else:
            return "debug"
    
    async def query_by_agent(self, agent_name: str, 
                              start_date: str, end_date: str,
                              limit: int = 100) -> list[dict]:
        """Query audit logs for a specific agent."""
        results = []
        current = start_date
        
        while current <= end_date and len(results) < limit:
            events = await self._read(f"events:{current}")
            agent_events = [
                e for e in events 
                if e.get("agent_name") == agent_name
            ]
            results.extend(agent_events)
            
            # Next day
            date = datetime.strptime(current, "%Y-%m-%d")
            current = (date + timedelta(days=1)).strftime("%Y-%m-%d")
        
        return results[:limit]
```

---

## Audit Report Templates

### Daily Audit Summary

```markdown
# Agent Audit Summary — {date}

## Overview
- **Total Invocations**: 1,247
- **Successful**: 1,198 (96.1%)
- **Failed**: 49 (3.9%)
- **Handoffs**: 87
- **Human Escalations**: 12

## Top Agents by Activity
| Agent | Invocations | Errors | Avg Duration |
|-------|-------------|--------|-------------|
| Support Agent | 534 | 12 | 2.3s |
| Research Agent | 312 | 8 | 8.1s |
| Code Agent | 401 | 29 | 4.7s |

## Error Summary
- **TimeoutError**: 23 (46.9%)
- **RateLimitError**: 14 (28.6%)
- **ValidationError**: 12 (24.5%)

## Compliance Checks
- ✅ Human escalation rate within threshold
- ✅ Tool approval rate 100%
- ✅ Data access logged for all operations
- ⚠️ Token budget at 87% — review recommended
```

### Incident Forensics Report

```markdown
# Incident Forensics — Trace {trace_id}

## Timeline
| Time | Agent | Action | Duration | Status |
|------|-------|--------|----------|--------|
| 14:23:01 | Router | Task received | 0ms | ✅ |
| 14:23:02 | Support | Reasoning about refund | 1.2s | ✅ |
| 14:23:03 | Support | Tool call: get_order | 0.3s | ✅ |
| 14:23:04 | Support | Decision: escalate | 0.5s | ✅ |
| 14:23:05 | Support | Handoff to Billing | 0.1s | ✅ |
| 14:23:06 | Billing | Tool call: process_refund | 12.3s | ❌ Timeout |
| 14:23:19 | Billing | Retry: process_refund | 12.1s | ❌ Timeout |
| 14:23:33 | Billing | Circuit breaker OPEN | 0ms | ⚠️ |
| 14:23:34 | Billing | Degraded to fallback | 0.2s | ✅ |
| 14:23:35 | Billing | Human escalation | 0.1s | ✅ |

## Root Cause
The `process_refund` API was down (503 errors). The circuit breaker correctly opened after 2 failures, and the agent degraded to a fallback path before escalating to a human operator.

## Recommendations
1. Increase `process_refund` timeout from 10s to 30s
2. Add a cached fallback for refund status checks
3. Set up PagerDuty alert for `process_refund` failures
```

---

## Trigger Phrases

| Phrase | Action |
|--------|--------|
| "Show me the audit log" | Display recent audit events |
| "Trace task [id]" | Show full trace for a specific task |
| "Generate compliance report" | Build compliance report for time period |
| "What did the agent do?" | Show action timeline for a session |
| "Show error summary" | Aggregate and display recent errors |
| "Audit agent [name]" | Show all activity for a specific agent |
| "Run forensic analysis" | Deep dive into an incident trace |
| "Export audit data" | Export logs for external compliance |

---

## Anti-Patterns

| Anti-Pattern | Why It Fails | Fix |
|-------------|-------------|-----|
| Logging everything in one table | Queries are slow, impossible to prune | Partition by date + tier |
| No structured schema | Can't query or analyze logs | Defined AuditEvent schema |
| Synchronous logging | Slows down agent responses | Async buffered writes |
| No retention policy | Storage grows unbounded, costs explode | TTL-based retention tiers |
| Logging only errors | No trace of normal operation | Log all events, not just failures |
| No trace IDs | Can't connect related events | Always propagate trace_id |
| PII in logs | Compliance violations | Strip or hash PII before logging |

---
name: agent-health-monitoring
description: 'Monitor AI agent health, detect anomalies, set up alerting, and maintain observability dashboards for production multi-agent systems. Covers liveness checks, performance metrics, drift detection, and incident response.'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: ai-ml
  tags:
    - agent-monitoring
    - observability
    - alerting
    - health-checks
    - incident-response
    - production-agents
---

# Agent Health Monitoring & Alerting

## Overview

Production multi-agent systems fail silently. An agent that stops responding, returns empty results, or enters an infinite loop can degrade an entire workflow without triggering traditional infrastructure alerts. This skill covers how to build comprehensive health monitoring, metrics collection, and alerting for AI agent fleets.

---

## Core Concepts

### Agent Vital Signs

| Metric | What It Measures | Why It Matters |
|--------|-----------------|----------------|
| **Response Rate** | % of agent invocations that return a result | Dropping rate indicates crashes or context overflows |
| **Latency (P50/P95/P99)** | Time from invocation to response | Spikes indicate context bloat or degraded model performance |
| **Error Rate** | % of invocations with errors/tool failures | Rising rate indicates systemic issues |
| **Step Count** | Number of reasoning steps per task | Unbounded growth indicates looping behavior |
| **Tool Call Success Rate** | % of tool calls that succeed | Drop indicates broken integrations or rate limiting |
| **Token Consumption** | Tokens used per agent run | Budget anomalies indicate runaway agents |
| **Context Utilization** | % of context window used | High utilization risks truncation and quality loss |
| **Hallucination Score** | Confidence calibration or factuality checks | Degrading accuracy undermines trust |

### Alert Severity Levels

| Level | Color | Response Time | Examples |
|-------|-------|---------------|----------|
| **P0 (Critical)** | 🔴 Red | < 5 min | Agent completely down, data loss, security breach |
| **P1 (High)** | 🟠 Orange | < 15 min | Error rate > 20%, latency 5x baseline |
| **P2 (Medium)** | 🟡 Yellow | < 1 hour | Error rate > 5%, slow degradation |
| **P3 (Low)** | 🔵 Blue | < 24 hours | Single agent underperforming, minor drift |

---

## Step-by-Step Implementation

### Step 1: Instrument Every Agent

Wrap every agent invocation with telemetry:

```python
class MonitoredAgent:
    """Agent wrapper that collects metrics on every invocation."""
    
    def __init__(self, agent, agent_name: str, metrics_client):
        self.agent = agent
        self.agent_name = agent_name
        self.metrics = metrics_client
    
    async def run(self, task: str) -> str:
        start_time = time.time()
        step_count = 0
        token_usage = 0
        
        try:
            result = await self.agent.run(task)
            
            # Collect metrics
            duration = time.time() - start_time
            self.metrics.timing(f"agent.{self.agent_name}.latency", duration)
            self.metrics.increment(f"agent.{self.agent_name}.invocations")
            self.metrics.increment(f"agent.{self.agent_name}.success")
            self.metrics.gauge(f"agent.{self.agent_name}.steps", step_count)
            
            return result
            
        except Exception as e:
            duration = time.time() - start_time
            self.metrics.increment(f"agent.{self.agent_name}.errors")
            self.metrics.timing(f"agent.{self.agent_name}.error_latency", duration)
            raise
```

### Step 2: Implement Liveness & Readiness Probes

```python
class AgentHealthProbe:
    """Kubernetes-style health probes for AI agents."""
    
    async def liveness_check(self, agent) -> bool:
        """Is the agent process alive and responding?"""
        try:
            result = await asyncio.wait_for(
                agent.run("Respond with: OK"),
                timeout=5.0
            )
            return "OK" in result
        except (asyncio.TimeoutError, Exception):
            return False
    
    async def readiness_check(self, agent) -> dict:
        """Is the agent ready to accept tasks?"""
        checks = {
            "model_available": await self._check_model(agent),
            "tools_available": await self._check_tools(agent),
            "memory_available": await self._check_memory(agent),
            "context_capacity": await self._check_context(agent),
        }
        return {
            "ready": all(checks.values()),
            "checks": checks
        }
    
    async def deep_check(self, agent) -> dict:
        """Full diagnostic: run a test task and validate output."""
        test_task = agent.config.test_prompt
        result = await agent.run(test_task)
        return {
            "passed": self._validate_output(result),
            "output_preview": result[:200],
            "latency_ms": self._last_latency
        }
```

### Step 3: Set Up Anomaly Detection

```python
class AnomalyDetector:
    """Detect unusual agent behavior using statistical methods."""

    def __init__(self, window_size: int = 100):
        self.window_size = window_size
        self.metrics_history = defaultdict(list)

    def record(self, agent_name: str, metric: str, value: float):
        self.metrics_history[f"{agent_name}:{metric}"].append(value)
        
        # Keep rolling window
        history = self.metrics_history[f"{agent_name}:{metric}"]
        if len(history) > self.window_size:
            history.pop(0)

    def is_anomalous(self, agent_name: str, metric: str, value: float, 
                     z_threshold: float = 3.0) -> tuple[bool, float]:
        """Check if a value is anomalous using z-score."""
        history = self.metrics_history.get(f"{agent_name}:{metric}", [])
        if len(history) < 10:
            return False, 0.0  # Not enough data
        
        mean = statistics.mean(history)
        stdev = statistics.stdev(history)
        if stdev == 0:
            return False, 0.0
        
        z_score = (value - mean) / stdev
        return abs(z_score) > z_threshold, z_score
```

### Step 4: Build the Alerting Pipeline

```python
class AlertManager:
    """Route alerts to the right channels based on severity."""
    
    def __init__(self):
        self.channels = {
            "p0": ["pagerduty", "slack-critical", "phone"],
            "p1": ["slack-critical", "email"],
            "p2": ["slack-warn", "email"],
            "p3": ["dashboard", "weekly-report"],
        }
    
    async def alert(self, severity: str, title: str, message: str, 
                    context: dict = None):
        """Send an alert through the appropriate channels."""
        channels = self.channels.get(severity, self.channels["p3"])
        
        for channel in channels:
            await self._send(channel, {
                "severity": severity,
                "title": title,
                "message": message,
                "context": context,
                "timestamp": datetime.now().isoformat()
            })
```

### Step 5: Define Alert Rules

```yaml
# alert-rules.yaml
rules:
  - name: agent_down
    condition: liveness_check == false
    for: 30s
    severity: P0
    message: "Agent {name} is unresponsive"

  - name: high_error_rate
    condition: error_rate > 0.20
    for: 5m
    severity: P1
    message: "Agent {name} error rate is {error_rate:.0%}"

  - name: latency_spike
    condition: p99_latency > 30s
    for: 3m
    severity: P1
    message: "Agent {name} p99 latency is {latency:.1f}s"

  - name: looping_detected
    condition: step_count > max_steps * 0.8
    for: 1m
    severity: P2
    message: "Agent {name} approaching step limit on {task_count} tasks"

  - name: budget_anomaly
    condition: token_usage > daily_budget * 0.5
    for: 1h
    severity: P2
    message: "Agent {name} used {usage} tokens in last hour (50% of daily budget)"
```

### Step 6: Build the Dashboard

Essential dashboard panels for a multi-agent system:

| Panel | Metric | Display |
|-------|--------|---------|
| **Agent Grid** | Liveness per agent | Green/Red status cards |
| **Latency Heatmap** | P50/P95/P99 per agent | Color-coded time series |
| **Error Waterfall** | Error rate by agent + error type | Stacked area chart |
| **Token Burn Rate** | Tokens/min per agent | Line chart with budget line |
| **Active Tasks** | Tasks in-flight per agent | Gauge per agent |
| **Top Errors** | Most frequent error messages | Ranked list with count |
| **Context Pressure** | % context window used | Per-agent gauge cluster |
| **Alert Timeline** | Alerts over past 24h | Event timeline |

---

## Trigger Phrases

| Phrase | Action |
|--------|--------|
| "Check agent health" | Run liveness probes on all agents |
| "Show me the dashboard" | Generate or link to monitoring dashboard |
| "Why is agent X slow?" | Show latency breakdown for specific agent |
| "Any anomalies?" | Run anomaly detection on recent metrics |
| "Set up alert for..." | Create a new alert rule |
| "Agent X is down" | Trigger incident response workflow |
| "Run a health check" | Execute full liveness + readiness + deep check |

---

## Production Runbook

### Incident: Agent Unresponsive

1. **Check liveness probe** — is the process running?
2. **Check model endpoint** — is the LLM provider healthy?
3. **Check context window** — has the agent exceeded its limit?
4. **Restart agent** with fresh context
5. **If recurring**, set up circuit breaker

### Incident: Error Rate Spike

1. **Identify error type** — tool failure, model error, or parsing issue?
2. **Check recent deploys** — did a prompt or tool change?
3. **Rollback** if a recent change correlates
4. **Check rate limits** — are external APIs throttling?
5. **Scale out** if traffic increased

### Incident: Token Budget Spike

1. **Identify which agent(s) are consuming**
2. **Check for looping** — excessive step counts
3. **Review recent tasks** — unusually long inputs?
4. **Implement budget caps** per task
5. **Alert the team** if pattern persists

---

## Anti-Patterns

| Anti-Pattern | Why It Fails | Fix |
|-------------|-------------|-----|
| Monitoring only liveness | Agent can be "alive" but useless | Add readiness + deep checks |
| Same threshold for all agents | Different agents have different baselines | Per-agent dynamic thresholds |
| No alert deduplication | Alert fatigue leads to ignored alerts | Group by fingerprint, rate-limit |
| Fixing symptoms, not causes | Band-aid solutions mask root issues | Always capture root cause in alerts |
| No dashboard | No shared visibility | Build and maintain a live dashboard |

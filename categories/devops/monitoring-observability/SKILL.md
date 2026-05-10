---
name: monitoring-observability
description: 'Prometheus, Grafana, ELK/Loki, Jaeger, metrics, logging, tracing, and alerting'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: devops
  tags: [monitoring, observability, prometheus, grafana, logging, tracing]
---

# Monitoring & Observability

Build comprehensive observability for your systems.

## The Three Pillars

### 1. Metrics (Prometheus)
```yaml
# Instrument your app
http_requests_total{method="GET", endpoint="/api/users", status="200"} 1024
http_request_duration_seconds{quantile="0.95"} 0.235
```

### 2. Logging (Loki / ELK)
- Structured JSON logging
- Include: timestamp, level, service, trace_id, message
- Centralized log aggregation
- Log levels: DEBUG < INFO < WARN < ERROR < FATAL

### 3. Tracing (Jaeger / Tempo)
- Trace every request across services
- Span: individual operation with timing
- Distributed context propagation via trace ID headers
- Sample 1-10% of production traffic

## Alerting (Alertmanager)

### Alert Severity
| Severity | Response Time | Channel |
|----------|--------------|---------|
| Critical | Immediately | PagerDuty + SMS |
| Warning | 1 hour | Slack + Email |
| Info | Next day | Dashboard |

### Golden Signals (Google SRE)
1. **Latency**: Time to respond
2. **Traffic**: Requests per second
3. **Errors**: Error rate (5xx, exceptions)
4. **Saturation**: Resource utilization

## Dashboard Design (Grafana)

### Rules
- 3-5 panels per row
- Time series with trend lines, not raw numbers
- RED metrics: Rate, Errors, Duration per service
- USE metrics: Utilization, Saturation, Errors per resource
- Include annotations for deployments, incidents

## Best Practices
- Monitor from outside (synthetic checks)
- Monitor everything, alert on what matters
- Use SLOs to define what's "good enough"
- Test alerts (fire drills, tabletop exercises)
- Review dashboards monthly with the team

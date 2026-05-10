---
name: microservices
description: 'Service boundaries, communication patterns, event sourcing, CQRS, and distributed tracing'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: backend
  tags: [microservices, architecture, distributed-systems, event-sourcing, cqrs]
---

# Microservices

Design and operate microservice architectures.

## Service Boundaries

### Bounded Context (DDD)
- Each service owns a domain concept
- Service has its own database (no DB sharing)
- Communication via API or events
- Avoid "shared" services (leads to tight coupling)

### Service Sizing
- **Too small**: Nano-services — high overhead, hard to debug
- **Too large**: Distributed monolith — worst of both worlds
- **Right size**: Team can build, test, deploy independently

## Communication Patterns

| Pattern | Type | When |
|---------|------|------|
| REST | Sync | Request-response, CRUD |
| gRPC | Sync (fast) | Internal, high throughput |
| Event | Async | Decoupled workflows |
| Message Queue | Async | Buffered, reliable delivery |

### Event-Driven Communication
```
Service A → Event Bus → Service B
                       → Service C
                       → Service D
```
Benefits: eventual consistency, loose coupling, replayability.

## CQRS (Command Query Responsibility Segregation)
- Separate read and write models
- Queries go to optimized read stores (materialized views)
- Commands go to write stores (normalized)
- Eventually consistent between them

## Distributed Tracing
- Correlation ID passed across all services
- Use OpenTelemetry for instrumentation
- Trace each request: Service → Queue → DB → External API
- Visualize in Jaeger or Zipkin
- Alert on traces that exceed latency SLOs

## Anti-Patterns to Avoid
❌ Shared database between services
❌ Sync chains (A → B → C → D blocking)
❌ Distributed monolith (microservices but deployed together)
❌ Absent monitoring ("it works in dev")
❌ Premature decomposition (start monolith, extract carefully)

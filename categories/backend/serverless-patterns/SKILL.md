---
name: serverless-patterns
description: 'Lambda, cold starts, event-driven design, API Gateway, and serverless frameworks'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: backend
  tags: [serverless, lambda, cloud, aws, event-driven]
---

# Serverless Patterns

Build scalable serverless applications.

## Core Patterns

### Function Design
- Single responsibility per function
- Stateless (use external storage for state)
- Idempotent handlers (retry-safe)
- Receive event, process, return/forward

### Cold Start Mitigation
| Strategy | Effect | Tradeoff |
|----------|--------|----------|
| Provisioned Concurrency | Zero cold starts | Cost |
| Smaller runtime (Node/Python) | Faster start | Language choice |
| Keep-alive ping | Reduce frequency | Extra cost |
| Lambda SnapStart (Java) | Fast restore | State constraints |
| Lambda@Edge | Regional distribution | 1MB response limit |

## Event-Driven Design

### Event Types
```yaml
Events:
  - UserRegistered { userId, email, timestamp }
  - OrderPlaced { orderId, items, total }
  - PaymentProcessed { orderId, amount, status }
  - EmailSent { to, template, variables }
```

### SQS + Lambda Pattern
```
API Gateway → Lambda (producer) → SQS → Lambda (consumer) → DynamoDB
```
Benefits: decoupling, buffering, retry, dead-letter queue.

## API Gateway Patterns
- Request validation at gateway level
- Caching for GET endpoints (TTL per route)
- WAF for rate limiting and IP blocks
- Custom domain with ACM certificate
- Usage plans for API keys

## Frameworks
- **SAM** (AWS) — YAML/YML, local testing
- **Serverless Framework** — Multi-cloud, plugins
- **CDK** (AWS) — Full programming languages
- **Terraform** — If already using for other infra
- **Chalice** (Python) — Flask-like, AWS only

## Best Practices
- Function timeout: max 30s for APIs, 15min for background
- Memory: allocate more = more CPU (for compute-heavy, use 1.7GB+)
- Monitor: Duration, Invocations, Error count, Throttles
- Logs: structured JSON to CloudWatch
- Security: least-privilege IAM roles per function

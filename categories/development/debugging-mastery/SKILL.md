---
name: debugging-mastery
description: 'Structured debugging methodology, root cause analysis, logging strategies, and troubleshooting workflows'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: development
  tags: [debugging, troubleshooting, root-cause-analysis, logging, observability]
---

# Debugging Mastery

A structured approach to finding and fixing bugs systematically — from initial symptom to permanent resolution.

## Core Principles

### 1. Understand Before You Fix
The biggest debugging mistake is applying a fix before understanding the root cause. Correlation is not causation. Always prove you understand *why* a bug happens before changing code.

### 2. Isolate Before You Investigate
Narrow the search space. A bug that manifests in 100 lines is harder to find than one isolated to 10 lines. Binary search the code, the data, and the environment.

### 3. Fix the Root Cause, Not the Symptom
Patching symptoms creates technical debt. Firefighting is necessary, but it should always be followed by a permanent fix that addresses the underlying systemic issue.

### 4. Make It Reproducible First
If you can't reproduce a bug reliably, you can't fix it. Invest in reproduction before investigation. A failing test is worth a thousand log statements.

---

## Debugging Maturity Model

| Level | Approach | Tools | Prevention |
|-------|----------|-------|------------|
| **1: Reactive** | Random printf guessing | console.log, print statements | No prevention |
| **2: Basic** | Incremental investigation | Logging, basic breakpoints | Some error handling |
| **3: Structured** | Scientific method applied | Debugger, log levels, metrics | Unit tests for found bugs |
| **4: Systematic** | Root cause analysis documented | Distributed tracing, profilers | Regression tests for all bugs |
| **5: Proactive** | Predictive monitoring | Observability platform, chaos engineering | Automated anomaly detection |

Target: **Level 3+** for individual developers. **Level 4+** for teams.

---

## Actionable Guidance

### The Scientific Method of Debugging

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│   Observe   │ ──► │  Hypothesize │ ──► │   Predict   │ ──► │  Experiment │ ──► │  Conclude   │
│  Symptom    │     │  Root Cause  │     │  Outcome     │     │  Test Fix   │     │  Verified?  │
└─────────────┘     └──────────────┘     └──────────────┘     └─────────────┘     └──────────────┘
```

**Step-by-step process:**

1. **Observe**: What exactly is happening? When did it start? What changed?
2. **Hypothesize**: What could cause this? List possible root causes.
3. **Predict**: If my hypothesis is correct, what else would be true?
4. **Experiment**: Test the prediction. Change one variable at a time.
5. **Conclude**: Did the experiment confirm or refute the hypothesis?

```python
# Example: Debugging a payment processing bug

# Step 1: Observe
# Symptom: Users report "Payment failed" for valid credit cards
# Timing: Started after deploy v2.3.1
# Scope: Only 3% of users affected

# Step 2: Hypothesize
# H1: A new validation rule rejects valid cards
# H2: The payment gateway API changed
# H3: A race condition in the transaction handler

# Step 3: Predict
# If H1: Cards with specific BIN ranges (starting 4xxxxx) would fail
# If H2: All payments would fail, not 3%
# If H3: Failures would correlate with server load

# Step 4: Experiment
def test_h1():
    # Check recently changed validation code
    recent_changes = git_diff('v2.3.0', 'v2.3.1')
    validation_changes = [c for c in recent_changes if 'validate' in c.file]
    
    # Test with known-good card numbers
    test_cards = ['4111111111111111', '5500000000000004']
    for card in test_cards:
        result = payment_processor.validate(card)
        print(f"Card {card[:4]}... result: {result}")
        # Found: Cards starting with '4' (Visa) incorrectly rejected

# Step 5: Conclude
# Confirmed H1 — a regex change in validate.py introduced a bug
# Fix: Roll back the regex change and add test coverage
```

### The Debugging Toolkit

#### Logging Strategy

**Log Levels** — Use them consistently:

| Level | When to Use | Example |
|-------|-------------|---------|
| **ERROR** | Something is broken, needs human intervention | `Database connection failed after 3 retries` |
| **WARN** | Something unexpected but not breaking | `Rate limit approaching: 95/100 requests` |
| **INFO** | Important lifecycle events | `User 42 registered, invoice INV-003 created` |
| **DEBUG** | Detailed flow information, disabled in prod | `Processing payment: amount=29.99, currency=USD` |
| **TRACE** | Exhaustive step-by-step, rarely enabled | `Entering calculateTax(), item_count=3, region=EU` |

**Structured Logging** — Log as structured data, not strings:

```python
# Bad: String interpolation — hard to search and parse
logger.info(f"User {user_id} purchased {item_count} items for ${total}")

# Good: Structured logging — machine-parseable and searchable
logger.info("purchase_completed", extra={
    "user_id": user_id,
    "item_count": item_count,
    "total": total,
    "currency": "USD",
    "payment_method": payment_method,
    "timestamp": datetime.utcnow().isoformat()
})
```

**Key Logging Patterns:**

```python
# Log at boundaries, not everywhere
def process_order(order_data):
    logger.info("order_processing_started", extra={"order_id": order_data["id"]})
    try:
        result = order_processor.process(order_data)
        logger.info("order_processing_completed", extra={"order_id": order_data["id"], "status": result.status})
        return result
    except Exception as e:
        logger.error("order_processing_failed", extra={
            "order_id": order_data["id"],
            "error": str(e),
            "error_type": type(e).__name__
        })
        raise

# Include context that helps debugging
logger.warn("payment_gateway_timeout", extra={
    "gateway": "stripe",
    "timeout_ms": 5000,
    "attempt": retry_count,
    "order_id": order_id
})
```

#### Debugger Usage — Beyond Print Statements

```python
import pdb
import traceback

# Setting breakpoints in code
def complex_calculation(data):
    # Manual breakpoint
    breakpoint()  # Python 3.7+ — drops into pdb
    
    # Conditional breakpoint
    if data.get('type') == 'edge_case':
        breakpoint()
    
    result = perform_calculation(data)
    return result
```

**Debugger commands to know:**

```
# pdb / ipdb commands
n (next)       — Execute next line
s (step)       — Step into function call
c (continue)   — Continue until next breakpoint
l (list)       — Show source code context
p (print)      — Print variable value
pp             — Pretty-print variable
b (break)      — Set breakpoint: b 42 or b file.py:42
cl (clear)     — Clear breakpoints
q (quit)       — Exit debugger
!              — Execute arbitrary Python: !x = 42
```

#### Binary Search Debugging

When the bug could be anywhere in a large codebase:

```python
# Instead of stepping through 1000 lines,
# use binary search on commits

# Step 1: Find a known-good commit
# git checkout v2.2.0 — does the bug exist here? No.

# Step 2: Find a known-bad commit
# git checkout v2.3.1 — does the bug exist here? Yes.

# Step 3: Binary search
# git bisect start
# git bisect bad v2.3.1
# git bisect good v2.2.0
# Git checks out the midpoint automatically
# Run tests: if bad -> git bisect bad, if good -> git bisect good
# Repeat until the exact commit is found

# Step 4: Read the offending commit
# git bisect reset
# git show <offending-commit-hash>
```

### Root Cause Analysis (RCA)

#### The 5 Whys Technique

```
Problem: Users are seeing "500 Internal Server Error" on checkout

Why #1: The payment gateway returned an error
Why #2: The transaction timed out after 10 seconds
Why #3: The payment gateway's API rate limit was exceeded
Why #4: A deployment increased the retry count from 1 to 3 without considering rate limits
Why #5: The retry configuration wasn't reviewed during code review

Root Cause: Inadequate code review process for configuration changes
Fix: Add rate limit awareness to retry logic AND add config change review to PR checklist
```

#### The Fishbone (Ishikawa) Diagram Approach

```text
People                    Process                  Technology
───────                   ───────                  ──────────
Dev didn't know          No deployment             Database
about rate limits        checklist                 connection pool
Developer                          ─── exhausted by
rushed change                     │   retries
                                  │
                            ┌─────▼─────┐
                            │   BUG     │  "500 on checkout"
                            │           │   during peak hours
                            └─────▲─────┘
                                  │
Rate limit                   ────┘
threshold too low                  │
                                  │
Configuration                Not tested          Monitoring
───────                      under load          ──────────
Retry count                                         Alert
increased 1→3                                       threshold
with no review                                      too high
```

#### RCA Template

```markdown
## Root Cause Analysis

**Incident**: [Brief description]
**Severity**: [Critical/Major/Minor]
**Date**: YYYY-MM-DD
**Detected by**: [Monitoring/User report/Manual check]
**Impact**: [Users affected, revenue impact, duration]

### Timeline
- HH:MM — First symptom observed
- HH:MM — Investigation started
- HH:MM — Root cause identified
- HH:MM — Hotfix deployed
- HH:MM — Permanent fix deployed

### Root Cause
[Clear description of the underlying cause]

### Contributing Factors
1. [Factor that made the bug possible]
2. [Factor that delayed detection]
3. [Factor that amplified impact]

### Action Items
| Action | Owner | Due Date |
|--------|-------|----------|
| Fix root cause | | |
| Add monitoring/alert | | |
| Add regression test | | |
| Update docs/process | | |

### Lessons Learned
[What did we learn? How do we prevent this class of bug in the future?]
```

### Troubleshooting Workflows

#### Web Application — Request Fails

```python
# Workflow: Debugging a failed HTTP request

# 1. Check the logs
# grep "ERROR\|500\|Exception" /var/log/app.log | tail -50

# 2. Check recent deployments
# git log --oneline --since="1 day ago"

# 3. Reproduce with curl
"""
$ curl -v -X POST https://api.example.com/orders \
  -H "Content-Type: application/json" \
  -d '{"user_id": 42, "items": [{"sku": "ABC", "qty": 1}]}'
"""

# 4. Check infrastructure
# kubectl get pods | grep my-service
# kubectl logs deployment/my-service --tail=100
# kubectl describe pod my-service-xxxx

# 5. Check dependencies
# curl -I https://payment-gateway.example.com/health
# nc -zv database.example.com 5432

# 6. Reproduce locally with same data
def reproduce_bug():
    request_data = {"user_id": 42, "items": [{"sku": "ABC", "qty": 1}]}
    response = app.test_client().post('/orders', json=request_data)
    print(f"Status: {response.status_code}")
    print(f"Body: {response.json}")
```

#### Performance Degradation

```python
# Workflow: Debugging a slow endpoint

import time
import cProfile
import pstats

# 1. Add timing instrumentation
def timed_endpoint():
    start = time.perf_counter()
    try:
        result = process_request()
        return result
    finally:
        elapsed = time.perf_counter() - start
        if elapsed > 1.0:  # Log slow requests
            logger.warn("slow_endpoint", extra={
                "endpoint": "/api/orders",
                "elapsed_s": elapsed
            })

# 2. Profile the hot path
def profile_function():
    profiler = cProfile.Profile()
    profiler.enable()
    result = process_request()
    profiler.disable()
    
    stats = pstats.Stats(profiler)
    stats.sort_stats('cumtime')
    stats.print_stats(20)  # Top 20 by cumulative time

# 3. Check database query performance
# EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 42;

# 4. Check for N+1 queries
# Look for query count in logs — if page load makes 150 queries, that's N+1
```

#### Memory Leak Detection

```python
# Workflow: Debugging a memory leak

import tracemalloc
import gc

# 1. Enable tracemalloc
tracemalloc.start(25)  # Keep 25 stack frames

# 2. Take a snapshot before the operation
snapshot_before = tracemalloc.take_snapshot()

# 3. Run the suspect code
for _ in range(100):
    process_request()

# 4. Take a snapshot after
snapshot_after = tracemalloc.take_snapshot()

# 5. Compare to find what's growing
stats = snapshot_after.compare_to(snapshot_before, 'lineno')
for stat in stats[:10]:
    print(f"Size: {stat.size_diff}, Count: {stat.count_diff}")
    for line in stat.traceback.format():
        print(f"  {line}")

# 6. Force garbage collection and check
gc.collect()
unreachable = gc.garbage
print(f"Unreachable objects: {len(unreachable)}")

# 7. Check for common leak patterns
# - Event listeners not removed
# - Caches without eviction
# - Global mutable state
# - Circular references with __del__
```

### Debugging by Category

#### Concurrency Bugs

```python
import threading
import asyncio

# Race condition pattern
shared_counter = 0
lock = threading.Lock()

# BAD: No synchronization
def unsafe_increment():
    global shared_counter
    shared_counter += 1  # Not atomic!

# GOOD: With lock
def safe_increment():
    global shared_counter
    with lock:
        shared_counter += 1

# Deadlock pattern
def deadlock_risk():
    with lock_a:
        with lock_b:  # Another thread holds lock_b, waiting for lock_a
            do_something()

# Fix: Consistent lock ordering + timeout
def safe_locking():
    # Always acquire locks in the same order
    with lock_a:
        if lock_b.acquire(timeout=5):
            try:
                do_something()
            finally:
                lock_b.release()
```

#### API/Database Bugs

```python
# Common patterns

# N+1 Query detection
# BAD: One query per item
orders = Order.objects.filter(user_id=42)
for order in orders:  # N queries for N orders
    print(order.items.count())

# GOOD: Eager loading
orders = Order.objects.filter(user_id=42).prefetch_related('items')
for order in orders:  # 2 queries total
    print(order.items.count())

# Transaction debugging
from django.db import transaction

def debug_transaction():
    with transaction.atomic():
        try:
            order = Order.objects.create(user_id=42, total=29.99)
            payment = Payment.objects.create(order=order, amount=29.99)
            # If payment fails, order is rolled back too
        except Exception as e:
            logger.error(f"Transaction failed: {e}")
            raise
```

### Building Reproducible Test Cases

```python
# A good bug report includes a minimal reproduction

def test_reproduce_bug():
    """Minimal reproduction for checkout 500 error"""
    # Setup
    app = create_test_app()
    test_user = UserFactory(id=42, payment_method='credit_card')
    
    # Minimal request data
    request_data = {
        "user_id": test_user.id,
        "items": [
            {"sku": "ABC-123", "qty": 1}
        ],
        "payment": {
            "method": "credit_card",
            "token": "tok_test_12345"
        }
    }
    
    # Exercise
    with app.test_client() as client:
        response = client.post('/api/checkout', json=request_data)
    
    # Assert
    assert response.status_code != 500, f"Got 500: {response.json}"
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
```

---

## Common Mistakes

1. **Changing too many variables at once**: Change one thing, test it, then change the next. Otherwise you don't know what fixed it.
2. **Fixing symptoms instead of root causes**: A hotfix that catches the exception but doesn't prevent the underlying condition is not a fix.
3. **Ignoring the environment**: "Works on my machine" usually means an environment difference. Check versions, configs, and dependencies.
4. **Assuming rather than verifying**: Don't assume "that can't be the problem." Verify every hypothesis with evidence.
5. **Not writing a regression test**: If a bug was worth fixing, it's worth preventing from recurring. Always add a test.
6. **Over-relying on print debugging**: Print statements are fine for quick checks but a debugger gives you full context without code changes.
7. **Not reading the error message carefully**: Error messages often tell you exactly what's wrong. Read the full stack trace and message before guessing.
8. **Panic debugging**: Randomly changing code to see if something sticks. Follow the scientific method instead.
9. **Neglecting to document the fix and the root cause**: The next person with this bug deserves your notes. Write them down.

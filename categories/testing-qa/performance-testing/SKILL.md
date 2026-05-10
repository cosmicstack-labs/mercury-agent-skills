---
name: performance-testing
description: 'Load, stress, spike testing with k6/Locust, bottleneck analysis, and performance test automation'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: testing-qa
  tags: [performance, testing, load-testing, k6, locust]
---

# Performance Testing

Load, stress, and spike test your systems to ensure reliability at scale.

## Types of Performance Tests

| Type | Goal | Pattern |
|------|------|---------|
| Smoke | Verify basic perf with minimal load | 1-5 users for 1 min |
| Load | Test under expected traffic | Ramp to target, hold 10-30 min |
| Stress | Find breaking point | Ramp up until failure |
| Spike | Handle sudden traffic bursts | Instant 10x load for 2-5 min |
| Endurance | Detect memory leaks over time | Sustained load for 1-24 hrs |
| Soak | Verify long-term stability | 50% load for hours |

## k6 Patterns

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up
    { duration: '5m', target: 100 },  // Hold
    { duration: '1m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('https://api.example.com/users');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 300ms': (r) => r.timings.duration < 300,
  });
  sleep(1);
}
```

## Bottleneck Analysis Flow
1. Run test → find slow endpoint
2. Check DB query plans
3. Check app server CPU/memory
4. Check external service latency
5. Add caching or optimize query
6. Re-test to verify improvement

## Automation
- Run smoke tests on every PR
- Run full perf suite nightly
- Alert on threshold breaches
- Track latency percentiles over time in dashboards

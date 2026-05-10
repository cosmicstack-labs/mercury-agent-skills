---
name: caching-strategies
description: 'CDN, Redis, in-memory cache, cache invalidation, and distributed caching patterns'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: backend
  tags: [caching, performance, redis, cdn, distributed-systems]
---

# Caching Strategies

Cache effectively to improve performance and reduce load.

## Cache Layers

| Layer | Latency | Storage | Examples |
|-------|---------|---------|----------|
| Browser | Local | Small | localStorage, HTTP cache |
| CDN | Regional | Large | CloudFront, CloudFlare, Fastly |
| Application | In-process | Small | L1 cache (heap) |
| Distributed | Network | Large | Redis, Memcached |
| Database | Same host | Very large | Buffer pool, query cache |

## Caching Patterns

### Cache-Aside (Lazy Loading)
```
1. Check cache → miss
2. Query database
3. Store in cache
4. Return
```
Best for: Read-heavy, general purpose.

### Write-Through
```
1. Write to cache
2. Cache writes to DB (sync)
3. Return
```
Best for: Consistency critical, write-heavy.

### Write-Behind
```
1. Write to cache
2. Return immediately
3. Cache writes to DB (async)
```
Best for: High throughput writes, eventual consistency OK.

### Refresh-Ahead
- Cache proactively refreshes before expiry
- Reduces latency spikes on cache miss
- Requires predictive logic or scheduled refresh

## Cache Invalidation

**Two hard things**: naming, cache invalidation, off-by-one errors.

| Strategy | How | Risk |
|----------|-----|------|
| TTL | Expire after X seconds | Stale data during TTL |
| Event-based | Invalidate on data change | Missed events |
| Version keys | `user_42_v3` | Unused old keys accumulate |
| Write-through | Update cache on write | Write amplification |

## Redis Patterns
- Use `EXPIRE` on every SET
- Use `SCAN` not `KEYS` in production
- Distributing: Redis Cluster for sharding
- Backup: RDB (snapshot) + AOF (append-only log)
- Monitor: hit rate, memory, evictions, latency

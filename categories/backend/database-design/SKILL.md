---
name: database-design
description: 'Schema design, normalization, indexing, migrations, and query optimization for SQL and NoSQL'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: backend
  tags: [database, sql, nosql, schema, indexing, migrations]
---

# Database Design

Design efficient, scalable database schemas.

## Normalization

| Normal Form | Rule | Violation Example |
|-------------|------|-------------------|
| 1NF | Atomic columns, no repeating groups | `phone_numbers: "555-0100,555-0200"` |
| 2NF | 1NF + all non-key cols depend on full PK | Orders table with product details |
| 3NF | 2NF + no transitive dependencies | Employee with department_name (dept info in dept table) |

**When to denormalize**: Read-heavy workloads, reporting, caching layers.

## Indexing Strategy

### Index Types
| Index | Use Case | Tradeoff |
|-------|----------|----------|
| B-Tree | General purpose, equality + range | Default, usually best |
| Hash | Equality only | Fast lookups, no sorting |
| GIN | Array/JSON | Slightly slower writes |
| BRIN | Huge sorted tables | Very small size |

### Rules
- Index columns used in WHERE, JOIN, ORDER BY
- Index foreign keys
- Covering indexes for frequent queries
- Don't over-index (slows writes, uses space)
- Drop unused indexes (use pg_stat_user_indexes)

## Migrations
- One file per change, sequential naming
- Always reversible (up/down pair)
- Test on staging before production
- Run in transactions where possible
- Avoid locking tables on large tables (use pt-online-schema-change)

## Query Optimization
- EXPLAIN ANALYZE every slow query
- Look for: Seq scans, nested loops, temp files
- Common fixes: missing index, bad join order, OR conditions
- N+1 problem: batch find / includes / joins
- Limit offsets for pagination (use cursor-based)

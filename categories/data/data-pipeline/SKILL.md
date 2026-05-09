---
name: data-pipeline
description: "Comprehensive guide to data pipeline design, ETL/ELT patterns, data quality, monitoring, orchestration, and cost optimization for production-grade data engineering."
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: data
  tags:
    - data-pipeline
    - etl
    - elt
    - data-quality
    - dbt
    - airflow
    - dagster
    - prefect
    - data-observability
    - orchestration
    - medallion-architecture
---

# Data Pipeline Design

## Core Principles

Data pipelines are the arteries of modern data platforms. A well-designed pipeline is **reliable**, **observable**, **idempotent**, and **cost-efficient**. The following principles guide every decision:

1. **Idempotency First** — Running a pipeline twice should produce the same result. This enables safe retries and backfills without data duplication.
2. **Observability by Default** — Every stage must emit metrics, logs, and lineage metadata. If you can't see it, you can't fix it.
3. **Fail Gracefully** — Assume failures will happen. Design dead letter queues, retry logic with exponential backoff, and alerting on anomalies.
4. **Incremental Processing** — Process only what's changed. Full refreshes are for schema migrations and backfills only.
5. **Data Contracts** — Define and enforce schemas at every boundary. Catch drift before it reaches downstream consumers.
6. **Separation of Concerns** — Extract, transform, load are distinct phases. Each should be independently testable and debuggable.
7. **Cost Awareness** — Every byte processed costs money. Partition, compress, and prune aggressively.

---

## Pipeline Maturity Model

| Level | Name | Characteristics |
|-------|------|----------------|
| **0** | Ad-hoc | Manual scripts, no scheduling, no error handling, no documentation |
| **1** | Scheduled | Cron-based scheduling, basic retries, simple logging |
| **2** | Monitored | Centralized logging, metrics dashboards, alerts on failure, basic data quality checks |
| **3** | Observable | Full lineage tracking, freshness SLAs, schema validation, data contract enforcement |
| **4** | Self-healing | Automated retry with backoff, dead letter queues, anomaly detection triggers auto-pause |
| **5** | Autonomous | Adaptive pipelines that optimize themselves (auto-partitioning, dynamic resource allocation, intelligent backfilling) |

**Target:** At minimum Level 3 for production pipelines. Level 4 for critical business data.

---

## Pipeline Architecture Patterns

### Batch vs Streaming

| Aspect | Batch | Streaming |
|--------|-------|-----------|
| **Latency** | Minutes to hours | Seconds to minutes |
| **Processing** | Scheduled intervals (hourly, daily) | Continuous, event-driven |
| **Complexity** | Lower | Higher |
| **State management** | Simpler (stateless per batch) | Complex (windowing, watermarks) |
| **Cost** | Predictable | Variable, can spike |
| **Use case** | Reporting, BI, ML training | Real-time dashboards, fraud detection, alerts |

**When to choose batch:** Business reports don't need sub-minute freshness. Batch is simpler, cheaper, and easier to debug.

**When to choose streaming:** You need real-time decisions (fraud, pricing, monitoring). Be prepared for the operational complexity.

### Lambda vs Kappa Architecture

**Lambda Architecture** — Run batch and streaming paths in parallel, merge results at query time.

```
Streaming path: Source → Stream processor → Speed layer → Serving layer
Batch path:    Source → Batch processor → Batch view     ↗
```

- **Pros:** Handles both real-time and historical accuracy
- **Cons:** Code duplication (batch + streaming logic), complex reconciliation

**Kappa Architecture** — Everything is a stream. Batch is just replaying a stream from the beginning.

```
Source → Stream processor → Serving layer (with replay capability)
```

- **Pros:** Single codebase, simpler operational model
- **Cons:** Requires robust stream processing infrastructure (Kafka + Flink/Kafka Streams)

**Recommendation:** Start with Kappa unless you have existing batch infrastructure. The unified model reduces maintenance burden significantly.

### Medallion Architecture (Bronze/Silver/Gold)

This is the de facto standard for modern data lakes and lakehouses (Databricks, Iceberg, Delta Lake).

**Bronze (Raw):** Landing zone — raw data as-is from sources. Schema-on-read. Immutable.
- Append-only, no transformations
- Preserves original data for reprocessing
- Partitioned by ingestion date

**Silver (Cleaned):** Validated, deduplicated, enriched data.
- Schema enforced, quality checks applied
- Joins, type casting, null handling
- Suitable for data science exploration

**Gold (Aggregated):** Business-level aggregates, metrics, and reporting tables.
- Denormalized for query performance
- Aggregated at business grain (daily, monthly)
- Powers dashboards, ML features, and APIs

```
Bronze ──► Silver ──► Gold ──► Consumers
  │          │          │
  │          │          └── BI dashboards
  │          │          └── Feature store
  │          │          └── Reporting
  │          │
  │          └── Data science
  │          └── Ad-hoc queries
  │
  └── Reprocessing / backfills
```

**Key benefit:** Each layer acts as a checkpoint. If gold is corrupted, replay from silver. If silver has issues, replay from bronze.

---

## ETL vs ELT

### ETL (Extract, Transform, Load)

```
Extract → Transform (in staging area) → Load
```

- **When to use:** Transform logic is complex, source system is slow/stressed, target system can't handle complex transformations
- **Pros:** Less load on target, cleaner data at load time
- **Cons:** Requires a transformation engine, more pipeline code, harder to debug

### ELT (Extract, Load, Transform)

```
Extract → Load (raw) → Transform (in target)
```

- **When to use:** Target is a powerful warehouse (Snowflake, BigQuery, Redshift, Databricks), raw data needs to be preserved
- **Pros:** Simpler pipeline, leverages warehouse compute power, raw data always available
- **Cons:** More expensive (compute on transformed data may be wasteful), raw data takes storage

### Transformation Strategies

| Strategy | Tooling | Best For |
|----------|---------|----------|
| SQL-based | dbt, SQLMesh | ELT on warehouses |
| Code-based | Spark, Beam, Flink | Complex logic, streaming |
| Visual | Fivetran, Stitch, Airbyte | Simple ingestion |
| Hybrid | dbt + Spark | ELT with complex transforms |

**Recommendation:** Prefer ELT + dbt for 80% of pipelines. Use ETL with Spark/Beam only when transformations are too complex for SQL (ML feature engineering, graph processing, custom aggregations).

---

## Data Quality

### Schema Validation

Validate schemas at every pipeline boundary. Use schema registries (Confluent Schema Registry, JSON Schema, Avro, Protobuf).

```python
# Example: Schema validation with Great Expectations
import great_expectations as ge

df = ge.read_csv("raw_orders.csv")
df.expect_column_values_to_not_be_null("order_id")
df.expect_column_values_to_be_between("amount", 0, 100000)
df.expect_column_values_to_be_in_set("status", ["pending", "shipped", "delivered"])
validation_result = df.validate()
assert validation_result["success"], "Schema validation failed!"
```

### Data Contracts

Define a contract between producers and consumers:

```yaml
# data_contracts/orders.yaml
version: 1
table: orders
columns:
  order_id: { type: string, nullable: false, unique: true }
  user_id: { type: string, nullable: false }
  amount: { type: decimal(10,2), nullable: false, min: 0 }
  status: { type: string, nullable: false, enum: ["pending", "shipped", "delivered"] }
  created_at: { type: timestamp, nullable: false }
freshness: { sla: 1h, check_on: created_at }
volume: { min_rows: 100, max_rows: 1_000_000 }
```

### Freshness Checks

Alert when data stops arriving:

```sql
-- Freshness check (runs every 5 minutes)
SELECT
  CURRENT_TIMESTAMP AS check_time,
  MAX(created_at) AS latest_record,
  DATEDIFF('minute', MAX(created_at), CURRENT_TIMESTAMP) AS staleness_minutes
FROM orders
HAVING staleness_minutes > 60;  -- SLA is 1 hour
```

### Anomaly Detection

Detect unexpected changes in volume, schema, or values:

```python
# Volume anomaly detection
expected_row_count = 10000  # from historical baseline
actual_count = spark.sql("SELECT COUNT(*) FROM orders").collect()[0][0]

threshold = 0.3  # 30% deviation
if abs(actual_count - expected_row_count) / expected_row_count > threshold:
    alert(f"Volume anomaly: expected {expected_row_count}, got {actual_count}")
```

### dbt Testing

```yaml
# dbt/schema.yml
version: 2

models:
  - name: orders
    description: "Cleaned orders table in Silver layer"
    columns:
      - name: order_id
        tests:
          - unique
          - not_null
      - name: amount
        tests:
          - not_null
          - dbt_expectations.expect_column_values_to_be_between:
              min_value: 0
              max_value: 100000
    tests:
      - dbt_utils.recency:
          datepart: hour
          field: created_at
          interval: 1
```

---

## Monitoring & Observability

### Data Observability

Monitor the five pillars: **freshness**, **volume**, **schema**, **distribution**, **lineage**.

Tools: Monte Carlo, Sifflet, Datadog, OpenLineage, Marquez, DQOps.

### Lineage Tracking

Every transformation should log its inputs and outputs:

```python
# OpenLineage example
from openlineage.client import OpenLineageClient
from openlineage.client.run import RunEvent, RunState

client = OpenLineageClient(url="http://localhost:8080")
client.emit(RunEvent(
    eventType=RunState.COMPLETE,
    eventTime=datetime.now().isoformat(),
    run=Run(runId=str(uuid4())),
    job=Job(namespace="my_namespace", name="transform_orders"),
    inputs=[Dataset(namespace="my_database", name="raw_orders")],
    outputs=[Dataset(namespace="my_database", name="silver_orders")]
))
```

### Freshness SLAs

Define SLAs and alert when breached:

```sql
-- Alert if any critical table hasn't been updated in the expected window
WITH table_freshness AS (
  SELECT
    'orders' AS table_name,
    MAX(created_at) AS last_update,
    DATEDIFF('hour', MAX(created_at), CURRENT_TIMESTAMP) AS hours_since_update
  FROM orders
  UNION ALL
  SELECT
    'inventory',
    MAX(updated_at),
    DATEDIFF('hour', MAX(updated_at), CURRENT_TIMESTAMP)
  FROM inventory
)
SELECT * FROM table_freshness
WHERE hours_since_update > (
  CASE table_name
    WHEN 'orders' THEN 1     -- 1 hour SLA
    WHEN 'inventory' THEN 4  -- 4 hour SLA
    ELSE 24                  -- default 24 hour SLA
  END
);
```

### Alerting Rules

- **P0 (Critical):** Pipeline down, data missing for > SLA, schema corruption → Page on-call immediately
- **P1 (High):** Anomalous volume (>30% deviation), freshness breach warning → Notify Slack, create ticket
- **P2 (Medium):** Minor schema drift (nullable → non-nullable), performance degradation → Daily digest
- **P3 (Low):** Deprecation warnings, non-critical schema changes → Logged in weekly report

---

## Orchestration

### Airflow Patterns

```python
# Airflow DAG with idempotent tasks
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

default_args = {
    "owner": "data-team",
    "retries": 3,
    "retry_delay": timedelta(minutes=5),
    "retry_exponential_backoff": True,
    "max_retry_delay": timedelta(hours=1),
}

with DAG(
    dag_id="orders_pipeline",
    start_date=datetime(2024, 1, 1),
    schedule="0 6 * * *",  # Daily at 6 AM
    catchup=False,  # Avoid automatic backfill
    tags=["production", "etl"],
    default_args=default_args,
) as dag:

    extract = PythonOperator(
        task_id="extract_orders",
        python_callable=lambda: print("Extracting..."),
    )

    validate = PythonOperator(
        task_id="validate_schema",
        python_callable=lambda: print("Validating..."),
    )

    load = PythonOperator(
        task_id="load_to_silver",
        python_callable=lambda: print("Loading..."),
    )

    # DAG structure
    extract >> validate >> load
```

### Dagster Patterns

```python
# Dagster with asset-based approach
from dagster import asset, AssetExecutionContext, materialize, Definitions

@asset
def raw_orders():
    """Extract raw orders from source."""
    return extract_from_api()

@asset
def silver_orders(context: AssetExecutionContext, raw_orders):
    """Clean and validate raw orders."""
    cleaned = clean_data(raw_orders)
    validate_schema(cleaned)
    context.log.info(f"Processed {len(cleaned)} orders")
    return cleaned

@asset
def gold_daily_orders(silver_orders):
    """Aggregate orders to daily grain."""
    return silver_orders.groupby("date").agg({"amount": "sum"}).reset_index()

defs = Definitions(assets=[raw_orders, silver_orders, gold_daily_orders])
```

### Prefect Patterns

```python
# Prefect flow with caching and retries
from prefect import flow, task
from prefect.tasks import task_input_hash
from datetime import timedelta

@task(
    retries=3,
    retry_delay_seconds=30,
    cache_key_fn=task_input_hash,
    cache_expiration=timedelta(hours=1),
)
def fetch_data(date: str) -> list:
    response = requests.get(f"https://api.example.com/orders?date={date}")
    response.raise_for_status()
    return response.json()

@task
def transform(data: list) -> list:
    return [{"order_id": d["id"], "amount": float(d["total"])} for d in data]

@flow
def orders_pipeline(date: str):
    raw = fetch_data(date)
    transformed = transform(raw)
    return transformed
```

### DAG Design Principles

1. **Single Responsibility** — Each task does one thing and does it well
2. **Idempotent Tasks** — Re-running a task produces identical results
3. **Deterministic Ordering** — Dependencies are explicit, not implicit
4. **Minimal Fan-out** — Too many parallel tasks overwhelm resources. Batch where possible
5. **Task Granularity** — Too fine-grained = overhead. Too coarse = long-running, hard to restart
6. **Retry from Point of Failure** — Don't restart the entire DAG on a single task failure

### Task Idempotency

A task is idempotent if running it N times produces the same result as running it once.

**How to achieve:**
- Use `MERGE` or `INSERT OVERWRITE` instead of `INSERT INTO`
- Include a dedup step: `ROW_NUMBER() OVER (PARTITION BY id ORDER BY updated_at DESC) = 1`
- Use deterministic partition overwrites: `INSERT OVERWRITE TABLE orders PARTITION(ds='2024-01-01')`
- For streaming: use exactly-once semantics with Kafka offsets

### Backfilling

Backfilling reprocesses data for a historical time window.

**Safe backfill strategy:**
1. Ensure all tasks are idempotent
2. Use partition-aware processing (process only affected partitions)
3. Run backfill in a sandbox environment first
4. Validate row counts before swapping into production
5. Use Airflow's backfill feature: `airflow dags backfill orders_pipeline -s 2024-01-01 -e 2024-01-07`

```python
# Safe backfill: reprocess a date range
from datetime import date, timedelta

def backfill_range(start_date: date, end_date: date):
    current = start_date
    while current <= end_date:
        # Process single partition — safe and restartable
        process_partition(current.isoformat())
        current += timedelta(days=1)
```

---

## Error Handling

### Retry Logic

```python
import time
from functools import wraps

def retry_with_exponential_backoff(max_retries=5, base_delay=5):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_retries - 1:
                        raise
                    delay = base_delay * (2 ** attempt)  # 5, 10, 20, 40, 80 seconds
                    time.sleep(delay)
            return None
        return wrapper
    return decorator
```

### Dead Letter Queues (DLQ)

When a record can't be processed, don't drop it — route it to a DLQ:

```python
def process_with_dlq(records: list, dlq_topic: str = "pipeline.errors"):
    success_count = 0
    error_count = 0

    for record in records:
        try:
            process_record(record)
            success_count += 1
        except Exception as e:
            # Route failed record to DLQ with error metadata
            dlq_publish({
                "original_record": record,
                "error": str(e),
                "timestamp": datetime.now().isoformat(),
                "pipeline": "orders_etl"
            })
            error_count += 1

    # Emit metrics
    print(f"Processed: {success_count}, Failed (routed to DLQ): {error_count}")
```

### Alerting Triggers

```python
def alert_on_failure(context):
    """Send alert when task fails after all retries."""
    dag_id = context["dag"].dag_id
    task_id = context["task"].task_id
    execution_date = context["execution_date"]

    message = f"""
    🚨 Pipeline FAILURE
    DAG: {dag_id}
    Task: {task_id}
    Execution: {execution_date}
    """

    # Send to multiple channels
    send_slack(message, channel="#data-alerts")
    send_pagerduty(message, severity="critical")
```

---

## Cost Optimization

### Partitioning

Partition by date — the most common and effective strategy:

```sql
-- Partition by ingestion date
CREATE TABLE orders (
    order_id STRING,
    amount DECIMAL(10,2),
    created_at TIMESTAMP
)
PARTITIONED BY (ds STRING)  -- 'yyyy-mm-dd'
STORED AS PARQUET;
```

Query only needed partitions:
```sql
SELECT * FROM orders WHERE ds = '2024-01-15';  -- Scans 1 partition = 1/365 of data
SELECT * FROM orders WHERE ds >= '2024-01-01' AND ds < '2024-02-01';  -- Scans 31 partitions
```

### Incremental Processing

Never reprocess the full dataset. Track watermark and process only new/changed records.

```python
from datetime import datetime, timedelta

def incremental_load():
    # Read watermark from last successful run
    last_run = get_watermark("orders_pipeline")  # e.g., 2024-01-15 06:00:00

    # Process only records after watermark
    new_records = fetch_orders_since(last_run)

    if new_records:
        process(new_records)
        # Update watermark to now
        set_watermark("orders_pipeline", datetime.now())
    else:
        print("No new records to process.")
```

### Compression

Use columnar formats with compression:

| Format | Compression Ratio | Read Performance | Write Speed |
|--------|------------------|-----------------|-------------|
| Parquet + Snappy | 2-4x | Excellent | Fast |
| Parquet + ZSTD | 3-6x | Very Good | Moderate |
| ORC + ZLIB | 4-8x | Excellent | Slow |
| Avro + Snappy | 1.5-2x | Good | Fast |

**Rule of thumb:** Use Parquet + ZSTD for storage, Parquet + Snappy for performance-critical paths.

### Additional Cost Tips

1. **Predicate pushdown** — Push filters into the storage layer (Parquet row group pruning)
2. **Cluster by high-cardinality columns** — Optimizes large joins and aggregations
3. **Use materialized views** — Pre-compute expensive aggregations, refresh incrementally
4. **Auto-scaling** — Rightsize compute per pipeline stage (Spark dynamic allocation, Airflow worker pool sizing)
5. **Data lifecycle** — Archive or delete data older than 90 days from hot storage; move to cold/glacier

---

## Common Mistakes

### ❌ Not Handling Schema Drift

**Problem:** Source adds a column, pipeline silently drops it or crashes.

**Solution:** Implement schema-on-read with evolution strategies:
```sql
-- Delta Lake / Iceberg: allow schema evolution
ALTER TABLE bronze_orders ADD COLUMN discount DECIMAL(5,2);
```
Use schema registries to detect and alert on drift.

### ❌ No Data Quality Checks

**Problem:** Bad data flows silently to dashboards. Decisions are made on garbage.

**Solution:** Add quality gates at every stage:
- Bronze → Silver: Schema validation, null checks
- Silver → Gold: Business rule validation, uniqueness checks
- Gold → Dashboard: Freshness SLA, volume anomaly detection

### ❌ Fragile Dependencies

**Problem:** Pipelines depend on implicit upstream completion (e.g., "wait 2 hours after midnight").

**Solution:** Use explicit dependency tracking:
```python
# Bad: Implicit wait
def wait_for_upstream():
    time.sleep(7200)  # Pray it's done in 2 hours

# Good: Sensor checks for upstream completion
from airflow.sensors.time_delta import TimeDeltaSensor
wait_for_upstream = ExternalTaskSensor(
    task_id="wait_for_upstream",
    external_dag_id="source_ingestion",
    external_task_id="complete",
    timeout=3600,
)
```

### ❌ Monolithic DAGs

**Problem:** One massive DAG with 100+ tasks. Hard to debug, impossible to maintain.

**Solution:** Break into focused DAGs with clear boundaries:
- `ingestion_dag` — Source → Bronze
- `cleaning_dag` — Bronze → Silver
- `aggregation_dag` — Silver → Gold
- `export_dag` — Gold → BI tool

Use `ExternalTaskSensor` or dataset-driven scheduling for cross-DAG dependencies.

### ❌ Ignoring Backfill Strategy

**Problem:** Need to reprocess 3 months of data but pipeline only supports incremental loads.

**Solution:** Design for both from day one. Include a `mode` parameter:
```python
def run_pipeline(mode: str = "incremental", start_date: str = None, end_date: str = None):
    if mode == "full_refresh":
        clear_partitions(start_date, end_date)
        process_full_range(start_date, end_date)
    else:
        incremental_load()
```

### ❌ No Monitoring or Alerting

**Problem:** Pipeline silently fails at 2 AM, nobody notices until 9 AM standup.

**Solution:** Invest in observability before you need it. Set up at minimum:
1. Failure alerts (Slack + PagerDuty)
2. Freshness SLA checks
3. Volume anomaly detection
4. Pipeline duration tracking (alert on slow runs)

### ❌ Over-Engineering

**Problem:** Adding streaming infrastructure for a daily batch report.

**Solution:** Match architecture to actual requirements. Start batch, move to streaming only when latency demands it. "We might need real-time someday" is not a reason to build a streaming pipeline today.

---

## Scoring & Evaluation

Use this rubric to evaluate pipeline quality:

| Criterion | Beginner (1 pt) | Proficient (2 pts) | Advanced (3 pts) |
|-----------|-----------------|-------------------|-----------------|
| **Idempotency** | Manual dedup | Idempotent with partition overwrites | Fully idempotent with MERGE/UPSERT |
| **Data Quality** | No checks | Basic null/type checks | Schema validation + contracts + automated testing |
| **Monitoring** | Logs only | Metrics + dashboards | Alerts + lineage + anomaly detection |
| **Error Handling** | Crash on failure | Retry logic | DLQ + retry + smart alerting |
| **Cost Optimization** | No optimization | Date partitioning | Incremental + compression + auto-scaling |
| **Architecture** | Monolithic DAG | Modular DAGs with sensors | Medallion architecture with lineage |
| **Documentation** | None | README with instructions | Auto-generated docs + data catalog |

**Score targets:**
- **7-10:** Development/QA pipeline
- **11-15:** Production pipeline (acceptable)
- **16-21:** Enterprise-grade pipeline (excellent)

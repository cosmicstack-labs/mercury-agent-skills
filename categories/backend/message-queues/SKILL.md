---
name: message-queues
description: 'RabbitMQ, Kafka, SQS, pub/sub, competing consumers, dead letter queues, and event streaming'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: backend
  tags: [message-queues, kafka, rabbitmq, sqs, event-streaming]
---

# Message Queues

Design reliable message-driven systems.

## Queue Types

| Queue | Persistence | Ordering | Use Case |
|-------|------------|----------|----------|
| RabbitMQ | Optional | Per queue | Task distribution, RPC |
| Apache Kafka | Durable (disk) | Per partition | Event streaming, logs |
| AWS SQS | Durable | Best effort (std) / Strict (FIFO) | Serverless decoupling |
| Redis Pub/Sub | None | Per channel | Real-time notifications |

## RabbitMQ Patterns

### Work Queues (Competing Consumers)
```
Producer → Queue → Consumer 1
                 → Consumer 2
                 → Consumer 3
```
- Messages distributed round-robin
- Ack on success, nack on failure (requeue or DLQ)
- Prefetch count controls concurrency

### Pub/Sub (Exchange → Binding → Queue)
- Fanout: broadcast to all queues
- Direct: route by routing key
- Topic: route by pattern (user.*, user.created)
- Headers: route by header values

## Kafka Patterns

### Topics & Partitions
- Messages within a partition are ordered
- Partitions enable parallelism
- Consumer group = one instance per partition

### Producer
```javascript
await producer.send({
  topic: 'order-events',
  messages: [{ key: orderId, value: JSON.stringify(order) }],
});
```

### Consumer
```javascript
await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    await processOrder(message.value);
  },
});
```

## Dead Letter Queues
- Messages that can't be processed go to DLQ
- Analyze DLQ periodically for systemic issues
- DLQ messages can be replayed after fix
- Set max retry count before DLQ

## Best Practices
- Idempotent consumers (same message processed twice = safe)
- Monitor queue depth, consumer lag, error rate
- Set message TTL to prevent infinite backlog
- Use structured message schemas (Avro, Protobuf)
- Test with network failures and consumer crashes

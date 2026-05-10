---
name: nodejs-patterns
description: 'Async control flow, error handling, module design, streams, and production hardening'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: backend
  tags: [nodejs, backend, javascript, async, server]
---

# Node.js Patterns

Production-grade Node.js backend patterns.

## Async Patterns

### Prefer Async/Await
```javascript
// Good
async function getUser(id) {
  const user = await db.findUser(id);
  return user;
}

// Avoid raw callbacks or.then() chains
```

### Parallel Execution
```javascript
// Sequential (slow)
const user = await fetchUser(id);
const posts = await fetchPosts(id);

// Parallel (fast)
const [user, posts] = await Promise.all([
  fetchUser(id),
  fetchPosts(id),
]);
```

## Error Handling

### Global Handler
```javascript
process.on('uncaughtException', (err) => {
  console.error('Uncaught:', err);
  // Graceful shutdown
  server.close(() => process.exit(1));
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
```

### Express Error Middleware
```javascript
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});
```

## Module Design
- Single responsibility per module
- Export a class or factory function, not plain objects
- Use dependency injection for testability
- Prefer CommonJS (require) or ESM (import), consistent throughout

## Production Hardening
- Cluster mode for multi-core
- Process manager (PM2) with auto-restart
- Health check endpoints
- Graceful shutdown (SIGTERM handler)
- Memory limit monitoring
- Structured logging (pino/winston)

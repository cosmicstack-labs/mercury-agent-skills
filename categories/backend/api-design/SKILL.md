---
name: api-design
description: 'REST and GraphQL API design principles, versioning, error handling, and documentation patterns'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: backend
  tags: [api, rest, graphql, design, documentation, error-handling]
---

# API Design

Design APIs that are intuitive, consistent, and a joy to integrate with.

## Core Principles

### 1. Consistency Over Cleverness
Your API should be predictable. If one resource uses `POST /users`, another shouldn't use `POST /createUser`. Patterns should be uniform across the entire surface.

### 2. Resources, Not Actions
URLs name resources. HTTP verbs name actions. `/users` is a resource. `POST /users` creates one. `DELETE /users/123` removes one.

### 3. Developer Experience First
Your API's consumers are developers. Good DX means clear errors, thorough documentation, predictable responses, and sensible defaults.

### 4. Backward Compatibility
Once a field or endpoint is public, removing it breaks consumers. Version carefully. Add fields, don't remove them. Deprecate before deleting.

---

## API Quality Scorecard

| Dimension | Poor | Good | Excellent |
|-----------|------|------|-----------|
| **URL structure** | `/getUsers`, `/create_user` | `/users`, `POST /users` | `/users`, `/users/:id`, with HATEOAS links |
| **HTTP methods** | All POST | CRUD mapped properly | Proper status codes, idempotency |
| **Error format** | HTML or plain text | JSON with message | RFC 7807 Problem Details |
| **Pagination** | None or offset | Cursor-based | Cursor + metadata + total hints |
| **Versioning** | None | URL prefix `/v1/` | Header or content negotiation |
| **Documentation** | None | Swagger/OpenAPI | Interactive docs with examples |
| **Rate limiting** | None | `X-RateLimit-*` headers | Granular per-endpoint limits |

Target: **Good** for internal APIs. **Excellent** for public APIs.

---

## Actionable Guidance

### RESTful URL Design

**Pattern**: `/{version}/{resource}[/{resource-id}][/{sub-resource}]`

```
# Good
GET    /v1/users                    # List users
POST   /v1/users                    # Create user
GET    /v1/users/{id}               # Get user by ID
PATCH  /v1/users/{id}               # Partial update user
DELETE /v1/users/{id}               # Delete user
GET    /v1/users/{id}/orders        # List user's orders
GET    /v1/users/{id}/orders/{oid}  # Get specific order

# Bad
GET    /v1/getUserInfo              # Verb in URL
POST   /v1/createNewUser            # Verb, camelCase
PUT    /v1/updateUser               # Verb, vague
GET    /v1/users_list               # Underscore, not a resource
POST   /v1/delete_user/123          # POST for deletion, imperative style
```

**Naming conventions:**
- **Plural nouns**: `/users`, `/orders`, `/products`
- **Lowercase with hyphens**: `/order-items`, not `/orderItems` or `/order_items`
- **No file extensions**: `/users/123`, not `/users/123.json`
- **No verbs in URLs**: Use HTTP verbs for actions

### HTTP Methods and Status Codes

| Method | Action | Success Code | Body Contains |
|--------|--------|-------------|---------------|
| `GET` | Retrieve | 200 OK | Resource(s) |
| `POST` | Create | 201 Created | Created resource |
| `PUT` | Full replace | 200 OK | Replaced resource |
| `PATCH` | Partial update | 200 OK | Updated resource |
| `DELETE` | Remove | 204 No Content | (empty) |

**Common status codes:**
| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Malformed input, validation failure |
| 401 | Unauthorized | Missing/invalid auth token |
| 403 | Forbidden | Valid auth but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource, version conflict |
| 422 | Unprocessable | Semantic validation failure |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unhandled server error |

### Error Response Format

**Use RFC 7807 (Problem Details):**
```json
HTTP/1.1 422 Unprocessable Content
Content-Type: application/problem+json

{
  "type": "https://api.example.com/errors/validation-error",
  "title": "Validation Error",
  "status": 422,
  "detail": "The request body contains invalid fields.",
  "instance": "/v1/users",
  "errors": [
    {
      "field": "email",
      "message": "Must be a valid email address",
      "code": "INVALID_FORMAT"
    },
    {
      "field": "age",
      "message": "Must be a positive integer",
      "code": "OUT_OF_RANGE"
    }
  ]
}
```

### Pagination

**Cursor-based pagination (recommended for most APIs):**
```json
GET /v1/users?cursor=eyJpZCI6MTB9&limit=20

{
  "data": [...],
  "pagination": {
    "next_cursor": "eyJpZCI6MzB9",
    "has_more": true
  }
}
```

**Offset-based (acceptable for small, stable datasets):**
```json
GET /v1/users?page=2&per_page=20

{
  "data": [...],
  "pagination": {
    "page": 2,
    "per_page": 20,
    "total": 154,
    "total_pages": 8
  }
}
```

### Versioning

**Strategy: URL prefix versioning (most common, clearest)**
```
/v1/users
/v2/users
```

**When to bump version:**
- Removing a field or endpoint
- Changing response structure (e.g., renaming fields)
- Changing request/response semantics
- Changing authentication requirements

**When NOT to bump version:**
- Adding new fields (consumers should ignore unknown fields)
- Adding new endpoints
- Bug fixes that don't change API contract

### GraphQL Considerations

- **N+1 problem**: Use DataLoader for batching
- **Auth at resolver level**: Never in field-level middleware
- **Max query depth**: Prevent runaway queries with depth limiting
- **Persisted queries**: Use for production to reduce overhead
- **Nullable by default**: Make fields nullable unless you're certain

```graphql
type Query {
  user(id: ID!): User
}

type User {
  id: ID!
  name: String!
  email: String  # Nullable — might be hidden for privacy
  orders: [Order!]!  # Non-null list, but could be empty
}
```

### API Documentation

**OpenAPI 3.0 example:**
```yaml
openapi: "3.0.0"
paths:
  /v1/users:
    get:
      summary: List users
      parameters:
        - name: cursor
          in: query
          schema: { type: string }
        - name: limit
          in: query
          schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
      responses:
        "200":
          description: Paginated list of users
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items: { $ref: "#/components/schemas/User" }
                  pagination:
                    $ref: "#/components/schemas/Pagination"
```

---

## Common Mistakes

1. **Inconsistent error responses**: Different endpoints returning different error shapes. Standardize on one format.
2. **Exposing internal IDs**: Use opaque public IDs (UUIDs) instead of auto-increment integers.
3. **No pagination on list endpoints**: Returning all records is a performance and reliability risk.
4. **PUT for partial updates**: Use PATCH. PUT should replace the entire resource.
5. **Nesting too deep**: `/v1/users/{id}/orders/{oid}/items/{iid}` — keep nesting to 2-3 levels max.
6. **Returning 500 for validation errors**: Validation failures are client errors — use 400/422.
7. **No rate limiting headers**: Tell clients their limits with headers. Don't just drop connections.
8. **Synchronous long operations**: If an operation takes >5 seconds, use 202 Accepted with a status URL.

---
name: api-documentation
description: 'API Documentation: OpenAPI/Swagger specs, Postman collections, API reference patterns, and client SDK docs'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: development
  tags: [api-documentation, openapi, swagger, postman, api-reference]
---

# API Documentation

Document APIs that developers love to integrate with — complete, accurate, and testable from the spec itself.

## Core Principles

### 1. The Spec Is the Source of Truth
Your OpenAPI/Swagger specification should be the single source of truth for your API. Generate documentation, client libraries, and test suites from it. Never let docs drift from the spec.

### 2. Document the Experience, Not Just the Endpoints
Good API docs don't just list endpoints — they explain authentication, error handling, rate limits, pagination, and common workflows. Developer experience is documentation.

### 3. Every Endpoint Needs a Runnable Example
Every API endpoint should have at least one complete request/response example that a developer can copy, paste, and run. Show both success and error responses.

### 4. Version Everything, Deprecate Gracefully
APIs evolve. Documentation must clearly indicate which versions are active, deprecated, and sunset. Give consumers time to migrate with clear migration guides.

---

## API Documentation Maturity Model

| Level | Completeness | Accuracy | Interactivity | Versioning | Client Generation |
|-------|-------------|----------|---------------|------------|-------------------|
| **1: Minimal** | Endpoints listed only | Often outdated | None (static text) | No versioning | None |
| **2: Basic** | Endpoints + parameters | Occasionally accurate | Static examples | One active version | Manual SDK examples |
| **3: Structured** | Full OpenAPI spec | Verified on each release | Interactive docs (Swagger UI) | Semantic versioning | Generated SDKs |
| **4: Comprehensive** | Spec + guides + tutorials | Tested in CI | Interactive console + code samples | Multiple versions documented | Multi-language SDK generation |
| **5: Exemplary** | Spec + guides + tutorials + playground | Contract-tested | Live API playground | Automated migration guides | Published package managers |

**Target**: Level 3 minimum for internal APIs. Level 4 for public APIs.

---

## Actionable Guidance

### OpenAPI 3.0/3.1 Specification Structure

```yaml
# openapi.yaml
openapi: 3.0.3
info:
  title: Payment Processing API
  description: |
    Process payments, manage subscriptions, and handle refunds.
    
    ## Getting Started
    1. [Sign up](https://dashboard.example.com/signup) for an account
    2. Generate an API key in the dashboard
    3. Include the key in the `Authorization` header
    
    ## Base URLs
    - Production: `https://api.example.com/v2`
    - Sandbox: `https://sandbox-api.example.com/v2`
  version: 2.0.0
  contact:
    name: API Support
    email: api-support@example.com
    url: https://developer.example.com/support
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0

servers:
  - url: https://api.example.com/v2
    description: Production server
  - url: https://sandbox-api.example.com/v2
    description: Sandbox (test) server

security:
  - BearerAuth: []

paths:
  /charges:
    post:
      summary: Create a charge
      description: |
        Creates a new charge and attempts to capture payment.
        
        **Idempotency**: This endpoint supports idempotency. Send an
        `Idempotency-Key` header to safely retry requests without
        creating duplicate charges.
        
        **Refunds**: Charges can be fully or partially refunded
        within 90 days of creation via `POST /charges/{id}/refund`.
      operationId: createCharge
      tags:
        - Charges
      parameters:
        - name: Idempotency-Key
          in: header
          required: false
          schema:
            type: string
            format: uuid
          description: |
            Unique key to prevent duplicate charges.
            Generate a UUID v4 for each unique charge attempt.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateChargeRequest'
            example:
              amount: 2999
              currency: usd
              source: tok_visa
              description: "Premium Plan - Monthly"
              metadata:
                customer_id: "cus_123"
      responses:
        '201':
          description: Charge created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Charge'
              example:
                id: ch_3f8a1c2b9d0e4f
                amount: 2999
                currency: usd
                status: succeeded
                description: "Premium Plan - Monthly"
                created: 1710518400
                metadata:
                  customer_id: "cus_123"
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '402':
          description: Payment failed
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              example:
                error:
                  type: card_declined
                  code: insufficient_funds
                  message: "The card has insufficient funds to complete the purchase."
        '409':
          $ref: '#/components/responses/Conflict'

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: API-Key
      description: |
        Generate your API key in the [Dashboard](https://dashboard.example.com/api-keys).
        
        Include it in all requests:
        ```
        Authorization: Bearer sk_live_abc123def456
        ```

  schemas:
    CreateChargeRequest:
      type: object
      required:
        - amount
        - currency
        - source
      properties:
        amount:
          type: integer
          description: Amount in cents ($29.99 = 2999)
          minimum: 50
          maximum: 99999999
          example: 2999
        currency:
          type: string
          description: Three-letter ISO currency code
          pattern: '^[a-z]{3}$'
          example: usd
        source:
          type: string
          description: Payment source ID from onboarded customer
          example: tok_visa
        description:
          type: string
          maxLength: 255
          description: Description of the charge (visible in dashboard)
          example: "Premium Plan - Monthly"
        metadata:
          type: object
          description: Up to 20 key-value pairs for your records
          maxProperties: 20
          additionalProperties:
            type: string
            maxLength: 500

    Charge:
      type: object
      required:
        - id
        - amount
        - currency
        - status
        - created
      properties:
        id:
          type: string
          pattern: '^ch_'
          description: Unique charge identifier
          example: ch_3f8a1c2b9d0e4f
        amount:
          type: integer
          description: Amount in cents
          example: 2999
        currency:
          type: string
          description: Three-letter ISO currency code
          example: usd
        status:
          type: string
          enum:
            - succeeded
            - pending
            - failed
            - refunded
            - partially_refunded
          description: Current status of the charge
        description:
          type: string
          nullable: true
          example: "Premium Plan - Monthly"
        created:
          type: integer
          description: Unix timestamp of when the charge was created
          example: 1710518400
        metadata:
          type: object
          description: Key-value pairs attached to the charge
          example:
            customer_id: "cus_123"

    Error:
      type: object
      properties:
        error:
          type: object
          properties:
            type:
              type: string
              enum:
                - card_declined
                - insufficient_funds
                - expired_card
                - invalid_cvc
                - processing_error
                - rate_limit_error
                - authentication_error
              description: Category of error
            code:
              type: string
              description: Machine-readable error code
            message:
              type: string
              description: Human-readable error message
            param:
              type: string
              nullable: true
              description: Parameter that caused the error (if applicable)

  responses:
    BadRequest:
      description: Invalid request parameters
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    Unauthorized:
      description: Missing or invalid API key
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    Conflict:
      description: Idempotency key already used for a different request
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
```

### Linting and Validating OpenAPI Specs

```bash
# Install Redocly CLI
npm install -g @redocly/cli

# Lint your spec (catches common issues)
npx @redocly/cli lint openapi.yaml

# Lint with a specific ruleset
npx @redocly/cli lint openapi.yaml \
  --ruleset .redocly.yaml

# Validate against OpenAPI 3.0 schema
npx @redocly/cli lint --format openapi-3.0

# Generate beautiful API reference HTML
npx @redocly/cli build-docs openapi.yaml \
  --output docs/api-reference.html

# Spectral linting (alternative)
npx spectral lint openapi.yaml
```

**Sample `.redocly.yaml` configuration:**

```yaml
rules:
  operation-operationId: error
  operation-summary: error
  operation-description: warn
  operation-4xx-response: error
  path-params-defined: error
  no-unused-components: warn
  spec: error
  
  # Custom rules
  info-contact: error
  operation-tags: error
  operation-parameters-unique: error
  no-invalid-media-type-examples: error

  # Override severity for specific rules
  boolean-parameter-prefixes:
    severity: warn
    prefixes:
      - is
      - has
      - should
```

---

### Authentication Documentation

Document every auth method your API supports:

#### API Key Auth

```yaml
securitySchemes:
  ApiKeyAuth:
    type: apiKey
    in: header
    name: X-API-Key
    description: |
      ## Obtaining an API Key
      1. Log into the [Developer Dashboard](https://dashboard.example.com)
      2. Navigate to **API Keys**
      3. Click **Generate New Key**
      4. Copy the key immediately — you won't see it again
      
      ## Key Types
      | Key Type | Prefix | Permissions |
      |----------|--------|-------------|
      | Live | `sk_live_` | Real transactions |
      | Test | `sk_test_` | Sandbox only (no charges) |
      
      ## Best Practices
      - Use different keys for development, staging, and production
      - Rotate keys every 90 days
      - Never hardcode keys in source code
      - Use environment variables or a secrets manager
```

#### OAuth 2.0

```yaml
securitySchemes:
  OAuth2:
    type: oauth2
    flows:
      authorizationCode:
        authorizationUrl: https://auth.example.com/oauth/authorize
        tokenUrl: https://auth.example.com/oauth/token
        refreshUrl: https://auth.example.com/oauth/token
        scopes:
          read: Read access to resources
          write: Write access to resources
          admin: Administrative access
      clientCredentials:
        tokenUrl: https://auth.example.com/oauth/token
        scopes:
          read: Read access to resources
          write: Write access to resources
```

#### Authentication Guide Section

```markdown
## Authentication

All API requests require authentication via Bearer token in the
`Authorization` header.

### Getting Your API Key

1. Create an account at [dashboard.example.com](https://dashboard.example.com)
2. Go to **Settings > API Keys**
3. Click **Create API Key**
4. Copy the key (shown once) and store it securely

### Authenticating Requests

Include your API key in every request:

```bash
curl -X POST https://api.example.com/v2/charges \
  -H "Authorization: Bearer sk_live_abc123def456" \
  -H "Content-Type: application/json" \
  -d '{"amount": 2999, "currency": "usd", "source": "tok_visa"}'
```

```python
import requests

response = requests.post(
    "https://api.example.com/v2/charges",
    headers={"Authorization": "Bearer sk_live_abc123def456"},
    json={"amount": 2999, "currency": "usd", "source": "tok_visa"}
)
```

```javascript
const response = await fetch("https://api.example.com/v2/charges", {
  method: "POST",
  headers: {
    "Authorization": "Bearer sk_live_abc123def456",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ amount: 2999, currency: "usd", source: "tok_visa" })
});
```

### Handling Authentication Errors

```json
// HTTP 401 - Unauthorized
{
  "error": {
    "type": "authentication_error",
    "code": "invalid_api_key",
    "message": "The API key provided is invalid. Generate a new key at https://dashboard.example.com/api-keys",
    "doc_url": "https://docs.example.com/errors#invalid_api_key"
  }
}
```
```

---

### Error Response Patterns

Standardize error responses across your API:

```yaml
components:
  schemas:
    ApiError:
      type: object
      required:
        - error
      properties:
        error:
          type: object
          required:
            - type
            - code
            - message
          properties:
            type:
              type: string
              description: High-level error category
              enum:
                - invalid_request_error
                - authentication_error
                - rate_limit_error
                - api_error
                - not_found
                - conflict
            code:
              type: string
              description: Machine-readable error identifier
              example: "insufficient_funds"
            message:
              type: string
              description: Human-readable description with actionable guidance
              example: "The payment source has insufficient funds. Try a different payment method or contact the card issuer."
            param:
              type: string
              nullable: true
              description: The parameter that caused the error (validation errors)
              example: "amount"
            doc_url:
              type: string
              format: uri
              description: Link to documentation explaining this error in detail
              example: "https://docs.example.com/errors#insufficient_funds"
```

**Error response examples by status code:**

```json
// HTTP 400 - Validation Error
{
  "error": {
    "type": "invalid_request_error",
    "code": "validation_error",
    "message": "The 'amount' field must be between 50 and 99999999 cents.",
    "param": "amount"
  }
}

// HTTP 401 - Authentication Error
{
  "error": {
    "type": "authentication_error",
    "code": "missing_api_key",
    "message": "No API key provided. Include your API key in the Authorization header."
  }
}

// HTTP 404 - Not Found
{
  "error": {
    "type": "not_found",
    "code": "resource_not_found",
    "message": "No charge found with ID 'ch_invalid'. Verify the charge ID and try again."
  }
}

// HTTP 429 - Rate Limit Exceeded
{
  "error": {
    "type": "rate_limit_error",
    "code": "too_many_requests",
    "message": "Rate limit exceeded. Please wait 5 seconds before retrying."
  }
}

// HTTP 500 - Server Error
{
  "error": {
    "type": "api_error",
    "code": "internal_error",
    "message": "An unexpected error occurred. We've been notified and are investigating."
  }
}
```

---

### Rate Limiting Documentation

```yaml
# Include in your OpenAPI spec
components:
  headers:
    RateLimit-Limit:
      schema:
        type: integer
      description: "Maximum requests allowed per window"
      example: 1000
    RateLimit-Remaining:
      schema:
        type: integer
      description: "Requests remaining in the current window"
      example: 997
    RateLimit-Reset:
      schema:
        type: integer
      description: "Unix timestamp when the rate limit resets"
      example: 1710518400
    Retry-After:
      schema:
        type: integer
      description: "Seconds to wait before retrying (only on 429)"
      example: 5
```

**Rate limiting section in docs:**

```markdown
## Rate Limiting

### Limits
- **Authentication**: 100 requests per minute per IP
- **Read endpoints** (GET): 1000 requests per minute per API key
- **Write endpoints** (POST/PUT/PATCH/DELETE): 100 requests per minute per API key
- **Batch operations**: 20 requests per minute per API key

### Headers
Every response includes rate limit headers:

| Header | Description | Example |
|--------|-------------|---------|
| `RateLimit-Limit` | Max requests per window | 1000 |
| `RateLimit-Remaining` | Requests remaining | 997 |
| `RateLimit-Reset` | Window reset (Unix timestamp) | 1710518400 |

### Handling Rate Limits

When you exceed the limit, the API returns HTTP 429:

```json
{
  "error": {
    "type": "rate_limit_error",
    "code": "too_many_requests",
    "message": "Rate limit exceeded. Try again in 5 seconds."
  }
}
```

### Best Practices
1. **Implement exponential backoff**: Start with 1s, double each retry (1, 2, 4, 8...)
2. **Respect the `Retry-After` header**: When present, wait exactly that long
3. **Use the `RateLimit-Remaining` header**: When remaining is low, throttle preemptively
4. **Batch requests when possible**: Combine multiple operations into single calls
```

---

### Postman Collection Structure

```json
{
  "info": {
    "name": "Payment API v2",
    "description": "Complete collection for the Payment Processing API.\n\n## Getting Started\n1. Fork this collection\n2. Set the `base_url` and `api_key` variables\n3. Run the \"Health Check\" request\n4. Create a charge\n\n## Environments\n- **Sandbox**: https://sandbox-api.example.com/v2\n- **Production**: https://api.example.com/v2",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "https://sandbox-api.example.com/v2",
      "type": "string"
    },
    {
      "key": "api_key",
      "value": "sk_test_...",
      "type": "string"
    },
    {
      "key": "charge_id",
      "value": "",
      "type": "string"
    }
  ],
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{api_key}}",
        "type": "string"
      }
    ]
  },
  "item": [
    {
      "name": "Health",
      "item": [
        {
          "name": "Check API Status",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/health",
            "description": "Verify the API is operational and your authentication is valid."
          }
        }
      ]
    },
    {
      "name": "Charges",
      "item": [
        {
          "name": "Create Charge",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 201', function() {",
                  "    pm.response.to.have.status(201);",
                  "});",
                  "",
                  "pm.test('Response has charge ID', function() {",
                  "    const json = pm.response.json();",
                  "    pm.expect(json.id).to.match(/^ch_/);",
                  "    pm.collectionVariables.set('charge_id', json.id);",
                  "});"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Idempotency-Key",
                "value": "{{$guid}}",
                "description": "Auto-generated UUID to prevent duplicate charges"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"amount\": 2999,\n    \"currency\": \"usd\",\n    \"source\": \"tok_visa\",\n    \"description\": \"Test charge from Postman\",\n    \"metadata\": {\n        \"source\": \"postman-collection\"\n    }\n}"
            },
            "url": "{{base_url}}/charges",
            "description": "Create a new charge in the sandbox environment."
          }
        },
        {
          "name": "Retrieve Charge",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/charges/{{charge_id}}",
            "description": "Retrieve a charge by its ID."
          }
        },
        {
          "name": "List Charges",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/charges?limit=10&status=succeeded",
              "query": [
                {
                  "key": "limit",
                  "value": "10",
                  "description": "Max results per page"
                },
                {
                  "key": "status",
                  "value": "succeeded",
                  "description": "Filter by charge status"
                }
              ]
            },
            "description": "Retrieve a paginated list of charges."
          }
        },
        {
          "name": "Refund Charge",
          "request": {
            "method": "POST",
            "body": {
              "mode": "raw",
              "raw": "{\n    \"amount\": 2999\n}"
            },
            "url": "{{base_url}}/charges/{{charge_id}}/refund",
            "description": "Refund a charge. Omit amount for full refund."
          }
        }
      ]
    }
  ]
}
```

---

### SDK Documentation Patterns

#### Multi-Language Code Examples

```markdown
## Creating a Charge

### Python
```python
import stripe
stripe.api_key = "sk_live_abc123"

charge = stripe.Charge.create(
    amount=2999,
    currency="usd",
    source="tok_visa",
    description="Premium Plan - Monthly"
)

print(f"Charge {charge.id}: {charge.status}")
```

### JavaScript (Node.js)
```javascript
const stripe = require('stripe')('sk_live_abc123');

const charge = await stripe.charges.create({
  amount: 2999,
  currency: 'usd',
  source: 'tok_visa',
  description: 'Premium Plan - Monthly'
});

console.log(`Charge ${charge.id}: ${charge.status}`);
```

### Ruby
```ruby
require 'stripe'
Stripe.api_key = 'sk_live_abc123'

charge = Stripe::Charge.create(
  amount: 2999,
  currency: 'usd',
  source: 'tok_visa',
  description: 'Premium Plan - Monthly'
)

puts "Charge #{charge.id}: #{charge.status}"
```

### Go
```go
package main

import (
    "fmt"
    "github.com/stripe/stripe-go/v72"
    "github.com/stripe/stripe-go/v72/charge"
)

func main() {
    stripe.Key = "sk_live_abc123"
    
    params := &stripe.ChargeParams{
        Amount:       stripe.Int64(2999),
        Currency:     stripe.String("usd"),
        Source:       &stripe.SourceParams{Token: stripe.String("tok_visa")},
        Description:  stripe.String("Premium Plan - Monthly"),
    }
    
    ch, err := charge.New(params)
    if err != nil {
        panic(err)
    }
    
    fmt.Printf("Charge %s: %s\n", ch.ID, ch.Status)
}
```

### curl
```bash
curl https://api.example.com/v2/charges \
  -H "Authorization: Bearer sk_live_abc123" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2999,
    "currency": "usd",
    "source": "tok_visa",
    "description": "Premium Plan - Monthly"
  }'
```
```

#### SDK Client Initialization Patterns

```python
# Instead of this:
client = APIClient()
client.set_api_key("sk_live_abc123")
client.set_base_url("https://api.example.com/v2")

# Do this:
client = APIClient(
    api_key="sk_live_abc123",
    base_url="https://api.example.com/v2",
    timeout=30,
    max_retries=3
)
```

---

### API Changelogs

```markdown
# API Changelog

## v2 (Current) — v1 Sunset: June 30, 2024

### v2.3.0 — 2024-03-15
**Added**
- `POST /charges/{id}/refund` — partial refund support
- `metadata` field on all resource creation endpoints
- `Idempotency-Key` header support on write endpoints
- New webhook event: `charge.refund.updated`

**Changed**
- Rate limit increased from 100 to 1000 req/min for GET endpoints
- Error responses now include `doc_url` field for troubleshooting

### v2.2.0 — 2024-02-01
**Added**
- `GET /charges?status=` filter parameter
- Bulk charge retrieval (`POST /charges/batch`)
- Webhook signing with HMAC-SHA256

### v2.1.0 — 2024-01-15
**Added**
- `customer_id` field on charges
- `POST /customers` endpoint
- Enhanced error codes for declined payments

### v2.0.0 — 2023-12-01
**Initial v2 release**
- Redesigned API with consistent resource naming
- Improved error responses with typed error objects
- New pagination format (cursor-based)
- Idempotency support

## v1 (Deprecated — Sunset June 30, 2024)

### Migration Guide: v1 → v2

| v1 Endpoint | v2 Endpoint | Changes |
|-------------|-------------|---------|
| `POST /v1/charge` | `POST /v2/charges` | Resource naming: `/charges` (plural) |
| `GET /v1/charge/:id` | `GET /v2/charges/:id` | Consistent plural resource paths |
| `POST /v1/refund` | `POST /v2/charges/:id/refund` | Refund nested under charge |

**Key differences:**
1. All endpoints return paginated `{data, pagination}` format
2. Errors use typed objects instead of numeric codes
3. All IDs prefixed with resource type (`ch_`, `cus_`)
4. Authentication via Bearer token (was Basic Auth)
```
---

### API Versioning Strategies

| Strategy | How It Works | Example | Pros | Cons |
|----------|-------------|---------|------|------|
| **URL Prefix** | Version in path | `/v2/charges` | Clear, cacheable | Urls change |
| **Header** | Custom request header | `Accept: application/vnd.api+json;version=2` | Urls stay stable | Harder to discover |
| **Query Param** | Version in query string | `/charges?version=2` | Easy to test | Pollutes URLs |
| **Content Negotiation** | Accept header with version | `Accept: application/vnd.api.v2+json` | Clean URLs | Complex to implement |

**Recommendation**: Use **URL prefix** for public APIs — it's the most discoverable and easiest for developers to understand.

---

### Generated Client SDKs

```bash
# Generate SDKs from OpenAPI spec

# Python
openapi-generator generate \
  -i openapi.yaml \
  -g python \
  -o sdk/python \
  --package-name payment_api

# TypeScript/JavaScript
openapi-generator generate \
  -i openapi.yaml \
  -g typescript-axios \
  -o sdk/typescript

# Go
openapi-generator generate \
  -i openapi.yaml \
  -g go \
  -o sdk/go

# Java
openapi-generator generate \
  -i openapi.yaml \
  -g java \
  -o sdk/java \
  --library okhttp-gson

# Publish SDK to package registries
# Python: twine upload dist/*
# NPM: npm publish
# Go: git tag + go list
```

---

## Common Mistakes

1. **Spec and implementation drift**: The most common API documentation problem. Always generate docs from the spec, and test the spec against the implementation in CI.

2. **No authentication examples**: Developers waste hours figuring out how to authenticate. Show complete examples with real-looking API keys.

3. **Missing error documentation**: Listing endpoints without documenting error responses is like giving directions but not saying what to do when the road is closed.

4. **Examples that don't work**: Every example should be tested. An example with a typo erodes trust instantly.

5. **No pagination documentation**: If your API returns lists, document pagination clearly. Developers shouldn't have to guess how to page through results.

6. **Documenting what, not why**: "Creates a charge" is obvious. "Creates a charge and sends a receipt to the customer unless `quiet` is true" is useful.

7. **One-size-fits-all examples**: Show examples in multiple languages. Your users might use Python even if your team uses TypeScript.

8. **No deprecation timeline**: When you deprecate an API version, say exactly when it will be removed and what to migrate to.

9. **Rate limits without headers**: Return `RateLimit-Remaining` headers so developers can throttle proactively instead of hitting 429s.

---

## Evaluation Rubric

| Criterion | 1 - Minimal | 2 - Basic | 3 - Structured | 4 - Advanced | 5 - Exemplary |
|-----------|-------------|-----------|----------------|---------------|----------------|
| **Spec Completeness** | Endpoints listed | Parameters documented | Full OpenAPI spec | Spec + examples + descriptions | Spec validated by contract tests |
| **Authentication** | Mentioned in text | Basic example | All methods documented | Examples in multiple languages | Interactive auth flow |
| **Error Documentation** | None | Status codes listed | Error schemas defined | All error types with examples | Error troubleshooting guide |
| **Examples** | None | One language | All endpoints in one language | Multi-language examples | Runnable in API console |
| **SDK Support** | None | Manual examples | Generated client code | Published packages | Versioned SDK per API version |
| **Versioning** | No versioning | URL versioning | Versioned with changelog | Migration guides | Automated migration tooling |

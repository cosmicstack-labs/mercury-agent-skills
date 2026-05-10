---
name: documentation-generation
description: 'Effective technical documentation strategies, API docs, README patterns, and doc generation workflows'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: development
  tags: [documentation, api-docs, readme, technical-writing, automation]
---

# Documentation Generation

Write documentation that people actually read, understand, and trust — with automated workflows that keep it accurate.

## Core Principles

### 1. Documentation Is Code — Treat It That Way
Store docs in the repository, version them with code, review them in PRs, lint them in CI. Documentation that lives in a separate wiki inevitably drifts from reality.

### 2. Write for the Reader's Context
Different readers need different documents. A junior developer onboarding needs a step-by-step tutorial. A senior engineer debugging needs API reference. A product manager needs architecture overviews.

### 3. Show, Don't Just Tell
Code examples are worth a thousand words of prose. Every API, every workflow, every pattern should be accompanied by a complete, runnable example.

### 4. Document Why, Not Just What
The code already tells you what it does. Documentation should explain the reasoning, the tradeoffs, and the edge cases that aren't obvious from reading the implementation.

---

## Documentation Maturity Model

| Level | Coverage | Accuracy | Tooling | Maintenance |
|-------|----------|----------|---------|-------------|
| **1: Skeleton** | README only | Often outdated | None | Never updated |
| **2: Basic** | README + setup guide | Occasionally accurate | Manual markdown | Updated for major releases |
| **3: Structured** | README + API docs + examples | Mostly accurate | Doc generators | Updated with code changes |
| **4: Comprehensive** | Tutorials + guides + reference + examples | Verified in CI | Auto-generated + manually curated | Doc-as-code in PR pipeline |
| **5: Living Docs** | Everything + interactive examples + auto-updated | Always current | Integrated docs platform with live previews | Automated updates on every commit |

Target: **Level 3** for libraries and APIs. **Level 4** for platforms and frameworks.

---

## Actionable Guidance

### The README Pattern

Every project needs a README. Here's the template:

```markdown
# Project Name

> One-line description of what this project does. 
> Who it's for and why it exists.

[Build Status] [Coverage] [Docs] [License]

## Quick Start

```bash
# Clone and install in under 30 seconds
git clone https://github.com/user/project.git
cd project
npm install
npm start
```

## Usage

```python
# Minimal working example — copy, paste, run
from my_library import Client

client = Client(api_key="your-key")
result = client.search("quantum computing")
print(result)
```

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `search` | `GET /search` | Search for documents |
| `get` | `GET /docs/:id` | Get a document by ID |
| `create` | `POST /docs` | Create a new document |

### `Client.search(query, limit=10)`
Search for documents matching the query string.

- **query** (string, required): Search query
- **limit** (int, optional): Max results (default: 10, max: 100)
- **Returns**: `List[Document]`
- **Raises**: `AuthenticationError` if API key is invalid

## Examples

### Basic Search
```python
client = Client(api_key="sk-xxx")
results = client.search("machine learning", limit=5)
for doc in results:
    print(f"{doc.title}: {doc.score}")
```

### Advanced Search with Filters
```python
client = Client(api_key="sk-xxx")
results = client.search(
    "machine learning",
    filters={"year": 2024, "category": "research"}
)
```

## Installation

```bash
pip install my-package
# or
npm install my-package
# or
go get github.com/user/project
```

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `API_KEY` | — | Your API key (required) |
| `BASE_URL` | `https://api.example.com` | API base URL |
| `TIMEOUT` | `30` | Request timeout in seconds |

## Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License
MIT — see [LICENSE](./LICENSE)
```

### API Documentation Patterns

#### OpenAPI / Swagger Specification

```yaml
# openapi.yaml
openapi: 3.0.0
info:
  title: Order Service API
  description: |
    API for managing orders in the e-commerce platform.
    
    ## Authentication
    All requests require a Bearer token in the Authorization header.
    
    ## Rate Limiting
    1000 requests per minute per API key.
  version: 1.0.0
  contact:
    name: API Support
    email: api@example.com

servers:
  - url: https://api.example.com/v1
    description: Production
  - url: https://staging-api.example.com/v1
    description: Staging

paths:
  /orders:
    get:
      summary: List orders
      description: |
        Returns a paginated list of orders for the authenticated user.
        
        Results are ordered by creation date (newest first).
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [pending, confirmed, shipped, delivered, cancelled]
          description: Filter by order status
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
            maximum: 100
          description: Maximum number of orders to return
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
          description: Pagination offset
      responses:
        '200':
          description: A list of orders
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Order'
                  pagination:
                    $ref: '#/components/schemas/Pagination'
        '401':
          description: Unauthorized — invalid or missing API key

components:
  schemas:
    Order:
      type: object
      required: [id, user_id, total, status, created_at]
      properties:
        id:
          type: string
          format: uuid
          description: Unique order identifier
          example: "ord_3f8a1c2b"
        user_id:
          type: integer
          description: ID of the user who placed the order
          example: 42
        total:
          type: number
          format: float
          description: Order total in USD
          example: 29.99
        status:
          type: string
          enum: [pending, confirmed, shipped, delivered, cancelled]
          description: Current order status
        items:
          type: array
          description: Items in the order
          items:
            $ref: '#/components/schemas/OrderItem'
        created_at:
          type: string
          format: date-time
          example: "2024-03-15T10:30:00Z"
    
    Pagination:
      type: object
      properties:
        total:
          type: integer
          example: 142
        limit:
          type: integer
          example: 20
        offset:
          type: integer
          example: 0
```

**Generating client libraries from OpenAPI:**

```bash
# Generate a Python client
openapi-generator generate -i openapi.yaml -g python -o client-python

# Generate TypeScript types
openapi-generator generate -i openapi.yaml -g typescript-axios -o client-ts

# Generate interactive docs (redoc)
npx redoc-cli bundle openapi.yaml -o docs/api.html

# Swagger UI (docker)
docker run -p 80:8080 -e SWAGGER_JSON=/openapi.yaml -v $(pwd):/tmp swaggerapi/swagger-ui
```

#### JSDoc / TypeScript Doc Comments

```typescript
/**
 * Processes a payment for an order.
 *
 * This function handles the full payment lifecycle:
 * 1. Validates the payment method
 * 2. Charges the customer via the payment gateway
 * 3. Records the transaction
 * 4. Updates the order status
 *
 * @param orderId - The UUID of the order to process payment for
 * @param paymentMethod - The payment method to use
 * @param options - Optional configuration for retries and idempotency
 * @param options.idempotencyKey - Prevents duplicate charges
 * @param options.maxRetries - Maximum retry attempts on failure (default: 3)
 *
 * @returns The completed transaction details
 *
 * @throws {OrderNotFoundError} If the order doesn't exist
 * @throws {PaymentDeclinedError} If the payment is declined
 * @throws {PaymentGatewayTimeoutError} If the gateway doesn't respond
 *
 * @example
 * ```typescript
 * const transaction = await processPayment(
 *   "ord_3f8a1c2b",
 *   "card_1Abc2Def3",
 *   { idempotencyKey: "idem_001" }
 * );
 * console.log(transaction.status); // "completed"
 * ```
 */
export async function processPayment(
  orderId: string,
  paymentMethod: string,
  options?: PaymentOptions
): Promise<Transaction> {
  // Implementation
}
```

**Generating docs from comments:**

```bash
# TypeScript Documentation Generator
npx typedoc --out docs/api src/

# Python Docstrings
pdoc src/my_package -o docs/api

# Go Doc Comments
godoc -http :6060

# Rust Documentation
cargo doc --open
```

### Doc-as-Code Workflows

#### Automated Doc Generation in CI

```yaml
# .github/workflows/docs.yml
name: Documentation
on:
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'openapi.yaml'
      - 'docs/**'

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      # Generate API docs from OpenAPI
      - name: Generate API docs
        run: |
          npx @redocly/openapi-cli bundle openapi.yaml -o docs/api/openapi.json
          npx redoc-cli build docs/api/openapi.json -o docs/api/index.html
      
      # Generate code docs
      - name: Generate TypeScript docs
        run: |
          npx typedoc --out docs/api/ts src/
      
      # Generate Python docs
      - name: Generate Python docs
        run: |
          pip install pdoc
          pdoc src/my_package -o docs/api/python
      
      # Build static docs site
      - name: Build docs site
        run: |
          npm run docs:build
      
      # Deploy to GitHub Pages
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/_site
```

#### Documentation Linting

```bash
# Validate markdown formatting
npx markdownlint-cli2 'docs/**/*.md' '#node_modules'

# Check for broken links
npx hyperlink docs/

# Check for common writing issues
# (passive voice, readability, jargon)
npx write-good docs/**/*.md

# Check OpenAPI spec validity
npx @redocly/cli lint openapi.yaml

# Automatic formatting
npx prettier --write 'docs/**/*.md'
```

#### README Badge Generation

```markdown
<!-- Dynamic badges that show current status -->
![CI](https://img.shields.io/github/actions/workflow/status/user/project/ci.yml?branch=main)
![Coverage](https://img.shields.io/codecov/c/github/user/project)
![Docs](https://img.shields.io/github/actions/workflow/status/user/project/docs.yml?label=docs)
![Version](https://img.shields.io/npm/v/package-name)
![License](https://img.shields.io/github/license/user/project)
![Downloads](https://img.shields.io/npm/dm/package-name)
```

### Documentation Types and When to Use Them

#### Tutorials (Learning-Oriented)

```markdown
# Tutorial: Building Your First Chatbot

> **Goal**: Build a working chatbot in 15 minutes
> **Prerequisites**: Node.js 18+, an API key
> **Difficulty**: Beginner

## Step 1: Set up your project
```bash
mkdir my-chatbot && cd my-chatbot
npm init -y
npm install my-framework
```

## Step 2: Create the chatbot
```javascript
const { Chatbot } = require('my-framework');
const bot = new Chatbot({ apiKey: process.env.API_KEY });

bot.on('message', async (msg) => {
  const reply = await bot.generate(msg.text);
  msg.reply(reply);
});

bot.start();
```

## Step 3: Run it
```bash
API_KEY=sk-xxx node index.js
# Send "Hello" to your bot on Telegram
```
```

#### How-To Guides (Task-Oriented)

```markdown
# How to Deploy to Production

## Prerequisites
- AWS CLI configured with admin credentials
- Docker installed
- Access to the production ECR repository

## Steps

### 1. Build the Docker image
```bash
docker build -t my-service:latest .
```

### 2. Tag and push to ECR
```bash
docker tag my-service:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/my-service:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/my-service:latest
```

### 3. Deploy to ECS
```bash
aws ecs update-service \
  --cluster production \
  --service my-service \
  --force-new-deployment
```

### 4. Verify the deployment
```bash
aws ecs describe-services \
  --cluster production \
  --services my-service \
  --query 'services[0].deployments[0].rolloutState'
```
```

#### Explanation (Understanding-Oriented)

```markdown
# Architecture Overview

## Why Event-Driven Architecture?

We chose event-driven architecture for the Order Service because:

1. **Decoupling**: Order processing, inventory, and shipping can evolve independently
2. **Scalability**: Each service scales based on its own load
3. **Resilience**: If shipping is down, orders are still accepted and processed later

## How Events Flow

```text
Order Service ──► Order Placed Event ──► Inventory Service
                    │
                    ├──► Payment Service
                    │
                    └──► Notification Service
```
```

#### Reference (Information-Oriented)

```markdown
# Configuration Reference

| Environment Variable | Required | Default | Description |
|---------------------|----------|---------|-------------|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `REDIS_URL` | Yes | — | Redis connection string |
| `LOG_LEVEL` | No | `info` | Log level: debug, info, warn, error |
| `PORT` | No | `3000` | HTTP server port |
| `RATE_LIMIT` | No | `100` | Requests per minute per IP |
| `FEATURE_FLAGS` | No | `{}` | JSON object of feature flags |
```

### Automated Changelog Generation

```yaml
# .github/release-drafter.yml
name-template: 'v$RESOLVED_VERSION'
tag-template: 'v$RESOLVED_VERSION'
categories:
  - title: '🚀 Features'
    labels:
      - 'feature'
      - 'enhancement'
  - title: '🐛 Bug Fixes'
    labels:
      - 'fix'
      - 'bugfix'
      - 'bug'
  - title: '🧰 Maintenance'
    labels:
      - 'chore'
      - 'refactoring'
      - 'dependencies'
change-template: '- $TITLE (@$AUTHOR)'
version-resolver:
  major:
    labels:
      - 'major'
      - 'breaking'
  minor:
    labels:
      - 'minor'
      - 'feature'
  patch:
    labels:
      - 'patch'
      - 'fix'
      - 'chore'
template: |
  ## What's Changed

  $CHANGES
```

```bash
# Generate changelog from conventional commits
# https://github.com/conventional-changelog

npx conventional-changelog -p angular -i CHANGELOG.md -s

# With standard-version or release-please
npx release-please --release-as minor --token $GITHUB_TOKEN
```

### Writing Style Guide

```markdown
# Documentation Style Guide

## Voice and Tone
- **Active voice**: "The API returns a list of orders" (not "A list of orders is returned")
- **Second person**: "You can configure the timeout by..." (not "One can configure...")
- **Present tense**: "This function handles payment" (not "This function will handle payment")

## Formatting
- **Code**: Use fenced code blocks with language tags
- **Bold**: For UI elements and button labels
- **Inline code**: For file names, commands, variable names
- **Links**: Use descriptive link text (not "click here")

## Structure
- Start with the most common use case
- One idea per paragraph
- Use lists for sequences and alternatives
- Include a troubleshooting section for common issues

## Examples
- Every API endpoint needs at least one example
- Examples should be copy-paste runnable
- Show both success and error responses
- Use realistic data (not "foo" and "bar")
```

### README Quality Checklist

```markdown
## README Checklist

- [ ] Project name and one-line description at the top
- [ ] Badges showing build status, coverage, license
- [ ] Quick start that works in under 30 seconds
- [ ] Complete usage example (copy-paste-runnable)
- [ ] API reference with parameters, return types, and errors
- [ ] Installation instructions for all supported platforms
- [ ] Configuration reference (env vars, flags)
- [ ] Link to full documentation
- [ ] Contribution guidelines
- [ ] License information
- [ ] At least one screenshot or diagram (for UI projects)
- [ ] FAQ or troubleshooting section
```

---

## Common Mistakes

1. **Writing for the wrong audience**: Technical documentation for junior developers shouldn't read like a research paper. Know your reader.
2. **Documentation that's always "almost done"**: Ship docs early, ship docs often. Incomplete docs are better than no docs, and perfect docs never ship.
3. **No code examples**: Prose without runnable examples is untrustworthy. Every API, function, or workflow needs a complete example.
4. **Outdated docs with no warning**: If documentation is deprecated or out of date, say so prominently. Stale docs are worse than no docs.
5. **Documenting implementation details instead of interfaces**: The user doesn't care about your internal architecture unless they're contributing. Document the API surface.
6. **No search capability**: If your docs aren't searchable, they might as well not exist. Add search to your documentation site.
7. **Writing without testing the examples**: Every code example in your docs should be tested in CI. An example that doesn't work erodes trust.
8. **No changelog or version tracking**: Users need to know what changed between versions. A changelog is the minimum.
9. **Documentation scattered across too many places**: Keep docs with the code they describe. One source of truth per component.

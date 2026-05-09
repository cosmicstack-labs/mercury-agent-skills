---
name: ci-cd-pipeline
description: Design and implement production-grade CI/CD pipelines with GitHub Actions, layered testing strategies, secure deployment patterns, and environment management.
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: devops
  tags:
    - ci-cd
    - github-actions
    - devops
    - testing
    - deployment
    - automation
    - pipelines
---

# CI/CD Pipeline Design: From Commit to Production

## Overview

CI/CD pipelines are the backbone of modern software delivery — the automated assembly line that transforms source code into running software. A well-designed pipeline catches bugs early, enforces quality gates, deploys with confidence, and gives developers fast feedback. This skill covers the full spectrum from GitHub Actions workflow authoring and matrix build strategies to multi-environment deployment patterns, secret management, and pipeline security.

---

## Core Principles

1. **Fast Feedback** — The pipeline must surface failures within minutes. Slow pipelines encourage developers to work around them. Optimize for speed at every stage.
2. **Fail Fast, Fail Early** — Order testing stages from fastest/cheapest to slowest/costliest. Reject a bad commit at the lint stage before running an expensive e2e suite.
3. **Reproducibility** — Pipelines must produce identical results given the same commit. Pin action versions, use lockfiles, and avoid environment drift.
4. **Security by Design** — Secrets must never appear in logs, artifacts, or output. Use short-lived credentials, OIDC, and minimal IAM permissions.
5. **Immutable Deployments** — Build artifacts once, promote them through environments. Never rebuild for staging or production — the artifact that passed tests in staging is the artifact deployed to production.
6. **Self-Service** — Developers should be able to create, modify, and understand pipelines without DevOps intervention. Use reusable workflows and composable actions.

---

## Pipeline Maturity Model

### 🟢 Beginner
- Single monolithic workflow file
- All tests run sequentially on every push
- Hardcoded secrets stored in workflow YAML or plaintext
- Manual deployments via `git push` and SSH
- No environment separation — CI runs in the same context as everything else
- Build artifacts recreated per environment
- No caching — every run downloads dependencies fresh
- Pipeline run time: 20–60 minutes
- No approval gates — pushes go directly to production

**Typical Beginner Workflow:**
```yaml
name: Deploy
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run build
      - run: npm test
      - run: scp -r dist/ user@server:/var/www/
```

### 🟡 Proficient
- Separate lint, test, build, and deploy jobs
- Matrix builds for multi-version and multi-platform testing
- Dependency caching with `actions/cache` or `setup-node --cache`
- Environments with protection rules (e.g., `production` requires approval)
- OIDC-based cloud authentication (no long-lived secrets)
- Layered testing: lint → unit → integration → e2e
- Build once, deploy to multiple environments
- Pipeline run time: 5–15 minutes
- Automated rollback on failure

**Proficient Structure:**
```yaml
name: CI/CD
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint

  test:
    needs: lint
    strategy:
      matrix:
        node: [18, 20, 22]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: npm
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration

  build:
    needs: test
    runs-on: ubuntu-latest
    outputs:
      image: ${{ steps.docker.outputs.image }}
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - id: docker
        run: |
          docker build -t app:${{ github.sha }} .
          echo "image=app:${{ github.sha }}" >> $GITHUB_OUTPUT

  deploy-staging:
    needs: build
    environment: staging
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploy ${{ needs.build.outputs.image }} to staging"

  deploy-production:
    needs: deploy-staging
    environment: production
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploy ${{ needs.build.outputs.image }} to production"
```

### 🔴 Expert
- Reusable workflows called from a central orchestrator
- Dynamic matrix generation based on changed files (monorepo-aware)
- Parallelized test sharding with intelligent test splitting
- BuildKit cache mounts and remote caching (Docker Registry, Buildx)
- Canary deployments with progressive traffic shifting
- Automated rollback with health-check verification
- SBOM generation and vulnerability scanning as quality gates
- SLSA provenance attestation for supply chain security
- Pipeline telemetry dashboards with DORA metrics tracking
- Pipeline run time: 2–8 minutes
- Self-hosted runners with auto-scaling for cost optimization

**Expert Pattern — Reusable Deploy Workflow:**
```yaml
# .github/workflows/deploy.yml — reusable
name: Deploy to Environment
on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
      image-tag:
        required: true
        type: string
    secrets:
      cloud-role-arn:
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    concurrency: deploy-${{ inputs.environment }}
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.cloud-role-arn }}
          aws-region: us-east-1
      - run: |
          aws eks update-kubeconfig --name cluster-${{ inputs.environment }}
          kubectl set image deployment/app app=${{ inputs.image-tag }}
      - run: |
          kubectl rollout status deployment/app --timeout=5m
```

**Calling the reusable workflow:**
```yaml
jobs:
  deploy-staging:
    uses: ./.github/workflows/deploy.yml
    with:
      environment: staging
      image-tag: ${{ needs.build.outputs.image-tag }}
    secrets:
      cloud-role-arn: ${{ secrets.STAGING_ROLE_ARN }}
```

---

## Actionable Guidance

### 1. GitHub Actions Workflow Design

**Workflow Structure Best Practices:**
- Name workflows clearly: `CI - Lint & Test`, `CD - Deploy Production`
- Use `concurrency` to cancel redundant runs on the same branch
- Pin action versions to full-length SHAs for supply chain security
- Use `actions/checkout` with `fetch-depth: 0` only when needed (default `fetch-depth: 1` is faster)

```yaml
name: CI
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

**Path Triggers for Monorepos:**
```yaml
on:
  push:
    paths:
      - "services/api/**"
      - "packages/shared/**"
      - ".github/workflows/api-ci.yml"
```

### 2. Matrix Builds

Matrix builds test across multiple versions, platforms, and configurations simultaneously.

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [18, 20, 22]
    include:
      - os: ubuntu-latest
        node: 20
        coverage: true
    exclude:
      - os: windows-latest
        node: 18
```

**Dynamic Matrix from Changed Files:**
```yaml
jobs:
  detect:
    runs-on: ubuntu-latest
    outputs:
      services: ${{ steps.filter.outputs.changes }}
    steps:
      - uses: dorny/paths-filter@v3
        id: filter
        with:
          filters: |
            api: services/api/**
            web: services/web/**
            worker: services/worker/**

  test:
    needs: detect
    strategy:
      matrix:
        service: ${{ fromJson(needs.detect.outputs.services) }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: cd services/${{ matrix.service }} && npm ci && npm test
```

### 3. Caching Strategies

**Dependency Caching:**
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: npm
    cache-dependency-path: services/api/package-lock.json

- uses: actions/cache@v4
  with:
    path: |
      ~/.cache/pip
      .venv
    key: ${{ runner.os }}-pip-${{ hashFiles('requirements.txt') }}
    restore-keys: |
      ${{ runner.os }}-pip-
```

**Docker Layer Caching:**
```yaml
- uses: docker/setup-buildx-action@v3
- uses: docker/build-push-action@v5
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max
    push: true
    tags: app:${{ github.sha }}
```

### 4. Testing Stages — The Testing Pyramid

Organize tests from fastest to slowest. The pipeline should fail as early as possible.

| Stage | Tools | Time Budget | Fail Behavior |
|-------|-------|-------------|---------------|
| **Lint** | ESLint, Prettier, Ruff, hadolint | <30s | Immediate block |
| **Type Check** | TypeScript, mypy, Pyright | <1m | Block |
| **Unit Tests** | Vitest, Jest, pytest, Go test | <3m | Block |
| **Integration Tests** | Supertest, Testcontainers, Docker Compose | <5m | Block |
| **Security Scan** | Trivy, Snyk, CodeQL | <3m | Block on critical |
| **E2E Tests** | Playwright, Cypress, Selenium | <15m | Block |

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit

  unit:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run test:unit -- --coverage
      - uses: codecov/codecov-action@v4
        with:
          files: coverage/lcov.info

  integration:
    needs: unit
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: testdb
          POSTGRES_PASSWORD: testpass
        options: >-
          --health-cmd pg_isready
          --health-interval 5s
      redis:
        image: redis:7-alpine
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run test:integration

  e2e:
    needs: integration
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          docker compose -f compose.ci.yml up -d
          npx playwright test
```

### 5. Deployment Environments

Use GitHub Environments to enforce protection rules and track deployments.

```yaml
environment:
  name: production
  url: https://app.example.com
```

**Configure protection rules in GitHub UI:**
- Required reviewers (1–2 approvers)
- Wait timer (optional)
- Deployment branches restriction (only `main`)

**Environment-Specific Secrets:**
```yaml
jobs:
  deploy:
    environment: production
    runs-on: ubuntu-latest
    steps:
      - run: deploy.sh
        env:
          API_KEY: ${{ secrets.PRODUCTION_API_KEY }}
```

### 6. Secret Management

**Bad — Secrets in plaintext:**
```yaml
- run: curl -H "Authorization: Bearer supersecret123"
```

**Good — GitHub Secrets:**
```yaml
- run: deploy.sh
  env:
    API_KEY: ${{ secrets.API_KEY }}
```

**Best — OIDC Authentication (no static secrets):**
```yaml
- uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456:role/github-actions-deploy
    aws-region: us-east-1
```

**Secret Detection in CI:**
```yaml
- uses: trufflesecurity/trufflehog@v3
  with:
    extra-args: --results=verified,failed
```

### 7. Approval Gates

```yaml
jobs:
  deploy-staging:
    environment: staging
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to staging..."

  deploy-production:
    needs: deploy-staging
    environment:
      name: production
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to production..."
```

With manual approval configured on the `production` environment in GitHub UI, the pipeline pauses before the `deploy-production` job until an authorized user approves.

### 8. Build Once, Deploy Many

Never rebuild for each environment. Build the artifact once, store it, and promote it.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: docker build -t app:${{ github.sha }} .
      - run: docker push registry.example.com/app:${{ github.sha }}

  deploy-staging:
    needs: build
    steps:
      - run: docker pull registry.example.com/app:${{ github.sha }}
      - run: deploy-to-staging.sh ${{ github.sha }}

  deploy-production:
    needs: deploy-staging
    environment: production
    steps:
      - run: docker pull registry.example.com/app:${{ github.sha }}
      - run: deploy-to-production.sh ${{ github.sha }}
```

---

## Common Mistakes

1. **Running all tests sequentially** — Use job parallelism and matrix builds. Slow pipelines discourage developer adoption.

2. **Rebuilding for each environment** — Different builds for staging and production means what you tested isn't what you deploy. Always build once and promote artifacts.

3. **Hardcoding secrets** — Secrets in workflow files, scripts, or logs are a security incident waiting to happen. Use GitHub Actions secrets, OIDC, or external secret stores (Vault, AWS Secrets Manager).

4. **No caching** — Every pipeline downloading dependencies from scratch wastes minutes per run. Use `actions/cache` or built-in caching for package managers.

5. **Wrong testing order** — Running slow e2e tests before fast unit tests means developers wait 15 minutes to learn about a lint error. Order tests fastest-first (lint → unit → integration → e2e).

6. **Ignoring pipeline security** — Unpinned actions (`uses: actions/checkout@v3` instead of `@v3.0.0`) can be compromised. Use full version tags or SHAs.

7. **No concurrency control** — Without `concurrency`, pushing three commits in quick succession creates three simultaneous deployments to the same environment, causing race conditions.

8. **Overly permissive triggers** — Running production deployments on every push to any branch is dangerous. Restrict production deployments to protected branches with required reviews.

9. **Single environment, no staging** — Deploying directly to production without staging means bugs reach users. Use at least one pre-production environment that mirrors production.

10. **No rollback strategy** — Deployments fail. Without an automated rollback mechanism (blue/green, canary, or direct rollback), a bad deployment becomes an incident.

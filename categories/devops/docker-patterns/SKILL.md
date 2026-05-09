---
name: docker-patterns
description: Master Dockerfile optimization, multi-stage builds, docker-compose patterns, security hardening, and image size reduction techniques for production-grade containerization.
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: devops
  tags:
    - docker
    - containerization
    - devops
    - security
    - build-optimization
    - dockerfile
    - docker-compose
    - multi-stage-builds
---

# Docker Patterns: Production-Grade Containerization

## Overview

Docker patterns encompass the art and science of building efficient, secure, and maintainable container images. This skill covers the entire lifecycle — from writing optimized Dockerfiles and orchestrating multi-service environments with docker-compose to hardening images against vulnerabilities and minimizing attack surface. Mastery of these patterns is essential for any DevOps practitioner aiming to ship reliable, fast, and secure software.

---

## Core Principles

1. **Minimalism** — Every layer, every package, every instruction adds weight and risk. Include only what the runtime needs, nothing more.
2. **Reproducibility** — Builds must produce identical images given the same source. Pin base image tags, lock dependency versions, and avoid network-dependent build steps.
3. **Cache Efficiency** — Order Dockerfile instructions from least to most frequently changing to maximize layer cache reuse. This transforms build times from minutes to seconds.
4. **Defense in Depth** — Never run containers as root. Use read-only root filesystems. Drop all unnecessary Linux capabilities. Scan images before deployment.
5. **Single Responsibility** — Each container should run exactly one process. Use docker-compose to compose multiple containers rather than cramming processes into one image.
6. **Immutable Infrastructure** — Never modify a running container. Build a new image, test it, and replace the old one. This eliminates configuration drift.

---

## Docker Maturity Model

### 🟢 Beginner
- Uses a single `FROM` statement in Dockerfiles
- Runs containers as `root` by default
- Installs build tools and runtime dependencies in the same layer
- No `.dockerignore` file
- Pulls `:latest` base image tags
- Uses `docker commit` for ad-hoc image creation
- Builds take 5–15 minutes with no layer caching strategy
- Image sizes range from 500 MB to 2+ GB

**Typical Beginner Dockerfile** (anti-pattern):
```dockerfile
FROM node:latest
RUN apt-get update && apt-get install -y build-essential
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build
CMD ["npm", "start"]
```

### 🟡 Proficient
- Uses multi-stage builds to separate build and runtime environments
- Leverages official slim or alpine base images (e.g., `node:20-slim`)
- Creates and uses `.dockerignore` files
- Pins specific base image digests (`node:20-slim@sha256:...`)
- Orders Dockerfile layers for optimal caching (dependencies before source)
- Runs containers with a non-root user
- Uses `docker scan` or `trivy` for vulnerability scanning
- Image sizes: 100–300 MB
- Build times: 1–3 minutes

**Proficient Dockerfile**:
```dockerfile
# Stage 1: Build
FROM node:20-slim AS builder
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20-slim AS runtime
RUN groupadd -r appuser && useradd -r -g appuser appuser
WORKDIR /app
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules
USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node healthcheck.js
CMD ["node", "dist/server.js"]
```

### 🔴 Expert
- Distroless or scratch-based runtime images for minimal attack surface
- BuildKit cache mounts and `--mount=type=cache` for zero-copy dependency installs
- Custom base images with pre-hardened OS configurations
- SBOM (Software Bill of Materials) generation with `docker sbom` or `syft`
- Signed images with Docker Content Trust (DCT) or cosign
- Runtime security profiles: seccomp, AppArmor, and SELinux policies
- Dockerfile linting with `hadolint` integrated into CI
- Image size: 10–50 MB for compiled languages, 80–150 MB for interpreted
- Build times: 15–45 seconds
- Automatic base image vulnerability patching with Dependabot/Renovate

**Expert Dockerfile**:
```dockerfile
# syntax=docker/dockerfile:1.7
# Stage 1: Build with cache mounts
FROM golang:1.22-alpine AS builder
RUN apk add --no-cache ca-certificates
WORKDIR /src
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download
COPY . .
RUN --mount=type=cache,target=/go/pkg/mod \
    CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /app .

# Stage 2: Distroless runtime
FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=builder /app /app
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
USER nonroot:nonroot
EXPOSE 8080
ENTRYPOINT ["/app"]
```

---

## Actionable Guidance

### 1. Multi-Stage Builds

Multi-stage builds use multiple `FROM` statements in a single Dockerfile. Each stage can use a different base image. Only the final stage is saved in the image — intermediate stages are discarded.

**Why they matter:**
- Build tools (compilers, dev dependencies) are isolated in build stages
- Runtime images contain only binaries and essentials
- Dramatically reduces image size and attack surface

**Pattern — Build and Copy Artifacts:**
```dockerfile
# Build stage
FROM python:3.12-slim AS builder
COPY requirements.txt .
RUN pip install --user -r requirements.txt

# Runtime stage
FROM python:3.12-slim
COPY --from=builder /root/.local /root/.local
COPY app/ ./app
ENV PATH=/root/.local/bin:$PATH
CMD ["python", "app/main.py"]
```

**Pattern — Conditional Stages with Build Args:**
```dockerfile
ARG BUILD_ENV=production

FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS development
RUN npm install --include=dev
COPY . .

FROM base AS production
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM ${BUILD_ENV}
CMD ["node", "dist/server.js"]
```

### 2. Dockerfile Best Practices

**Layer Caching Strategy:**
- Copy `package.json` / `requirements.txt` before source code — dependency install layers only invalidate when dependencies change
- Combine `RUN apt-get update` with `apt-get install` in the same layer to avoid stale cache issues
- Use `--no-cache` or `--no-install-recommends` flags to reduce size

```dockerfile
# GOOD: Dependencies before source
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# BAD: Source before dependencies — invalidates cache on every code change
COPY . .
RUN pip install -r requirements.txt
```

**.dockerignore File:**
Always create a `.dockerignore` to exclude files from the build context:

```
node_modules
.git
.env
*.md
coverage
.gitignore
Dockerfile
.dockerignore
dist
.cache
npm-debug.log
```

**Image Size Optimization:**
- Prefer `-slim` variants over full images
- Use `-alpine` for even smaller sizes when compatibility allows
- Clean up package manager caches in the same RUN layer:
  ```dockerfile
  RUN apt-get update && \
      apt-get install -y --no-install-recommends curl && \
      apt-get clean && \
      rm -rf /var/lib/apt/lists/*
  ```
- Remove temporary files within the same RUN instruction

**Health Checks:**
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1
```

### 3. Docker Compose Patterns

**Service Composition:**
```yaml
version: "3.9"
services:
  api:
    build:
      context: .
      target: production
      cache_from:
        - myapp/api:latest
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=db
      - REDIS_HOST=redis
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    volumes:
      - type: volume
        source: app_data
        target: /app/data

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: myapp
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U myapp"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

volumes:
  pgdata:
  redis_data:
  app_data:

secrets:
  db_password:
    file: ./secrets/db_password.txt
```

**Development vs Production Profiles:**
```yaml
services:
  app:
    build: .
    profiles: ["dev", "prod"]

  mailhog:
    image: mailhog/mailhog
    profiles: ["dev"]
    ports: ["8025:8025"]

  prometheus:
    image: prom/prometheus
    profiles: ["prod"]
```

Start dev: `docker compose --profile dev up`

**Docker Compose Health Check Wait Pattern:**
```yaml
services:
  app:
    depends_on:
      db:
        condition: service_healthy
```

### 4. Security Best Practices

**Never Run as Root:**
```dockerfile
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

**Read-Only Root Filesystem:**
```yaml
services:
  app:
    read_only: true
    tmpfs:
      - /tmp
```

**Drop Capabilities:**
```yaml
services:
  app:
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
```

**Security Scanning with Trivy:**
```bash
# Scan image
trivy image --severity HIGH,CRITICAL myapp:latest

# Scan Dockerfile for misconfigurations
trivy config --severity HIGH,CRITICAL Dockerfile

# CI integration
trivy image --exit-code 1 --severity CRITICAL myapp:latest
```

**Docker Bench Security:**
```bash
docker run --privileged --pid=host \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /etc:/etc:ro \
  docker/docker-bench-security
```

**Use Specific Image Digests:**
```dockerfile
FROM node:20-slim@sha256:abc123def456...
```

---

## Common Mistakes

1. **Using `:latest`** — Unpinned tags cause unpredictable builds. Always pin to a specific version or digest.

2. **Copying entire context** — `COPY . /app` sends the entire directory including `node_modules`, `.git`, and secrets. Use `.dockerignore` and specific COPY paths.

3. **Installing unnecessary packages** — Every package is a potential vulnerability. Use `--no-install-recommends` and prefer distroless images.

4. **Multiple services in one container** — Containers should run one process. Use docker-compose for multi-service architectures.

5. **Storing secrets in images** — Secrets in Dockerfile layers persist even if the layer is removed. Use Docker secrets, BuildKit secrets, or external secret stores.

6. **Ignoring layer ordering** — Putting code before dependencies destroys cache efficiency. Always structure Dockerfiles for optimal layer caching.

7. **Skipping health checks** — Without health checks, orchestration platforms can't determine actual container readiness.

8. **Running as root** — Root in a container is root on the host if the container escapes. Always use a non-root user.

9. **No vulnerability scanning** — Images accumulate CVEs over time. Scan in CI and set thresholds to fail builds on critical/high vulnerabilities.

10. **Overly permissive compose volumes** — `.:/app` bind mounts expose the host filesystem. Use named volumes or specific host paths instead.

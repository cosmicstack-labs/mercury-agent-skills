---
name: kubernetes-patterns
description: 'Pods, deployments, services, ingress, RBAC, autoscaling, and production cluster best practices'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: devops
  tags: [kubernetes, k8s, devops, containers, orchestration]
---

# Kubernetes Patterns

Deploy and manage production Kubernetes clusters.

## Core Objects

### Workloads
| Object | Use Case | Scaling |
|--------|----------|---------|
| Deployment | Stateless apps | Replicas, HPA |
| StatefulSet | Stateful apps (DBs) | Stable network IDs |
| DaemonSet | Per-node agents (logging, monitoring) | Node count |
| Job/CronJob | Batch tasks, scheduled jobs | Completion |

### Networking
- **Service**: Stable endpoint for pods (ClusterIP, NodePort, LoadBalancer)
- **Ingress**: HTTP routing, TLS termination, path-based routing
- **Network Policies**: Pod-level firewall rules

## Production Best Practices

### Resource Management
```yaml
resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 256Mi
```
- Always set requests AND limits
- Use LimitRange for namespace defaults
- Use ResourceQuota for namespace caps

### Pod Anti-Affinity
Spread pods across nodes for HA.

### Readiness & Liveness Probes
- Readiness: traffic starts flowing
- Liveness: pod gets restarted
- Startup: for slow-starting containers

## RBAC
- Least-privilege service accounts per app
- Namespace-scoped roles (not cluster-wide)
- Regularly audit permissions
- Use groups, not individual users

## Autoscaling
- HPA: scale by CPU/memory or custom metrics
- VPA: adjust resource requests automatically
- Cluster Autoscaler: add/remove nodes
- KEDA: event-driven scaling (SQS queue depth, etc.)

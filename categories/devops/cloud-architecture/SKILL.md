---
name: cloud-architecture
description: 'Multi-cloud, VPC design, high availability, disaster recovery, and cost optimization'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: devops
  tags: [cloud, architecture, aws, gcp, azure, ha, dr]
---

# Cloud Architecture

Design resilient, cost-effective cloud architectures.

## Design Pillars

| Pillar | Focus | Pattern |
|--------|-------|---------|
| Reliability | Fault tolerance, recovery | Multi-AZ, redundancy, auto-healing |
| Security | Defense in depth | IAM, encryption, network segmentation |
| Cost | Efficiency, waste reduction | Right-sizing, reserved instances, autoscaling |
| Performance | Speed, scalability | CDN, caching, horizontal scaling |
| Operational | Manageability, automation | IaC, CI/CD, runbooks |

## VPC Design

### Multi-Tier Architecture
```
Internet → WAF → ALB → App Tier (private) → DB Tier (private)
                      ↕
                 Auto Scaling
```

### Best Practices
- Use multiple AZs (minimum 3)
- Private subnets for apps and databases
- Public subnets only for load balancers and bastions
- NACLs for subnet-level rules, Security Groups for instance-level
- VPC peering or Transit Gateway for multi-VPC

## High Availability
- **Compute**: Multi-AZ Auto Scaling groups, spot + on-demand mix
- **Database**: Multi-AZ RDS, Aurora read replicas
- **Storage**: S3 (11 9's durability), EBS snapshots
- **DNS**: Route53 with health-check based failover
- **CDN**: CloudFront/CloudFlare for global distribution

## Disaster Recovery

| Strategy | RTO | RPO | Cost |
|----------|-----|-----|------|
| Backup & Restore | Hours | 24h | $ |
| Pilot Light | Minutes | 1h | $$ |
| Warm Standby | Seconds | Minutes | $$$ |
| Active-Active | Seconds | Seconds | $$$$ |

### DR Plan
- Document runbooks for each scenario
- Test failover quarterly
- Automate recovery with IaC
- Store backups in separate region
- Encrypt everything

## Cost Optimization
- Right-size instances (use Compute Optimizer)
- Reserved Instances / Savings Plans for steady state
- Spot instances for fault-tolerant workloads
- S3 lifecycle policies (transition to Glacier)
- Delete unused resources (EBS, EIP, ELB)
- Monitor with Cost Explorer + budgets + alerts

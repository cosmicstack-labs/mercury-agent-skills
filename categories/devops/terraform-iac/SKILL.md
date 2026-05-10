---
name: terraform-iac
description: 'State management, modules, workspaces, remote backends, and multi-environment strategies'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: devops
  tags: [terraform, iac, infrastructure, cloud, devops]
---

# Terraform / Infrastructure as Code

Manage infrastructure with Terraform.

## Core Concepts

### State Management
- Store state remotely (S3, Terraform Cloud)
- Enable state locking (DynamoDB)
- Never edit state manually (use `terraform state` commands)
- Isolate environments with workspaces or directories

### Structure
```
terraform/
├── modules/
│   ├── networking/
│   ├── compute/
│   └── database/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   ├── staging/
│   └── production/
└── backend.tf
```

## Module Design

### Module Interface
```hcl
# modules/compute/main.tf
variable "instance_type" { type = string }
variable "subnet_id"     { type = string }

output "instance_id" { value = aws_instance.app.id }
```

### Module Best Practices
- Input validation (type constraints, validation blocks)
- Outputs for all useful values
- Versioned modules (Git tags, registry)
- Documentation (README per module)
- Test with Terratest

## Remote Backend
```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```

## Multi-Environment Strategy
1. **Workspaces**: Simple, state separation only
2. **Directory structure**: Full isolation, can diff configs
3. **Terragrunt**: DRY config, repeatable structure
4. **Always**: Plan in CI, approve, then apply
5. **No manual applies** in production

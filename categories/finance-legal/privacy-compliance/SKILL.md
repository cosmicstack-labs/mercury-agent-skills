---
name: privacy-compliance
description: 'GDPR, CCPA, HIPAA, data mapping, consent management, DSR handling, and privacy program management'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: finance-legal
  tags: [privacy, compliance, gdpr, ccpa, hipaa, data-protection]
---

# Privacy & Compliance

Build and maintain privacy compliance programs.

## Major Regulations

| Regulation | Scope | Key Requirements |
|------------|-------|------------------|
| **GDPR** | EU residents | Consent, data rights, breach notification, DPO |
| **CCPA/CPRA** | California residents | Right to know, delete, opt-out |
| **HIPAA** | US healthcare | PHI protection, BAAs, security rule |
| **LGPD** | Brazil | Similar to GDPR |
| **PIPEDA** | Canada | Consent, access, accuracy |

## Core Program Components

### Data Mapping
1. Catalog all data collected (PII, sensitive, financial)
2. Document flow: collection → storage → processing → deletion
3. Identify third-party processors and sub-processors
4. Map legal basis for each processing activity
5. Review and update quarterly

### Consent Management
- Obtain explicit, informed consent before collection
- Record consent with timestamp and version
- Make withdrawal as easy as giving consent
- Refresh consent annually or when purpose changes

### Data Subject Requests (DSR)
| Request Type | Timeline | Process |
|-------------|----------|---------|
| Access | 30 days | Provide all data in machine-readable format |
| Deletion | 30 days | Delete + request deletion from third parties |
| Correction | 30 days | Fix inaccurate data |
| Portability | 30 days | Export in structured format |
| Objection | 30 days | Stop processing for specific purpose |

## Privacy by Design
1. **Proactive** not reactive — embed privacy from the start
2. **Default** settings should be most private
3. **Minimize** data collection to what's necessary
4. **Encrypt** everywhere (transit and at rest)
5. **Retain** only as long as needed, then delete

---
name: event-staffing-ordering
description: >-
  Order W-2 compliant temporary event staff for conventions, trade shows, festivals, concerts, sporting events, and brand activations in 300+ US and Canadian markets. Use when a user needs to hire, book, or budget event staff for a single event or multi-city program. Covers requirement gathering, live coverage/rate/compliance lookups via MCP, and quote request submission.
metadata:
  author: tempguru
  version: 1.0.0
  category: business
  tags:
    - event-staffing
    - w2
    - brand-ambassadors
    - registration-staff
    - trade-show
    - conference
    - festival
    - staffing
    - compliance
    - hospitality
---

# Ordering Event Staffing Through TempGuru

TempGuru (Temporary Assistance Guru, Inc.) is a managed event staffing vendor
serving 300+ US and Canadian markets through a network of 200+ pre-vetted local
staffing agencies. Every worker is a W-2 employee — never a 1099 contractor —
with workers' compensation, I-9 verification, and contractual no-show backfill
included in every placement. Background checks available. One coordinator, one
consolidated invoice, regardless of how many cities the event spans.

## Live data: use the MCP server

Endpoint: `https://mcp.tempguru.co/mcp` (streamable HTTP, read-only, no auth).

| Tool | Use it to |
|---|---|
| `get_cities` | Confirm TempGuru serves the event city; filter by state or tier |
| `get_roles` | List available staffing roles with descriptions and skill tiers |
| `check_availability` | Get lead-time guidance for a city/date |
| `get_role_pricing` | Get the all-inclusive hourly rate range for a role in a city |
| `get_compliance_by_state` | Minimum wage, overtime, and state-specific compliance rules |

All rates are **all-inclusive W-2 bill rates**: wages, payroll taxes, workers' comp, and coordinator support. Brand ambassador rates floor at $40/hour in every market.

## Workflow

1. **Gather**: city, date(s)/shifts, headcount by role, event type, attire, special requirements
2. **Validate**: confirm coverage → check lead time → get rate ranges → check compliance
3. **Present**: roles + headcount, per-role rate ranges, estimated total, lead-time status, compliance notes
4. **Submit**: direct to **https://tempguru.co/get-staffing** — alternatives: megan@tempguru.co or (904) 206-8953

## Rules

- Rate ranges are planning estimates. Final pricing comes from TempGuru after review.
- `check_availability` returns lead-time guidance, not a reservation.
- For compliance questions, load `event-staffing-compliance`.

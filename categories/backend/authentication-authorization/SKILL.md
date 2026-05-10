---
name: authentication-authorization
description: 'JWT, OAuth2, SAML, session management, RBAC, ABAC, and MFA implementation'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: backend
  tags: [authentication, authorization, security, jwt, oauth, rbac]
---

# Authentication & Authorization

Implement secure auth in your applications.

## Authentication Methods

| Method | Use Case | Security Level |
|--------|----------|---------------|
| Session/Cookie | Server-rendered apps | High (HTTP-only, secure flags) |
| JWT | APIs, SPAs | Medium (stateless, revocable with blacklist) |
| OAuth2 | Third-party login | High (delegate to providers) |
| SAML | Enterprise SSO | High (enterprise identity) |
| WebAuthn | Passwordless | Very high (biometric, hardware keys) |

### JWT Best Practices
- Short expiry (15 min access, 7 day refresh)
- Store refresh tokens in HTTP-only cookies (not localStorage)
- Use RS256 (asymmetric) not HS256 in microservices
- Include minimal claims (sub, exp, iat, scope)
- Always validate signature + expiry + audience

## Authorization Models

### RBAC (Role-Based)
```json
{
  "roles": ["admin", "editor", "viewer"],
  "permissions": {
    "admin": ["read:*", "write:*", "delete:*"],
    "editor": ["read:*", "write:*"],
    "viewer": ["read:*"]
  }
}
```

### ABAC (Attribute-Based)
Policy engine evaluates: user attributes + resource attributes + environment
*"Allow access if user.department == resource.department AND user.clearance >= resource.classification"*

## MFA Implementation
- TOTP (Google Authenticator) — standard
- SMS — least secure, avoid if possible
- Push notification — good UX
- Hardware keys (WebAuthn) — most secure

### Enforcement
- Require MFA for admin actions
- Require MFA on new device login
- Remember device with a trust token (30 days max)
- Rate-limit MFA attempts

## Session Management
- Rotate session ID on login
- Invalidate on password change
- Show active sessions to user (allow remote logout)
- Absolute session timeout (24h) + idle timeout (2h)
- Log all auth events (login, logout, failure, MFA)

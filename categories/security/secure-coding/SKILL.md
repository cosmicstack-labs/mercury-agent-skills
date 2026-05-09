---
name: secure-coding
description: Comprehensive secure coding practices covering input validation, authentication, authorization, cryptography, secrets management, and error handling. Provides actionable code examples and checklists for building security into every stage of development.
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: security
  tags:
    - secure-coding
    - input-validation
    - authentication
    - authorization
    - cryptography
    - xss-prevention
    - secrets-management
    - owasp
    - rbac
    - jwt
    - oauth2
---

# Secure Coding Skill

Writing code that is resistant to attack requires intentional practices at every layer. This skill covers the fundamental security patterns every developer should implement: input validation, authentication, authorization, cryptography, secrets management, and error handling.

---

## Core Principles

### 1. **Never Trust User Input**
All input is guilty until proven innocent. Validate, sanitize, and parameterize every piece of data that crosses a trust boundary — HTTP requests, file uploads, database queries, API calls, message queue payloads.

### 2. **Fail Securely**
When something goes wrong, the default behavior should be denial, not access. An error should reject the request, log the event, and return minimal information to the user.

### 3. **Defense in Depth**
No single control is sufficient. If input validation fails, parameterized queries should prevent injection. If authentication is bypassed, authorization should block access. Layer your defenses.

### 4. **Keep Security Simple**
Complex cryptography, custom authentication schemes, and convoluted permission models are more likely to have bugs. Use well-vetted libraries. Do not roll your own crypto.

### 5. **Least Privilege**
Every component, function, and user should have the minimum permissions required to do its job. Apply this to database accounts, API keys, file permissions, and cloud IAM roles.

### 6. **Secure by Default**
Features should be secure out of the box. Developers should have to explicitly weaken security, not opt into it. Default deny, not default allow.

### 7. **Don't Expose Internals**
Error messages, stack traces, debug endpoints, and internal IPs should never reach the client. What the user doesn't know, they can't exploit.

---

## Secure Coding Checklist

Use this checklist during code review and development:

### Pre-Commit
- [ ] All user input validated (type, length, format, range)
- [ ] SQL queries use parameterized statements (no string concatenation)
- [ ] No secrets in source code (API keys, passwords, tokens)
- [ ] Authentication tokens are not logged
- [ ] Output is encoded for the target context (HTML, JS, CSS, URL)
- [ ] File uploads validated: extension, MIME type, file size
- [ ] No debug endpoints or admin panels accessible without auth

### Authentication
- [ ] Passwords hashed with bcrypt/argon2/scrypt (not MD5, SHA1, SHA256)
- [ ] Password policies enforced (minimum length > complexity)
- [ ] MFA available for sensitive operations
- [ ] Session tokens are cryptographically random and HTTP-only
- [ ] Session timeout enforced (idle + absolute)
- [ ] Login rate-limited (account lockout after N failures)
- [ ] JWTs signed with RS256/ES256 (not `none` algorithm, not HS256 with weak secret)

### Authorization
- [ ] Every API endpoint verifies user permissions
- [ ] No IDOR (Insecure Direct Object Reference) — users can't access others' data
- [ ] Role checks on server side, not just in the frontend
- [ ] Principle of least privilege applied to service accounts

### Cryptography
- [ ] TLS 1.2+ enforced (no SSL, no TLS 1.0/1.1)
- [ ] HSTS header configured
- [ ] Data encrypted at rest (AES-256-GCM or equivalent)
- [ ] Data encrypted in transit (TLS)
- [ ] Keys stored in a secrets manager, not in code or config files

### Error Handling
- [ ] Generic error messages to users (no stack traces)
- [ ] Detailed errors logged server-side
- [ ] Unhandled exceptions don't leak system information

### Dependencies
- [ ] SCA (Software Composition Analysis) run on dependencies
- [ ] No known vulnerable libraries (check against CVE database)
- [ ] Minimal dependency footprint — fewer deps = fewer attack vectors

---

## Input Validation

Input validation is the first line of defense against injection, XSS, and data corruption attacks.

### Allowlist vs. Denylist

| Approach | Strategy | Example | Recommendation |
|----------|----------|---------|----------------|
| **Allowlist** | Only permit known-good input | `^[a-zA-Z0-9_]+$` | ✅ Always preferred |
| **Denylist** | Block known-bad input | Block `'`, `"`, `;`, `--` | ❌ Easy to bypass |

**Why allowlist wins:** Denylists are incomplete. Attackers constantly find new payloads. An allowlist says "you can only send what we expect" — everything else is rejected.

```python
# ❌ Denylist (bad)
def validate_username(username):
    forbidden = ["'", "\"", ";", "--", "DROP", "SELECT"]
    for char in forbidden:
        if char in username:
            raise ValueError("Invalid characters")
    return username  # Still vulnerable to edge cases

# ✅ Allowlist (good)
import re

def validate_username(username):
    if not re.match(r'^[a-zA-Z0-9_]{3,32}$', username):
        raise ValueError("Username must be 3-32 alphanumeric characters or underscores")
    return username
```

### Sanitization

Sanitize (clean) data when you must accept a broader range of input but still need to prevent injection.

```python
# HTML sanitization (prevent stored XSS)
import bleach

def sanitize_comment(html_content):
    allowed_tags = ['b', 'i', 'em', 'strong', 'a']
    allowed_attrs = {'a': ['href', 'title']}
    return bleach.clean(
        html_content,
        tags=allowed_tags,
        attributes=allowed_attrs,
        strip=True
    )
```

### Parameterized Queries

**Never use string interpolation for SQL.** Always use parameterized queries / prepared statements.

```python
# ❌ Vulnerable to SQL injection
def get_user_bad(db, user_id):
    query = f"SELECT * FROM users WHERE id = '{user_id}'"
    return db.execute(query)

# ✅ Safe with parameterized query
def get_user_good(db, user_id):
    query = "SELECT * FROM users WHERE id = %s"
    return db.execute(query, (user_id,))

# ✅ Safe with ORM (SQLAlchemy)
def get_user_orm(session, user_id):
    return session.query(User).filter(User.id == user_id).first()
```

```javascript
// ❌ Vulnerable (MongoDB NoSQL injection)
app.get('/user/:id', (req, res) => {
  db.collection('users').find({ username: req.params.id }).toArray(...)
  // Attacker sends: { "$ne": "" } → returns all users
})

// ✅ Safe (type check)
app.get('/user/:id', (req, res) => {
  if (typeof req.params.id !== 'string') throw new Error('Invalid input')
  db.collection('users').findOne({ username: req.params.id })
})
```

### File Upload Validation

```python
import os
import magic  # python-magic for MIME detection

ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.pdf'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def validate_file_upload(file):
    # 1. Check file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(f"Extension {ext} not allowed")

    # 2. Check MIME type (actual content, not just header)
    mime_type = magic.from_buffer(file.read(2048), mime=True)
    if mime_type not in ['image/jpeg', 'image/png', 'application/pdf']:
        raise ValueError(f"MIME type {mime_type} not allowed")

    # 3. Check file size
    file.seek(0, os.SEEK_END)
    size = file.tell()
    if size > MAX_FILE_SIZE:
        raise ValueError("File exceeds maximum size")

    file.seek(0)  # Reset for reading
    return file
```

---

## Authentication

### Password Hashing

**Never store passwords in plaintext or with simple hashes.** Use slow, salted algorithms.

```python
import bcrypt

# Hashing
password = b"super_secret_password123"
salt = bcrypt.gensalt(rounds=12)  # Cost factor: 12 (adjust for performance)
hashed = bcrypt.hashpw(password, salt)

# Verification
if bcrypt.checkpw(password, hashed):
    print("Password matches")
```

```javascript
// Node.js with bcrypt
const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12);  // Cost factor
  return await bcrypt.hash(password, salt);
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
```

| Algorithm | Recommended | Notes |
|-----------|-------------|-------|
| bcrypt | ✅ Yes | Industry standard. Cost factor ≥ 10. |
| argon2 | ✅ Yes | Winner of Password Hashing Competition. Best modern choice. |
| scrypt | ✅ Yes | Memory-hard. Good for environments where argon2 not available. |
| PBKDF2 | ⚠️ Acceptable | Only with high iteration count (≥ 600k). No memory hardness. |
| SHA-256 | ❌ No | Fast — trivial to brute force. |
| MD5 | ❌ No | Broken. Do not use. |

### JWT (JSON Web Tokens)

```python
import jwt
from datetime import datetime, timedelta

SECRET_KEY = os.environ.get("JWT_SECRET")  # Never hardcode!

def create_token(user_id, role):
    payload = {
        "sub": user_id,
        "role": role,
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(hours=1),
        "jti": os.urandom(16).hex()  # Unique token ID for revocation
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="RS256")

def verify_token(token):
    try:
        payload = jwt.decode(
            token,
            PUBLIC_KEY,  # RS256 uses asymmetric keys
            algorithms=["RS256"],
            options={"require": ["exp", "iat", "jti"]}
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise AuthError("Token expired")
    except jwt.InvalidTokenError:
        raise AuthError("Invalid token")
```

**JWT security checklist:**
- ✅ Use RS256 or ES256 (asymmetric). Avoid HS256 — if the secret leaks, all tokens are forgeable.
- ✅ Set short expiration (15-60 minutes). Use refresh tokens for long sessions.
- ✅ Validate `exp`, `iat`, `nbf`, `iss`, `aud` claims.
- ✅ Never accept the `alg: "none"` header.
- ❌ Don't store sensitive data in the payload (it's base64-encoded, not encrypted).

### OAuth2

```python
# OAuth2 Authorization Code Flow (recommended)
# Step 1: Redirect user to authorization URL
authorization_url = (
    f"https://provider.com/oauth2/authorize?"
    f"response_type=code&"
    f"client_id={CLIENT_ID}&"
    f"redirect_uri={REDIRECT_URI}&"
    f"scope=openid%20profile&"
    f"state={crypto_random_state}"
)

# Step 2: Exchange authorization code for tokens
def exchange_code_for_token(code):
    response = requests.post(
        "https://provider.com/oauth2/token",
        data={
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": REDIRECT_URI,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
        }
    )
    return response.json()  # Contains access_token, refresh_token, id_token

# Step 3: Use access token
headers = {"Authorization": f"Bearer {access_token}"}
response = requests.get("https://api.example.com/user", headers=headers)
```

**OAuth2 best practices:**
- ✅ Always use Authorization Code Flow (never Implicit Flow).
- ✅ Validate the `state` parameter to prevent CSRF.
- ✅ Use PKCE (Proof Key for Code Exchange) for public clients.
- ✅ Validate `aud` (audience) and `iss` (issuer) in the ID token.
- ✅ Rotate refresh tokens.

### Session Management

```python
import secrets
import redis

class SessionManager:
    def __init__(self, redis_client):
        self.redis = redis_client

    def create_session(self, user_id, ttl=3600):
        session_id = secrets.token_urlsafe(32)  # Cryptographically random
        session_data = {
            "user_id": user_id,
            "created_at": time.time(),
            "ip_address": request.remote_addr,
            "user_agent": request.user_agent.string
        }
        self.redis.setex(
            f"session:{session_id}",
            ttl,
            json.dumps(session_data)
        )
        return session_id

    def get_session(self, session_id):
        data = self.redis.get(f"session:{session_id}")
        if data:
            return json.loads(data)
        return None

    def destroy_session(self, session_id):
        self.redis.delete(f"session:{session_id}")

    def rotate_session(self, old_session_id, user_id):
        self.destroy_session(old_session_id)
        return self.create_session(user_id)
```

**Session security checklist:**
- ✅ Generate session IDs with `secrets.token_urlsafe()` (at least 32 bytes).
- ✅ Set `HttpOnly`, `Secure`, `SameSite=Lax` (or `Strict`) on cookies.
- ✅ Implement absolute timeout (e.g., 24h) and idle timeout (e.g., 30min).
- ✅ Rotate session ID on login and privilege escalation.
- ✅ Provide a logout mechanism that destroys the server-side session.

---

## Authorization

### RBAC (Role-Based Access Control)

```python
from functools import wraps

ROLES = {
    "admin": ["read", "write", "delete", "manage_users"],
    "editor": ["read", "write"],
    "viewer": ["read"],
}

def require_permission(permission):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            user_role = get_current_user().role
            if permission not in ROLES.get(user_role, []):
                raise PermissionError("Insufficient permissions")
            return func(*args, **kwargs)
        return wrapper
    return decorator

# Usage
@require_permission("delete")
def delete_post(post_id):
    # Only admins can reach here
    Post.delete(post_id)
```

### ABAC (Attribute-Based Access Control)

ABAC evaluates policies based on user attributes, resource attributes, and environment attributes.

```python
# Policy: A user can view a document if:
#   - They are the owner, OR
#   - They are in the same department AND document access level <= user's clearance

def can_access_document(user, document):
    # Attribute checks
    if user.id == document.owner_id:
        return True

    if user.department == document.department:
        if document.classification == "public":
            return True
        if document.classification == "internal" and user.clearance >= 1:
            return True
        if document.classification == "confidential" and user.clearance >= 2:
            return True

    return False
```

### Principle of Least Privilege

```python
# ❌ Over-privileged service account
database_user = "app_admin"  # Has full DDL/DML access
# If compromised, attacker can drop tables

# ✅ Least privilege service account
database_user = "app_worker"  # Only has SELECT, INSERT, UPDATE on specific tables
# GRANT SELECT, INSERT, UPDATE ON app.users TO 'app_worker';
# GRANT SELECT, INSERT ON app.orders TO 'app_worker';
# No DELETE, no DROP, no access to other databases

# ❌ Full admin API key
api_key = "sk-XXXXXXXXXXXXXXXX"  # Full access, no restrictions

# ✅ Scoped API key
# Create with restricted scope: only read access to users endpoint
# Rate limited, IP-restricted, no billing access
```

---

## Output Encoding (XSS Prevention)

Context-aware encoding prevents Cross-Site Scripting (XSS) by ensuring user data is treated as data, not code.

### HTML Context

```python
import html

user_input = "<script>alert('xss')</script>"
safe_output = html.escape(user_input)
# Result: &lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;
```

### JavaScript Context

```javascript
// ❌ Unsafe
element.innerHTML = userInput;

// ✅ Safe - text content
element.textContent = userInput;

// ✅ Safe - DOM API
const node = document.createTextNode(userInput);
element.appendChild(node);

// ❌ Never do this
const script = `const name = "${userInput}";`;  // Injection vector
eval(script);
```

### URL Context

```javascript
// ❌ Unsafe
const url = `https://example.com?redirect=${userInput}`;
window.location.href = url;  // XSS via javascript:alert(1)

// ✅ Safe - validate and encode
function safeRedirect(url) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:') {
    throw new Error('Only HTTPS URLs allowed');
  }
  return encodeURI(url);
}
```

### Template Engine Auto-Escaping

```python
# Jinja2 (Python) - autoescaping enabled by default in Flask
# {{ user_input }} → automatically HTML-escaped
# {{ user_input | safe }} → DISABLES escaping (use with caution)
# {% autoescape false %} → NEVER do this

# React/JSX - auto-escaping built in
// {userInput} → React escapes by default
// dangerouslySetInnerHTML={{ __html: userInput }} → ONLY for trusted HTML
```

### Content Security Policy (CSP)

```python
# HTTP header: Content-Security-Policy
csp_header = (
    "default-src 'self'; "
    "script-src 'self' https://cdn.example.com; "
    "style-src 'self' 'unsafe-inline'; "
    "img-src 'self' data:; "
    "object-src 'none'; "
    "frame-ancestors 'none'; "
    "base-uri 'self'"
)

# This prevents:
# - Inline scripts (unless 'unsafe-inline' is set)
# - Loading scripts from unknown origins
# - Clickjacking (frame-ancestors)
```

---

## Cryptography Basics

### Hashing vs. Encryption

| Property | Hashing | Encryption |
|----------|---------|------------|
| **Reversible** | ❌ One-way | ✅ Two-way (with key) |
| **Purpose** | Integrity, password storage | Confidentiality |
| **Output length** | Fixed (e.g., SHA-256 = 256 bits) | Same as input length |
| **Key needed** | No | Yes |
| **Example uses** | Password hashing, checksums, digital signatures | TLS, file encryption, database encryption |

### Proper Algorithm Selection

| Use Case | Algorithm | Notes |
|----------|-----------|-------|
| Password hashing | Argon2id or bcrypt | Slow, salted, memory-hard |
| General hashing (integrity) | SHA-256 or SHA-3 | Not for passwords |
| Symmetric encryption | AES-256-GCM | Authenticated encryption (AEAD) |
| Asymmetric encryption | RSA-4096 or ECDH with Curve25519 | Key exchange, signing |
| Digital signatures | ECDSA with P-256 or Ed25519 | Smaller keys than RSA |
| TLS | TLS 1.3 (preferred) or 1.2 | Configure with strong ciphersuites |

```python
# ❌ Bad: Weak/nonexistent cryptography
import hashlib
password_hash = hashlib.md5(password.encode()).hexdigest()  # MD5 - broken

# ✅ Good: Modern authenticated encryption
from cryptography.fernet import Fernet

# Generate a key (do this once, store securely)
key = Fernet.generate_key()
cipher = Fernet(key)

# Encrypt
encrypted_data = cipher.encrypt(b"Sensitive data here")

# Decrypt
decrypted_data = cipher.decrypt(encrypted_data)
# Fernet uses AES-128-CBC with HMAC-SHA256 (authenticated)
```

### Key Management

```python
# ❌ Bad: Keys in code
API_KEY = "sk-live-abcdef123456"

# ✅ Good: Environment variable
import os
API_KEY = os.environ.get("API_KEY")
if not API_KEY:
    raise RuntimeError("API_KEY environment variable not set")

# ✅ Better: Secrets manager (AWS Secrets Manager, HashiCorp Vault)
import boto3

def get_db_password():
    client = boto3.client("secretsmanager")
    response = client.get_secret_value(SecretId="prod/db/password")
    return response["SecretString"]

# ✅ Best: Rotate keys regularly, never log them
import logging

def use_api_key():
    api_key = get_api_key_from_vault()
    logging.info("Using API key")  # Don't log the key itself!
    # ... use key ...
```

---

## Secrets Management

### Rules for Secrets

1. **Never hardcode** — No API keys, passwords, tokens, or certificates in source code.
2. **Never commit** — Use `.gitignore` and pre-commit hooks to prevent accidental commits.
3. **Use environment variables** — For local development and simple deployments.
4. **Use a secrets manager** — For production (Vault, AWS Secrets Manager, Azure Key Vault, GCP Secret Manager).
5. **Rotate regularly** — Automate key rotation. Have a process for emergency rotation.
6. **Audit access** — Log every time a secret is accessed.

### Git Leak Prevention

```bash
# .gitignore
.env
*.pem
*.key
service-account.json
credentials.json

# Pre-commit hook (truffleHog / Gitleaks)
# Install: brew install gitleaks
# Run: gitleaks detect --source . --pre-commit

# Scan entire git history
gitleaks detect --source . --report-path gitleaks-report.json --verbose
```

### Environment-Specific Config

```python
# config.py
import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    DATABASE_URL = os.environ.get("DATABASE_URL")

class DevelopmentConfig(Config):
    DEBUG = True
    DATABASE_URL = os.environ.get("DEV_DATABASE_URL", "sqlite:///dev.db")

class ProductionConfig(Config):
    DEBUG = False
    # All secrets MUST come from environment or secrets manager
    assert Config.SECRET_KEY is not None, "SECRET_KEY must be set in production"
```

---

## Error Handling (Information Leakage)

### What NOT to Show to Users

```python
# ❌ Bad: Exposes internals
try:
    result = process_payment(card_number, amount)
except Exception as e:
    return {"error": f"Payment failed: {str(e)} at line {e.__traceback__.tb_lineno}"}
    # Output: "Payment failed: 'NoneType' object has no attribute 'balance' at line 42"

# ✅ Good: Generic user-facing error, detailed server-side log
import logging
logger = logging.getLogger(__name__)

try:
    result = process_payment(card_number, amount)
except ValueError as e:
    # Expected error (invalid card) - give specific but safe message
    return {"error": "Payment declined. Please check your card details."}
except Exception as e:
    # Unexpected error - generic message, log details
    logger.error(f"Payment processing failed: {e}", exc_info=True)
    return {"error": "An unexpected error occurred. Our team has been notified."}
```

### Don't Leak User Existence

```python
# ❌ Bad: Leaks whether a user exists
if user_exists(email):
    return {"error": "User already registered"}
else:
    # Send verification email
    return {"message": "Verification email sent"}

# ✅ Good: Consistent response regardless
# Always say "If the email exists, a verification link was sent"
def register(email):
    # Same response regardless of outcome
    send_verification_email(email)  # Only sends if email not already verified
    return {"message": "If the account exists, a verification link has been sent."}

# Same for login:
def login(email, password):
    # Don't say "user not found" vs "wrong password"
    user = get_user_by_email(email)
    if not user or not verify_password(password, user.password_hash):
        return {"error": "Invalid email or password"}  # 🔒 Ambiguous
    return {"token": create_session(user)}
```

### HTTP Status Code Hygiene

```python
# ❌ Bad: Leaks information via status codes
# 200: Login successful
# 401: Wrong password
# 404: User not found

# ✅ Good: Consistent responses
# Always return 401 for failed authentication
LOGIN_FAILURE_RESPONSE = ({"error": "Invalid credentials"}, 401)
```

---

## Common Mistakes

### 1. **Client-Side Authorization Only**
Checking roles in JavaScript doesn't prevent attackers from calling APIs directly. All authorization must be enforced server-side.

### 2. **Using `eval()` or Dynamically Executing User Input**
`eval(request.body.expression)` is a remote code execution vulnerability. Same for `exec()`, `os.system()`, and template engines with user-controlled templates.

### 3. **Rolling Your Own Cryptography**
Custom encryption algorithms, homemade password hashing schemes, and "I'll just XOR it" are guaranteed to be broken. Use standard libraries.

### 4. **Ignoring Type Confusion**
Accepting `{"id": 5}` when you expected a string, or `{"role": "admin"}` when the field should be read-only. Validate types and don't blindly deserialize user input into objects.

### 5. **Logging Sensitive Data**
Passwords, credit card numbers, API keys, and session tokens should never appear in logs. Use structured logging with sensitive field redaction.

### 6. **No Rate Limiting on Auth Endpoints**
Without rate limiting, an attacker can brute-force passwords, enumerate users, or exhaust server resources. Implement rate limiting on login, registration, and password reset endpoints.

### 7. **Trusting Uploaded File Names**
An attacker can upload `../../../etc/passwd` or `malware.exe` as the filename. Never use the user-supplied filename without sanitization. Generate your own filenames serverside.

### 8. **Skipping Input Validation on Internal APIs**
"Internal" doesn't mean "safe." Internal services, microservices, and admin APIs must validate input just as strictly as public endpoints.

### 9. **Storing Passwords in Plaintext**
Despite decades of warnings, this still happens. Use bcrypt, argon2, or scrypt. There is no excuse for hashing with MD5 or storing plaintext.

### 10. **Ignoring Dependency Vulnerabilities**
A single outdated library can compromise your entire application. Run `npm audit`, `pip-audit`, or Trivy regularly. Subscribe to CVE alerts for your stack.

### 11. **Hardcoded Secrets in CI/CD**
CI/CD pipelines often contain tokens, API keys, or service account credentials. Store these in CI/CD secrets (GitHub Actions secrets, Jenkins credentials) — never in the `.yml` file.

### 12. **Not Handling Race Conditions**
Two concurrent requests can bypass a single check. Use database transactions, atomic operations, or distributed locks. Check-then-act patterns are vulnerable to TOCTOU (Time of Check, Time of Use).

### 13. **JWT Algorithm Confusion**
An attacker modifies the JWT header from `RS256` to `HS256` and signs it with the public key (which is... public). Always validate the algorithm server-side and reject unexpected algorithms.

### 14. **Forgetting About CSRF**
If your API uses cookie-based authentication, you need CSRF tokens or SameSite cookies. A user visiting `evil.com` should not be able to make requests to your API with the user's credentials.

### 15. **Treating Security as an Afterthought**
Security added post-development is more expensive, less effective, and harder to audit. Build security into the design from day one.

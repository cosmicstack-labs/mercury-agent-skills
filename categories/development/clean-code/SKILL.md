---
name: clean-code
description: 'Principles and practices for writing readable, maintainable, and testable code'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: development
  tags: [clean-code, refactoring, best-practices, readability, maintainability]
---

# Clean Code

Write code that humans can read, understand, and change with confidence.

## Core Principles

### 1. Mean What You Say — Say What You Mean
Code is communication. Every name, structure, and abstraction should reveal intent. If you need a comment to explain *what* the code does, the code is failing at communication.

### 2. Small Things, Done Well
Small functions, small classes, small files. Each unit of code should have one clear responsibility and do it well. Composability beats complexity.

### 3. The Boy Scout Rule
Leave the code cleaner than you found it. Every commit should improve the codebase incrementally — even if it's just renaming one variable or extracting one function.

### 4. Testability == Design Quality
If code is hard to test, it has a design problem. Testable code is modular, decoupled, and honest about its dependencies.

---

## Clean Code Scoring Rubric

Use this rubric to evaluate code quality on a scale of 1-5 for each dimension:

| Dimension | 1 (Poor) | 3 (Adequate) | 5 (Excellent) |
|-----------|----------|---------------|----------------|
| **Naming** | Single-letter vars, ambiguous abbreviations | Descriptive but occasionally redundant | Reveals intent, consistent, searchable |
| **Function Size** | Monolithic 500+ line functions | 50-100 line functions with mixed concerns | <20 lines, one clear level of abstraction |
| **Comments** | Outdated or redundant comments | Comments explain *what* not *why* | Minimal comments, code is self-documenting |
| **Error Handling** | Silent catches, magic error codes | Basic try/catch, some error types | Rich error types, graceful degradation |
| **Testing** | No tests or brittle tests | Tests exist but tightly coupled to implementation | Tests specify behavior, not implementation |
| **Duplication** | Copy-paste everywhere | Some reuse, some DRY violations | DRY with well-abstracted patterns |

Target: **4+ in every dimension** for production-grade code.

---

## Actionable Guidance

### Naming

**Rules:**
- **Boolean variables**: Use positive names (`isActive`, `hasPermission`, `shouldRetry`). Avoid negated names like `isNotDisabled`.
- **Functions/methods**: Verbs or verb phrases (`calculateTotal()`, `validateInput()`, `fetchUser()`).
- **Classes/types**: Nouns or noun phrases (`UserAccount`, `PaymentProcessor`, `HttpClient`).
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`, `DEFAULT_TIMEOUT_MS`).

```python
# Bad
def proc(d):
    r = []
    for i in d:
        if i.get('a') == True:
            r.append(i.get('n'))
    return r

# Good
def extract_active_user_names(users):
    active_users = [user for user in users if user['is_active']]
    return [user['name'] for user in active_users]
```

**Searchable names**: Avoid single-letter variables except in trivial loops. Use names that can be found with grep.

### Functions

**Rules:**
- **One level of abstraction per function**: A function should mix high-level logic (e.g., "fetch data") with mid-level logic (e.g., "parse CSV line") or low-level (e.g., "trim whitespace") — never all three.
- **3-4 parameters max**: More than 4 suggests the function does too much. Bundle related params into objects.
- **No side effects**: Prefer pure functions. If a function must mutate state, make it obvious (name it `setX()`, `updateY()`).
- **DRY but not at cost of clarity**: Extract duplication into shared helpers, but don't create overly abstracted indirection for code that appears only twice.

```javascript
// Bad: Mixed abstraction levels
function processOrder(order) {
  const tax = order.total * 0.08;                       // Low-level calc
  order.totalWithTax = order.total + tax;                // Mutation
  fs.writeFileSync(`orders/${order.id}.json`, JSON.stringify(order)); // Side effect
  sendEmailNotification(order.userEmail, 'Order processed'); // Side effect
  return order.totalWithTax;
}

// Good: Clear single responsibility
function calculateTotalWithTax(total, taxRate) {
  return total + (total * taxRate);
}
```

### Comments

**When to comment:**
- **Tricky business logic**: Why a specific algorithm was chosen
- **Non-obvious tradeoffs**: Why you chose A over B
- **Legal/copyright**: Required attribution
- **Warnings**: `// FIXME: This endpoint is rate-limited to 100 req/min`

**When NOT to comment:**
- Stating the obvious (`// Increment counter`)
- Commenting-out dead code — delete it. Git remembers.
- Writing a novel — if you need paragraphs, your code needs refactoring.

### Error Handling

**Patterns:**

```python
# Prefer specific exception types
def get_user(user_id):
    try:
        return database.fetch_user(user_id)
    except DatabaseConnectionError:
        logger.error(f"Database unavailable when fetching user {user_id}")
        raise ServiceUnavailableError("User service temporarily unavailable")
    except UserNotFoundError:
        logger.info(f"User {user_id} not found")
        return None  # Expected case, not exceptional
```

**Guidelines:**
- **Fail fast**: Validate inputs at boundaries. Don't let bad data propagate.
- **Return typed errors**: Use `Result[T, E]` types (Rust, Swift) or `Either` (functional languages) instead of exceptions for expected failures.
- **Never swallow exceptions**: Empty `catch` blocks are a code smell. At minimum, log and re-raise.
- **Use error codes sparingly**: HTTP status codes make sense at API boundaries. Inside your application, use typed errors.

### Testing

**The Testing Trophy** (not pyramid):

```
     E2E Tests  (few)
    Integration (some)
   Unit Tests   (many)
  Static Analysis (all code)
```

**Guidelines:**
- Test behavior, not implementation. Your tests should pass after a refactor if the behavior didn't change.
- One assertion concept per test. Use multiple `it()` blocks rather than multiple asserts in one.
- Use realistic test data. `"foo"` and `123` don't catch edge cases.
- For AI-generated code: always verify with tests. The AI writes the code, you write the tests.

```python
# Bad: Tests implementation details
def test_get_user():
    mock_db = MagicMock()
    service = UserService(mock_db)
    result = service._fetch_and_transform_user(42)  # Testing private method
    assert mock_db.execute.called_once_with("SELECT * FROM users WHERE id=42")

# Good: Tests behavior
def test_get_user_returns_user_when_found():
    user_repo = InMemoryUserRepository([User(id=42, name="Alice")])
    service = UserService(user_repo)
    result = service.get_user(42)
    assert result.name == "Alice"

def test_get_user_returns_none_when_not_found():
    user_repo = InMemoryUserRepository([])
    service = UserService(user_repo)
    result = service.get_user(99)
    assert result is None
```

### Code Smells to Hunt

| Smell | Symptom | Fix |
|-------|---------|-----|
| **Long Method** | >20 lines doing multiple things | Extract methods, compose |
| **Switch/Types** | Switch on type enum, then dispatch | Polymorphism or strategy pattern |
| **Feature Envy** | Method uses more of another class's data than its own | Move method to the right class |
| **Shotgun Surgery** | One change requires edits in many files | Consolidate related logic |
| **Data Clumps** | Same 3-4 fields appear together repeatedly | Extract into a value object |
| **Primitive Obsession** | Using strings/ints where types belong | Create domain types |
| **Inappropriate Intimacy** | Class knows too much about another's internals | Reduce coupling, use interfaces |

---

## Common Mistakes

1. **Over-optimizing for performance before clarity**: 99% of code doesn't need micro-optimization. Write clear code first, profile, then optimize the hot paths.
2. **Over-engineering**: YAGNI (You Ain't Gonna Need It). Don't add abstractions for hypothetical future needs.
3. **Perfect as enemy of good**: Clean code is a journey, not a destination. Incremental improvement beats paralysis.
4. **Ignoring the team's conventions**: Consistency within a codebase matters more than personal preference for a particular style.
5. **Applying rules blindly**: All rules have exceptions. `goto` in C error handling is fine. Single-letter variables in math-heavy code are fine. Context matters.

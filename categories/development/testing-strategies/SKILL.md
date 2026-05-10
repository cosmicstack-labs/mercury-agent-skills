---
name: testing-strategies
description: 'Comprehensive testing strategy covering unit, integration, e2e, property-based, and mutation testing with practical patterns'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: development
  tags: [testing, unit-tests, integration-tests, e2e, property-based-testing, mutation-testing]
---

# Testing Strategies

A comprehensive approach to testing that gives you confidence your code works correctly — from unit tests to mutation testing.

## Core Principles

### 1. Test Behavior, Not Implementation
Your tests should specify what the code does, not how it does it. Tests that pass after a refactor (with the same behavior) are good tests. Tests that break after a refactor (with the same behavior) are brittle tests.

### 2. The Test Pyramid Is a Guideline, Not a Rule
Write many fast unit tests, some integration tests, and a few end-to-end tests. But adjust ratios based on your context: a data pipeline needs more integration tests; a UI component needs more visual regression tests.

### 3. Tests Are Code — Treat Them That Way
Tests need the same care as production code: clean naming, DRY helpers, proper abstractions. Test code that's hard to maintain leads to tests that get deleted.

### 4. Confidence Is the Goal
Coverage numbers are a proxy metric. A codebase with 80% coverage and excellent tests is better than one with 100% coverage and shallow tests. Test the things that scare you.

---

## Testing Maturity Model

| Level | Unit Tests | Integration Tests | CI Integration | Quality Gates |
|-------|------------|--------------------|----------------|---------------|
| **1: None** | No tests | No tests | No CI | None |
| **2: Skeleton** | Some critical paths | Happy-path smoke tests | Tests run manually | None |
| **3: Standard** | >60% coverage | >80% of API endpoints | Tests run on every PR | Coverage check: >60% |
| **4: Systematic** | >80% coverage | Contract tests + DB tests | CI fails on test failure | Coverage + mutation score >70% |
| **5: Excellence** | Property-based + mutation | Consumer-driven contracts | Test parallelization, flaky test detection | Mutation score >85%, flaky tests auto-retry |

Target: **Level 3+** for production services. **Level 4+** for critical systems.

---

## Actionable Guidance

### Unit Testing Patterns

#### The AAA Pattern (Arrange, Act, Assert)

```python
import pytest
from datetime import datetime, timedelta

def test_discount_applies_to_premium_members():
    # Arrange
    user = User(membership="premium", joined_at=datetime.now() - timedelta(days=365))
    cart = Cart(items=[Item(price=100.0)])
    service = DiscountService()

    # Act
    discount = service.calculate_discount(user, cart)

    # Assert
    assert discount == 20.0  # 20% premium member discount
```

#### Test Naming Conventions

```python
# Pattern: test_[unit]_[scenario]_[expected_behavior]

# Good names — tell you what's being tested
def test_calculate_discount_premium_member_returns_20_percent():
    ...

def test_calculate_discount_expired_membership_returns_0():
    ...

def test_calculate_discount_empty_cart_returns_0():
    ...

# Bad names — need to read the test body
def test_discount_1():
    ...

def test_discount_negative():
    ...
```

#### One Assertion Concept Per Test

```python
# BAD: Testing multiple behaviors in one test
def test_order_total():
    order = create_order_with_items([Item(price=10.0), Item(price=20.0)])
    assert order.subtotal == 30.0
    assert order.tax == 3.0  # 10% tax
    assert order.total == 33.0
    # If tax calculation breaks, all three assertions fail
    # and you don't know which behavior broke

# GOOD: One assertion concept per test
def test_order_subtotal_is_sum_of_item_prices():
    order = create_order_with_items([Item(price=10.0), Item(price=20.0)])
    assert order.subtotal == 30.0

def test_order_tax_is_10_percent_of_subtotal():
    order = create_order_with_items([Item(price=30.0)])
    assert order.tax == 3.0

def test_order_total_is_subtotal_plus_tax():
    order = create_order_with_items([Item(price=30.0)])
    assert order.total == 33.0
```

#### Fixtures and Factories

```python
import pytest
from datetime import datetime

# Use fixtures for shared setup
@pytest.fixture
def premium_user():
    return User(
        id=42,
        membership="premium",
        joined_at=datetime(2023, 1, 15)
    )

@pytest.fixture
def basic_user():
    return User(
        id=7,
        membership="basic",
        joined_at=datetime(2023, 6, 1)
    )

@pytest.fixture
def cart_with_items():
    return Cart(items=[
        Item(sku="ABC", price=50.0, quantity=2),
        Item(sku="XYZ", price=25.0, quantity=1)
    ])

# Use factory functions for complex setup
def create_order_with_items(items, user=None):
    if user is None:
        user = User(id=1, membership="basic")
    cart = Cart(items=items)
    return Order(user=user, cart=cart, payment_method="credit_card")

# Clean tests with fixtures
def test_premium_member_gets_free_shipping(premium_user, cart_with_items):
    shipping = ShippingService()
    cost = shipping.calculate_cost(premium_user, cart_with_items)
    assert cost == 0.0

def test_basic_member_pays_shipping(basic_user, cart_with_items):
    shipping = ShippingService()
    cost = shipping.calculate_cost(basic_user, cart_with_items)
    assert cost > 0.0
```

### Mocking and Fakes

#### When to Mock vs. When to Fake

```python
from unittest.mock import Mock, patch
import pytest

# Mock: Use for external services (HTTP, email, payments)
def test_order_creates_payment_charge():
    payment_gateway = Mock()
    payment_gateway.charge.return_value = Transaction(id="txn_123", status="success")
    
    service = OrderService(payment_gateway=payment_gateway)
    order = service.create_order(user_id=42, total=29.99)
    
    payment_gateway.charge.assert_called_once_with(
        amount=29.99,
        currency="USD",
        description="Order - User 42"
    )
    assert order.payment_status == "completed"

# Fake: Use for in-memory implementations of repositories
class InMemoryUserRepository:
    def __init__(self):
        self.users = {}
    
    def save(self, user):
        self.users[user.id] = user
    
    def find_by_id(self, user_id):
        return self.users.get(user_id)
    
    def find_by_email(self, email):
        for user in self.users.values():
            if user.email == email:
                return user
        return None

def test_user_registration():
    repo = InMemoryUserRepository()
    service = UserService(repo)
    
    user = service.register("alice@example.com", "secure_password")
    assert repo.find_by_email("alice@example.com") is not None
    assert user.email == "alice@example.com"
```

#### Mocking External HTTP Calls

```python
import responses
import requests

@responses.activate
def test_external_api_integration():
    # Mock the external API
    responses.add(
        responses.GET,
        "https://api.github.com/repos/user/repo",
        json={"stargazers_count": 42, "description": "A great repo"},
        status=200
    )
    
    # Your code that calls the API
    result = fetch_repo_stats("user", "repo")
    
    assert result["stars"] == 42
    assert result["description"] == "A great repo"
    assert len(responses.calls) == 1
```

### Integration Testing

#### Database Integration Tests

```python
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

@pytest.fixture
def db_session():
    # Use in-memory SQLite for fast test setup
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()

def test_create_and_retrieve_order(db_session):
    # Arrange
    repo = OrderRepository(db_session)
    user = User(id=42, name="Alice")
    db_session.add(user)
    db_session.commit()
    
    order = Order(user_id=user.id, total=29.99, status="pending")
    
    # Act
    saved_order = repo.save(order)
    retrieved_order = repo.find_by_id(saved_order.id)
    
    # Assert
    assert retrieved_order is not None
    assert retrieved_order.user_id == 42
    assert retrieved_order.total == 29.99
    assert retrieved_order.status == "pending"
```

#### API Integration Tests

```python
import pytest
from fastapi.testclient import TestClient

@pytest.fixture
def client():
    app = create_app()  # Your FastAPI/Flask app
    return TestClient(app)

def test_create_order_endpoint(client):
    # Arrange
    request_data = {
        "user_id": 42,
        "items": [
            {"sku": "ABC-123", "quantity": 2}
        ],
        "payment_method": "credit_card"
    }
    
    # Act
    response = client.post("/api/orders", json=request_data)
    
    # Assert
    assert response.status_code == 201
    data = response.json()
    assert "order_id" in data
    assert data["status"] == "pending"
    assert data["total"] > 0

def test_get_order_not_found(client):
    response = client.get("/api/orders/99999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Order not found"
```

### End-to-End Testing

#### Playwright Example

```python
import pytest
from playwright.sync_api import Page, expect

def test_user_checkout_flow(page: Page):
    # Navigate to the app
    page.goto("https://example.com")
    
    # Login
    page.click("text=Sign In")
    page.fill("[data-testid=email-input]", "alice@example.com")
    page.fill("[data-testid=password-input]", "password123")
    page.click("[data-testid=login-button]")
    
    # Wait for dashboard
    expect(page.locator("text=Welcome, Alice")).to_be_visible()
    
    # Add item to cart
    page.click("[data-testid=add-to-cart-ABC123]")
    expect(page.locator("[data-testid=cart-count]")).to_have_text("1")
    
    # Checkout
    page.click("[data-testid=checkout-button]")
    page.fill("[data-testid=card-number]", "4111111111111111")
    page.fill("[data-testid=expiry]", "12/28")
    page.fill("[data-testid=cvc]", "123")
    page.click("[data-testid=pay-button]")
    
    # Verify success
    expect(page.locator("[data-testid=order-confirmation]")).to_be_visible()
    expect(page.locator("[data-testid=order-status]")).to_have_text("confirmed")
```

#### Cypress Example

```javascript
// cypress/e2e/user-registration.cy.js
describe('User Registration', () => {
  beforeEach(() => {
    cy.visit('/register')
  })

  it('should register a new user successfully', () => {
    cy.get('[data-cy=name-input]').type('Alice Johnson')
    cy.get('[data-cy=email-input]').type('alice@example.com')
    cy.get('[data-cy=password-input]').type('SecurePass123!')
    cy.get('[data-cy=tos-checkbox]').check()
    cy.get('[data-cy=register-button]').click()
    
    cy.url().should('include', '/welcome')
    cy.contains('Welcome, Alice Johnson').should('be.visible')
  })

  it('should show validation errors for invalid email', () => {
    cy.get('[data-cy=email-input]').type('not-an-email')
    cy.get('[data-cy=password-input]').type('short')
    cy.get('[data-cy=register-button]').click()
    
    cy.contains('Invalid email address').should('be.visible')
    cy.contains('Password must be at least 8 characters').should('be.visible')
  })
})
```

### Property-Based Testing

Test properties that should *always* be true, rather than specific examples.

```python
from hypothesis import given, strategies as st
from hypothesis.strategies import integers, text, lists

# Example: Testing a sorting function
@given(lists(integers()))
def test_sort_always_returns_sorted_list(items):
    result = sorted(items)
    for i in range(len(result) - 1):
        assert result[i] <= result[i + 1]

@given(lists(integers()))
def test_sort_preserves_elements(items):
    result = sorted(items)
    assert sorted(result) == sorted(items)

@given(lists(integers()))
def test_sort_is_idempotent(items):
    first_sort = sorted(items)
    second_sort = sorted(first_sort)
    assert first_sort == second_sort

# Example: Testing URL validation
@given(text())
def test_valid_urls_have_expected_structure(url):
    is_valid = is_valid_url(url)
    if is_valid:
        assert url.startswith("http://") or url.startswith("https://")
        assert "." in url

# Example: Testing arithmetic
@given(integers(), integers())
def test_addition_is_commutative(a, b):
    assert a + b == b + a

@given(integers(), integers(), integers())
def test_addition_is_associative(a, b, c):
    assert (a + b) + c == a + (b + c)
```

### Mutation Testing

Mutation testing checks your test quality by introducing bugs and seeing if your tests catch them.

```python
# Install: pip install mutmut

# Original code
def calculate_discount(price: float, is_member: bool) -> float:
    if is_member:
        return price * 0.2  # 20% discount for members
    return 0.0

# Mutmut creates mutants:
# Mutant 1: price * 0.1  (changed constant)
# Mutant 2: price * 0.3  (changed constant)
# Mutant 3: if not is_member  (negated condition)
# Mutant 4: return price * 0.0  (changed value)
# Mutant 5: return price * 0.2 + 1  (added statement)

# Your tests should kill ALL mutants
def test_member_gets_discount():
    assert calculate_discount(100.0, True) == 20.0

def test_non_member_gets_no_discount():
    assert calculate_discount(100.0, False) == 0.0

# These two tests kill all 5 mutants above
# If any mutant survives, your tests are incomplete
```

**Mutation testing workflow:**

```bash
# Run mutation testing
mutmut run --paths-to-mutate src/

# Review surviving mutants
mutmut results

# Show a surviving mutant
mutmut show 1  # Shows mutant #1 diff
```

**What survivors tell you:**

| Survival Pattern | What's Missing |
|-----------------|----------------|
| Constant changed (100 → 0) | Tests don't verify specific values |
| Condition negated (if → if not) | Tests don't cover the false branch |
| Removed function call | Tests don't verify side effects |
| Changed boundary (>= → >) | Off-by-one edge case not tested |

### Test Coverage That Matters

```python
# Not all code is equal. Prioritize testing by risk.

HIGH_PRIORITY = [
    "Payment processing",
    "Authentication/Authorization",
    "Data validation",
    "ID generation / unique constraint logic",
    "State machines / status transitions",
    "Concurrent access / race conditions",
]

MEDIUM_PRIORITY = [
    "Business logic / calculations",
    "API request handling",
    "Data transformation / mapping",
    "Caching logic",
]

LOW_PRIORITY = [
    "Simple getters/setters",
    "Configuration loading",
    "Logging/tracing",
    "Generated code",
    "Trivial delegation methods",
]

def test_priority_guidance():
    """Target 100% coverage for HIGH_PRIORITY, >80% for MEDIUM,
    and don't sweat LOW_PRIORITY under 50%."""
    pass
```

### Contract Tests (Consumer-Driven)

```python
# Consumer (microservice A) defines expectations
# Provider (microservice B) must satisfy them

from pact import Consumer, Provider

@pytest.fixture(scope='module')
def pact():
    pact = Consumer('OrderService').has_pact_with(
        Provider('UserService')
    )
    pact.start_service()
    yield pact
    pact.stop_service()

def test_user_service_returns_user_details(pact):
    # Define the expected interaction
    pact.given('user 42 exists') \
        .upon_receiving('a request for user details') \
        .with_request('GET', '/api/users/42') \
        .will_respond_with(200, body={
            'id': 42,
            'name': 'Alice',
            'email': 'alice@example.com'
        })
    
    # Exercise the consumer code
    with pact:
        client = UserServiceClient(base_url=pact.uri)
        user = client.get_user(42)
        
    # Verify
    assert user.id == 42
    assert user.name == 'Alice'
```

### Test Organization

```python
# Organize tests to mirror source structure
"""
src/
  services/
    order_service.py
    user_service.py

tests/
  unit/
    services/
      test_order_service.py
      test_user_service.py
  integration/
    test_database.py
    test_api_endpoints.py
  e2e/
    test_user_flow.py
    test_admin_flow.py
  conftest.py  # Shared fixtures
"""

# Use markers to categorize tests
import pytest

@pytest.mark.slow
def test_heavy_computation():
    ...

@pytest.mark.integration
def test_database_interaction():
    ...

@pytest.mark.smoke
def test_critical_health_check():
    ...

# Run specific categories
# pytest -m "not slow"        # Skip slow tests
# pytest -m "integration"      # Only integration tests
# pytest -m "smoke"            # Quick sanity checks
```

---

## Common Mistakes

1. **Testing implementation instead of behavior**: Your tests break when you refactor even though behavior is identical. Test the public interface and observable results.
2. **Over-mocking**: Mocking every dependency creates brittle tests that know too much. Use real objects or fakes when practical.
3. **Flaky tests**: Tests that pass sometimes and fail other times erode trust. Fix flaky tests immediately or disable them.
4. **Chasing 100% coverage without quality**: Coverage is a proxy. A 100% covered codebase can still have buggy behavior. Focus on testing logic, not lines.
5. **Testing only happy paths**: Every test for the success case should have a sibling test for the failure case. Edge cases catch production bugs.
6. **Test code duplication**: Extract test helpers and fixtures. Duplicated test setup leads to tests that don't get updated when things change.
7. **Not running tests in CI**: Tests that only pass locally aren't tests — they're documentation at best.
8. **Ignoring test failures**: A failing test suite is a broken promise. Fix failures before adding new code.
9. **Writing tests after the fact (or not at all)**: Test-driven development (TDD) isn't required, but tests written after the code often reflect what the code does, not what it should do.

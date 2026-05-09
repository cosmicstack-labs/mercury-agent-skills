---
name: python-patterns
description: 'Python best practices including type hints, async patterns, testing, and project structure'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: backend
  tags: [python, type-hints, async, testing, best-practices]
---

# Python Patterns

Write Python that is type-safe, testable, and a joy to maintain.

## Core Principles

### 1. Explicit Over Implicit
Use type hints. Avoid `*args` and `**kwargs` when named parameters work. Favor clear interfaces over dynamic flexibility.

### 2. Composition Over Inheritance
Python's multiple inheritance is powerful but dangerous. Prefer composition and protocols over deep class hierarchies.

### 3. Async Done Right
Async is a tool for I/O-bound workloads, not a universal default. Use synchronous code for CPU-bound tasks, async for network calls and file I/O.

### 4. Test-First for Critical Paths
Your business logic should be testable without mocks. Use dependency injection. Keep I/O at the boundaries.

---

## Python Maturity Model

| Level | Typing | Async | Testing | Structure |
|-------|--------|-------|---------|-----------|
| **1: Script** | No type hints | sync only | Manual testing | Single file |
| **2: Module** | Basic types (str, int) | Basic asyncio | pytest, some coverage | Package with `__init__.py` |
| **3: Package** | Full type hints with mypy | Async with proper patterns | pytest + fixtures + mocking | src-layout, entry points |
| **4: Service** | Generics, Protocols, TypedDict | Structured concurrency | Property-based, integration tests | Domain-driven structure |
| **5: Library** | Precise types, variance annotations | Trio / anyio | Fuzzing, benchmark tests | Public API surface explicit |

Target: **Level 3+** for production services.

---

## Actionable Guidance

### Type Hints

#### Basic Patterns
```python
from typing import Optional, Union, Sequence, TypeVar, Protocol, Any
from datetime import datetime

# Function signatures
def process_user(
    user_id: int,
    name: str,
    email: Optional[str] = None,
    tags: list[str] | None = None,  # Python 3.10+ union syntax
) -> dict[str, Any]:
    ...

# TypedDict for structured dicts
class UserData(TypedDict, total=False):
    id: int
    name: str
    email: str
    created_at: datetime

# Protocols (structural subtyping)
class Drawable(Protocol):
    def draw(self, context: Any) -> None: ...

def render(item: Drawable) -> None:
    item.draw(...)  # Any object with draw() method works
```

#### Generic Types
```python
T = TypeVar('T')
U = TypeVar('U', bound=Comparable)

class Repository(Generic[T]):
    def get(self, id: int) -> T | None: ...
    def list(self) -> Sequence[T]: ...
    def save(self, item: T) -> T: ...
```

### Async Patterns

#### Proper Async Context Managers
```python
import asyncio
from contextlib import asynccontextmanager

@asynccontextmanager
async def db_session():
    session = await create_session()
    try:
        yield session
    finally:
        await session.close()

# Usage
async with db_session() as session:
    result = await session.query(...)
```

#### Structured Concurrency
```python
async def fetch_all_data():
    # Run tasks concurrently with proper error propagation
    async with asyncio.TaskGroup() as tg:
        task1 = tg.create_task(fetch_users())
        task2 = tg.create_task(fetch_orders())
        task3 = tg.create_task(fetch_products())

    # All tasks completed (or TaskGroup raised on error)
    return task1.result(), task2.result(), task3.result()
```

#### Timeouts and Cancellation
```python
async def fetch_with_timeout(url: str, timeout: float = 10.0) -> Response:
    try:
        async with asyncio.timeout(timeout):
            return await fetch(url)
    except TimeoutError:
        logger.warning(f"Request to {url} timed out after {timeout}s")
        raise ServiceUnavailableError(f"Timeout fetching {url}")
```

### Project Structure

**Recommended: `src` layout**
```
project/
├── pyproject.toml
├── src/
│   └── mypackage/
│       ├── __init__.py
│       ├── domain/       # Business logic
│       │   ├── models.py
│       │   └── services.py
│       ├── infrastructure/  # External dependencies
│       │   ├── database.py
│       │   └── http_client.py
│       ├── api/           # Entry points
│       │   └── routes.py
│       └── config.py
├── tests/
│   ├── unit/
│   ├── integration/
│   └── conftest.py
└── README.md
```

**`pyproject.toml`** (modern Python packaging):
```toml
[build-system]
requires = ["setuptools>=68.0"]
build-backend = "setuptools.build_meta"

[project]
name = "mypackage"
version = "0.1.0"
dependencies = [
    "fastapi>=0.100",
    "pydantic>=2.0",
]
```

### Testing Patterns

#### Fixtures for Clean Tests
```python
import pytest
from datetime import datetime, timezone

@pytest.fixture
def sample_user() -> UserData:
    return UserData(
        id=1,
        name="Alice",
        email="alice@example.com",
        created_at=datetime.now(timezone.utc),
    )

@pytest.fixture
def repo(in_memory_db):
    return UserRepository(in_memory_db)

def test_create_user(repo, sample_user):
    saved = repo.save(sample_user)
    assert saved.id == 1
    assert saved.name == "Alice"

def test_get_nonexistent_user(repo):
    result = repo.get(999)
    assert result is None
```

#### Testing Async Code
```python
@pytest.mark.asyncio
async def test_async_service():
    service = UserService(client=MockAsyncClient())
    result = await service.get_user(42)
    assert result.name == "Alice"
```

#### Property-Based Testing
```python
from hypothesis import given, strategies as st

@given(st.integers(min_value=1, max_value=1000))
def test_user_id_is_positive(user_id: int):
    result = process_user(user_id)
    assert result["user_id"] > 0

@given(st.emails())
def test_valid_email_format(email: str):
    assert validate_email(email) is True
```

### Error Handling

#### Custom Exception Hierarchy
```python
class AppError(Exception):
    """Base exception for application errors."""
    def __init__(self, message: str, code: str | None = None):
        super().__init__(message)
        self.code = code or "UNKNOWN_ERROR"

class NotFoundError(AppError):
    def __init__(self, resource: str, id: int | str):
        super().__init__(f"{resource} not found: {id}", code="NOT_FOUND")

class ValidationError(AppError):
    def __init__(self, message: str, field: str | None = None):
        super().__init__(message, code="VALIDATION_ERROR")
        self.field = field
```

#### Result Pattern (Alternative to Exceptions)
```python
from dataclasses import dataclass
from typing import Generic, TypeVar

T = TypeVar('T')
E = TypeVar('E')

@dataclass
class Ok(Generic[T]):
    value: T

@dataclass
class Err(Generic[E]):
    error: E

Result = Ok[T] | Err[E]

def get_user(user_id: int) -> Result[User, AppError]:
    user = database.find(user_id)
    if user is None:
        return Err(NotFoundError("User", user_id))
    return Ok(user)
```

---

## Common Mistakes

1. **Mutable default arguments**: `def func(items=[])` — creates one list shared across calls. Use `None` and initialize inside.
2. **Ignoring type hints in hot paths**: Type hints have minimal runtime cost but catch bugs early. Use mypy/pyright in CI.
3. **Blocking the event loop**: Calling `requests.get()` inside async code blocks all coroutines. Use `httpx.AsyncClient`.
4. **Overusing `**kwargs`**: Pass-through kwargs obscure function signatures. Be explicit about parameters.
5. **Not using `__slots__`**: For classes with many instances, `__slots__` reduces memory by ~50%.
6. **Mixing sync and async carelessly**: Calling async from sync (or vice versa) requires careful handling. Use `asyncio.run()` only at entry points.
7. **Deep nested context managers**: Chain too many `async with` blocks. Extract into helper methods or context manager composition.

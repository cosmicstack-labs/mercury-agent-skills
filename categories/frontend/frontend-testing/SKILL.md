---
name: frontend-testing
description: 'Comprehensive frontend testing strategy covering unit, integration, E2E, visual regression, and accessibility testing'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: frontend
  tags: [testing, frontend, vitest, playwright, testing-library, e2e, accessibility]
---

# Frontend Testing

Complete testing strategy for frontend applications — from unit tests to visual regression to E2E.

## Testing Pyramid

```
        ╱  E2E ╲          ╱ Few, critical paths ╲
       ╱─────────╲        ╱  Smoke tests, auth   ╲
      ╱ Integration ╲    ╱  Component + feature  ╲
     ╱───────────────╲  ╱  User interaction flows ╲
    ╱ Unit + Component ╲╱  Logic, rendering, hooks ╲
   ╱────────────────────╲╱  Fast, many, isolated    ╲
```

## Test Types

### Unit Tests (Vitest + Testing Library)

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductsList } from './ProductsList';
import { server } from '../mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('loads and displays products', async () => {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ProductsList />
    </QueryClientProvider>
  );

  expect(screen.getByText('Loading...')).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByText('Product A')).toBeInTheDocument();
    expect(screen.getByText('Product B')).toBeInTheDocument();
  });
});
```

### E2E Tests (Playwright)

```tsx
import { test, expect } from '@playwright/test';

test('user can complete checkout', async ({ page }) => {
  await page.goto('/products');
  await page.click('text=Add to Cart');
  await page.click('text=Checkout');
  await page.fill('[name=email]', 'test@example.com');
  await page.fill('[name=card]', '4242 4242 4242 4242');
  await page.click('text=Pay Now');
  await expect(page.getByText('Order confirmed!')).toBeVisible();
});
```

## Test Configuration

```tsx
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
```

---

## Common Mistakes

1. **Testing implementation details**: Test behavior, not internals. Don't test private methods or component state.
2. **Over-mocking**: Mock at the network boundary (MSW), not individual imports.
3. **Flaky E2E tests**: Use `waitFor` and retry-able assertions. Avoid `setTimeout`.
4. **No accessibility tests**: Use `jest-axe` or `@axe-core/playwright` for a11y.
5. **Ignoring visual regression**: Use Percy/Chromatic for visual diffs alongside functional tests.

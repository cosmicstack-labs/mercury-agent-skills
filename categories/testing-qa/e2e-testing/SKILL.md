---
name: e2e-testing
description: 'Playwright and Cypress patterns, selectors, assertions, API mocking, visual testing, and CI/CD'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: testing-qa
  tags: [e2e, testing, playwright, cypress, automation]
---

# E2E Testing

End-to-end testing with Playwright and Cypress.

## Tool Choice

| Factor | Playwright | Cypress |
|--------|-----------|---------|
| Language | JS/TS, Python, C#, Java | JS/TS only |
| Browser support | Chromium, Firefox, WebKit | Chromium, Firefox, WebKit |
| Iframe support | Native | Limited |
| Network mocking | Route API | intercept() |
| Parallel execution | Built-in | Dashboard required |

## Playwright Patterns

### Selector Strategy (Priority Order)
1. `getByRole()` — best for accessibility
2. `getByText()` — for text content
3. `getByTestId()` — for complex components
4. `getByLabel()` — for form fields
5. `locator(CSS)` — last resort

### Test Structure
```typescript
test.describe('Checkout Flow', () => {
  test('completes purchase with valid card', async ({ page }) => {
    await page.goto('/products');
    await page.getByText('Add to Cart').first().click();
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByLabel('Card Number').fill('4242424242424242');
    await page.getByRole('button', { name: 'Pay' }).click();
    await expect(page.getByText('Thank you')).toBeVisible();
  });
});
```

## Visual Testing
- Use `await expect(page).toHaveScreenshot()`
- Maintain baseline screenshots in version control
- Run visual tests on CI with 1% threshold
- Use percy.io or Chromatic for cloud-based visual review

## CI Integration
```yaml
# GitHub Actions
- name: E2E Tests
  run: npx playwright test
- uses: actions/upload-artifact
  if: failure()
  with:
    name: playwright-report
    path: playwright-report/
```

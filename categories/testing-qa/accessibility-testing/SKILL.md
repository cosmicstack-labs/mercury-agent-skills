---
name: accessibility-testing
description: 'WCAG 2.1/2.2 audit, axe, Lighthouse, manual testing, screen reader testing, and remediation'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: testing-qa
  tags: [accessibility, a11y, testing, wcag, inclusive]
---

# Accessibility Testing

Systematically test and improve web accessibility.

## WCAG Guidelines (Quick Reference)

| Level | Conformance | Target |
|-------|-------------|--------|
| A | Minimum | Must pass all A criteria |
| AA | Standard | Legal standard (ADA, Section 508) |
| AAA | Advanced | Highest level, not always achievable |

### Key Success Criteria
- **1.1.1 (A)**: All non-text content has text alternative
- **1.4.3 (AA)**: Color contrast ≥ 4.5:1
- **2.1.1 (A)**: All functionality via keyboard
- **2.4.7 (AA)**: Visible focus indicators
- **4.1.2 (A)**: Proper ARIA roles and attributes

## Testing Approach

### Automated (Catches ~30%)
```javascript
// axe-core in CI
const { axe } = require('jest-axe');
it('should have no accessibility violations', async () => {
  render(<MyComponent />);
  const results = await axe(document.body);
  expect(results).toHaveNoViolations();
});
```

### Manual (Catches ~40%)
- Tab through all interactive elements
- Test with high contrast mode
- Zoom to 200% — no content should be cut off
- Disable CSS — content should be in logical order

### Assistive Technology (Catches ~30%)
- Test with VoiceOver (macOS/iOS)
- Test with NVDA (Windows)
- Test with keyboard only (no mouse/trackpad)

## Common Fixes
- Add `alt` text to all images (decorative = `alt=""`)
- Add `aria-label` to icon-only buttons
- Ensure forms have associated `<label>` elements
- Add `skip-to-content` link
- Use proper heading hierarchy (h1 → h2 → h3, never skip)

---
name: component-design-systems
description: 'Building and maintaining scalable component libraries, design tokens, accessibility, and cross-team collaboration patterns'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: frontend
  tags: [design-systems, components, react, accessibility, design-tokens, storybook]
---

# Component Design Systems

Patterns for building scalable, accessible, and maintainable component libraries.

## Architecture

```
design-system/
├── tokens/              # Design tokens
│   ├── colors.json
│   ├── typography.json
│   └── spacing.json
├── primitives/          # Base components
│   ├── Button/
│   ├── Input/
│   └── Text/
├── patterns/            # Composed patterns
│   ├── FormField/
│   ├── DataTable/
│   └── Modal/
└── docs/               # Documentation
    └── Storybook/
```

## Component API Design

```tsx
// Compound component pattern
<Select>
  <Select.Label>Country</Select.Label>
  <Select.Trigger>
    <Select.Value placeholder="Select a country" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="us">United States</Select.Item>
    <Select.Item value="uk">United Kingdom</Select.Item>
  </Select.Content>
</Select>
```

---

## Common Mistakes

1. **No design tokens**: Hardcoded values everywhere. Use tokens for colors, spacing, typography.
2. **Missing accessibility**: Always include ARIA labels, keyboard nav, focus management.
3. **Too opinionated**: Components should work out-of-box but be customizable via props/composition.
4. **No versioning strategy**: Use semver. Document breaking changes clearly.
5. **No visual regression tests**: Use Chromatic/Percy to catch unintended style changes.

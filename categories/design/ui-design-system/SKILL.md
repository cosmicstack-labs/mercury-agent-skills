---
name: ui-design-system
description: Master the creation, maintenance, and governance of design systems — from design tokens and component architecture to documentation, versioning, and accessibility.
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: Design
  tags:
    - design-systems
    - ui-components
    - design-tokens
    - component-library
    - atomic-design
    - storybook
    - accessibility
    - theming
    - frontend-architecture
    - design-governance
---

# UI Design System Skill

## Core Principles

### 1. Consistency Over Creativity
A design system's primary value is consistency. Every component, token, and pattern must behave predictably across the entire product surface. Creativity belongs at the product level — the design system provides the reliable foundation.

### 2. Composability First
Components should be built to compose, not to cover every permutation. A well-designed system lets teams assemble complex interfaces from simple, well-defined building blocks. Prefer composition over configuration.

### 3. Accessibility Is Not Optional
Accessibility must be baked into every component from day one, not bolted on later. Every component in the system should meet at minimum WCAG 2.1 Level AA. Design tokens for color must account for contrast ratios from the start.

### 4. Dogfood Your Own System
The design system team should be its own first consumer. If the system doesn't work for its creators, it won't work for the wider organization. Build real features with your components before releasing them.

### 5. Documentation Is a Feature
Documentation is not an afterthought — it is a first-class deliverable. If a component isn't documented, it doesn't exist. Usage guidelines, code examples, accessibility notes, and design rationale are all required.

## Design System Maturity Model

### Level 1: Ad Hoc
No centralized system. Components are built per-feature. Inconsistent patterns, duplicated code, and design drift across teams. This is the starting point before formalizing a system.

### Level 2: Catalog
A shared component library exists, typically in a single repository. Teams can browse and install components. Basic design tokens may exist. Documentation is sparse or auto-generated. Adoption is voluntary and inconsistent.

### Level 3: Standardized
Design tokens are formally defined and used across all products. Components are reviewed for consistency. Documentation is maintained in Storybook. A basic contribution process exists. Most teams participate.

### Level 4: Governed
The design system has a dedicated team. There's a formal contribution and review process. Breaking changes are managed through semantic versioning. Adoption metrics are tracked. Cross-team alignment meetings happen regularly.

### Level 5: Ecosystem
The design system extends beyond UI — it includes design tooling, code generation, analytics, and automated testing. External contributions are possible. White-label and theme variants are supported. The system actively shapes product strategy.

## Design Tokens

Design tokens are the atoms of your design system — named values that store design decisions. They bridge design and development by providing a single source of truth.

### Token Structure

Tokens should follow a hierarchical naming convention that maps to how designers and developers think:

```
token-category_property_variant_state
```

**Example:**
```
color_background_primary_default
color_text_secondary_disabled
spacing_padding_large
```

### Color Tokens

Define colors with clear semantic meaning, not visual descriptions:

- **Base colors**: The raw palette (brand blue, neutral gray, alert red)
- **Semantic tokens**: What the color means (color_text_primary, color_background_error, color_border_focus)
- **Contextual tokens**: What it's used for (button_background_primary_default, input_border_focus)

Contrast ratios must be verified for every text-on-background pairing. Use tools like Contrast API or Stark to validate.

```css
:root {
  /* Palette */
  --color-blue-500: #3B82F6;
  --color-gray-100: #F3F4F6;
  --color-gray-900: #111827;

  /* Semantic */
  --color-text-primary: var(--color-gray-900);
  --color-text-on-primary: #FFFFFF;
  --color-background-primary: var(--color-blue-500);
  --color-border-default: var(--color-gray-100);
}
```

### Typography Tokens

Typography should define more than just font size. Include family, weight, line height, letter spacing, and responsive breakpoints:

```
typography_heading_large
typography_body_default
typography_caption_small
```

```css
:root {
  --font-family-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --font-size-heading-xl: 2.5rem;
  --font-size-heading-lg: 2rem;
  --font-size-body: 1rem;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --letter-spacing-tight: -0.02em;
  --letter-spacing-wide: 0.05em;
}
```

Use a modular scale (e.g., 1.25 ratio) for font sizes to maintain visual harmony.

### Spacing Tokens

Use a consistent scale, typically based on 4px or 8px increments:

```css
:root {
  --spacing-xs: 0.25rem;  /* 4px */
  --spacing-sm: 0.5rem;   /* 8px */
  --spacing-md: 0.75rem;  /* 12px */
  --spacing-lg: 1rem;     /* 16px */
  --spacing-xl: 1.5rem;   /* 24px */
  --spacing-2xl: 2rem;    /* 32px */
  --spacing-3xl: 3rem;    /* 48px */
  --spacing-4xl: 4rem;    /* 64px */
}
```

### Shadow Tokens

Define elevation levels with consistent depth:

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1);
}
```

### Animation Tokens

Duration and easing should be tokenized to ensure consistent motion:

```css
:root {
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
  --easing-default: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-enter: cubic-bezier(0, 0, 0.2, 1);
  --easing-exit: cubic-bezier(0.4, 0, 1, 1);
}
```

### Token Delivery

Tokens should be distributed as platform-agnostic formats:
- **JSON**: For tooling and transformations
- **CSS Custom Properties**: For web consumption
- **Style Dictionary**: For multi-platform output (iOS, Android, Web)

## Component Architecture

### Atomic Design Methodology

Organize components by complexity:

- **Atoms**: Basic HTML elements — Button, Input, Label, Icon
- **Molecules**: Simple composition of atoms — InputGroup, Card, MenuItem
- **Organisms**: Complex sections — Header, Sidebar, DataTable
- **Templates**: Page-level wireframes with layout
- **Pages**: Filled templates with real content

Each level should only depend on levels below it. A molecule should never import an organism.

### Composable Component Patterns

**Slot-based composition** (React example):
```tsx
<Card>
  <Card.Header>
    <Card.Title>Profile</Card.Title>
    <Card.Actions>
      <Button variant="ghost">Edit</Button>
    </Card.Actions>
  </Card.Header>
  <Card.Body>
    <Avatar src={user.avatar} size="lg" />
    <Text variant="body">{user.bio}</Text>
  </Card.Body>
</Card>
```

**Polymorphism via `as` prop**:
```tsx
<Text as="h1" variant="heading">Title</Text>
// Renders <h1 class="heading">Title</h1>
```

### Component API Design

Every component should follow consistent API conventions:

1. **Ref forwarding**: All interactive components forward refs to their root DOM node
2. **className prop**: Accept custom styling via class merging (use `clsx` or `tailwind-merge`)
3. **Spreading props**: Spread unrecognized props to the root HTML element
4. **Controlled/uncontrolled**: Support both controlled (stateful) and uncontrolled (stateless) modes for form components

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(styles.base, styles[variant], styles[size], className)}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <Spinner size="sm" />}
        {icon && <span className={styles.icon}>{icon}</span>}
        {children}
      </button>
    );
  }
);
```

## Documentation

Documentation is the interface between the design system and its consumers. Without great documentation, even the best components go unused or misused.

### Storybook as Documentation Hub

Every component must have stories covering:
- **Default state**: The most common usage
- **Variants**: All variant prop combinations
- **States**: Hover, active, disabled, loading, error, empty
- **Edge cases**: Very long text, empty children, missing optional props
- **Accessibility**: Keyboard navigation, screen reader output, focus management
- **Responsive**: Behavior at different viewport sizes

### Documentation Requirements Per Component

1. **Overview**: What this component does and when to use it
2. **Usage guidelines**: Do's and don'ts with examples
3. **Props table**: Auto-generated from TypeScript/PropTypes
4. **Accessibility**: ARIA roles, keyboard interactions, focus behavior
5. **Theming**: How the component responds to theme changes
6. **Code examples**: Copy-paste ready snippets for common use cases
7. **Design specs**: Figma/Framer embed showing design intent

## Versioning and Distribution

### Semantic Versioning

Follow strict semver for component library releases:

- **Major (1.0.0 → 2.0.0)**: Breaking changes — renamed props, removed components, changed APIs
- **Minor (1.0.0 → 1.1.0)**: New features, new components, new variants — backward compatible
- **Patch (1.0.0 → 1.0.1)**: Bug fixes, accessibility improvements, documentation updates

### Changelog

Maintain a human-readable changelog following Keep a Changelog convention:

```markdown
# Changelog

## [2.0.0] - 2026-01-15

### Added
- New `Drawer` component for slide-in panels
- Dark mode support for all components
- `size` prop on `Button` component

### Changed
- **BREAKING:** `Button` variants renamed (`outline` → `secondary`)
- **BREAKING:** Removed deprecated `IconButton`; use `Button iconOnly`
- Updated color tokens to match rebrand

### Fixed
- Focus ring visibility on `Select` component
- Screen reader announcement for toast notifications
```

### Package Distribution

Publish as scoped npm packages:

```
@company/design-tokens    — token definitions
@company/react-components — React component library
@company/icons            — SVG icon set
@company/hooks            — Shared React hooks
```

Each package should include:
- CommonJS and ESM builds
- TypeScript type definitions
- Source maps
- README with quick-start guide

## Governance

A design system without governance is a collection of components with no direction.

### Contribution Process

1. **Proposal**: Contributor creates an RFC or GitHub Discussion outlining the need
2. **Review**: Design system team reviews for consistency, accessibility, and maintenance cost
3. **Prototype**: Component is built in isolation following system standards
4. **Review (again)**: Code review, design review, accessibility review
5. **Testing**: Tested in 2+ real product surfaces before release
6. **Release**: Component is added to library with documentation and changelog entry

### Adoption Metrics

Track these metrics to measure system health:
- **Component adoption**: Percentage of UI built with system components vs. custom code
- **Token adoption**: Use of design tokens vs. hardcoded values in codebase
- **Version lag**: How many versions behind teams are running
- **Reopened issues**: Component issues that get re-reported after being fixed
- **Time-to-ship**: How long it takes from proposal to release of a new component

## Theme Support

### Dark Mode

Design tokens should have light and dark variants:

```css
:root, [data-theme="light"] {
  --color-background-page: #FFFFFF;
  --color-text-primary: #111827;
}

[data-theme="dark"] {
  --color-background-page: #0F172A;
  --color-text-primary: #F1F5F9;
}
```

Components should use only semantic tokens, never raw colors, so they automatically adapt to theme changes without modification.

### White-Label / Brand Theming

For multi-brand systems, define a brand layer between tokens and components:

```
Brand A:       Tokens → Brand A Aliases → Components
Brand B:       Tokens → Brand B Aliases → Components
```

Each brand alias file maps shared tokens to brand-specific values, keeping the component layer brand-agnostic.

## Scoring & Evaluation

| Criteria | Novice (1) | Competent (2) | Proficient (3) | Expert (4) |
|---|---|---|---|---|
| Design Tokens | Hardcoded values throughout | Some CSS variables | Full token system, semantic naming | Multi-platform token pipeline |
| Component Architecture | Monolithic components | Some composition | Atomic design followed | Headless + styled variants |
| Documentation | None | Basic prop tables | Storybook with usage guides | Interactive playground + specs |
| Accessibility | Not considered | Color contrast checked | WCAG AA per component | Automated a11y testing in CI |
| Versioning | No versioning | Manual version bumps | Semver with changelog | Automated release workflows |
| Governance | No process | Ad hoc reviews | Formal RFC process | Metrics-driven governance |
| Theme Support | Single theme | Manual dark mode | Token-based theming | White-label + multi-brand |

## Common Mistakes

### 1. Building Everything at Once
Teams try to build a complete system before launching. Start with the 20% of components that cover 80% of use cases. Button, Input, Card, and Modal will get you far. Ship early, iterate often.

### 2. Over-Engineering Early
Don't build for every possible future use case. Component APIs should solve today's problems. Adding props later is easy — removing them is breaking. Start simple.

### 3. Ignoring the Contribution Pipeline
Design systems die when they become bottlenecks. If only one team can add components, adoption will stall. Build clear contribution pathways and empower other teams.

### 4. Documentation as an Afterthought
I've seen beautiful component libraries with zero documentation. They fail every time. Documentation must ship with the component — not a week later, not in the next sprint. Same PR, same release.

### 5. Skipping Accessibility
Accessibility retrofits are expensive and often imperfect. Building an accessible component from scratch costs marginally more. Fixing an inaccessible one later costs 5-10x more and usually results in compromises.

### 6. No Token Adoption Enforcement
Defining tokens is useless if teams still use hardcoded values. Use lint rules (e.g., stylelint, ESLint) to prevent raw colors and hardcoded spacing. Automated enforcement beats manual code review every time.

### 7. Forgetting Consumers Are Not the Design Team
Consumer teams need to ship features quickly. If using the design system is slower than building custom components, they'll go custom. Optimize for developer experience — fast iteration, clear docs, helpful error messages.

### 8. No Migration Strategy for Breaking Changes
When you release v2.0.0 old code breaks. Provide codemods, migration guides, and a deprecation window. A component should warn users one version before it's removed. Respect your consumers' time.

### 9. Design-Dev Handoff Gaps
If design tokens live in Figma and components use different names, things drift. Keep design and code in sync — tools like Supernova, Specify, or Amazon Style Dictionary help bridge this gap.

### 10. Not Measuring Success
If you can't measure adoption, you can't improve it. Track usage, version lag, and team satisfaction. Run regular surveys. A design system that doesn't measure itself is flying blind.

---
name: responsive-design
description: 'Responsive web design patterns, mobile-first CSS, container queries, fluid typography, and accessibility-first layouts'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: frontend
  tags: [responsive-design, css, mobile-first, container-queries, accessibility, tailwind]
---

# Responsive Design

Modern responsive design patterns using mobile-first methodology, CSS Grid, Flexbox, and container queries.

## Mobile-First Approach

```css
/* Base styles = Mobile */
.container {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 2rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem;
  }
}
```

## Container Queries

```css
/* Instead of viewport queries, query the container */
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}

@container card (max-width: 399px) {
  .card {
    display: flex;
    flex-direction: column;
  }
}
```

## Fluid Typography

```css
/* Fluid type scale using clamp() */
:root {
  --text-sm: clamp(0.875rem, 0.8rem + 0.25vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
  --text-lg: clamp(1.25rem, 1rem + 1vw, 1.75rem);
  --text-xl: clamp(1.5rem, 1rem + 2vw, 2.5rem);
}
```

---

## Common Mistakes

1. **Starting with desktop**: Always design mobile-first. It's easier to add than remove.
2. **Relying only on media queries**: Use `min-width` not `max-width`. Use container queries for reusable components.
3. **Ignoring touch targets**: Minimum 44x44px tap targets. No hover-dependent interactions on mobile.
4. **Fixed widths and heights**: Use `min-height`, `max-width`, and intrinsic sizing.
5. **Not testing on real devices**: Emulators aren't enough. Test on actual phones and tablets.

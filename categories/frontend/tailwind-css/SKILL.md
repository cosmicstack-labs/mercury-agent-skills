---
name: tailwind-css
description: 'Best practices for utility-first CSS with Tailwind, responsive design, and component patterns'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: frontend
  tags: [tailwind, css, responsive-design, utility-css, styling]
---

# Tailwind CSS

Build beautiful, responsive interfaces efficiently with utility-first CSS.

## Core Principles

### 1. Utility-First, Component-Last
Start with utilities, extract to components only when repetition demands it. Premature abstraction creates indirection without benefit.

### 2. Design in the Browser
Tailwind lets you iterate visually without context-switching to CSS files. Experiment, settle on a design, then clean up.

### 3. Consistency Through Constraints
Use the design system (colors, spacing, typography) via Tailwind's config. Custom values are escape hatches, not the default.

### 4. Responsive by Default
Design mobile-first. Add responsive prefixes (`md:`, `lg:`) to adjust for larger screens, not the other way around.

---

## Tailwind Mastery Scorecard

| Skill | Beginner | Proficient | Expert |
|-------|----------|------------|--------|
| **Utility usage** | Writes long class strings | Groups with `@apply` or `cn()` | Creates composable patterns |
| **Config** | Uses default theme | Extends theme with brand tokens | Creates plugins for custom utilities |
| **Responsive** | Copy-paste breakpoints | Mobile-first, strategic overrides | Container queries, dynamic breakpoints |
| **Dark mode** | Manual classes | `dark:` prefix consistently | Automatic with class strategy |
| **Performance** | Not considered | PurgeCSS configured | JIT, optimized builds |
| **Reusability** | Rewrites same patterns | Uses `@apply` or component classes | Headless + utility composition |

Target: **Proficient** for production projects.

---

## Actionable Guidance

### Class Organization

**Recommended order** (use Prettier plugin `prettier-plugin-tailwindcss`):
```
Layout → Flex/Grid → Spacing → Sizing → Typography → Visual → Interactive → States
```

```html
<!-- Before (random order) -->
<div class="text-lg p-4 flex bg-white shadow-md rounded-lg mt-4 items-center">

<!-- After (organized) -->
<div class="flex items-center mt-4 p-4 rounded-lg bg-white shadow-md text-lg">
```

### Responsive Design

**Mobile-first breakpoints** (Tailwind defaults):
| Prefix | Min-width | Targets |
|--------|-----------|---------|
| (none) | 0 | Mobile |
| `sm:` | 640px | Large phones |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large screens |

```html
<!-- Mobile: single column. Desktop: two columns -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
  <!-- Mobile: full width. Desktop: spans 2 columns -->
  <div class="lg:col-span-2">Header</div>
  <div>Sidebar</div>
  <div>Content</div>
</div>
```

### Component Extraction Patterns

#### 1. Inline with `cn()` helper (Recommended)
```tsx
import { cn } from '@/lib/utils';

function Button({ variant = 'primary', size = 'md', className, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-gray-100 text-gray-900 hover:bg-gray-200': variant === 'secondary',
          'border border-gray-300 bg-white hover:bg-gray-50': variant === 'outline',
        },
        {
          'h-9 px-3 text-sm': size === 'sm',
          'h-10 px-4 py-2': size === 'md',
          'h-11 px-8 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
}
```

#### 2. `@apply` in Component (For simple leaf components)
```css
/* styles/button.css */
@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-colors;
  }
}
```

**⚠️ Warning**: `@apply` creates a layer of indirection. Prefer `cn()` for complex variants — it keeps everything in JavaScript where it's easier to compose.

### Design System Integration

#### Theme Configuration
```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a5f',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
};
```

#### Design Tokens → Tailwind Config
Map your design tokens directly to Tailwind values:

| Token | Tailwind Config |
|-------|-----------------|
| Spacing scale (4px base) | Default spacing |
| Color palette | `colors` extend |
| Type scale | `fontSize` extend |
| Shadows | `boxShadow` extend |
| Breakpoints | `screens` extend |
| Border radius | `borderRadius` extend |

### Layout Patterns

#### Responsive Sidebar Layout
```html
<div class="flex h-screen">
  <!-- Sidebar: hidden on mobile, visible on desktop -->
  <aside class="hidden lg:flex lg:w-64 lg:flex-col">
    <nav class="flex-1 space-y-1 px-2 py-4">
      <!-- nav items -->
    </nav>
  </aside>

  <!-- Main content -->
  <main class="flex-1 overflow-y-auto">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <!-- page content -->
    </div>
  </main>
</div>
```

#### Card Grid
```html
<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
    <h3 class="text-lg font-semibold text-gray-900">Card Title</h3>
    <p class="mt-2 text-sm text-gray-600">Card description here.</p>
  </div>
</div>
```

### Dark Mode

Enable with `darkMode: 'class'` in config:
```html
<!-- Toggle dark mode by adding 'dark' class to <html> -->
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  <h2 class="text-gray-900 dark:text-white">Title</h2>
  <p class="text-gray-600 dark:text-gray-400">Content</p>
</div>
```

### Performance

1. **Enable JIT**: Default in v3+. Remove unused styles automatically.
2. **Purge configuration**: Ensure `content` paths cover all template files.
3. **Avoid dynamic class construction**: `text-${color}-500` won't be detected. Use complete class names.
4. **Extract components, not wrappers**: One `@apply` wrapper per abstraction is fine. Chained abstractions (wrapper-of-wrapper) hurt.

---

## Common Mistakes

1. **Long unreadable class strings**: Use `cn()` or `clsx` for conditional classes. Break into multiple lines.
2. **Custom values every time**: `p-[13px]` should be rare. Stick to the spacing scale.
3. **Overusing `@apply`**: Creates a custom CSS file that defeats Tailwind's purpose. Use only for simple leaf components.
4. **No Prettier plugin**: Manual class sorting is error-prone. Use `prettier-plugin-tailwindcss`.
5. **Inline styles**: Tailwind utilities replaced inline styles. If you're using `style={}` for layout, there's a Tailwind utility.
6. **Not using design tokens**: Hardcoding colors instead of extending the config creates inconsistency.
7. **Forgetting responsive prefixes**: Always check your design at mobile size first, then add breakpoints.

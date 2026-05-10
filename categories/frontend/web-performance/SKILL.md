---
name: web-performance
description: 'Web performance optimization patterns, Core Web Vitals, lazy loading, code splitting, caching strategies, and monitoring'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: frontend
  tags: [performance, web-vitals, lighthouse, optimization, caching, core-web-vitals]
---

# Web Performance

Systematic approach to measuring, analyzing, and optimizing web application performance.

## Core Web Vitals

| Metric | Target | What It Measures |
|--------|--------|------------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Loading performance |
| **FID** (First Input Delay) | < 100ms | Interactivity |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Visual stability |
| **INP** (Interaction to Next Paint) | < 200ms | Responsiveness |

## Optimization Strategies

### 1. JavaScript Optimization

```tsx
// Dynamic imports — code splitting
const Chart = dynamic(() => import('./Chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // If chart needs browser APIs
});

// Bundle analysis
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer({});
```

### 2. Image Optimization

```tsx
// Next.js Image component
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // Above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/webp;base64,..."
/>

// Responsive images with srcSet
<picture>
  <source media="(min-width: 1024px)" srcSet="/hero-lg.webp" />
  <source media="(min-width: 640px)" srcSet="/hero-md.webp" />
  <img src="/hero-sm.webp" alt="Hero" loading="lazy" />
</picture>
```

### 3. Caching Strategy

```tsx
// Service Worker caching strategies
// Cache-First for static assets
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/static/')) {
    event.respondWith(cacheFirst(event.request));
  }
  // Network-First for API calls
  if (event.request.url.includes('/api/')) {
    event.respondWith(networkFirst(event.request));
  }
});
```

---

## Common Mistakes

1. **Optimizing before measuring**: Always measure first. Use Lighthouse, WebPageTest, and RUM data.
2. **Ignoring mobile performance**: Test on real mobile devices, not just desktop DevTools.
3. **Blocking rendering with JavaScript**: Defer non-critical JS. Use `async`/`defer` on scripts.
4. **Not optimizing images**: Use WebP/AVIF, responsive images, and lazy loading.
5. **Missing performance budgets**: Set budgets in your CI pipeline and fail builds that exceed them.

---
name: nextjs-patterns
description: 'Next.js best practices, server components, app router patterns, caching strategies, and full-stack architecture'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: frontend
  tags: [nextjs, react, server-components, app-router, full-stack, ssr, ssg, isr]
---

# Next.js Patterns

Comprehensive guide to building production-grade Next.js applications with the App Router, Server Components, and modern React patterns.

## Core Architecture

### App Router vs Pages Router

| Aspect | App Router | Pages Router |
|--------|-----------|--------------|
| **Components** | Server Components by default | Client Components only |
| **Routing** | File-system based with layout nesting | File-system based, flat |
| **Data Fetching** | Server-side fetch, `use`, cache primitives | `getServerSideProps`, `getStaticProps` |
| **Loading States** | `loading.js` files | Manual implementation |
| **Error Handling** | `error.js` files | Manual implementation |
| **Streaming** | Built-in with Suspense boundaries | Not supported |

### Project Structure

```
my-app/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── loading.tsx         # Root loading state
│   ├── error.tsx           # Root error boundary
│   ├── not-found.tsx       # 404 page
│   ├── (auth)/             # Route group
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx      # Dashboard layout
│   │   ├── page.tsx        # Dashboard home
│   │   ├── loading.tsx
│   │   └── settings/
│   │       └── page.tsx
│   └── api/
│       └── [...route]/route.ts  # API handlers
├── components/
│   ├── ui/                 # Shared UI components
│   └── features/           # Feature-specific components
├── lib/
│   ├── db.ts              # Database client
│   ├── auth.ts            # Auth utilities
│   └── utils.ts           # Shared utilities
└── public/
    └── images/
```

## Server Components (RSC)

### When to Use Server vs Client

```tsx
// ✅ SERVER COMPONENT (default) — Use for:
// - Data fetching from databases/APIs
// - Accessing backend resources directly
// - Keeping sensitive logic on server
// - Reducing client bundle size
// - SEO-critical content
async function ProductPage({ params }: { params: { id: string } }) {
  const product = await db.product.findUnique({ where: { id: params.id } });
  return <ProductDetail product={product} />;
}

// ✅ CLIENT COMPONENT — Use for:
// - Interactivity (onClick, onChange, etc.)
// - useState, useReducer, useEffect
// - Browser-only APIs
// - Custom hooks
// - Event listeners
'use client';
function AddToCartButton({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false);
  return (
    <button onClick={() => { addToCart(productId); setAdded(true); }}>
      {added ? 'Added!' : 'Add to Cart'}
    </button>
  );
}
```

### Composing Server and Client Components

```tsx
// ✅ CORRECT: Server Component wrapping Client Component
async function ProductPage({ id }: { id: string }) {
  const product = await getProduct(id);
  // Server component passes data as props to client component
  return (
    <div>
      <ProductDetails product={product} />
      <AddToCartButton productId={id} />
    </div>
  );
}

// ❌ WRONG: Client Component importing Server Component
'use client';
import ServerComponent from './ServerComponent'; // ❌ Won't work
function ClientPage() {
  return <ServerComponent />; // Error: Cannot import server component into client
}

// ✅ CORRECT: Pass Server Component as children
'use client';
function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && children} {/* Server component rendered here */}
    </div>
  );
}
```

## Data Fetching Patterns

### Server-Side Data Fetching

```tsx
// app/products/page.tsx
async function ProductsPage() {
  // Direct database access — no API route needed
  const products = await db.product.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
  });
  
  return <ProductGrid products={products} />;
}

// With parallel fetching for multiple data sources
async function DashboardPage() {
  const [user, posts, analytics] = await Promise.all([
    getCurrentUser(),
    getRecentPosts(),
    getAnalytics(),
  ]);
  
  return (
    <DashboardShell user={user}>
      <PostList posts={posts} />
      <AnalyticsChart data={analytics} />
    </DashboardShell>
  );
}
```

### Revalidation Strategies

```tsx
// Time-based revalidation (ISR)
export const revalidate = 3600; // Revalidate every hour

// On-demand revalidation (revalidateTag / revalidatePath)
'use server';
export async function publishPost(formData: FormData) {
  const post = await createPost(formData);
  revalidateTag('posts');
  revalidatePath('/blog');
  redirect(`/blog/${post.slug}`);
}

// Dynamic data — no caching
export const dynamic = 'force-dynamic';

// Static data — cache forever
export const dynamic = 'force-static';
```

### Streaming with Suspense

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
      <Suspense fallback={<ActivitySkeleton />}>
        <RecentActivity />
      </Suspense>
    </div>
  );
}

async function DashboardContent() {
  const data = await fetchDashboardData(); // This suspends
  return <DashboardCharts data={data} />;
}

async function RecentActivity() {
  const activity = await fetchRecentActivity(); // This loads independently
  return <ActivityFeed items={activity} />;
}
```

## Route Handlers & API Patterns

```tsx
// app/api/products/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  
  const products = await db.product.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });
  
  return Response.json({ products, page, limit });
}

export async function POST(request: Request) {
  const body = await request.json();
  const product = await db.product.create({ data: body });
  return Response.json(product, { status: 201 });
}
```

## Common Patterns

### Route Groups for Organization

```tsx
// app/(marketing)/page.tsx — Public marketing pages
// app/(dashboard)/page.tsx — Authenticated dashboard
// app/(auth)/login/page.tsx — Auth pages with different layout
```

### Middleware for Auth

```tsx
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('session');
  const { pathname } = request.nextUrl;
  
  // Protected routes
  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}
```

### Error Boundaries

```tsx
// app/dashboard/error.tsx
'use client';
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

---

## Common Mistakes

1. **Overusing client components**: Default to Server Components. Only add `'use client'` when you need interactivity.
2. **Nesting fetch calls sequentially**: Use `Promise.all()` for independent data fetches.
3. **Ignoring caching defaults**: Understand Next.js fetch caching. Use `no-store` or `revalidate` explicitly.
4. **Mixing server/client component boundaries incorrectly**: Pass Server Components as children to Client Components, don't import them.
5. **Forgetting error and loading states**: Always provide error boundaries and loading skeletons for streaming.

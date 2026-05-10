---
name: state-management
description: 'Modern frontend state management patterns, tools, architecture decisions, and scalability patterns'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: frontend
  tags: [state-management, react, zustand, redux, jotai, xstate, frontend-architecture]
---

# State Management

Comprehensive patterns for managing state in modern frontend applications — from local component state to global application state.

## State Categories

| Type | Description | Examples | Tool |
|------|-------------|----------|------|
| **Local** | Component-scoped state | Form inputs, toggles | `useState`, `useReducer` |
| **Shared** | State shared between components | Selected item, filter state | Zustand, Context |
| **Server** | Data from APIs/database | User list, product catalog | TanStack Query, SWR |
| **URL** | State in the URL | Page number, search query | `next/navigation`, React Router |
| **Persisted** | State that survives refresh | Theme preference, auth token | localStorage, AsyncStorage |

## Patterns by Scale

### Small App (< 5 screens)

```tsx
// Just useState + lifting state up is enough
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <ChildA count={count} />
      <ChildB onIncrement={() => setCount(c => c + 1)} />
    </>
  );
}
```

### Medium App (5-20 screens)

```tsx
// Zustand — minimal boilerplate, great performance
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  total: () => number;
  clear: () => void;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => ({ 
        items: [...state.items, item] 
      })),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),
      total: () => get().items.reduce((sum, i) => sum + i.price, 0),
      clear: () => set({ items: [] }),
    }),
    { name: 'cart-storage' }
  )
);

// Usage in any component
function CartBadge() {
  const count = useCartStore((state) => state.items.length);
  return <span>{count} items</span>;
}
```

### Large App (20+ screens, multiple teams)

```tsx
// Domain-driven stores with clear boundaries
const useUserStore = create<UserStore>()(...);
const useProductStore = create<ProductStore>()(...);
const useUIStore = create<UIStore>()(...);
// Each store is independent, composable
```

## Server State Pattern

```tsx
// TanStack Query — best for server state
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function ProductsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', { page: 1 }],
    queryFn: () => fetchProducts({ page: 1 }),
    staleTime: 5 * 60 * 1000, // 5 min cache
  });

  if (isLoading) return <Loading />;
  if (error) return <Error />;
  return <div>{/* render data */}</div>;
}

// Optimistic updates
function useAddProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addProduct,
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previous = queryClient.getQueryData(['products']);
      queryClient.setQueryData(['products'], (old) => [...old, newProduct]);
      return { previous };
    },
    onError: (err, newProduct, context) => {
      queryClient.setQueryData(['products'], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
```

---

## Common Mistakes

1. **Putting everything in global state**: Keep state as local as possible. Global state should be a last resort.
2. **Over-engineering for small apps**: Start with `useState`, graduate to Zustand, only adopt Redux for complex needs.
3. **Mixing server and client state**: Server state belongs in TanStack Query/SWR. Client state in Zustand/Context.
4. **Not memoizing selectors**: `useStore(s => s.items)` re-renders on every store change. Use selectors.

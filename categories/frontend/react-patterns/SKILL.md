---
name: react-patterns
description: 'Component patterns, hooks, state management, and performance optimization for React applications'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: frontend
  tags: [react, hooks, state-management, performance, components]
---

# React Patterns

Build React applications that are composable, performant, and maintainable.

## Core Principles

### 1. Composition Over Configuration
Build small, focused components and compose them. Avoid giant components with many configuration props. Children and slots are your friends.

### 2. State Management Is About Proximity
Keep state as close to where it's used as possible. Lift state up only when truly shared. Context is not a state management solution.

### 3. Derive, Don't Duplicate
Derived state (computed from existing state) should never be stored separately. Use `useMemo` for expensive derivations, compute inline for cheap ones.

### 4. Effects Are Escape Hatches
`useEffect` is for synchronizing with external systems (API, DOM, subscriptions). Don't use it for derived state or event handlers.

---

## React Patterns Maturity Model

| Level | Components | State | Effects | Performance |
|-------|------------|-------|---------|-------------|
| **1: Basic** | Class components, mix of concerns | Local state only | Raw useEffects | Not considered |
| **2: Foundational** | Functional components, some hooks | Lifting state, some context | Cleanup in effects | React.memo basics |
| **3: Proficient** | Compound components, custom hooks | useReducer, Zustand/Context | Custom hooks encapsulate effects | useMemo, useCallback |
| **4: Advanced** | Render props, slots, polymorphic | Server state (TanStack Query) | Controlled side effects | Code splitting, virtualization |
| **5: Expert** | Headless UI, state machines | Zustand + server state + URL | xState or custom event bus | Concurrent features, streaming SSR |

Target: **Level 3+** for production apps. Level 4 for complex applications.

---

## Actionable Guidance

### Component Patterns

#### 1. Compound Components
```tsx
// Expose related components that share implicit state
<Select value={selected} onChange={setSelected}>
  <Select.Option value="1">Option 1</Select.Option>
  <Select.Option value="2">Option 2</Select.Option>
  <Select.Option value="3">Option 3</Select.Option>
</Select>
```

**When to use**: Complex UI widgets (selects, tabs, accordions, menus) where children share state.

**Implementation**:
```tsx
const SelectContext = createContext<SelectContextType | null>(null);

function Select({ children, value, onChange }: SelectProps) {
  return (
    <SelectContext.Provider value={{ value, onChange }}>
      <select className="select">{children}</select>
    </SelectContext.Provider>
  );
}

Select.Option = function Option({ value, children }: OptionProps) {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error('Option must be inside Select');
  return (
    <option
      value={value}
      selected={ctx.value === value}
      onClick={() => ctx.onChange(value)}
    >
      {children}
    </option>
  );
};
```

#### 2. Custom Hooks
Extract complex logic into reusable hooks. Hooks are your primary code reuse mechanism.

```tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function SearchResults({ query }: { query: string }) {
  const debouncedQuery = useDebounce(query, 300);
  const { data } = useQuery(['search', debouncedQuery], fetchResults);
  // ...
}
```

#### 3. Render Props / Slots
Let consumers control rendering while you control behavior.

```tsx
function DataList<T>({
  items,
  renderItem,
  renderEmpty,
}: {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  renderEmpty?: () => ReactNode;
}) {
  if (items.length === 0) {
    return renderEmpty?.() ?? <p>No items found.</p>;
  }
  return <ul>{items.map((item, i) => <li key={i}>{renderItem(item, i)}</li>)}</ul>;
}
```

### State Management

#### Local State (useState)
Best for: UI state, form inputs, toggle flags, single-component data.
```tsx
const [isOpen, setIsOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
```

#### Complex State (useReducer)
Best for: State with multiple sub-values, complex update logic, dependent state transitions.
```tsx
type State = { count: number; step: number };
type Action = { type: 'increment' } | { type: 'decrement' } | { type: 'setStep'; step: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment': return { ...state, count: state.count + state.step };
    case 'decrement': return { ...state, count: state.count - state.step };
    case 'setStep':   return { ...state, step: action.step };
  }
}
```

#### Server State (TanStack Query / SWR)
Best for: API data, caching, refetching, optimistic updates.
```tsx
function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json()),
  });

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  return <UserCard user={data} />;
}
```

#### Shared Client State (Zustand / Jotai)
Best for: Global UI state (theme, sidebar, auth), cross-component state.
```tsx
import { create } from 'zustand';

const useStore = create((set) => ({
  theme: 'light',
  sidebar: 'open',
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  })),
}));
```

### Performance Optimization

#### 1. Memoization Rules

| Tool | Use When | Don't Use When |
|------|----------|----------------|
| `React.memo` | Component renders often with same props | Props change every render anyway |
| `useMemo` | Expensive calculations (>1ms) | Simple arithmetic or access patterns |
| `useCallback` | Passing stable callbacks to memo'd children | Passing to DOM elements |

```tsx
// Good: useMemo for expensive computation
const sortedItems = useMemo(
  () => items.sort((a, b) => expensiveCompare(a, b)),
  [items]
);

// Overkill: useMemo for trivial computation
const total = useMemo(() => items.length + 1, [items]); // Just compute inline

// Good: useCallback for stable function reference
const handleClick = useCallback(() => {
  setCount(c => c + 1);
}, []); // No dependencies — stable forever
```

#### 2. Code Splitting
```tsx
import { lazy, Suspense } from 'react';

const AdminPanel = lazy(() => import('./AdminPanel'));

function App() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      {isAdmin ? <AdminPanel /> : <UserPanel />}
    </Suspense>
  );
}
```

#### 3. Virtualization
For long lists (1000+ items), use `react-window` or `@tanstack/virtual`:
```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div key={virtualItem.key} style={{
            position: 'absolute',
            top: 0,
            transform: `translateY(${virtualItem.start}px)`,
          }}>
            {items[virtualItem.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Common Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| **Big useEffect** | Single effect doing multiple, unrelated things | Split into multiple effects |
| **State as derived data** | Storing computed values in state | Use `useMemo` or compute inline |
| **Prop drilling** | Passing props through 5+ layers | Use composition or context (sparingly) |
| **Context for everything** | Re-rendering entire tree on any state change | Split contexts, use Zustand/Jotai |
| **Inline functions in render** | Breaking React.memo optimization | Move to stable references with useCallback |
| **Over-optimization** | Memoizing everything prematurely | Profile first, optimize second |

---

## Common Mistakes

1. **Overusing context**: Context causes re-renders in all consumers. For high-frequency updates, use Zustand or Jotai.
2. **Missing dependency arrays**: The React linting rule is not optional. Include all refs and state used inside effects.
3. **Async in effects without cleanup**: Fetch requests need AbortController. SetTimeouts need clearing.
4. **State cascades**: Setting state in one effect that triggers another effect. Prefer derived state.
5. **Not using key props**: Key props on lists enable efficient reconciliation. Use stable IDs, not indices.
6. **Direct DOM manipulation**: You're using React. Let React manage the DOM. Use refs sparingly.

---
name: refactoring-patterns
description: 'Systematic refactoring techniques, code smell elimination, pattern extraction, and legacy modernization'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: development
  tags: [refactoring, code-quality, patterns, legacy, modernization]
---

# Refactoring Patterns

Systematically improve code without changing its behavior.

## The Refactoring Workflow

1. **Identify** a code smell or pain point
2. **Ensure** you have tests (write them first if not)
3. **Apply** one refactoring at a time
4. **Test** after each change (green = continue, red = revert)
5. **Commit** — small, focused, descriptive
6. **Repeat**

## Extract Method
**When**: A method does multiple things or is too long.
**How**: Find a cohesive block → extract to new method → call it.

```javascript
// Before
function processOrder(order) {
  const total = order.items.reduce((sum, i) => sum + i.price, 0);
  const tax = total * 0.08;
  const discount = order.coupon ? total * 0.1 : 0;
  return total + tax - discount;
}

// After
function processOrder(order) {
  const subtotal = calculateSubtotal(order);
  const tax = calculateTax(subtotal);
  const discount = calculateDiscount(order, subtotal);
  return subtotal + tax - discount;
}
```

## Replace Conditional with Polymorphism
**When**: Switch/if-else chains based on type grow too long.

```javascript
// Before
function calculateShipping(order) {
  if (order.type === 'standard') return order.weight * 0.5;
  if (order.type === 'express') return order.weight * 1.5 + 5;
  if (order.type === 'overnight') return order.weight * 3 + 15;
}

// After
class StandardShipping {
  calculate(weight) { return weight * 0.5; }
}
class ExpressShipping {
  calculate(weight) { return weight * 1.5 + 5; }
}
```

## Legacy Code Strategy
1. **Characterize with tests**: Write tests that capture current behavior
2. **Sprout method**: Add new code in new methods, don't modify old
3. **Wrap method**: Wrap entire methods with new behavior (logging, caching)
4. **Step-by-step**: Extract small pieces over time
5. **Strangler pattern**: New code replaces old incrementally, old gets retired

## Common Refactorings
| Refactoring | When | Risk |
|-------------|------|------|
| Rename Variable | Unclear name | Low |
| Extract Method | Long function | Low |
| Replace Magic Literal | Hard-coded values | Low |
| Introduce Parameter Object | Many parameters | Medium |
| Replace Temp with Query | Reused expressions | Low |
| Decompose Conditional | Complex condition | Medium |
| Extract Class | Class doing too much | Medium-High |

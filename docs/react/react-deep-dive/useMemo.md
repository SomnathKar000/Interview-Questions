---
title: "useMemo - Deep Dive"
sidebar_position: 6
description: "Senior-level deep dive into useMemo — memoized values, referential equality, performance optimization, and when NOT to memoize."
---

# `useMemo` — Surface Level to Deep Dive

Most developers think:

> "`useMemo` is for performance optimization."

That's partially true.

But senior-level understanding is:

> `useMemo` caches computed values between renders based on dependencies.

And even more importantly:

> Most `useMemo` usage in real-world apps is unnecessary or incorrect.

This hook is heavily overused.

---

## 1. Surface Level — What is `useMemo`?

```jsx
const memoizedValue = useMemo(() => {
  return expensiveCalculation();
}, [dependencies]);
```

React:

- runs calculation
- stores result
- reuses cached result until dependencies change

### Example

```jsx
const doubled = useMemo(() => count * 2, [count]);
```

When `count` changes → recompute. Otherwise → reuse previous value.

---

## 2. Why `useMemo` Exists

Every render re-runs component function.

### Example

```jsx
function App() {
  const filtered = items.filter((item) => item.active);

  return <List items={filtered} />;
}
```

Filtering runs every render.

Usually fine. But if dataset huge, computation expensive, and renders frequent — then memoization may help.

---

## 3. Important Mental Model

:::important
`useMemo` is a **render optimization hint** — NOT state, NOT a guaranteed cache, NOT persistent storage.

React MAY discard memo cache (especially in future rendering optimizations).

- Never rely on memo for correctness
- Only for optimization
:::

---

## 4. How `useMemo` Works

### Initial Render

```jsx
const value = useMemo(() => compute(), [count]);
```

React: runs `compute()` → stores result → stores dependencies.

### Next Render

React compares `oldDeps vs newDeps`:

- If unchanged → returns cached value
- If changed → recomputes

---

## 5. Dependency Comparison

Uses:

```js
Object.is();
```

Mostly reference equality.

### Example

```jsx
const obj = {};
```

New reference every render.

So:

```jsx
useMemo(() => expensive(), [obj]);
```

recomputes every render.

---

## 6. Realistic Example

### ❌ Without `useMemo`

```jsx
const filteredUsers = users.filter((user) => user.active);
```

Runs every render.

### ✅ With `useMemo`

```jsx
const filteredUsers = useMemo(() => {
  return users.filter((user) => user.active);
}, [users]);
```

Now recalculates only when `users` changes.

---

## 7. Senior-Level Reality Check

Most computations are NOT expensive.

This:

```jsx
count * 2;
```

does NOT need memoization. Neither does `items.map(...)` in most apps.

:::warning[Cost of useMemo]
`useMemo` itself has overhead:

- dependency comparison
- cache storage
- memory usage

Sometimes memoization costs MORE than recalculation.
:::

---

## 8. When `useMemo` Actually Helps

### A. Expensive Computation

- large filtering
- sorting huge arrays
- parsing
- mathematical calculations
- graph processing

### B. Stable References

Very important.

#### ❌ Problem

```jsx
const config = {
  theme: "dark",
};
```

New object every render. Breaks memoization downstream.

#### ✅ Better

```jsx
const config = useMemo(
  () => ({
    theme: "dark",
  }),
  [],
);
```

Now stable reference.

---

## 9. Why Stable References Matter

Massive React topic.

```jsx
<Child config={{ dark: true }} />
```

New object each render. Even with `memo(Child)`, child still re-renders.

Why?

```js
{} !== {}
```

Reference changed.

### ✅ Solution

```jsx
const config = useMemo(
  () => ({
    dark: true,
  }),
  [],
);
```

Now reference stable.

---

## 10. `useMemo` + `React.memo`

Common pairing.

### Parent

```jsx
const data = useMemo(
  () => ({
    count,
  }),
  [count],
);

return <Child data={data} />;
```

### Child

```jsx
export default memo(Child);
```

Now child skips unnecessary renders.

---

## 11. Important Distinction

| | `useMemo` | `useCallback` |
|---|---|---|
| **Memoizes** | VALUE | FUNCTION |
| **Example** | `useMemo(() => compute(), [])` | `useCallback(() => {}, [])` |

---

## 12. Common Beginner Mistake

:::danger[Memoizing EVERYTHING]

❌ **BAD:**

```jsx
const doubled = useMemo(() => count * 2, [count]);
```

Unnecessary.

❌ **Worse:**

```jsx
const name = useMemo(() => "Somnath", []);
```

Completely pointless.
:::

:::tip[Senior Rule]
First: measure performance, identify bottleneck. Then optimize.
:::

---

## 13. Another Huge Mistake

Using `useMemo` for correctness.

### ❌ BAD

```jsx
const user = useMemo(() => getUser(), []);
```

assuming guaranteed persistence.

:::warning
React may discard memo cache.

`useMemo` is optimization only. NOT semantic state.
:::

---

## 14. Stale Dependency Bugs

Massive source of bugs.

### ❌ BAD

```jsx
const result = useMemo(() => {
  return items.filter((item) => item.includes(search));
}, [items]);
```

Missing `search`. Result becomes stale.

### ✅ Correct

```jsx
}, [items, search])
```

---

## 15. Over-Memoization Problem

Huge real-world issue.

Too many memos create:

- cognitive overhead
- harder debugging
- stale bugs
- dependency chaos

```jsx
const a = useMemo(...)
const b = useMemo(...)
const c = useMemo(...)
const d = useMemo(...)
```

Now dependency graph becomes nightmare.

---

## 16. React Rendering Truth Most Developers Miss

:::info
Re-rendering is NOT inherently bad.

React is optimized for frequent renders and cheap recalculation.

Avoid premature optimization.
:::

---

## 17. When Memoization REALLY Matters

| ✅ Usually worth it | ❌ Usually NOT worth it |
|---|---|
| large lists | tiny components |
| charts | simple arithmetic |
| realtime updates | ordinary forms |
| complex editors | |
| heavy transforms | |
| expensive selectors | |

---

## 18. Real Example — Expensive Sorting

### ❌ Without Memo

```jsx
const sortedUsers = users.sort(sortFn);
```

Runs every render.

### ✅ Better

```jsx
const sortedUsers = useMemo(() => {
  return [...users].sort(sortFn);
}, [users, sortFn]);
```

:::danger
Never mutate props/state:

```jsx
users.sort();
```

mutates original array.
:::

---

## 19. useMemo and Context Optimization

Very important real-world usage.

### ❌ BAD

```jsx
<AuthContext.Provider value={{ user, login }}>
```

New object every render. All consumers re-render.

### ✅ Better

```jsx
const value = useMemo(
  () => ({
    user,
    login,
  }),
  [user, login],
);
```

Now provider value stable.

---

## 20. useMemo Is NOT Free

Every memo adds:

- dependency tracking
- memory usage
- complexity

So memoization should produce **measurable benefit**.

---

## 21. Advanced React Understanding

Memoization interacts heavily with:

- referential equality
- reconciliation
- React.memo
- context propagation
- dependency arrays

This becomes core performance engineering.

---

## 22. Common Pitfalls

:::danger[Avoid these mistakes]

**A. Memoizing cheap calculations** — Usually wasteful.

**B. Missing dependencies** — Creates stale values.

**C. Overusing memoization** — Complexity explosion.

**D. Assuming memo persists forever** — Incorrect mental model.

**E. Mutating memoized objects** — `memoizedObj.x = 1` is dangerous.
:::

---

## 23. Important Internal Detail

`useMemo` runs DURING render.

Meaning:

- calculation must stay pure
- no side effects

### ❌ BAD

```jsx
useMemo(() => {
  fetchData();
}, []);
```

:::warning
Wrong hook. Use effects for side effects.
:::

---

## 24. Senior-Level Heuristic

:::tip[Use `useMemo` ONLY when at least one is true]

**A.** Computation measurably expensive

**B.** Stable reference required for optimization

**C.** Prevents expensive child re-renders

Otherwise: skip it.
:::

---

## 25. One of the Biggest Senior Insights

Most React performance problems are NOT missing `useMemo`.

They are:

- bad state placement
- unnecessary effects
- huge context updates
- render cascades
- unstable architecture

---

## 26. Common Interview Questions

### What does useMemo do?

Caches computed value between renders.

### Does useMemo guarantee caching?

No. React may discard cache.

### Difference between useMemo and useCallback?

`useMemo` caches value. `useCallback` caches function.

### Why can useMemo improve rendering?

Stable references reduce unnecessary child renders.

---

## 27. Final Senior-Level Insight

Most junior developers:

- don't optimize enough

Most intermediate developers:

- overuse `useMemo`

:::note
Senior engineers:

- optimize surgically
- understand render economics
- profile before optimizing
- prioritize architecture over memoization
:::

### One Sentence Summary

`useMemo` is a render-time value cache for optimization — NOT a state management tool.

---

**Useful references:**

- [React Docs - useMemo](https://react.dev/reference/react/useMemo?utm_source=chatgpt.com)
- [React Docs - Memoizing Expensive Calculations](https://react.dev/reference/react/useMemo?utm_source=chatgpt.com#skipping-expensive-recalculations)
- [React Docs - React.memo](https://react.dev/reference/react/memo?utm_source=chatgpt.com)

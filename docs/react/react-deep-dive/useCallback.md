---
title: "useCallback - Deep Dive"
sidebar_position: 7
description: "Senior-level deep dive into useCallback — function reference stabilization, React.memo pairing, stale closures, and when NOT to memoize functions."
---

# `useCallback` — Surface Level to Deep Dive

Most developers learn:

> "`useCallback` memoizes functions."

Technically correct.

But senior-level understanding is:

> `useCallback` stabilizes function references between renders to control re-rendering and dependency behavior.

And even more importantly:

> Most `useCallback` usage is unnecessary.

A huge amount of React codebases are over-memoized.

---

## 1. Surface Level — What is `useCallback`?

```jsx
const memoizedFn = useCallback(() => {
  doSomething();
}, [dependencies]);
```

React:

- stores function reference
- reuses same function until dependencies change

### Without `useCallback`

```jsx
const handleClick = () => {
  console.log("clicked");
};
```

New function created every render.

### With `useCallback`

```jsx
const handleClick = useCallback(() => {
  console.log("clicked");
}, []);
```

Same function reference reused.

---

## 2. Important JavaScript Reality

Functions are objects.

```js
(() => {}) === (() => {});
```

is `false`.

Every execution creates new reference.

:::info
React cares about reference equality heavily.
:::

---

## 3. Why Function References Matter

Usually: they DON'T.

:::important
This is the first major senior-level insight.
:::

```jsx
<button onClick={() => setCount(count + 1)}>
```

Perfectly fine. No optimization needed.

---

## 4. When Function Identity Actually Matters

Mainly in 3 situations:

| Situation | Why it matters |
|---|---|
| **A. `React.memo`** | Stable props prevent child re-renders |
| **B. Dependency arrays** | Stable deps prevent effect re-runs |
| **C. Expensive child renders** | Avoid unnecessary re-render cost |

---

## 5. `React.memo` Problem

### Parent

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log("click");
  };

  return <Child onClick={handleClick} />;
}
```

### Child

```jsx
export default memo(Child);
```

Still re-renders. Why? New function reference every render.

### ✅ Solution

```jsx
const handleClick = useCallback(() => {
  console.log("click");
}, []);
```

Now: stable reference → memo child can skip render.

---

## 6. Important Mental Model

:::info
`useCallback` does NOT prevent function creation.

React still creates function during render. It simply returns cached previous version if deps unchanged.
:::

### Internal Approximation

```js
if (depsChanged) {
  cache.fn = newFn;
}
return cache.fn;
```

---

## 7. `useCallback` vs `useMemo`

| | `useMemo` | `useCallback` |
|---|---|---|
| **Caches** | RESULT of function | FUNCTION ITSELF |
| **Example** | `useMemo(() => compute(), [])` | `useCallback(() => {}, [])` |

### Important Connection

This:

```jsx
useCallback(fn, deps);
```

is essentially:

```jsx
useMemo(() => fn, deps);
```

---

## 8. Dependency Arrays + useCallback

Huge topic.

### Example

```jsx
const increment = useCallback(() => {
  setCount(count + 1);
}, [count]);
```

Depends on `count` because closure captures it.

Missing dependency → stale closure bug.

---

## 9. Stale Closure Problem

### ❌ BAD

```jsx
const increment = useCallback(() => {
  setCount(count + 1);
}, []);
```

`count` frozen from first render.

### ✅ Correct

```jsx
}, [count])
```

OR:

```jsx
setCount((prev) => prev + 1);
```

then dependency may disappear.

---

## 10. Functional Updates + useCallback

Very important optimization pattern.

### ❌ Without functional update

```jsx
const increment = useCallback(() => {
  setCount(count + 1);
}, [count]);
```

Function recreated every count change.

### ✅ Better

```jsx
const increment = useCallback(() => {
  setCount((prev) => prev + 1);
}, []);
```

:::tip
Now: stable forever, no stale closure. Huge senior-level pattern.
:::

---

## 11. Real Use Cases

### A. Stable handlers for memoized children

### B. Event listeners

```jsx
useEffect(() => {
  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, [handleResize]);
```

Stable callback avoids unnecessary re-subscription.

### C. Context optimization

#### ❌ BAD

```jsx
<AuthContext.Provider value={{ login }}>
```

New function every render.

#### ✅ Better

```jsx
const login = useCallback(() => {}, []);
```

paired with `useMemo()`.

---

## 12. Most Common Beginner Mistake

:::danger[Wrapping EVERYTHING in useCallback]

```jsx
const onClick = useCallback(() => {
  console.log("click");
}, []);
```

for ordinary button. **Pointless.**

Function creation itself is cheap. Memoization also has overhead.
:::

---

## 13. useCallback Is NOT Free

Costs:

- dependency tracking
- memory
- complexity
- cognitive load

:::warning
Overusing it can hurt performance.
:::

---

## 14. Another Huge Mistake

Using `useCallback` without memoized children.

```jsx
const fn = useCallback(() => {}, []);
```

but:

- child not memoized
- function not dependency
- no optimization benefit

Completely unnecessary.

---

## 15. Real Performance Rule

:::important
`useCallback` only matters when **reference equality matters**.

Otherwise: ignore it.
:::

---

## 16. Event Handler Myth

Huge misconception.

Developers think: "new functions cause bad performance." Usually false.

React apps naturally recreate functions constantly. That's normal.

Real bottlenecks are usually:

- unnecessary renders
- huge trees
- context propagation
- effects
- expensive calculations

NOT function creation.

---

## 17. useCallback + Effects

Very important interaction.

### ❌ Problem

```jsx
const fetchData = () => {};
```

inside component.

```jsx
useEffect(() => {
  fetchData();
}, [fetchData]);
```

Runs every render because function reference changes.

### Solutions

#### A. Move function inside effect (BEST most of time)

```jsx
useEffect(() => {
  const fetchData = async () => {};
}, []);
```

#### B. useCallback

Only if function needed elsewhere.

---

## 18. React.memo + useCallback + useMemo Triangle

Core React optimization triangle.

| Tool | Purpose |
|---|---|
| `React.memo` | Skips child render if props stable |
| `useMemo` | Keeps object/array values stable |
| `useCallback` | Keeps function props stable |

Together: control render propagation.

---

## 19. Common Pitfalls

:::danger[Avoid these mistakes]

**A. Missing dependencies** — Creates stale closures.

**B. Overusing callbacks** — Adds complexity.

**C. Assuming callbacks improve everything** — Often no measurable benefit.

**D. Memoizing inline handlers unnecessarily** — Usually pointless.

**E. Fighting ESLint dependencies incorrectly** — Leads to bugs.
:::

---

## 20. Senior-Level Heuristic

:::tip[Use `useCallback` ONLY if]

**A.** Passing function to memoized child

**B.** Function appears in dependency array

**C.** Stable reference genuinely matters

Otherwise: skip it.
:::

---

## 21. One of the Biggest React Truths

Most React optimization problems are NOT solved by `useCallback`.

Architecture matters far more:

- state placement
- context splitting
- render boundaries
- effect minimization

---

## 22. Advanced Insight — Stable APIs

Libraries heavily use stable callbacks internally.

Examples:

- React Query
- Zustand
- Router libraries

Stable references:

- reduce subscriptions
- reduce reruns
- improve predictability

---

## 23. Common Interview Questions

### What does useCallback do?

Caches function reference between renders.

### Difference between useMemo and useCallback?

`useMemo` caches value. `useCallback` caches function.

### Does useCallback prevent function creation?

No. It returns cached reference.

### When should useCallback be used?

When stable function identity matters.

---

## 24. Final Senior-Level Insight

Most junior developers:

- ignore memoization entirely

Most intermediate developers:

- overuse `useCallback`

:::note
Senior engineers:

- understand render economics deeply
- optimize selectively
- measure before optimizing
- avoid premature memoization
:::

### One Sentence Summary

`useCallback` is a function reference stabilization tool — NOT a general performance magic hook.

---

**Useful references:**

- [React Docs - useCallback](https://react.dev/reference/react/useCallback?utm_source=chatgpt.com)
- [React Docs - memo](https://react.dev/reference/react/memo?utm_source=chatgpt.com)
- [React Docs - Removing Effect Dependencies](https://react.dev/learn/removing-effect-dependencies?utm_source=chatgpt.com)

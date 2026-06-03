---
title: "useCallback - Deep Dive"
sidebar_position: 7
description: "Senior-level deep dive into useCallback – performance optimization, and production patterns."
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

# 1. Surface Level — What is `useCallback`?

```jsx id="l3s8mr"
const memoizedFn = useCallback(() => {
  doSomething();
}, [dependencies]);
```

React:

- stores function reference
- reuses same function until dependencies change

---

# Without `useCallback`

```jsx id="8n8b8x"
const handleClick = () => {
  console.log("clicked");
};
```

New function created every render.

---

# With `useCallback`

```jsx id="d6m9mz"
const handleClick = useCallback(() => {
  console.log("clicked");
}, []);
```

Same function reference reused.

---

# 2. Important JavaScript Reality

Functions are objects.

---

# Example

```js id="zpt7mh"
() => {};
```

Every execution creates new reference.

---

# Meaning:

```js id="zz5k1z"
(() => {}) === (() => {});
```

is:

```txt id="85lb8i"
false
```

---

# React cares about reference equality heavily.

---

# 3. Why Function References Matter

Usually:
they DON'T.

This is the first major senior-level insight.

---

# Example

```jsx id="wn5wr7"
<button onClick={() => setCount(count + 1)}>
```

Perfectly fine.

No optimization needed.

---

# 4. When Function Identity Actually Matters

Mainly in 3 situations:

---

# A. `React.memo`

---

# B. Dependency arrays

---

# C. Expensive child renders

---

# 5. `React.memo` Problem

---

# Parent

```jsx id="qjlwm0"
function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log("click");
  };

  return <Child onClick={handleClick} />;
}
```

---

# Child

```jsx id="9vjlwm"
export default memo(Child);
```

Still re-renders.

Why?

Because:

```txt id="uqljlwm"
new function reference every render
```

---

# Solution

```jsx id="8jlwmf"
const handleClick = useCallback(() => {
  console.log("click");
}, []);
```

Now:

- stable reference
- memo child can skip render

---

# 6. Important Mental Model

`useCallback` does NOT:

- prevent function creation

React still creates function during render.

It simply:

- returns cached previous version if deps unchanged

---

# 7. Internal Approximation

Roughly behaves like:

```js id="jlwmic"
if (depsChanged) {
  cache.fn = newFn;
}

return cache.fn;
```

---

# 8. `useCallback` vs `useMemo`

---

# `useMemo`

Caches RESULT of function.

```jsx id="fjlwmz"
const value = useMemo(() => compute(), []);
```

---

# `useCallback`

Caches FUNCTION ITSELF.

```jsx id="f5jlwm"
const fn = useCallback(() => {}, []);
```

---

# Important Connection

This:

```jsx id="jlwmko"
useCallback(fn, deps);
```

is essentially:

```jsx id="jlwmll"
useMemo(() => fn, deps);
```

---

# 9. Dependency Arrays + useCallback

Huge topic.

---

# Example

```jsx id="jlwmmz"
const increment = useCallback(() => {
  setCount(count + 1);
}, [count]);
```

Depends on:

```jsx id="jlwmn9"
count;
```

---

# Why?

Because closure captures count.

Missing dependency:

- stale closure bug

---

# 10. Stale Closure Problem

---

# BAD

```jsx id="o0jlwm"
const increment = useCallback(() => {
  setCount(count + 1);
}, []);
```

`count` frozen from first render.

---

# Correct

```jsx id="p3jlwm"
}, [count])
```

OR:

```jsx id="r0jlwm"
setCount((prev) => prev + 1);
```

then dependency may disappear.

---

# 11. Functional Updates + useCallback

Very important optimization pattern.

---

# Without functional update

```jsx id="s6jlwm"
const increment = useCallback(() => {
  setCount(count + 1);
}, [count]);
```

Function recreated every count change.

---

# Better

```jsx id="u0jlwm"
const increment = useCallback(() => {
  setCount((prev) => prev + 1);
}, []);
```

Now:

- stable forever
- no stale closure

Huge senior-level pattern.

---

# 12. Real Use Cases

---

# A. Stable handlers for memoized children

---

# B. Event listeners

```jsx id="w9jlwm"
useEffect(() => {
  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, [handleResize]);
```

Stable callback avoids unnecessary re-subscription.

---

# C. Context optimization

---

# BAD

```jsx id="x7jlwm"
<AuthContext.Provider value={{ login }}>
```

New function every render.

---

# Better

```jsx id="y2jlwm"
const login = useCallback(() => {}, []);
```

paired with:

```jsx id="z1jlwm"
useMemo();
```

---

# 13. Most Common Beginner Mistake

Wrapping EVERYTHING in `useCallback`.

---

# BAD

```jsx id="a2jlwm"
const onClick = useCallback(() => {
  console.log("click");
}, []);
```

for ordinary button.

Pointless.

---

# Why?

Function creation itself is cheap.

Memoization also has overhead.

---

# 14. useCallback Is NOT Free

Costs:

- dependency tracking
- memory
- complexity
- cognitive load

Overusing it can hurt performance.

---

# 15. Another Huge Mistake

Using `useCallback` without memoized children.

---

# Example

```jsx id="b4jlwm"
const fn = useCallback(() => {}, []);
```

but:

- child not memoized
- function not dependency
- no optimization benefit

Completely unnecessary.

---

# 16. Real Performance Rule

`useCallback` only matters when:

- reference equality matters

Otherwise:
ignore it.

---

# 17. Event Handler Myth

Huge misconception.

---

# Developers think:

```txt id="c7jlwm"
new functions cause bad performance
```

Usually false.

React apps naturally recreate functions constantly.

That's normal.

---

# Real bottlenecks are usually:

- unnecessary renders
- huge trees
- context propagation
- effects
- expensive calculations

NOT function creation.

---

# 18. useCallback + Effects

Very important interaction.

---

# Problem

```jsx id="d8jlwm"
const fetchData = () => {};
```

inside component.

---

# Effect

```jsx id="e5jlwm"
useEffect(() => {
  fetchData();
}, [fetchData]);
```

Runs every render.

Because function reference changes.

---

# Solutions

---

# A. Move function inside effect

BEST most of time.

```jsx id="f1jlwm"
useEffect(() => {
  const fetchData = async () => {};
}, []);
```

---

# B. useCallback

Only if function needed elsewhere.

---

# 19. React.memo + useCallback + useMemo Triangle

Core React optimization triangle.

---

# `React.memo`

Skips child render if props stable.

---

# `useMemo`

Keeps object/array values stable.

---

# `useCallback`

Keeps function props stable.

---

# Together:

control render propagation.

---

# 20. Common Pitfalls

---

# A. Missing dependencies

Creates stale closures.

---

# B. Overusing callbacks

Adds complexity.

---

# C. Assuming callbacks improve everything

Often no measurable benefit.

---

# D. Memoizing inline handlers unnecessarily

Usually pointless.

---

# E. Fighting ESLint dependencies incorrectly

Leads to bugs.

---

# 21. Senior-Level Heuristic

Use `useCallback` ONLY if:

---

# A.

Passing function to memoized child

---

# B.

Function appears in dependency array

---

# C.

Stable reference genuinely matters

---

# Otherwise:

skip it.

---

# 22. One of the Biggest React Truths

Most React optimization problems are:
NOT solved by `useCallback`.

Architecture matters far more:

- state placement
- context splitting
- render boundaries
- effect minimization

---

# 23. Advanced Insight — Stable APIs

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

# 24. Common Interview Questions

---

# What does useCallback do?

Caches function reference between renders.

---

# Difference between useMemo and useCallback?

`useMemo` caches value.
`useCallback` caches function.

---

# Does useCallback prevent function creation?

No.
It returns cached reference.

---

# When should useCallback be used?

When stable function identity matters.

---

# 25. Final Senior-Level Insight

Most junior developers:

- ignore memoization entirely

Most intermediate developers:

- overuse `useCallback`

Senior engineers:

- understand render economics deeply
- optimize selectively
- measure before optimizing
- avoid premature memoization

---

# One Sentence Summary

`useCallback` is a function reference stabilization tool —
NOT a general performance magic hook.

---

Useful references:

- [React Docs - useCallback](https://react.dev/reference/react/useCallback?utm_source=chatgpt.com)
- [React Docs - memo](https://react.dev/reference/react/memo?utm_source=chatgpt.com)
- [React Docs - Removing Effect Dependencies](https://react.dev/learn/removing-effect-dependencies?utm_source=chatgpt.com)

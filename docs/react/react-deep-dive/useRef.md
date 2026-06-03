---
title: "useRef - Deep Dive"
sidebar_position: 2
description: "Senior-level deep dive into useRef — closures, batching, immutability, derived state, and architectural tradeoffs."
---

# `useRef` — Surface Level to Deep Dive

Most developers initially think:

> "`useRef` is for accessing DOM elements."

That's only ~20% of its actual importance.

At senior level, `useRef` is really about:

- persistent mutable storage across renders
- avoiding unnecessary renders
- escaping React's render cycle
- preventing stale closures
- interacting with imperative systems
- performance optimization
- synchronization between renders

---

# 1. Surface Level — What is `useRef`?

```jsx
const ref = useRef(initialValue);
```

Returns:

```js
{
  current: initialValue;
}
```

Example:

```jsx
const countRef = useRef(0);
```

Access:

```jsx
countRef.current;
```

Update:

```jsx
countRef.current += 1;
```

---

# 2. Most Important Difference

# `useState`

```jsx
setCount(5);
```

→ causes re-render

---

# `useRef`

```jsx
ref.current = 5;
```

→ does NOT re-render

This is the single biggest conceptual difference.

---

# 3. Mental Model

## `useState`

Stores data for UI rendering.

---

## `useRef`

Stores mutable data for logic/runtime purposes.

---

# 4. DOM Access (The Common Use Case)

```jsx
const inputRef = useRef();

useEffect(() => {
  inputRef.current.focus();
}, []);

return <input ref={inputRef} />;
```

React assigns DOM node to:

```jsx
inputRef.current;
```

---

# Real Use Cases

- focus input
- scroll element
- measure dimensions
- play/pause video
- canvas manipulation
- third-party libraries

---

# 5. Why `useRef` Persists Between Renders

This confuses many developers.

---

# Example

```jsx
function App() {
  const ref = useRef(0);

  console.log(ref);

  return <button>Click</button>;
}
```

Component re-runs every render.

But `ref.current` persists.

Why?

Because React stores hook data outside the component function internally.

Exactly like `useState`.

---

# 6. Why Changing `ref.current` Doesn't Re-render

React does NOT track mutations inside refs.

This:

```jsx
ref.current = 10;
```

doesn't notify React.

React only re-renders on:

- state changes
- prop changes
- context changes
- forced updates

---

# 7. Senior-Level Understanding

`useRef` is basically:

> "An instance variable for function components."

Equivalent to:

```js
this.someValue;
```

from class components.

---

# 8. Common Practical Use Cases

---

# A. Store Timer IDs

```jsx
const timerRef = useRef();

useEffect(() => {
  timerRef.current = setInterval(() => {
    console.log("running");
  }, 1000);

  return () => clearInterval(timerRef.current);
}, []);
```

Avoids re-renders.

---

# B. Previous Value Tracking

```jsx
const prevCount = useRef();

useEffect(() => {
  prevCount.current = count;
}, [count]);
```

Now:

```jsx
prevCount.current;
```

contains previous render's value.

---

# C. Avoid Stale Closures

Huge real-world use case.

---

## Problem

```jsx
setTimeout(() => {
  console.log(count);
}, 3000);
```

Captures old value.

---

## Solution

```jsx
const countRef = useRef(count);

useEffect(() => {
  countRef.current = count;
}, [count]);
```

Now:

```jsx
setTimeout(() => {
  console.log(countRef.current);
}, 3000);
```

always gets latest value.

---

# Why This Works

Refs are mutable objects.

Closures capture object reference,
not snapshot value.

---

# 9. `useRef` vs Variable

---

# Wrong

```jsx
let counter = 0;
```

Resets every render.

---

# Correct

```jsx
const counterRef = useRef(0);
```

Persists.

---

# 10. `useRef` vs `useState`

| Feature                  | useState              | useRef     |
| ------------------------ | --------------------- | ---------- |
| Persists between renders | YES                   | YES        |
| Causes re-render         | YES                   | NO         |
| Mutable                  | NO (shouldn't mutate) | YES        |
| Used for UI              | YES                   | Usually NO |
| Tracked by React         | YES                   | NO         |

---

# 11. Important Rule

# Never use refs for UI rendering

---

## Bad

```jsx
const countRef = useRef(0);

return <div>{countRef.current}</div>;
```

Updating:

```jsx
countRef.current++;
```

won't update UI.

---

# Correct

Use state for renderable UI.

Refs are for:

- runtime data
- mutable storage
- imperative logic

---

# 12. Senior-Level Use Cases

---

# A. Prevent Double Submission

```jsx
const isSubmitting = useRef(false);

const handleSubmit = async () => {
  if (isSubmitting.current) return;

  isSubmitting.current = true;

  await apiCall();

  isSubmitting.current = false;
};
```

Avoids unnecessary renders.

---

# B. WebSocket Storage

```jsx
const socketRef = useRef();
```

Persist connection across renders.

---

# C. External Libraries

```jsx
const chartRef = useRef();
```

Store chart instance.

---

# D. Animation Frames

```jsx
const frameRef = useRef();
```

Store requestAnimationFrame ID.

---

# 13. `forwardRef`

Advanced React topic.

Normally:

```jsx
<MyComponent ref={ref} />
```

doesn't work for custom components.

Need:

```jsx
forwardRef();
```

---

# Example

```jsx
const Input = forwardRef((props, ref) => {
  return <input ref={ref} />;
});
```

Now parent can access internal DOM node.

---

# 14. `useImperativeHandle`

Even deeper.

Lets child expose controlled API.

---

# Example

```jsx
useImperativeHandle(ref, () => ({
  focus() {
    inputRef.current.focus();
  },
}));
```

Parent:

```jsx
childRef.current.focus();
```

---

# Senior Use Case

Complex reusable components:

- modals
- editors
- video players
- canvas engines

---

# 15. React Rendering + Refs

Important:

Changing refs during render is dangerous.

---

# Bad

```jsx
ref.current++;
```

inside component body.

Can create inconsistent behavior.

---

# Safe Places

- event handlers
- effects
- callbacks

---

# 16. Refs and Concurrent Rendering

This becomes advanced React internals.

Refs are mutable escape hatches.

In concurrent rendering:

- React may render multiple versions
- refs bypass React tracking

This means careless ref usage can:

- create tearing
- inconsistent state
- race conditions

---

# Senior Rule

Prefer state when UI matters.

Use refs only when:

- mutation should NOT render
- imperative access needed
- synchronization required

---

# 17. Common Pitfalls

---

# A. Using ref instead of state

```jsx
ref.current = value;
```

but expecting UI update.

---

# B. Overusing refs

Refs bypass React architecture.

Too many refs:

- unpredictable code
- imperative spaghetti
- synchronization bugs

---

# C. Mutating refs during render

Can break concurrent assumptions.

---

# D. Forgetting null checks

```jsx
inputRef.current.focus();
```

may crash before mount.

---

# Safe

```jsx
inputRef.current?.focus();
```

---

# 18. Real Senior Interview Questions

---

# Why does `useRef` persist between renders?

Because React stores hook data outside component execution.

---

# Why doesn't updating ref trigger render?

React doesn't track `ref.current` mutations.

---

# When should `useRef` replace `useState`?

When value:

- should persist
- should NOT affect UI
- should avoid re-render

---

# Why are refs considered escape hatches?

Because they bypass React's declarative rendering model.

---

# 19. Internal Mental Model

Approximate idea:

```js
function useRef(initialValue) {
  return {
    current: initialValue,
  };
}
```

Except React preserves same object across renders.

---

# 20. Real Architecture Understanding

Senior engineers use `useRef` carefully because:

Every ref introduces:

- mutability
- imperative behavior
- non-reactive state

Which reduces predictability.

---

# 21. Decision Framework

# Use `useState` when:

- UI depends on value
- render should update
- declarative rendering needed

---

# Use `useRef` when:

- mutable storage needed
- no re-render required
- DOM access needed
- avoiding stale closures
- external instance persistence

---

# 22. One of the Most Important Patterns

# Combining `useRef` + `useEffect`

---

## Example

```jsx
const latestCallback = useRef(callback);

useEffect(() => {
  latestCallback.current = callback;
}, [callback]);
```

Used heavily in:

- libraries
- subscriptions
- intervals
- async systems

This avoids stale closures without re-subscribing.

---

# 23. Final Senior-Level Insight

`useRef` is not just:

> "DOM access hook"

It's actually:

> "Persistent mutable container outside React rendering."

That makes it extremely powerful —
and dangerous if misused.

Most junior developers underuse it.

Most intermediate developers overuse it.

Senior engineers know exactly:

- when React reactivity is needed
- when mutation is safer
- when refs improve performance
- when refs break predictability

---

Useful references:

- [React Docs - useRef](https://react.dev/reference/react/useRef?utm_source=chatgpt.com)
- [React Docs - Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs?utm_source=chatgpt.com)
- [React Docs - Manipulating the DOM with Refs](https://react.dev/learn/manipulating-the-dom-with-refs?utm_source=chatgpt.com)

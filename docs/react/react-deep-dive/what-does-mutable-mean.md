---
title: "Mutability in React"
sidebar_position: 3
description: "Understanding mutability vs immutability in React — why useState is immutable, why useRef is mutable, and the senior-level ref + state pattern."
---

# What Does "Mutable" Actually Mean?

Mutable means:

> a value can be changed directly after creation.

---

## 1. Mutable vs Immutable

### Mutable Example

```js
const obj = { count: 0 };

obj.count = 1;
```

The object itself was modified.

Same memory reference. Only internal value changed.

### Immutable Example

Instead of modifying:

```js
obj.count = 1;
```

you create a new object:

```js
const newObj = {
  ...obj,
  count: 1,
};
```

Now:

- old reference != new reference
- React can detect change easily

### Why React Prefers Immutability

React rendering relies heavily on:

```js
oldRef !== newRef;
```

:::info
Reference comparison is cheap.

Deep comparison is expensive.
:::

---

## 2. Why `useState` Says "Shouldn't Mutate"

Technically you _can_ mutate state.

Example:

```jsx
const [user, setUser] = useState({
  name: "Somnath",
});

user.name = "John";
```

This is mutation.

But React won't reliably detect it.

### ❌ Problem

```jsx
setUser(user);
```

Reference remains same.

:::danger
React may skip rendering.
:::

### ✅ Correct

```jsx
setUser((prev) => ({
  ...prev,
  name: "John",
}));
```

New object reference created.

React sees:

```js
oldRef !== newRef;
```

and re-renders.

---

## 3. Why Refs ARE Mutable

This is intentional design.

```jsx
const ref = useRef(0);

ref.current = 10;
```

React EXPECTS this.

Because refs are meant for:

- mutable runtime values
- instance storage
- imperative behavior

---

## 4. The Confusion: "Why Not useState Instead?"

Example:

```jsx
const isSubmitting = useRef(false);

const handleSubmit = async () => {
  if (isSubmitting.current) return;

  isSubmitting.current = true;

  await apiCall();

  isSubmitting.current = false;
};
```

Let's break it down deeply.

---

## 5. Why This Works

The ref stores mutable value across renders.

When button clicked:

```jsx
if (isSubmitting.current) return;
```

prevents duplicate submission.

:::info[Important Part]
Changing `isSubmitting.current = true` does NOT re-render component.

That's the whole point.
:::

---

## 6. What If We Used `useState`?

```jsx
const [isSubmitting, setIsSubmitting] = useState(false);
```

Then:

```jsx
setIsSubmitting(true);
```

causes re-render. Is that bad? Depends.

---

## 7. When `useState` is CORRECT

If UI depends on it:

```jsx
<button disabled={isSubmitting}>Submit</button>
```

Then state is correct. Because UI must update.

---

## 8. When `useRef` is BETTER

If value is purely logical/runtime:

- prevent duplicate requests
- prevent race conditions
- track mounted state
- store websocket instance
- store timers

Then ref avoids unnecessary renders.

### Senior-Level Distinction

| | `useState` | `useRef` |
|---|---|---|
| **Purpose** | Reactive value for rendering | Non-reactive mutable container |

---

## 9. Why Senior Engineers Use Refs for Submission Guards

Imagine:

```jsx
setIsSubmitting(true);
```

Triggers render.

During rapid clicks:

- render scheduling
- batching
- async timing

can create edge-case race conditions.

Ref updates instantly synchronously:

```jsx
isSubmitting.current = true;
```

No render involved. Immediate mutable lock.

---

## 10. Timeline Comparison

### Using State

```jsx
setIsSubmitting(true);
```

```txt
schedule render → React batches update → next render happens → state becomes true
```

:::warning
NOT immediate inside React lifecycle.
:::

### Using Ref

```jsx
isSubmitting.current = true;
```

```txt
value changes instantly
```

No scheduling. No render. Immediate mutation.

---

## 11. Real-World Example

### ❌ BAD

```jsx
const [loading, setLoading] = useState(false);

const handleClick = async () => {
  if (loading) return;

  setLoading(true);

  await api();

  setLoading(false);
};
```

Rapid clicks MAY still sneak through in some edge timing scenarios.

### ✅ STRONGER

```jsx
const loadingRef = useRef(false);

const handleClick = async () => {
  if (loadingRef.current) return;

  loadingRef.current = true;

  await api();

  loadingRef.current = false;
};
```

Immediate synchronous lock.

---

## 12. Best Production Pattern

Actually combine BOTH.

### Real Senior Pattern

```jsx
const loadingRef = useRef(false);
const [loading, setLoading] = useState(false);

const handleClick = async () => {
  if (loadingRef.current) return;

  loadingRef.current = true;
  setLoading(true);

  try {
    await api();
  } finally {
    loadingRef.current = false;
    setLoading(false);
  }
};
```

:::tip[Why BOTH?]
- **Ref:** prevents race conditions, immediate lock
- **State:** updates UI
:::

---

## 13. Another Important Insight

Refs are NOT reactive.

Meaning:

```jsx
console.log(ref.current);
```

always gets latest value.

But React UI doesn't care automatically.

---

## 14. Why React Allows Mutable Refs

Because some things fundamentally require mutation:

- DOM nodes
- timers
- sockets
- observers
- media players
- animations
- imperative APIs

:::info
Trying to force pure immutability there becomes awkward and inefficient.
:::

---

## 15. Senior-Level Mental Model

| State = Declarative World | Ref = Imperative World |
|---|---|
| "UI should look like this" | "Store this mutable thing somewhere" |

---

## 16. One Sentence Summary

:::note
`useState` → reactive immutable render state

`useRef` → persistent mutable runtime storage

That distinction is foundational in advanced React.
:::

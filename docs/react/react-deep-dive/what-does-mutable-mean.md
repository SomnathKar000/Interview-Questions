---
title: "What does Mutable mean?"
sidebar_position: 3
description: "Senior-level deep dive into Mutable — closures, batching, immutability, derived state, and architectural tradeoffs."
---

# 1. What does "mutable" actually mean?

Mutable means:

> a value can be changed directly after creation.

---

# Mutable Example

```js
const obj = { count: 0 };

obj.count = 1;
```

The object itself was modified.

Same memory reference.
Only internal value changed.

---

# Immutable Example

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

---

# Why React prefers immutability

React rendering relies heavily on:

```js
oldRef !== newRef;
```

Reference comparison is cheap.

Deep comparison is expensive.

---

# 2. Why `useState` says "shouldn't mutate"

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

---

# Problem

```jsx
setUser(user);
```

Reference remains same.

React may skip rendering.

---

# Correct

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

# 3. Why refs ARE mutable

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

# 4. The confusion: "Why not useState instead?"

Your example:

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

# 5. Why this works

The ref stores mutable value across renders.

When button clicked:

```jsx
if (isSubmitting.current) return;
```

prevents duplicate submission.

---

# Important Part

Changing:

```jsx
isSubmitting.current = true;
```

does NOT re-render component.

That's the whole point.

---

# 6. What if we used `useState`?

```jsx
const [isSubmitting, setIsSubmitting] = useState(false);
```

Then:

```jsx
setIsSubmitting(true);
```

causes re-render.

---

# Is that bad?

Depends.

---

# 7. When `useState` is CORRECT

If UI depends on it:

```jsx
<button disabled={isSubmitting}>Submit</button>
```

Then state is correct.

Because UI must update.

---

# 8. When `useRef` is BETTER

If value is purely logical/runtime:

```jsx
prevent duplicate requests
prevent race conditions
track mounted state
store websocket instance
store timers
```

Then ref avoids unnecessary renders.

---

# Senior-level distinction

# `useState`

Reactive value for rendering.

---

# `useRef`

Non-reactive mutable container.

---

# 9. Why senior engineers use refs for submission guards

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

No render involved.

Immediate mutable lock.

---

# 10. Timeline Comparison

---

# Using State

```jsx
setIsSubmitting(true);
```

Flow:

```txt
schedule render
React batches update
next render happens
state becomes true
```

NOT immediate inside React lifecycle.

---

# Using Ref

```jsx
isSubmitting.current = true;
```

Flow:

```txt
value changes instantly
```

No scheduling.

No render.

Immediate mutation.

---

# 11. Real-world example

---

# BAD

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

---

# STRONGER

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

# 12. Best Production Pattern

Actually combine BOTH.

---

# Real Senior Pattern

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

---

# Why BOTH?

# Ref:

- prevents race conditions
- immediate lock

# State:

- updates UI

---

# 13. Another important insight

Refs are NOT reactive.

Meaning:

```jsx
console.log(ref.current);
```

always gets latest value.

But React UI doesn't care automatically.

---

# 14. Why React allows mutable refs

Because some things fundamentally require mutation:

- DOM nodes
- timers
- sockets
- observers
- media players
- animations
- imperative APIs

Trying to force pure immutability there becomes awkward and inefficient.

---

# 15. Senior-level mental model

# State = declarative world

```txt
UI should look like this
```

---

# Ref = imperative world

```txt
store this mutable thing somewhere
```

---

# 16. One sentence summary

`useState`
→ reactive immutable render state

`useRef`
→ persistent mutable runtime storage

That distinction is foundational in advanced React.

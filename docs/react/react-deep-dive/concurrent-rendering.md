---
title: "Concurrent Rendering"
sidebar_position: 14
description: "Senior-level deep dive into Concurrent Rendering — how React decides when to re-render, when to skip, and how to optimize it."
---

# Concurrent Rendering — The Most Misunderstood React Topic

When developers hear **Concurrent Rendering**, they often think:

> "React renders components in parallel."

That's **not what it means**.

React is still mostly running JavaScript on a single thread.

A better definition:

> Concurrent Rendering allows React to interrupt, pause, resume, and prioritize rendering work.

This is one of the biggest architectural changes introduced in React 18.

---

# 1. The Problem Before React 18

Imagine:

```jsx
function HugeList() {
  return items.map((item) => <Row key={item.id} />);
}
```

Suppose:

```txt
10,000 rows
```

need rendering.

---

Old React:

```txt
Start render
↓
Render row 1
↓
Render row 2
↓
...
↓
Render row 10000
↓
Finish
```

During this time:

```txt
Typing
Scrolling
Clicking
```

can feel laggy.

Because React blocks the main thread until rendering finishes.

---

# 2. Concurrent Rendering Idea

Instead:

```txt
Render row 1
Render row 2
Render row 3

Pause

User clicks button

Handle click

Resume rendering
```

React can yield control back to the browser.

This improves responsiveness.

---

# 3. Key Concept: Interruptible Rendering

Old React:

```txt
Render must finish
```

---

Concurrent React:

```txt
Render can pause
Render can restart
Render can abandon work
```

---

Example:

```txt
Start rendering search results
↓
User types another character
↓
Previous render becomes obsolete
↓
Throw it away
↓
Start fresh render
```

---

# 4. Why This Matters

Imagine search:

```jsx
<input />
```

Typing:

```txt
r
re
rea
reac
react
```

---

Without concurrency:

```txt
Render results
Wait
Render results
Wait
Render results
Wait
```

UI may stutter.

---

With concurrency:

```txt
User typing = high priority

Search results = low priority
```

Typing stays smooth.

---

# 5. Priority-Based Rendering

React internally assigns priorities.

Think:

```txt
Urgent
Normal
Background
```

---

Examples

### Urgent

```txt
Typing
Clicking
Dragging
```

---

### Less Urgent

```txt
Search filtering
Large list updates
Analytics
```

---

React can prioritize urgent work.

---

# 6. Render Can Be Thrown Away

This surprises many developers.

Imagine:

---

Render A starts

```txt
search = "rea"
```

---

Before completion:

```txt
search = "react"
```

---

React may discard:

```txt
search = "rea"
```

render entirely.

Never committed.

---

Important:

```txt
Render happened
Commit never happened
```

---

# 7. Why Render Must Stay Pure

This is one reason React insists:

```txt
No side effects during render
```

---

Bad:

```jsx
function App() {
  fetch("/api");
}
```

---

Imagine:

```txt
Render starts
↓
fetch called
↓
React abandons render
↓
fetch already happened
```

Now side effect occurred for work React never committed.

---

Hence:

```txt
Render = Pure
Effects = Side effects
```

---

# 8. useEffect and Concurrent Rendering

Effects only run after commit.

---

Timeline:

```txt
Render
↓
Reconciliation
↓
Commit
↓
useEffect
```

---

If render gets abandoned:

```txt
Render
↓
Cancelled
```

Effect never runs.

---

This makes effects safe.

---

# 9. Automatic Batching

React 18 introduced expanded batching.

---

Before:

```jsx
setCount(1);
setName("John");
```

inside async code:

```txt
Render
Render
```

---

Now:

```txt
Single render
```

---

Example:

```jsx
fetchData().then(() => {
  setUser(user);
  setLoading(false);
});
```

React batches updates.

---

# 10. startTransition()

One of the most important APIs.

---

Allows marking updates as non-urgent.

---

Example:

```jsx
import { startTransition } from "react";

startTransition(() => {
  setSearchResults(results);
});
```

---

React treats:

```txt
Search results update
```

as lower priority.

---

Meanwhile:

```txt
Typing
```

remains responsive.

---

# Real Example

```jsx
const [input, setInput] = useState("");
const [query, setQuery] = useState("");

const handleChange = (e) => {
  setInput(e.target.value);

  startTransition(() => {
    setQuery(e.target.value);
  });
};
```

---

Priority:

```txt
Input value update
↑ High Priority

Search results update
↑ Low Priority
```

---

Typing stays smooth.

---

# 11. useTransition()

Hook version of startTransition.

---

```jsx
const [isPending, startTransition] = useTransition();
```

---

Usage:

```jsx
startTransition(() => {
  setResults(newResults);
});
```

---

Display loading state:

```jsx
{
  isPending ? "Loading..." : results;
}
```

---

# 12. useDeferredValue()

Another concurrent feature.

---

Imagine:

```jsx
const [search, setSearch] = useState("");
```

---

Large filtering:

```jsx
const deferredSearch = useDeferredValue(search);
```

---

React lets:

```txt
Input update immediately
```

while:

```txt
Heavy filtering catches up later
```

---

Very useful for:

```txt
Search
Large tables
Big lists
Dashboards
```

---

# 13. Strict Mode and Concurrency

Why does React sometimes render twice?

---

Development:

```txt
Render
Render
```

---

React intentionally checks:

```txt
Purity
Cleanup correctness
Concurrency safety
```

---

This prepares components for concurrent rendering.

---

# 14. State as Snapshots

Concurrency reinforces this concept.

---

Render 1:

```txt
count = 0
```

---

Render 2:

```txt
count = 1
```

---

Render 3:

```txt
count = 2
```

Each render has its own snapshot.

React may work on multiple snapshots internally.

---

# 15. What Concurrent Rendering Does NOT Mean

---

## Not Multi-threading

Wrong:

```txt
CPU 1 renders App
CPU 2 renders Sidebar
```

React doesn't do this.

---

## Not Parallel JavaScript

JavaScript remains mostly single-threaded.

---

## Not Faster Rendering

Goal is:

```txt
Better responsiveness
```

not necessarily:

```txt
Less rendering time
```

---

# 16. Why useMemo/useCallback Matter More

In concurrent rendering:

React may render more frequently.

Therefore:

```txt
Expensive calculations
```

become more noticeable.

Proper memoization becomes more valuable.

---

# 17. Why React.memo Still Matters

Concurrent rendering may:

```txt
Start render
Pause
Resume
```

But React.memo can still skip unnecessary child renders.

---

# 18. Real Senior-Level Example

Imagine:

```txt
Dashboard
  ↓
100 widgets
  ↓
Charts
Tables
Lists
```

User types:

```txt
Search box
```

---

Without concurrency:

```txt
Type
Wait
Type
Wait
```

---

With:

```jsx
startTransition(...)
```

React prioritizes:

```txt
Typing
```

and delays:

```txt
Dashboard updates
```

---

Much smoother UX.

---

# 19. Interview Questions

### What is Concurrent Rendering?

React's ability to interrupt, prioritize, pause, resume, and discard rendering work.

---

### Does Concurrent Rendering mean parallel rendering?

No.

JavaScript remains primarily single-threaded.

---

### Why must render stay pure?

Because React may abandon renders before commit.

---

### What does startTransition do?

Marks updates as low priority.

---

### Difference between useTransition and useDeferredValue?

`useTransition`

```txt
Marks updates as low priority
```

---

`useDeferredValue`

```txt
Delays consumption of a value
```

---

# 20. Senior-Level Mental Model

Old React:

```txt
State Update
      ↓
Render Everything
      ↓
Commit
```

---

Concurrent React:

```txt
State Update
      ↓
Schedule Work
      ↓
Prioritize
      ↓
Pause / Resume
      ↓
Discard Obsolete Work
      ↓
Commit Latest Version
```

---

# One-Sentence Summary

**Concurrent Rendering doesn't make React render in parallel; it makes rendering interruptible and priority-aware so the UI stays responsive even during expensive updates.**

---

# Where Concurrent Features Actually Matter

You'll most commonly use them in:

- Large search interfaces
- Data grids
- Dashboards
- Analytics tools
- IDE-like applications
- Design tools
- Large forms
- Chat applications
- Infinite scrolling UIs

For most CRUD apps, you may never explicitly use `startTransition`, but understanding Concurrent Rendering is crucial because it explains many modern React behaviors, including Strict Mode, render purity, effects, batching, and the future direction of React.

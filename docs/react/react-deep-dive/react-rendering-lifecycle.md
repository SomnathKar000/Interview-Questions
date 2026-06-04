---
title: "React Rendering Lifecycle"
sidebar_position: 12
description: "Senior-level deep dive into React Rendering Lifecycle — how React decides when to re-render, when to skip, and how to optimize it."
---

# React Rendering Lifecycle — The Most Important React Concept

If you understand:

- `useState`
- `useEffect`
- `useMemo`
- `useCallback`
- `React.memo`

but **don't understand rendering**, you'll struggle to reason about React performance and bugs.

Most React interview questions eventually reduce to:

> "When does React render and what happens during a render?"

---

# 1. First Principle

React components are functions.

```jsx
function Counter() {
  console.log("render");

  return <div>Hello</div>;
}
```

React renders by **calling the function**.

---

# Initial Render

```txt
React
 ↓
Call Counter()
 ↓
Get JSX
 ↓
Build Virtual DOM
 ↓
Update DOM
```

---

# Re-render

Whenever React decides:

```txt
Call Counter() again
```

The component function executes again from top to bottom.

---

# 2. What Causes a Render?

There are only a few reasons.

---

## State Change

```jsx
setCount(1);
```

Triggers render.

---

## Parent Re-render

```txt
Parent Render
 ↓
Child Render
```

By default children render too.

---

## Context Change

```jsx
const theme = useContext(ThemeContext);
```

Provider updates:

```txt
Consumer re-renders
```

---

## Reducer Update

```jsx
dispatch(...)
```

Triggers render.

---

# 3. What Does NOT Cause a Render?

Very common interview question.

---

## Ref Changes

```jsx
ref.current = 10;
```

No render.

---

## Local Variables

```jsx
let count = 0;
```

No render tracking.

---

## useMemo Cache Updates

Not a render trigger.

---

## useCallback Cache Updates

Not a render trigger.

---

# 4. Render ≠ DOM Update

Most developers confuse these.

---

Example:

```jsx
setCount(1);
```

React renders:

```txt
Call component
Create new JSX
Compare with previous JSX
```

Then React asks:

```txt
Did UI actually change?
```

---

Maybe:

```jsx
<div>Hello</div>
```

before

and

```jsx
<div>Hello</div>
```

after

No DOM update needed.

---

# Render Happened

DOM update didn't.

Huge distinction.

---

# 5. React Render Phases

Modern React has two major phases.

---

## Render Phase

Calculate what UI should look like.

---

## Commit Phase

Apply changes to DOM.

---

Timeline:

```txt
Render Phase
      ↓
Commit Phase
      ↓
Effects Run
```

---

# 6. Render Phase

During render React:

```txt
Calls component functions
Calls hooks
Creates JSX
Builds Virtual DOM
```

---

Example:

```jsx
function App() {
  const [count] = useState(0);

  return <h1>{count}</h1>;
}
```

During render:

```txt
App()
 ↓
useState()
 ↓
JSX created
```

---

# Important Rule

Render phase must stay pure.

---

# Bad

```jsx
function App() {
  fetch("/api");
}
```

Side effect during render.

Wrong.

---

# Good

```jsx
useEffect(() => {
  fetch("/api");
}, []);
```

---

# 7. Commit Phase

After React finishes rendering:

```txt
Old Tree
↓ compare
New Tree
```

React updates DOM.

---

Example:

```txt
Count: 1
↓
Count: 2
```

DOM changes happen here.

---

# 8. Effect Phase

After commit:

```jsx
useEffect(...)
```

runs.

---

Timeline:

```txt
Render
 ↓
Commit DOM
 ↓
useEffect
```

---

This explains why:

```jsx
useEffect(() => {
  console.log(element);
});
```

can safely access DOM.

Because DOM already exists.

---

# 9. Complete Lifecycle Example

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("effect");
  });

  console.log("render");

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

---

Initial Mount:

```txt
render
↓
DOM update
↓
effect
```

---

Click Button:

```txt
setCount
↓
render
↓
DOM update
↓
effect
```

---

# 10. Mount vs Update vs Unmount

---

## Mount

Component first appears.

```txt
Create component
```

---

## Update

Component already exists.

```txt
Re-render existing component
```

---

## Unmount

Component removed.

```txt
Destroy component
```

---

# Example

```jsx
{
  show && <Modal />;
}
```

---

show = true

```txt
Mount Modal
```

---

show = false

```txt
Unmount Modal
```

---

# 11. Effect Cleanup Lifecycle

```jsx
useEffect(() => {
  console.log("subscribe");

  return () => {
    console.log("unsubscribe");
  };
}, [roomId]);
```

---

Timeline:

```txt
Mount
 ↓
subscribe

roomId changes
 ↓
unsubscribe
 ↓
subscribe

Unmount
 ↓
unsubscribe
```

---

# 12. Component Tree Rendering

Suppose:

```txt
App
 ↓
Dashboard
 ↓
UserCard
```

---

State update in App:

```txt
App render
 ↓
Dashboard render
 ↓
UserCard render
```

By default.

---

# Why React.memo Exists

To stop unnecessary child renders.

---

# Without Memo

```txt
App render
 ↓
UserCard render
```

---

# With Memo

```txt
App render
 ↓
Props same
 ↓
Skip UserCard
```

---

# 13. State as Snapshot

One of React's most important ideas.

---

Render #1

```jsx
count = 0;
```

---

Render #2

```jsx
count = 1;
```

---

Each render gets its own snapshot.

---

This explains stale closures.

---

Example:

```jsx
setTimeout(() => {
  console.log(count);
}, 1000);
```

Captures count from the render that created it.

---

# 14. Batching

React groups updates.

---

```jsx
setCount(1);
setName("John");
```

Instead of:

```txt
render
render
```

React usually does:

```txt
one render
```

---

React 18 expanded batching further.

---

# 15. Strict Mode Double Render

Development only.

---

You may see:

```txt
render
render
```

on mount.

---

Why?

React checks:

- side effects
- cleanup logic
- purity

---

Not a production behavior.

---

# 16. Reconciliation

After render React compares:

```txt
Old Virtual DOM
New Virtual DOM
```

This process is called:

```txt
Reconciliation
```

---

Example:

```txt
<h1>1</h1>

↓

<h1>2</h1>
```

React updates only text node.

Not entire page.

---

# 17. Render Triggers vs Render Work

Senior engineers distinguish:

---

# Trigger

```jsx
setCount();
```

caused render.

---

# Work

```jsx
items.filter(...)
items.map(...)
```

executed during render.

---

Optimization often targets render work.

Not render triggers.

---

# 18. Complete Flow

Imagine:

```jsx
setCount((prev) => prev + 1);
```

React does:

```txt
State update queued
 ↓
Render phase
 ↓
Component function runs
 ↓
Virtual DOM created
 ↓
Reconciliation
 ↓
Commit phase
 ↓
DOM updates
 ↓
Effects run
```

That is the full lifecycle.

---

# 19. Most Common Misconceptions

---

## "Render means DOM update"

False.

Render can happen without DOM changes.

---

## "useEffect runs before render"

False.

Runs after commit.

---

## "useRef triggers render"

False.

---

## "React.memo prevents all renders"

False.

Only prop-driven renders.

---

## "State updates immediately"

False.

They schedule renders.

---

# 20. Senior-Level Mental Model

Think of React as:

```txt
State Changes
      ↓
Schedule Work
      ↓
Render Phase
      ↓
Compare Trees
      ↓
Commit Changes
      ↓
Run Effects
```

Every hook you've learned fits somewhere in this flow:

| Hook        | Role                                  |
| ----------- | ------------------------------------- |
| useState    | Triggers renders                      |
| useReducer  | Triggers renders                      |
| useRef      | Stores data outside rendering         |
| useEffect   | Runs after commit                     |
| useMemo     | Optimizes render work                 |
| useCallback | Stabilizes function references        |
| useContext  | Triggers consumers when value changes |
| React.memo  | Skips child renders                   |

---

# Interview-Level Summary

If asked:

> "Explain React rendering lifecycle."

A concise senior answer would be:

> React rendering starts when state, props, context, or reducer state changes. React enters the render phase, where it executes component functions and builds a new virtual tree. During reconciliation, it compares the new tree with the previous one. In the commit phase, React applies necessary DOM updates. After the commit phase completes, effects (`useEffect`) run and cleanup functions execute when dependencies change or components unmount.

For a senior frontend interview, the next topic after rendering lifecycle is usually **Reconciliation and the Virtual DOM**, because that's where React's rendering decisions actually come from.

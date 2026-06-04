---
title: "React.memo - Deep Dive"
sidebar_position: 8
description: "Senior-level deep dive into useMemo — memoized values, referential equality, performance optimization, and when NOT to memoize."
---

# `React.memo` — Surface Level to Senior-Level Understanding

Most developers learn:

> "`React.memo` prevents re-renders."

That's **not quite true**.

A more accurate statement is:

> `React.memo` skips a component render when its props haven't changed.

This distinction is extremely important.

---

# 1. What is React.memo?

`React.memo` is a Higher Order Component (HOC).

```jsx id="1"
const MemoizedComponent = React.memo(Component);
```

or

```jsx id="2"
export default React.memo(MyComponent);
```

---

# Basic Example

```jsx id="3"
function Child({ name }) {
  console.log("Child Render");

  return <div>{name}</div>;
}

export default React.memo(Child);
```

---

# Parent

```jsx id="4"
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Increment</button>

      <Child name="Somnath" />
    </>
  );
}
```

---

Without memo:

```txt
Parent Render
Child Render

Parent Render
Child Render

Parent Render
Child Render
```

---

With memo:

```txt
Parent Render
Child Render

Parent Render

Parent Render
```

Child skipped because props didn't change.

---

# 2. Important Mental Model

Many developers think:

```txt
Parent renders
↓
Child never renders
```

Wrong.

React still evaluates whether child should render.

Memo simply allows React to skip rendering if props are equal.

---

# 3. How React.memo Works

React compares previous props with new props.

---

Example:

```jsx id="5"
<Child name="Somnath" />
```

Previous:

```js
{
  name: "Somnath";
}
```

New:

```js
{
  name: "Somnath";
}
```

Comparison:

```js
Object.is(prevProp, nextProp);
```

Props same.

React skips render.

---

# 4. What React.memo Does NOT Stop

Many interview questions come from this.

---

## Context Changes

```jsx id="6"
const theme = useContext(ThemeContext);
```

Context updates:

```txt
Consumer re-renders
```

Even if component is memoized.

---

## State Changes Inside Component

```jsx id="7"
const [count, setCount] = useState(0);
```

Updating:

```jsx
setCount(...)
```

always re-renders component.

Memo doesn't help.

---

## useReducer Updates

Same story.

---

# Rule

`React.memo` only compares props.

Not:

- state
- context
- reducers

---

# 5. Referential Equality Problem

The biggest source of confusion.

---

## Primitive Props

Works well.

```jsx id="8"
<Child count={count} />
```

React compares:

```js
5 === 5;
```

Good.

---

## Object Props

```jsx id="9"
<Child config={{ dark: true }} />
```

Every render:

```js
{} !== {}
```

New object reference.

Child re-renders.

---

# Example

```jsx id="10"
function Parent() {
  return (
    <Child
      config={{
        dark: true,
      }}
    />
  );
}
```

Memo is useless here.

---

# Solution

```jsx id="11"
const config = useMemo(() => ({
  dark: true
}), [])

<Child config={config} />
```

Now reference stable.

---

# 6. Function Props Problem

Another huge one.

---

## Parent

```jsx id="12"
function Parent() {
  const handleClick = () => {
    console.log("clicked");
  };

  return <Child onClick={handleClick} />;
}
```

Every render:

```txt
new function
```

Therefore:

```js
oldFn !== newFn;
```

Child re-renders.

---

# Solution

```jsx id="13"
const handleClick = useCallback(() => {
  console.log("clicked");
}, []);
```

Stable reference.

---

# This is why

```txt
React.memo
+
useMemo
+
useCallback
```

often appear together.

---

# 7. Real Example

---

## Child

```jsx id="14"
const UserCard = memo(function UserCard({ user, onSelect }) {
  console.log("render user");

  return <button onClick={onSelect}>{user.name}</button>;
});
```

---

## Parent

```jsx id="15"
const user = useMemo(() => ({
  id: 1,
  name: "Somnath"
}), [])

const onSelect = useCallback(() => {
  console.log("selected")
}, [])

<UserCard
  user={user}
  onSelect={onSelect}
/>
```

Now memoization actually works.

---

# 8. Custom Comparison Function

Advanced feature.

---

Default:

```js
Object.is();
```

comparison.

---

You can override:

```jsx id="16"
export default memo(UserCard, (prevProps, nextProps) => {
  return prevProps.user.id === nextProps.user.id;
});
```

---

# Example

Only compare IDs.

Even if object reference changes:

```js
{
  id: 1,
  name: "Somnath"
}
```

↓

```js
{
  id: 1,
  name: "Somnath Updated"
}
```

Component may skip render.

---

# Danger

Bad comparisons create stale UI.

Use carefully.

---

# 9. When React.memo Helps

---

## Expensive Components

Example:

```txt
Large tables
Charts
Editors
Maps
Huge lists
```

---

## Frequently Re-rendering Parents

```txt
Dashboard
Chat apps
Realtime UI
```

---

## Stable Props

Memo only works when props stay stable.

---

# 10. When React.memo Is Useless

---

## Tiny Components

```jsx id="17"
function Label() {
  return <span>Hello</span>;
}
```

No meaningful gain.

---

## Constantly Changing Props

```jsx id="18"
<Child
  data={{ ... }}
  onClick={() => {}}
/>
```

Memo fails.

---

## Heavy Context Consumers

Context changes bypass memo.

---

# 11. Common Mistakes

---

## Memo Everything

Bad.

```jsx id="19"
export default memo(Button)
export default memo(Input)
export default memo(Text)
```

Creates complexity.

Little gain.

---

## Ignoring Reference Stability

```jsx id="20"
<Child config={{ dark: true }} />
```

Memo doesn't help.

---

## Expecting Memo To Fix Architecture

Bad state placement:

```txt
Parent rerenders entire tree
```

won't magically be solved by memo.

---

# 12. Real Senior-Level Thought Process

Instead of asking:

```txt
Should I add React.memo?
```

Ask:

```txt
Why is this component rendering?
```

Use React DevTools Profiler.

Measure first.

---

# 13. React.memo vs useMemo

Very common interview question.

---

## React.memo

Memoizes COMPONENT rendering.

```jsx id="21"
memo(Component);
```

---

## useMemo

Memoizes VALUE.

```jsx id="22"
useMemo(() => value, deps);
```

---

# Example

```jsx id="23"
const filteredUsers = useMemo(...)
```

Caches result.

---

```jsx id="24"
const UserList = memo(...)
```

Caches render.

---

# 14. React.memo vs useCallback

---

## React.memo

Skips child render.

---

## useCallback

Keeps function prop stable.

---

They often work together.

---

# 15. Interview-Level Example

---

Without optimization:

```jsx
Parent render
↓
New function
↓
Child render
```

---

With optimization:

```jsx
Parent render
↓
Stable callback
↓
Stable props
↓
React.memo skips child
```

---

# 16. Senior-Level Rule

Only use `React.memo` when:

### Component is expensive

AND

### Parent renders frequently

AND

### Props can remain stable

If one of these is missing, memoization often provides little benefit.

---

# 17. Common Interview Questions

### Does React.memo prevent all re-renders?

No.

Only prop-driven renders.

State and context updates still re-render.

---

### Why doesn't React.memo work with object props?

Because object references change.

```js
{} !== {}
```

---

### Why pair React.memo with useCallback?

To stabilize function references.

---

### Why pair React.memo with useMemo?

To stabilize object/array references.

---

# Final Mental Model

Think of rendering like this:

```txt
Parent Render
      ↓
Compare Child Props
      ↓
Props Changed?
      ↓
Yes → Render Child
No  → Skip Child
```

`React.memo` simply gives React permission to skip the child render when prop references haven't changed.

---

# Quick Rule of Thumb

| Tool        | Purpose                                     |
| ----------- | ------------------------------------------- |
| useState    | Store UI state                              |
| useRef      | Store mutable value without rendering       |
| useEffect   | Synchronize with external systems           |
| useContext  | Share values through tree                   |
| useMemo     | Cache computed values                       |
| useCallback | Cache function references                   |
| useReducer  | Manage complex state transitions            |
| React.memo  | Skip child renders when props are unchanged |

The biggest mistake mid-level React developers make is trying to solve rendering problems with `React.memo` before understanding **why components are rendering in the first place**. Understanding render propagation, prop identity, context updates, and state placement is usually far more valuable than adding memoization everywhere.

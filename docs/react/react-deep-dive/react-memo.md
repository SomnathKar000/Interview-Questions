---
title: "React.memo - Deep Dive"
sidebar_position: 9
description: "Senior-level deep dive into React.memo — component memoization, referential equality, custom comparison, and when NOT to memo."
---

# `React.memo` — Surface Level to Senior-Level Understanding

Most developers learn:

> "`React.memo` prevents re-renders."

That's **not quite true**.

A more accurate statement is:

> `React.memo` skips a component render when its props haven't changed.

This distinction is extremely important.

---

## 1. What is React.memo?

`React.memo` is a Higher Order Component (HOC).

```jsx
const MemoizedComponent = React.memo(Component);
```

or

```jsx
export default React.memo(MyComponent);
```

### Basic Example

```jsx
function Child({ name }) {
  console.log("Child Render");
  return <div>{name}</div>;
}

export default React.memo(Child);
```

### Parent

```jsx
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

Without memo → Child renders every time parent renders.

With memo → Child skipped because props didn't change.

---

## 2. Important Mental Model

:::important
React still evaluates whether child should render.

Memo simply allows React to **skip rendering** if props are equal.
:::

---

## 3. How React.memo Works

React compares previous props with new props using:

```js
Object.is(prevProp, nextProp);
```

Props same → React skips render.

---

## 4. What React.memo Does NOT Stop

:::warning[Many interview questions come from this]

**Context Changes** — Even if component is memoized, context updates re-render consumers.

**State Changes Inside Component** — `setCount(...)` always re-renders. Memo doesn't help.

**useReducer Updates** — Same story.

**Rule:** `React.memo` only compares props. Not state, context, or reducers.
:::

---

## 5. Referential Equality Problem

The biggest source of confusion.

### Primitive Props ✅

```jsx
<Child count={count} />
```

React compares: `5 === 5` → Good.

### Object Props ❌

```jsx
<Child config={{ dark: true }} />
```

Every render: `{} !== {}` → New reference → Child re-renders.

### ✅ Solution

```jsx
const config = useMemo(() => ({ dark: true }), []);

<Child config={config} />
```

Now reference stable.

---

## 6. Function Props Problem

Another huge one.

### ❌ Problem

```jsx
function Parent() {
  const handleClick = () => {
    console.log("clicked");
  };

  return <Child onClick={handleClick} />;
}
```

Every render creates new function → `oldFn !== newFn` → Child re-renders.

### ✅ Solution

```jsx
const handleClick = useCallback(() => {
  console.log("clicked");
}, []);
```

:::info[This is why]
`React.memo` + `useMemo` + `useCallback` often appear together.
:::

---

## 7. Real Example

### Child

```jsx
const UserCard = memo(function UserCard({ user, onSelect }) {
  console.log("render user");
  return <button onClick={onSelect}>{user.name}</button>;
});
```

### Parent

```jsx
const user = useMemo(() => ({ id: 1, name: "Somnath" }), []);

const onSelect = useCallback(() => {
  console.log("selected");
}, []);

<UserCard user={user} onSelect={onSelect} />
```

Now memoization actually works.

---

## 8. Custom Comparison Function

Advanced feature.

Default uses `Object.is()`. You can override:

```jsx
export default memo(UserCard, (prevProps, nextProps) => {
  return prevProps.user.id === nextProps.user.id;
});
```

:::danger
Bad comparisons create stale UI. Use carefully.
:::

---

## 9. When React.memo Helps

| ✅ Helps | ❌ Useless |
|---|---|
| Expensive components (large tables, charts, editors) | Tiny components (`<span>Hello</span>`) |
| Frequently re-rendering parents (dashboards, chat) | Constantly changing props |
| Stable props | Heavy context consumers |

---

## 10. Common Mistakes

:::danger[Avoid these]

**A. Memo Everything** — Creates complexity with little gain.

**B. Ignoring Reference Stability** — `<Child config={{ dark: true }} />` defeats memo.

**C. Expecting Memo To Fix Architecture** — Bad state placement won't be fixed by memo.
:::

:::tip[Senior Thought Process]
Instead of asking "Should I add React.memo?" ask "Why is this component rendering?"

Use React DevTools Profiler. Measure first.
:::

---

## 11. React.memo vs useMemo

Very common interview question.

| | `React.memo` | `useMemo` |
|---|---|---|
| **Memoizes** | COMPONENT rendering | VALUE |
| **Example** | `memo(Component)` | `useMemo(() => value, deps)` |

---

## 12. React.memo vs useCallback

| | `React.memo` | `useCallback` |
|---|---|---|
| **Purpose** | Skips child render | Keeps function prop stable |

They often work together.

---

## 13. Interview-Level Example

Without optimization:

```txt
Parent render → New function → Child render
```

With optimization:

```txt
Parent render → Stable callback → Stable props → React.memo skips child
```

---

## 14. Senior-Level Rule

:::important
Only use `React.memo` when:

- Component is expensive **AND**
- Parent renders frequently **AND**
- Props can remain stable

If one of these is missing, memoization often provides little benefit.
:::

---

## 15. Common Interview Questions

### Does React.memo prevent all re-renders?

No. Only prop-driven renders. State and context updates still re-render.

### Why doesn't React.memo work with object props?

Because object references change. `{} !== {}`.

### Why pair React.memo with useCallback?

To stabilize function references.

### Why pair React.memo with useMemo?

To stabilize object/array references.

---

## 16. Final Mental Model

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

## Quick Rule of Thumb

| Tool | Purpose |
|---|---|
| useState | Store UI state |
| useRef | Store mutable value without rendering |
| useEffect | Synchronize with external systems |
| useContext | Share values through tree |
| useMemo | Cache computed values |
| useCallback | Cache function references |
| useReducer | Manage complex state transitions |
| React.memo | Skip child renders when props are unchanged |

:::note
The biggest mistake mid-level React developers make is trying to solve rendering problems with `React.memo` before understanding **why components are rendering in the first place**.
:::

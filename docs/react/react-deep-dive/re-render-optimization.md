---
title: "Re-render Optimization"
sidebar_position: 17
description: "Senior-level deep dive into Re-render Optimization — state placement, memoization triangle, context splitting, and virtualization."
---

## Re-render Optimization — What Senior React Engineers Actually Optimize

Most developers think:

> "React re-renders are bad."

This is one of the biggest React misconceptions.

The real goal is:

> **Avoid unnecessary work**, not necessarily avoid renders.

A render is just:

```jsx
function Component() {
  console.log("render");
}
```

React calling a function is usually cheap.

The expensive parts are often:

- Large component trees
- Expensive calculations
- Huge lists
- DOM updates
- Context propagation
- Third-party components

---

## 1. First Rule: Measure Before Optimizing

Use:

- React DevTools Profiler
- Chrome Performance Tab

Don't optimize because:

```txt
"it might be slow"
```

Optimize because:

```txt
"I measured it and it's slow"
```

---

## 2. Understand What Causes Re-renders

A component re-renders when:

### State changes

```jsx
setCount(1);
```

---

### Parent re-renders

```txt
Parent
 ↓
Child
```

Parent render usually triggers child render.

---

### Context changes

```jsx
const theme = useContext(ThemeContext);
```

Provider update:

```txt
Consumer re-renders
```

---

### Reducer updates

```jsx
dispatch(...)
```

---

## 3. The Biggest Optimization: State Placement

Most performance issues come from state living too high.

---

## Bad

```jsx
function App() {
  const [search, setSearch] = useState("");

  return (
    <>
      <Search />
      <Dashboard />
      <Sidebar />
      <Footer />
    </>
  );
}
```

Typing causes:

```txt
App
Dashboard
Sidebar
Footer
```

all to render.

---

## Better

```jsx
function Search() {
  const [search, setSearch] = useState("");
}
```

Only Search re-renders.

---

## Senior Rule

> Move state as close as possible to where it's used.

This is often more impactful than all memoization combined.

---

## 4. React.memo

Most common optimization.

---

```jsx
const UserCard = memo(function UserCard() {
  ...
})
```

---

Without memo:

```txt
Parent render
 ↓
UserCard render
```

---

With memo:

```txt
Parent render
 ↓
Props unchanged
 ↓
Skip UserCard
```

---

Use when:

- Component expensive
- Parent renders often
- Props stable

---

## 5. Stable Object References

Memo often fails because of this.

---

Bad:

```jsx
<UserCard
  config={{
    dark: true,
  }}
/>
```

Every render:

```js
{} !== {}
```

New object.

Child re-renders.

---

Better:

```jsx
const config = useMemo(
  () => ({
    dark: true,
  }),
  [],
);
```

---

## 6. Stable Function References

Bad:

```jsx
<UserCard onClick={() => {}} />
```

New function every render.

---

Better:

```jsx
const handleClick = useCallback(() => {}, []);
```

---

Especially important when:

```jsx
React.memo;
```

is involved.

---

## 7. Context Optimization

One of the biggest real-world issues.

---

Bad:

```jsx
<AppContext.Provider
  value={{
    user,
    theme,
    notifications
  }}
>
```

Any change:

```txt
user
theme
notifications
```

re-renders all consumers.

---

Better:

```txt
AuthContext
ThemeContext
NotificationContext
```

Split contexts.

---

## Example

Instead of:

```txt
1 huge context
```

Use:

```txt
3 smaller contexts
```

---

## 8. Avoid Derived State

Bad:

```jsx
const [fullName, setFullName] = useState("");
```

```jsx
useEffect(() => {
  setFullName(first + last);
}, [first, last]);
```

---

Creates:

```txt
Extra state
Extra render
Extra effect
```

---

Better:

```jsx
const fullName = `${first} ${last}`;
```

No extra render.

---

## 9. Memoize Expensive Calculations

---

Bad:

```jsx
const filtered =
  users.filter(...)
```

on every render.

---

Better:

```jsx
const filtered = useMemo(() => {
  return users.filter(...)
}, [users])
```

---

Only for expensive work.

---

Not:

```jsx
const doubled = useMemo(() => count * 2, [count]);
```

Overkill.

---

## 10. Large Lists

Very common bottleneck.

---

Bad:

```jsx
10000 rows
```

rendered at once.

---

Use:

```txt
Virtualization
```

Libraries:

- [react-window](https://github.com/bvaughn/react-window?utm_source=chatgpt.com)
- [TanStack Virtual](https://tanstack.com/virtual?utm_source=chatgpt.com)

---

Render:

```txt
20 visible rows
```

instead of:

```txt
10000 rows
```

---

## 11. Context Selector Problem

Suppose:

```jsx
const { user, notifications } = useContext(AppContext);
```

Changing:

```txt
notifications
```

still re-renders user consumers.

---

Solutions:

- Split contexts
- Zustand
- Redux selectors
- Context selectors

---

## 12. Component Splitting

Bad:

```jsx
Dashboard
  ├─ Charts
  ├─ Tables
  ├─ Sidebar
  ├─ ActivityFeed
```

Everything re-renders.

---

Better:

```jsx
memo(Charts);
memo(Tables);
memo(ActivityFeed);
```

Separate boundaries.

---

## 13. Avoid Effect-Driven Architecture

Bad:

```jsx
useEffect(() => {
  setB(a + 1);
}, [a]);

useEffect(() => {
  setC(b + 1);
}, [b]);
```

Creates:

```txt
Extra renders
Extra effects
```

---

Better:

```jsx
const b = a + 1;
const c = b + 1;
```

Single render.

---

## 14. useTransition

React 18 optimization.

---

For expensive updates:

```jsx
startTransition(() => {
  setResults(results);
});
```

Allows:

```txt
Typing
```

to remain responsive.

---

Useful for:

- Search
- Filters
- Large dashboards

---

## 15. useDeferredValue

Example:

```jsx
const deferredSearch = useDeferredValue(search);
```

---

Typing updates immediately.

Heavy filtering updates later.

---

Useful for:

```txt
Search
Large tables
```

---

## 16. Memoization Triangle

The classic optimization trio.

---

## React.memo

Memoize component render.

---

## useMemo

Memoize values.

---

## useCallback

Memoize functions.

---

Example:

```jsx
const config = useMemo(...)
const handleClick =
  useCallback(...)

return (
  <Child
    config={config}
    onClick={handleClick}
  />
)
```

---

Child:

```jsx
export default memo(Child);
```

Now optimization works.

---

## 17. Common Anti-Patterns

---

## Memo Everything

Bad:

```jsx
memo(Button);
memo(Input);
memo(Text);
```

Usually pointless.

---

## Callback Everything

Bad:

```jsx
useCallback(() => {});
```

everywhere.

---

## Memo Tiny Values

Bad:

```jsx
useMemo(() => count * 2);
```

---

## Giant Contexts

Huge source of render storms.

---

## 18. Optimization Priority Order

Senior engineers usually optimize in this order:

### 1. State Placement

Biggest gains.

---

### 2. Remove Unnecessary Effects

Often huge gains.

---

### 3. Split Contexts

Massive gains.

---

### 4. Virtualize Lists

Massive gains.

---

### 5. React.memo

Targeted gains.

---

### 6. useMemo/useCallback

Fine-grained gains.

---

## 19. Real Interview Question

### Why is my component re-rendering?

Possible reasons:

```txt
State changed
Parent rendered
Context changed
Reducer updated
Props changed
```

---

### How do you optimize React rendering?

Answer:

```txt
Move state down
Split contexts
Use React.memo selectively
Memoize expensive calculations
Stabilize references
Virtualize large lists
Profile before optimizing
```

---

## 20. Senior-Level Mental Model

Most mid-level developers optimize:

```txt
Render Count
```

Senior engineers optimize:

```txt
Render Cost
```

---

Example:

```txt
100 cheap renders
```

is often better than:

```txt
1 expensive render
```

---

## One-Sentence Summary

**The most effective React performance optimization is usually better state ownership and component architecture—not adding `useMemo`, `useCallback`, and `React.memo` everywhere.**

---
title: "Reconciliation"
sidebar_position: 14
description: "Senior-level deep dive into React Reconciliation — diffing algorithm, keys, Virtual DOM, and state preservation rules."
---

## Reconciliation — The Heart of React Rendering

If rendering lifecycle answers:

> "When does React render?"

Reconciliation answers:

> "What does React do after rendering?"

This is one of the most important React internals concepts because it explains:

- Why React is fast
- Why keys matter
- Why components sometimes lose state
- Why React.memo works
- How React decides what to update

---

## 1. What is Reconciliation?

Reconciliation is the process where React compares:

```txt
Previous Virtual DOM
          vs
New Virtual DOM
```

and determines:

```txt
What actually changed?
```

---

Example:

### Render 1

```jsx
<h1>Hello</h1>
```

---

### Render 2

```jsx
<h1>Hello World</h1>
```

React compares:

```txt
<h1>Hello</h1>

↓

<h1>Hello World</h1>
```

and updates only the text.

Not the entire page.

---

## 2. Why Reconciliation Exists

Imagine React did:

```txt
Delete entire DOM
Create everything again
```

for every render.

That would be extremely slow.

Instead React performs:

```txt
Diffing
```

to find minimal changes.

---

## 3. Render vs Reconciliation

Many developers mix these up.

---

## Render

```jsx
function App() {
  return <h1>Hello</h1>;
}
```

React calls component.

Produces JSX.

---

## Reconciliation

React compares:

```txt
Old JSX Tree
       vs
New JSX Tree
```

Determines changes.

---

## Commit

Updates DOM.

---

Flow:

```txt
Render
 ↓
Reconciliation
 ↓
Commit
```

---

## 4. Virtual DOM

React doesn't compare real DOM directly.

It compares:

```txt
Virtual DOM Trees
```

Think:

```js
{
  type: "h1",
  props: {
    children: "Hello"
  }
}
```

---

Render #1

```txt
App
 ↓
<h1>Hello</h1>
```

---

Render #2

```txt
App
 ↓
<h1>Hello World</h1>
```

React compares trees.

---

## 5. Diffing Algorithm Assumptions

React's reconciliation relies on two assumptions.

---

## Assumption 1

Different element types mean different trees.

---

Example:

```jsx
<div />
```

↓

```jsx
<span />
```

React assumes:

```txt
Old tree destroyed
New tree created
```

---

Because:

```txt
div ≠ span
```

---

## Assumption 2

Keys identify stable children.

More on this later.

---

## 6. Same Type Elements

Example:

---

Render #1

```jsx
<h1>Hello</h1>
```

---

Render #2

```jsx
<h1>World</h1>
```

Same element type:

```txt
h1
```

React keeps DOM node.

Only updates:

```txt
text content
```

---

Cheap update.

---

## 7. Different Type Elements

---

Render #1

```jsx
<h1>Hello</h1>
```

---

Render #2

```jsx
<div>Hello</div>
```

React sees:

```txt
h1 ≠ div
```

Result:

```txt
Destroy h1
Create div
```

---

Entire subtree replaced.

---

## 8. Component Reconciliation

---

Render #1

```jsx
<UserProfile />
```

---

Render #2

```jsx
<UserProfile />
```

Same component type.

React preserves state.

---

Example:

```jsx
const [count] = useState(0);
```

stays alive.

---

## 9. Component Type Change

---

Render #1

```jsx
<UserProfile />
```

---

Render #2

```jsx
<Dashboard />
```

React sees:

```txt
UserProfile ≠ Dashboard
```

Result:

```txt
Unmount UserProfile
Mount Dashboard
```

State lost.

---

## 10. State Preservation Rule

One of React's most important rules:

> State is tied to component position in the tree.

---

Example:

```jsx
{
  show ? <UserProfile /> : <UserProfile />;
}
```

Same position.

State preserved.

---

Example:

```jsx
{
  show ? <UserProfile /> : <Dashboard />;
}
```

Different component.

State reset.

---

## 11. The Famous Key Prop

This is where reconciliation becomes critical.

---

Suppose:

```jsx
users.map((user) => <UserCard key={user.id} user={user} />);
```

React uses:

```txt
key
```

to identify children.

---

## Why?

Without keys:

React compares by position.

---

## Example

Old:

```txt
A
B
C
```

---

New:

```txt
X
A
B
C
```

React thinks:

```txt
A became X
B became A
C became B
```

Everything shifted.

Many updates.

---

## With Keys

Old:

```txt
1 A
2 B
3 C
```

---

New:

```txt
0 X
1 A
2 B
3 C
```

React immediately knows:

```txt
Add X
Keep A
Keep B
Keep C
```

Much cheaper.

---

## 12. Why Index Keys Are Dangerous

Common interview question.

---

Bad:

```jsx
users.map((user, index) => <UserCard key={index} />);
```

---

Imagine:

```txt
0 A
1 B
2 C
```

Delete A.

---

Now:

```txt
0 B
1 C
```

React thinks:

```txt
A became B
B became C
```

State gets mixed.

---

Real bugs:

- wrong input values
- wrong checkbox state
- animations break

---

Use stable IDs.

---

## 13. React.memo and Reconciliation

Memo affects reconciliation.

---

Without memo:

```txt
Parent render
 ↓
Child render
 ↓
Compare child tree
```

---

With memo:

```txt
Parent render
 ↓
Props same
 ↓
Skip child render
```

Less reconciliation work.

---

## 14. Reconciliation and State Reset

Example:

```jsx
<Form />
```

User types:

```txt
Hello
```

State stored.

---

Now:

```jsx
<Form key="new" />
```

Key changed.

React thinks:

```txt
Old Form removed
New Form created
```

State resets.

---

This is a powerful pattern.

---

## Example

Reset form:

```jsx
<Form key={userId} />
```

When user changes:

```txt
Fresh form state
```

---

## 15. List Reordering Example

Imagine:

---

Old

```txt
1 A
2 B
3 C
```

---

New

```txt
3 C
2 B
1 A
```

---

With proper keys:

React understands:

```txt
Move C
Keep B
Move A
```

instead of destroying everything.

---

## 16. Reconciliation Cost

React's diffing is efficient because:

It avoids:

```txt
O(n³)
```

tree comparisons.

---

Instead React uses heuristics.

Roughly:

```txt
O(n)
```

for most practical cases.

---

## 17. Common Misconceptions

---

## Re-render means DOM update

False.

Re-render only creates new virtual tree.

Reconciliation may determine:

```txt
No DOM changes
```

---

## React.memo stops reconciliation

Not exactly.

It skips component render if props unchanged.

---

## Keys improve performance only

False.

Keys also preserve correct state association.

---

## 18. Real Interview Questions

### What is reconciliation?

The process where React compares old and new virtual DOM trees to determine minimal updates.

---

### Why are keys important?

They help React identify stable elements across renders.

---

### Why shouldn't we use array index as key?

Reordering can cause incorrect state preservation.

---

### When does React destroy component state?

When component type changes or key changes.

---

### Why does changing a key reset state?

Because React treats it as a completely new component.

---

## 19. Senior-Level Mental Model

Think of React like this:

```txt
State Change
      ↓
Render New Tree
      ↓
Reconciliation
      ↓
Find Minimal Changes
      ↓
Commit DOM Updates
```

Reconciliation is the intelligence layer that determines:

```txt
Keep
Update
Move
Remove
Create
```

for every node in the UI tree.

---

## 20. One Sentence Summary

**Reconciliation is React's diffing process that compares the previous and next UI trees to determine the smallest set of updates needed while preserving component state whenever possible.**

---

## Visual Summary

```txt
setState()
    ↓
Render
    ↓
New Virtual DOM
    ↓
Reconciliation
    ↓
Compare Old Tree
    ↓
Determine Changes
    ↓
Commit DOM Updates
    ↓
Run Effects
```

Once you fully understand reconciliation, concepts like:

- keys
- React.memo
- state preservation
- state reset
- render optimization

all become much easier to reason about.

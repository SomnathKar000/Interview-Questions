---
title: "React Compiler - Deep Dive"
sidebar_position: 19
description: "Senior-level deep dive into React Compiler — automatic memoization, compilation modes, Vite integration, and what it means for useMemo/useCallback."
---

# `React Compiler` — Surface Level to Senior-Level Understanding

Most developers hear:

> "React Compiler makes `useMemo` and `useCallback` unnecessary."

That's **partially true**, but dangerously oversimplified.

A more accurate statement:

> React Compiler can **automatically apply** many memoization optimizations — but it doesn't replace understanding **why** those optimizations exist.

---

## 1. What Is React Compiler?

React Compiler is a **build-time tool** that analyzes your components and automatically inserts optimizations that previously required manual work:

```jsx
// These three tools...
useMemo();
useCallback();
React.memo();

// ...the compiler can often generate for you.
```

:::info[Key Insight]
It's a **compiler**, not a runtime feature. It transforms your code at build time — your shipped bundle contains the optimized output.
:::

---

## 2. What It Replaces

| Before (Manual) | After (Compiler) |
|---|---|
| `useMemo(() => expensiveCalc(), [deps])` | Compiler auto-memoizes the value |
| `useCallback((x) => fn(x), [deps])` | Compiler auto-stabilizes the reference |
| `React.memo(Component)` | Compiler auto-skips unchanged renders |

:::tip
The compiler doesn't just add `useMemo` — it uses a **more granular** memoization strategy that can be more efficient than hand-written memoization.
:::

---

## 3. Vite Setup

### Install

```bash
npm install -D @rolldown/plugin-babel
```

### Configure

```js
import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
  ],
});
```

---

## 4. Compilation Modes

### Default Mode — Compile Everything

```js
reactCompilerPreset();
```

Every component and hook is compiled automatically.

### Annotation Mode — Opt-In

```js
reactCompilerPreset({
  compilationMode: "annotation",
});
```

Only components explicitly marked get compiled:

```jsx
"use memo";

function ExpensiveComponent() {
  // This component will be compiled
}
```

:::tip[When to use annotation mode]
Use this for **gradual adoption** in large codebases where you want to verify the compiler's behavior one component at a time.
:::

---

## 5. React 18 / 17 Support

The compiler supports older React versions with an additional runtime:

```bash
npm install react-compiler-runtime
```

```js
reactCompilerPreset({
  target: "18", // or "17"
});
```

| React Version | Setup |
|---|---|
| **19** | Just enable the compiler — no extra runtime needed |
| **18** | Install `react-compiler-runtime` + set `target: "18"` |
| **17** | Install `react-compiler-runtime` + set `target: "17"` |

---

## 6. Rules of React

:::danger[The compiler enforces these strictly]
React Compiler relies on the [Rules of React](https://react.dev/reference/rules) to reason about your code. If your components violate these rules, the compiler will **skip** them silently or produce broken output.

Key rules:
- Components must be **pure** during render
- Props/state must be treated as **immutable**
- Hook calls must follow the **Rules of Hooks**
- Side effects belong in **event handlers** or **useEffect**
:::

### ✅ Compiler-Friendly

```jsx
function UserCard({ user }) {
  const fullName = user.first + " " + user.last;
  return <div>{fullName}</div>;
}
```

### ❌ Compiler Will Skip This

```jsx
function UserCard({ user }) {
  user.visits++; // Mutating props!
  return <div>{user.name}</div>;
}
```

---

## 7. What the Compiler Does NOT Fix

:::warning[This is the senior-level answer]
The compiler optimizes **re-render cost**. It does NOT fix:

| Problem | Solution |
|---|---|
| Bad state placement | Lift/colocate state properly |
| Prop drilling | Use Context or composition |
| Over-fetching data | Server-side filtering, pagination |
| Large component trees | Code splitting, lazy loading |
| Long lists | Virtualization (`react-window`) |
| Unnecessary context consumers | Context splitting |

A poorly designed component tree will still perform poorly — the compiler just makes each individual render cheaper.
:::

---

## 8. Before vs After Compiler

### Before — Manual Optimization

```jsx
const MemoChild = React.memo(Child);

function Parent({ items }) {
  const sorted = useMemo(() => items.sort(), [items]);
  const handleClick = useCallback(() => {
    console.log("click");
  }, []);

  return <MemoChild items={sorted} onClick={handleClick} />;
}
```

### After — With Compiler

```jsx
function Parent({ items }) {
  const sorted = items.sort();
  const handleClick = () => console.log("click");

  return <Child items={sorted} onClick={handleClick} />;
}
```

Same performance. Cleaner code. The compiler handles the memoization.

---

## 9. How to Verify It's Working

### React DevTools

Components optimized by the compiler show a **"Memo ✨"** badge in React DevTools.

### ESLint Plugin

```bash
npm install -D eslint-plugin-react-compiler
```

```js
// eslint.config.js
import reactCompiler from "eslint-plugin-react-compiler";

export default [
  {
    plugins: { "react-compiler": reactCompiler },
    rules: {
      "react-compiler/react-compiler": "error",
    },
  },
];
```

:::info
The ESLint plugin warns about code patterns that would prevent the compiler from optimizing a component.
:::

---

## 10. Decision Framework

### Should You Enable It?

| Scenario | Recommendation |
|---|---|
| **New React 19 project** | ✅ Enable by default |
| **Existing well-tested app** | ✅ Enable in annotation mode, migrate gradually |
| **App with lots of mutations** | ⚠️ Fix rule violations first, then enable |
| **Library / design system** | ✅ Great fit — consumers get free optimizations |

---

## 11. Interview Questions

### Will React Compiler make useMemo obsolete?

> It reduces the **need** for manual memoization but doesn't replace understanding **when and why** memoization matters. The compiler automates the "how," not the "why."

### Does the compiler work with class components?

No. It only optimizes **function components** and **hooks**.

### What happens if my code violates Rules of React?

The compiler silently **skips** that component. No error — just no optimization. Use the ESLint plugin to catch these.

### Can the compiler make performance worse?

Rarely, but possible. Memoizing very cheap computations adds overhead. The compiler has heuristics to avoid this, but profiling is still important.

---

## 12. Senior-Level Mental Model

:::note[The Big Picture]
```
React Compiler = Automatic Memoization at Build Time

What it handles:
  ✅ useMemo / useCallback / React.memo equivalents
  ✅ JSX expression caching
  ✅ Hook return value stability

What you still own:
  ❌ Component architecture
  ❌ State placement
  ❌ Data fetching strategy
  ❌ Code splitting
  ❌ Context design
```

The compiler makes **each render cheaper**.
Good architecture makes **renders happen less often**.

You need both.
:::

---

## One-Sentence Summary

**React Compiler automates memoization so you can write simpler code — but it doesn't replace understanding React's rendering model, which is what separates senior engineers from everyone else.**

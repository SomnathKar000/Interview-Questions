---
title: "useReducer - Deep Dive"
sidebar_position: 8
description: "Senior-level deep dive into useReducer — state transitions, action patterns, reducer purity, and when to prefer useReducer over useState."
---

# `useReducer` — Surface Level to Senior-Level Understanding

Most developers learn:

> "`useReducer` is an alternative to `useState`."

That's true, but it misses the point.

A better mental model:

> `useState` stores values.
> `useReducer` manages state transitions.

When your component starts having lots of related state and complex update logic, `useReducer` becomes much easier to reason about.

---

## 1. Why `useReducer` Exists

Imagine a login form.

### With `useState`

```jsx
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
```

Now imagine handling login start, success, failure, and reset. State updates become scattered everywhere.

### With `useReducer`

```jsx
const initialState = {
  email: "",
  password: "",
  loading: false,
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: "" };
    case "LOGIN_SUCCESS":
      return { ...state, loading: false };
    case "LOGIN_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
```

:::tip
Now all state transitions live in one place.
:::

---

## 2. Basic Syntax

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

You get:

- `state` — Current state
- `dispatch(action)` — A way to request state changes

---

## 3. Core Concepts

| Concept | Description | Example |
|---|---|---|
| **State** | Current data | `{ count: 0 }` |
| **Action** | Describes what happened | `{ type: "INCREMENT" }` |
| **Reducer** | Pure function that decides next state | `(state, action) => newState` |
| **Dispatch** | Sends action to reducer | `dispatch({ type: "INCREMENT" })` |

---

## 4. Counter Example

### Reducer

```jsx
function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    default:
      return state;
  }
}
```

### Component

```jsx
const [state, dispatch] = useReducer(reducer, { count: 0 });
```

### Usage

```jsx
<button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>
```

---

## 5. Why Actions Matter

Instead of:

```jsx
setCount(count + 1);
```

you describe intent:

```jsx
dispatch({ type: "INCREMENT" });
```

:::info[Senior Insight]
Reducers make state transitions explicit.

Reading `dispatch({ type: "ADD_TO_CART" })` is much clearer than `setCart(...)`.
:::

---

## 6. Reducer Must Be Pure

### ✅ Good

```jsx
function reducer(state, action) {
  return { count: state.count + 1 };
}
```

### ❌ Bad

```jsx
function reducer(state, action) {
  fetch("/api"); // side effect!
}
```

:::danger
No side effects. Reducers should only calculate state.
:::

---

## 7. Real-World Example — Async Request State

A very common pattern.

### State

```jsx
const initialState = {
  loading: false,
  data: null,
  error: null,
};
```

### Reducer

```jsx
function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { loading: false, data: action.payload, error: null };
    case "FETCH_ERROR":
      return { loading: false, data: null, error: action.payload };
    default:
      return state;
  }
}
```

### Usage

```jsx
dispatch({ type: "FETCH_START" });

// After API success
dispatch({ type: "FETCH_SUCCESS", payload: users });
```

---

## 8. `useReducer` vs `useState`

| | `useState` | `useReducer` |
|---|---|---|
| **Good for** | Simple state (`isOpen`, `loading`, `inputValue`) | Complex related state (forms, carts, wizards, auth) |
| **Updates** | Direct value changes | Described via actions |
| **Organization** | Scattered setters | Centralized transitions |

---

## 9. Form Example

Imagine managing `name`, `email`, `password`, `errors`, `loading`, `success` — using many `useState` calls quickly becomes messy.

:::tip
Reducer keeps all transitions centralized.
:::

---

## 10. Action Payloads

Actions often carry data.

```jsx
dispatch({ type: "SET_NAME", payload: "Somnath" });
```

Reducer:

```jsx
case "SET_NAME":
  return { ...state, name: action.payload }
```

---

## 11. Lazy Initialization

### ❌ Bad

```jsx
const [state] = useReducer(reducer, expensiveCalculation());
```

Runs every render.

### ✅ Better

```jsx
const [state] = useReducer(reducer, initialArg, expensiveCalculation);
```

Initialization runs once.

---

## 12. Combining with Context

Extremely common.

```jsx
const [state, dispatch] = useReducer(authReducer, initialState);

<AuthContext.Provider value={{ state, dispatch }}>
```

:::info
This is how many apps build global state.
:::

---

## 13. Redux Connection

Redux reducers are basically the same idea.

| | Redux | useReducer |
|---|---|---|
| **Pattern** | `(state, action) => newState` | `(state, action) => newState` |
| **Extras** | global store, middleware, devtools, selectors | — |

---

## 14. Common Mistakes

:::danger[Avoid these]

**A. Mutating State**

```jsx
state.count++;
return state; // ❌ Same reference
```

✅ Correct:

```jsx
return { ...state, count: state.count + 1 };
```

**B. Side Effects Inside Reducer**

```jsx
fetch(...) // ❌
localStorage.setItem(...) // ❌
```

Keep reducer pure.

**C. Giant Reducers**

Split by domain instead of having 1000-line reducers.
:::

---

## 15. State Machine Thinking

Senior engineers often think of reducers as state machines.

```txt
Idle → Loading → Success
                    or
         Loading → Error
```

Actions move between states.

```jsx
dispatch({ type: "FETCH_START" }); // Idle → Loading
```

---

## 16. Real Senior-Level Use Cases

| Use Case | State Examples |
|---|---|
| **Multi-Step Wizard** | currentStep, visitedSteps, errors |
| **Authentication** | user, loading, token, permissions |
| **Shopping Cart** | items, total, discounts, taxes |
| **Complex Form** | values, errors, touched, isSubmitting |

---

## 17. Decision Framework

### Use `useState`

If you can explain update in one line:

```jsx
setOpen(true);
```

### Use `useReducer`

If updates start looking like:

```jsx
setLoading(...)
setError(...)
setData(...)
setStatus(...)
```

all together.

---

## 18. Interview Questions

### Why useReducer over useState?

For complex related state transitions.

### What is an action?

An object describing what happened.

### Why keep reducers pure?

Predictability and testability.

### Can reducers perform API calls?

No. Use event handlers, effects, or async functions. Dispatch results afterward.

---

## 19. One of the Most Important Senior Insights

:::note
Many developers switch to `useReducer` because "too much state."

The real reason is "too many state transitions." That's the signal.
:::

---

## 20. Quick Cheat Sheet

| Hook | Use For |
|---|---|
| useState | Simple independent state |
| useRef | Mutable value without render |
| useEffect | Sync with external systems |
| useContext | Share values down tree |
| useMemo | Cache expensive values |
| useCallback | Cache function references |
| useReducer | Complex state transitions |

---

## One-Sentence Summary

**`useReducer` is for situations where managing how state changes becomes more complex than managing the state itself.**

---
title: "useReducer - Deep Dive"
sidebar_position: 7
description: "Senior-level deep dive into useMemo — memoized values, referential equality, performance optimization, and when NOT to memoize."
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

# 1. Why `useReducer` Exists

Imagine a login form.

With `useState`:

```jsx
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
```

Now imagine handling:

- Login start
- Login success
- Login failure
- Reset form

State updates become scattered everywhere.

---

# With useReducer

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
      return {
        ...state,
        loading: true,
        error: "",
      };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
      };

    case "LOGIN_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}
```

Now all state transitions live in one place.

---

# 2. Basic Syntax

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

You get:

```jsx
state;
```

Current state.

and

```jsx
dispatch(action);
```

A way to request state changes.

---

# 3. Core Concepts

## State

```jsx
{
  count: 0;
}
```

Current data.

---

## Action

Describes what happened.

```jsx
{
  type: "INCREMENT";
}
```

---

## Reducer

Pure function that decides next state.

```jsx
function reducer(state, action) {
  return newState;
}
```

---

## Dispatch

Sends action to reducer.

```jsx
dispatch({
  type: "INCREMENT",
});
```

---

# 4. Counter Example

---

## Reducer

```jsx
function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return {
        count: state.count + 1,
      };

    case "DECREMENT":
      return {
        count: state.count - 1,
      };

    default:
      return state;
  }
}
```

---

## Component

```jsx
const [state, dispatch] = useReducer(reducer, { count: 0 });
```

---

## Usage

```jsx
<button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>
```

---

# 5. Why Actions Matter

Instead of:

```jsx
setCount(count + 1);
```

you describe intent:

```jsx
dispatch({
  type: "INCREMENT",
});
```

This scales much better.

---

# Senior Insight

Reducers make state transitions explicit.

Reading:

```jsx
dispatch({
  type: "ADD_TO_CART",
});
```

is much clearer than:

```jsx
setCart(...)
```

---

# 6. Reducer Must Be Pure

Very important.

---

# Good

```jsx
function reducer(state, action) {
  return {
    count: state.count + 1,
  };
}
```

---

# Bad

```jsx
function reducer(state, action) {
  fetch("/api");
}
```

No side effects.

Reducers should only calculate state.

---

# 7. Real-World Example — Async Request State

A very common pattern.

---

## State

```jsx
const initialState = {
  loading: false,
  data: null,
  error: null,
};
```

---

## Reducer

```jsx
function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "FETCH_SUCCESS":
      return {
        loading: false,
        data: action.payload,
        error: null,
      };

    case "FETCH_ERROR":
      return {
        loading: false,
        data: null,
        error: action.payload,
      };

    default:
      return state;
  }
}
```

---

## Usage

```jsx
dispatch({
  type: "FETCH_START",
});
```

---

## After API Success

```jsx
dispatch({
  type: "FETCH_SUCCESS",
  payload: users,
});
```

---

# 8. useReducer vs useState

---

# useState

Good for:

```jsx
isOpen;
loading;
selectedTab;
inputValue;
```

Simple state.

---

# useReducer

Good for:

```jsx
forms
shopping carts
wizard flows
authentication
complex UI state
```

Many related updates.

---

# Example

### Good useState

```jsx
const [open, setOpen] = useState(false);
```

---

### Better useReducer

```jsx
{
  (currentStep, completedSteps, errors, loading);
}
```

Multiple connected states.

---

# 9. Form Example

Imagine:

```jsx
name;
email;
password;
errors;
loading;
success;
```

Using many states:

```jsx
useState(...)
useState(...)
useState(...)
useState(...)
```

Quickly becomes messy.

---

Reducer keeps all transitions centralized.

---

# 10. Action Payloads

Actions often carry data.

---

```jsx
dispatch({
  type: "SET_NAME",
  payload: "Somnath",
});
```

Reducer:

```jsx
case "SET_NAME":
  return {
    ...state,
    name: action.payload
  }
```

---

# 11. Lazy Initialization

Like `useState`.

---

Bad:

```jsx
const [state] = useReducer(reducer, expensiveCalculation());
```

Runs every render.

---

Better:

```jsx
const [state] = useReducer(reducer, initialArg, expensiveCalculation);
```

Initialization runs once.

---

# 12. Combining with Context

Extremely common.

---

```jsx
<AuthProvider>
```

internally:

```jsx
const [state, dispatch] = useReducer(authReducer, initialState);
```

Then expose:

```jsx
<AuthContext.Provider
  value={{
    state,
    dispatch
  }}
>
```

This is how many apps build global state.

---

# 13. Redux Connection

If you've heard Redux:

Redux reducers are basically the same idea.

---

Redux:

```jsx
(state, action) => newState;
```

---

useReducer:

```jsx
(state, action) => newState;
```

Same pattern.

Redux simply adds:

- global store
- middleware
- devtools
- selectors

---

# 14. Common Mistakes

---

## Mutating State

Bad:

```jsx
state.count++;
return state;
```

---

Good:

```jsx
return {
  ...state,
  count: state.count + 1,
};
```

---

## Side Effects Inside Reducer

Bad:

```jsx
fetch(...)
localStorage.setItem(...)
```

Keep reducer pure.

---

## Giant Reducers

Bad:

```jsx
1000-line reducer
```

Split by domain.

---

# 15. State Machine Thinking

Senior engineers often think of reducers as state machines.

---

Example:

```txt
Idle
 ↓
Loading
 ↓
Success

or

Loading
 ↓
Error
```

Actions move between states.

---

```jsx
dispatch({
  type: "FETCH_START",
});
```

Transition:

```txt
Idle → Loading
```

---

# 16. Real Senior-Level Use Cases

---

## Multi-Step Wizard

```jsx
currentStep;
visitedSteps;
errors;
```

---

## Authentication

```jsx
user;
loading;
token;
permissions;
```

---

## Shopping Cart

```jsx
items;
total;
discounts;
taxes;
```

---

## Complex Form

```jsx
values;
errors;
touched;
isSubmitting;
```

---

# 17. Decision Framework

---

### Use `useState`

If you can explain update in one line:

```jsx
setOpen(true);
```

---

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

# 18. Interview Questions

### Why useReducer over useState?

For complex related state transitions.

---

### What is an action?

An object describing what happened.

---

### Why keep reducers pure?

Predictability and testability.

---

### Can reducers perform API calls?

No.

Use:

- event handlers
- effects
- async functions

Dispatch results afterward.

---

# 19. One of the Most Important Senior Insights

Many developers switch to `useReducer` because:

```txt
Too much state
```

The real reason is:

```txt
Too many state transitions
```

That's the signal.

---

# 20. Quick Cheat Sheet

| Hook        | Use For                      |
| ----------- | ---------------------------- |
| useState    | Simple independent state     |
| useRef      | Mutable value without render |
| useEffect   | Sync with external systems   |
| useContext  | Share values down tree       |
| useMemo     | Cache expensive values       |
| useCallback | Cache function references    |
| useReducer  | Complex state transitions    |

---

# One-Sentence Summary

**`useReducer` is for situations where managing how state changes becomes more complex than managing the state itself.**

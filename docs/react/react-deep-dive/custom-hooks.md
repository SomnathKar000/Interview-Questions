---
title: "Custom Hooks - Deep Dive"
sidebar_position: 12
description: "Senior-level deep dive into custom hooks — sharing logic, state encapsulation, performance optimizations, and common patterns."
---

## Custom Hooks — Surface Level to Senior-Level Understanding

Custom Hooks are one of the biggest differences between a React developer and a React engineer.

Most developers think:

> "Custom hooks are for reusing code."

Partially true.

A better understanding is:

> Custom hooks are for reusing stateful logic and behavior.

---

## 1. What is a Custom Hook?

A custom hook is simply a function that:

- starts with `use`
- can call other hooks

Example:

```jsx
function useCounter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount((prev) => prev + 1);
  };

  return {
    count,
    increment,
  };
}
```

Usage:

```jsx
function App() {
  const { count, increment } = useCounter();

  return <button onClick={increment}>{count}</button>;
}
```

---

## 2. Why Not Just Use Utility Functions?

Utility function:

```js
function formatDate(date) {
  return ...
}
```

No React hooks.

No state.

No lifecycle.

---

Custom hook:

```jsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return width;
}
```

Uses:

- state
- effects
- React lifecycle

---

## 3. What Problem Do Custom Hooks Solve?

Imagine two components.

---

## Component A

```jsx
const [width, setWidth] = useState(window.innerWidth)

useEffect(() => {
  ...
}, [])
```

---

## Component B

```jsx
const [width, setWidth] = useState(window.innerWidth)

useEffect(() => {
  ...
}, [])
```

Duplicated logic.

---

Instead:

```jsx
const width = useWindowWidth();
```

Reusable.

---

## 4. Important Mental Model

Custom hooks do NOT share state.

This is one of the most common misunderstandings.

---

Example:

```jsx
const counter1 = useCounter();
const counter2 = useCounter();
```

Each gets its own state.

---

Equivalent to:

```jsx
const [count1] = useState(0);
const [count2] = useState(0);
```

Completely separate.

---

## 5. First Real Example

---

## useCounter

```jsx
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    setCount((prev) => prev + 1);
  };

  const decrement = () => {
    setCount((prev) => prev - 1);
  };

  const reset = () => {
    setCount(initialValue);
  };

  return {
    count,
    increment,
    decrement,
    reset,
  };
}
```

---

Usage:

```jsx
const { count, increment, reset } = useCounter(10);
```

---

## 6. Real-World Example — API Fetching

A common custom hook.

---

```jsx
function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.getUsers();

        setUsers(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
  };
}
```

---

Usage:

```jsx
const { users, loading, error } = useUsers();
```

Component stays clean.

---

## 7. Real-World Example — Debounce

Very common interview question.

---

```jsx
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

---

Usage:

```jsx
const debouncedSearch = useDebounce(search, 500);
```

---

## 8. Real-World Example — Local Storage

---

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);

    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```

---

Usage:

```jsx
const [theme, setTheme] = useLocalStorage("theme", "light");
```

---

## 9. Custom Hooks + Context

Senior pattern.

---

Instead of:

```jsx
const auth = useContext(AuthContext);
```

everywhere.

---

Create:

```jsx
function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Missing AuthProvider");
  }

  return context;
}
```

---

Usage:

```jsx
const { user } = useAuth();
```

Cleaner.

Safer.

---

## 10. Composition is the Superpower

Hooks compose beautifully.

---

Example:

```jsx
function useDashboard() {
  const { user } = useAuth();

  const users = useUsers();

  const width = useWindowWidth();

  return {
    user,
    users,
    width,
  };
}
```

Combining hooks.

---

## 11. Custom Hooks Can Return Anything

---

Object:

```jsx
return {
  count,
  increment,
};
```

---

Array:

```jsx
return [count, increment];
```

---

Function:

```jsx
return fetchUsers;
```

---

Value:

```jsx
return width;
```

---

## Senior Rule

Usually prefer objects.

More readable.

---

## Good

```jsx
const { users, loading } = useUsers();
```

---

## Less Clear

```jsx
const [users, loading] = useUsers();
```

---

## 12. Rules of Hooks Still Apply

Bad:

```jsx
function useSomething() {
  if (condition) {
    useEffect(...)
  }
}
```

Invalid.

---

Good:

```jsx
function useSomething() {
  useEffect(...)
}
```

---

Custom hooks must obey all hook rules.

---

## 13. Common Mistakes

---

## Creating Hooks Too Early

Bad:

```jsx
useButtonColor();
```

for tiny logic.

---

Don't abstract prematurely.

---

## Massive God Hooks

Bad:

```jsx
useDashboard();
```

containing:

```txt
500 lines
12 effects
20 states
```

Hard to maintain.

---

Split responsibilities.

---

## Hidden Side Effects

Bad:

```jsx
useUser();
```

secretly:

```txt
updates localStorage
navigates
opens modal
```

Unexpected behavior.

---

## 14. Senior-Level Hook Design

A good hook should:

- Have one responsibility
- Have predictable output
- Hide implementation details
- Be reusable
- Be testable

---

## Example

Good:

```jsx
useDebounce();
```

One job.

---

Bad:

```jsx
useEverything();
```

Too much.

---

## 15. Hook Naming Convention

Always:

```txt
useSomething
```

Examples:

```txt
useAuth
useUsers
useModal
useDebounce
useLocalStorage
useTheme
```

---

Why?

React uses naming convention to detect hook usage.

Lint rules depend on it.

---

## 16. Real Senior-Level Examples

You'll frequently build:

---

## Data Hooks

```jsx
useUsers();
useProjects();
useTasks();
```

---

## UI Hooks

```jsx
useModal();
useToast();
useSidebar();
```

---

## Browser Hooks

```jsx
useWindowWidth();
useOnlineStatus();
useClipboard();
```

---

## Utility Hooks

```jsx
useDebounce();
useThrottle();
useInterval();
```

---

## Context Hooks

```jsx
useAuth();
useTheme();
```

---

## 17. Interview Questions

### What is a custom hook?

A function that uses React hooks to encapsulate reusable stateful logic.

---

### Do custom hooks share state?

No.

Each call gets its own isolated state.

---

### Why must hook names start with "use"?

React and ESLint use that convention to enforce hook rules.

---

### Can custom hooks call other custom hooks?

Yes.

That's one of their biggest strengths.

---

## 18. Senior-Level Insight

Most developers see custom hooks as:

```txt
Code reuse
```

Senior engineers see them as:

```txt
Behavior abstraction
```

Example:

```jsx
useInfiniteScroll();
```

The component doesn't care:

- event listeners
- cleanup
- pagination
- observers

The hook owns that behavior.

---

## Final Mental Model

Think of custom hooks as:

```txt
Components reuse UI

Custom hooks reuse behavior
```

---

## Example

UI:

```jsx
<Button />
<Card />
<Modal />
```

Behavior:

```jsx
useAuth();
useDebounce();
useFetch();
useLocalStorage();
```

---

## Quick Rule of Thumb

Create a custom hook when:

✅ Multiple components need the same stateful logic

✅ A component is becoming cluttered with hook logic

✅ You want to hide implementation details

Avoid creating one when:

❌ It's only a few lines

❌ It won't be reused

❌ It makes the code harder to understand

For senior React engineering, custom hooks are often the primary tool for organizing business logic while keeping components focused on rendering.

## Hooks

### What are React Hooks?

**React Hooks** are new Set of features in React that allow you to use state and other react features without using a class.
Hooks are functions that let you `hoom into` React state and lifecycle features from function component. They do not work inside classes.

To ensure proper usage of Hooks, it's important to follow these rules:

- **Only Call Hooks at the Top Level**:

  - Don’t call Hooks inside loops, conditions, or nested functions. Instead, always use Hooks at the top level of your React function, before any early returns.

- **Only Call Hooks from React Functions**:

  - Hooks should be called from within React function components, whether they are built-in components or custom components you create using Hooks. Avoid calling Hooks from regular JavaScript functions. You can:

    ✅ Call Hooks from React function components.
    ✅ Call Hooks from custom Hooks, which are reusable functions you create to encapsulate state and logic for your components.

## What is state in React?

**State** in React refers to the data that a component manages and can change over time. It's a way for components to keep track of information that may be dynamic or user-dependent. State is used to store and manage information that affects a component's rendering and behavior. When state changes, React re-renders the component to reflect the new state.

### useState Hook

The `useState` Hook is a fundamental React Hook that allows you to add state to functional components. It enables you to declare and manage state variables within a functional component. Prior to the introduction of Hooks, state management was primarily done in class components using the `this.state` object. With the `useState` Hook, you can manage component state in a more concise and readable way in functional components.

Here's how the `useState` Hook works:

```javascript
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  const Decrement = () => {
    setCount((preCount) => preCount - 1);
  };
  const Increment = () => {
    setCount((preCount) => preCount + 1);
  };
  return (
    <>
      <button onClick={Increment}>+</button>
      <span>{count}</span>
      <button onClick={Decrement}>-</button>
    </>
  );
}

export default App;
```

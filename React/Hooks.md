## What are React Hooks?

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

## useState Hook

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

Updating state with objects in React using the `useState` Hook is a common source of confusion for many developers. The reason is that when you use `useState` to update an object state, it doesn't merge the new state with the old state. Instead, it completely replaces the old state with the new object. This can lead to unexpected behavior if you're not careful.

Let's illustrate this with an example:

```javascript
import React, { useState } from "react";

function StateObjectExample() {
  const [person, setPerson] = useState({ name: "John", age: 30 });

  const updateAge = () => {
    // This is where the problem occurs
    setPerson({ age: 31 });
  };

  return (
    <div>
      <p>Name: {person.name}</p>
      <p>Age: {person.age}</p>
      <button onClick={updateAge}>Update Age</button>
    </div>
  );
}

export default StateObjectExample;
```

In this example, we have a functional component `StateObjectExample` that uses the `useState` Hook to manage a `person` object with `name` and `age` properties. When the "Update Age" button is clicked, we want to update the `age` property of the `person` object.

However, if you run this code and click the button, you'll notice that the `name` property of the `person` object disappears. The reason is that when you call `setPerson({ age: 31 })`, you're providing a new object that only contains the `age` property, but it doesn't include the `name` property. As a result, the entire `person` object gets replaced by this new object.

To correctly update the state while preserving the `name` property, you should use the functional update form of `useState` like this:

```javascript
const updateAge = () => {
  setPerson((prevPerson) => ({
    ...prevPerson,
    age: 31,
  }));
};
```

By using the functional update, you can access the previous state (`prevPerson`), spread its properties, and then override the `age` property with the new value. This way, you update only the `age` property while keeping the rest of the object intact.

## useEffect Hook

The `useEffect` hook allows you to perform side effects in functional components. Side effects are actions that happen outside of the React component, such as fetching data, setting up subscriptions, or updating the DOM.

Here's how the `useEffect` Hook works:

```javascript
import { useState, useEffect } from "react";

function App() {
  const [resourceType, setResourceType] = useState("posts");
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/${resourceType}`)
      .then((response) => response.json())
      .then((data) => setItems(data));
  }, [resourceType]);

  return (
    <>
      <div>
        <button onClick={() => setResourceType("posts")}>Posts</button>
        <button onClick={() => setResourceType("users")}>Users</button>
        <button onClick={() => setResourceType("comments")}>Comments</button>
      </div>
      <h1>{resourceType}</h1>
      {items.map((item: unknown, i) => (
        <pre key={i}>{JSON.stringify(item)}</pre>
      ))}
    </>
  );
}

export default App;
```

### The useEffect hook return statement

The `useEffect` hook return statement can be used to clean up any side effects that were created in the effect. This is important because it ensures that your components are garbage collected properly and that you are not leaking any resources.

There are two ways to use the `useEffect` hook return statement:

1. **Return a function**: This function will be executed when the component is unmounted. This is a good way to clean up any subscriptions, timers, or other resources that were created in the effect.
2. **Return nothing**: If you do not return anything from the `useEffect` hook return statement, the effect will be cleaned up automatically. This is a good option if the effect does not need to be cleaned up explicitly.

Here are some examples of how to use the `useEffect` hook return statement:

```javascript
// Example 1: Clean up a subscription
useEffect(() => {
  const subscription = myApi.subscribe((data) => {
    // Update the state of the component with the data.
  });

  return () => subscription.unsubscribe();
}, []);

// Example 2: Clean up a timer
useEffect(() => {
  const timer = setInterval(() => {
    // Update the state of the component.
  }, 1000);

  return () => clearInterval(timer);
}, []);

// Example 3: Do not need to clean up the effect
useEffect(() => {
  // Update the document title.
  document.title = "My App";
}, []);
```

## useMemo hook

The `useMemo` Hook in React is used to memoize the result of a function and cache it for optimized performance. It is often used to prevent unnecessary re-computations in functional components. Memoization is a technique where the result of a function is cached, and if the function is called again with the same inputs, the cached result is returned instead of recomputing the result.

Here's how `useMemo` works:

```javascript
import React, { useMemo } from "react";

function FactorialCalculator({ number }) {
  const factorial = useMemo(() => {
    console.log("Calculating factorial...");
    let result = 1;
    for (let i = 1; i <= number; i++) {
      result *= i;
    }
    return result;
  }, [number]);

  return (
    <div>
      <p>
        Factorial of {number} is: {factorial}
      </p>
    </div>
  );
}

export default FactorialCalculator;
```

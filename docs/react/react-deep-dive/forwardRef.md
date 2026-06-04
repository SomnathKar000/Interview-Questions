---
title: "forwardRef - Deep Dive"
sidebar_position: 10
description: "Senior-level deep dive into forwardRef — ref forwarding, imperative handling, component composition, and when to avoid it."
---

# `forwardRef` — Surface Level to Senior-Level Understanding

Most developers encounter `forwardRef` when they see:

```jsx id="1"
const Input = forwardRef(...)
```

and wonder:

> Why can't I just pass `ref` like a normal prop?

The answer gets to how React treats refs internally.

---

## 1. The Problem `forwardRef` Solves

Consider:

```jsx id="2"
function Input() {
  return <input />;
}
```

Usage:

```jsx id="3"
const inputRef = useRef()

<Input ref={inputRef} />
```

You might expect:

```jsx id="4"
inputRef.current.focus();
```

to work.

It doesn't.

---

## Why?

Because:

```txt id="5"
ref is NOT a normal prop
```

React treats:

```jsx id="6"
ref;
key;
```

as special fields.

They are not passed into component props.

---

## Example

```jsx id="7"
function Input(props) {
  console.log(props);
}
```

Even if:

```jsx id="8"
<Input ref={inputRef} />
```

you won't see:

```js id="9"
props.ref;
```

---

## 2. What forwardRef Does

It allows a component to receive a ref and forward it somewhere else.

---

## Without forwardRef

```jsx id="10"
<Input ref={inputRef} />
```

❌ Doesn't work.

---

## With forwardRef

```jsx id="11"
const Input = forwardRef((props, ref) => {
  return <input ref={ref} />;
});
```

Now:

```jsx id="12"
<Input ref={inputRef} />
```

works.

---

## React Flow

```txt id="13"
Parent
 ↓
ref
 ↓
forwardRef
 ↓
input DOM node
```

---

## 3. Complete Example

---

## Child

```jsx id="14"
const Input = forwardRef((props, ref) => {
  return <input ref={ref} />;
});
```

---

## Parent

```jsx id="15"
function App() {
  const inputRef = useRef();

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <>
      <Input ref={inputRef} />

      <button onClick={focusInput}>Focus</button>
    </>
  );
}
```

---

When button clicked:

```jsx id="16"
inputRef.current.focus();
```

focuses input.

---

## 4. Mental Model

Without forwardRef:

```txt id="17"
Parent
 ↓
Input Component
 ↓
Input DOM
```

Ref gets stuck at component boundary.

---

With forwardRef:

```txt id="18"
Parent
 ↓
Input Component
 ↓
forwardRef
 ↓
Input DOM
```

Ref reaches DOM node.

---

## 5. Why React Needs This

React wants components to encapsulate implementation details.

Normally:

```jsx id="19"
<MyInput />
```

should hide:

```txt id="20"
input
textarea
contenteditable
```

implementation.

---

Using forwardRef intentionally exposes internal element.

---

## 6. Real-World Use Cases

---

## A. Focus Management

Very common.

```jsx id="21"
inputRef.current.focus();
```

---

## B. Text Selection

```jsx id="22"
inputRef.current.select();
```

---

## C. Scrolling

```jsx id="23"
elementRef.current.scrollIntoView();
```

---

## D. Measuring Dimensions

```jsx id="24"
elementRef.current.offsetWidth;
```

---

## E. Integrating Third-Party Libraries

```txt id="25"
Charts
Maps
Editors
Canvas
Video Players
```

Need DOM access.

---

## 7. Common UI Library Example

Imagine:

```jsx id="26"
<Button />
```

inside design system.

Consumer wants:

```jsx id="27"
buttonRef.current.focus();
```

Without forwardRef:

impossible.

---

With forwardRef:

```jsx id="28"
const Button = forwardRef((props, ref) => <button ref={ref} {...props} />);
```

Now works.

---

## 8. Passing Props Normally

forwardRef doesn't change props.

---

```jsx id="29"
const Input = forwardRef(({ label }, ref) => {
  return (
    <>
      <label>{label}</label>
      <input ref={ref} />
    </>
  );
});
```

Usage:

```jsx id="30"
<Input ref={inputRef} label="Email" />
```

Works fine.

---

## 9. Multiple Internal Elements

Interesting situation.

---

Suppose:

```jsx id="31"
const Input = forwardRef((props, ref) => {
  return (
    <>
      <label>Name</label>
      <input ref={ref} />
    </>
  );
});
```

Which element gets ref?

Only:

```jsx id="32"
<input />
```

because you attached it there.

---

## 10. Ref Forwarding Through Multiple Layers

---

## Component Tree

```txt id="33"
App
 ↓
Form
 ↓
Input
 ↓
input DOM
```

---

Both components must forward ref.

---

## Form

```jsx id="34"
const Form = forwardRef((props, ref) => {
  return <Input ref={ref} />;
});
```

---

## Input

```jsx id="35"
const Input = forwardRef((props, ref) => {
  return <input ref={ref} />;
});
```

Now reaches DOM node.

---

## 11. forwardRef + useImperativeHandle

This is where things get really interesting.

---

Normally:

```jsx id="36"
ref.current;
```

becomes DOM node.

---

Example:

```jsx id="37"
HTMLInputElement;
```

---

Sometimes you don't want to expose entire DOM node.

---

Instead:

```jsx id="38"
ref.current.focus();
```

only.

---

Use:

```jsx id="39"
useImperativeHandle();
```

---

Example:

```jsx id="40"
const Input = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    },
  }));

  return <input ref={inputRef} />;
});
```

---

Parent:

```jsx id="41"
inputRef.current.focus();
```

Works.

But parent cannot access:

```jsx id="42"
inputRef.current.value;
```

unless exposed.

---

## Senior Insight

This creates a controlled public API.

Very useful for reusable components.

---

## 12. Common Pitfalls

---

## Forgetting forwardRef

```jsx id="43"
<Input ref={ref} />
```

won't work.

---

## Assuming ref is prop

```jsx id="44"
props.ref;
```

is undefined.

---

## Exposing Too Much

Bad:

```jsx id="45"
return <input ref={ref} />;
```

when component should hide internals.

Sometimes useImperativeHandle is safer.

---

## 13. React 19 Note

React 19 introduces:

```jsx id="46"
function MyInput({ ref }) {}
```

allowing refs as props directly.

This reduces need for `forwardRef` in future React versions.

However:

- huge codebases still use forwardRef
- interviews still ask it
- many libraries still depend on it

So understanding it remains important.

---

## 14. Common Interview Questions

### Why doesn't ref work on functional components?

Because ref is special and isn't passed like normal props.

---

### What does forwardRef do?

Allows parent refs to reach child DOM nodes or imperative APIs.

---

### Difference between forwardRef and useRef?

`useRef`

```txt id="47"
creates ref
```

`forwardRef`

```txt id="48"
forwards ref
```

---

### Why combine forwardRef with useImperativeHandle?

To expose controlled methods instead of full DOM nodes.

---

## 15. Real Senior-Level Use Cases

You'll most commonly see `forwardRef` in:

- Component libraries
- Design systems
- Form libraries
- Modal systems
- Editors
- Canvas wrappers
- Complex reusable UI components

Examples:

- Material UI
- Radix UI
- Headless UI
- React Hook Form integrations

---

## Final Mental Model

Think of refs like a tunnel.

Without `forwardRef`:

```txt
Parent
 ↓
Component Boundary ✖
 ↓
DOM Node
```

The tunnel stops.

With `forwardRef`:

```txt
Parent
 ↓
forwardRef
 ↓
DOM Node
```

The tunnel continues through the component.

---

## Quick Rule of Thumb

Use `forwardRef` when:

✅ Parent needs access to child's DOM node or imperative API.

Examples:

```jsx
focus();
scrollIntoView();
select();
measure();
play();
pause();
```

Don't use it when:

❌ Data can be passed through props.

Props are declarative.
Refs are imperative.

A senior React engineer generally prefers props first and reaches for refs only when imperative control is genuinely needed.

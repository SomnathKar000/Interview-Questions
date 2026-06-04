---
title: "Component Patterns"
sidebar_position: 15
description: "Senior-level deep dive into Component Patterns — how React decides when to re-render, when to skip, and how to optimize it."
---

# React Component Patterns — From Mid-Level to Senior-Level

When developers reach ~3 years of experience, the challenge is no longer:

> "How do I build a component?"

The challenge becomes:

> "How do I design components that scale?"

Component patterns are essentially reusable architectural solutions.

---

# 1. Presentational vs Container Components

One of the oldest React patterns.

---

## Presentational Component

Responsible for:

- UI
- Layout
- Styling

```jsx id="1"
function UserCard({ user, onEdit }) {
  return (
    <div>
      <h2>{user.name}</h2>

      <button onClick={onEdit}>Edit</button>
    </div>
  );
}
```

---

## Container Component

Responsible for:

- Fetching data
- Business logic
- State

```jsx id="2"
function UserCardContainer() {
  const { user } = useUser()

  const handleEdit = () => {
    ...
  }

  return (
    <UserCard
      user={user}
      onEdit={handleEdit}
    />
  )
}
```

---

# Modern Equivalent

Today we often move container logic into:

```txt
Custom Hooks
```

instead.

---

Example:

```jsx id="3"
function UserCard() {
  const { user, editUser } =
    useUserCard()

  ...
}
```

---

# 2. Custom Hook Pattern

Probably the most important modern React pattern.

---

Separate behavior from UI.

---

Bad:

```jsx id="4"
function Dashboard() {
  useState(...)
  useEffect(...)
  useEffect(...)
  useEffect(...)
  useCallback(...)
  useMemo(...)
}
```

500 lines.

---

Better:

```jsx id="5"
function Dashboard() {
  const {
    users,
    loading
  } = useUsers()

  return ...
}
```

---

Logic lives in:

```jsx id="6"
useUsers();
```

---

# Senior Rule

Components render.

Hooks manage behavior.

---

# 3. Compound Components Pattern

Extremely common in UI libraries.

Examples:

- Tabs
- Accordion
- Select
- Modal

---

Usage:

```jsx id="7"
<Tabs>
  <Tabs.List>
    <Tabs.Trigger>Profile</Tabs.Trigger>

    <Tabs.Trigger>Settings</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content>Profile Content</Tabs.Content>
</Tabs>
```

---

Instead of:

```jsx id="8"
<Tabs
  tabs={[...]}
  content={[...]}
/>
```

---

Benefits:

- Flexible
- Declarative
- Composable

---

Used heavily by:

- Radix UI
- Headless UI
- Reach UI

---

# 4. Controlled Components Pattern

React owns state.

---

```jsx id="9"
function App() {
  const [value, setValue] = useState("");

  return <Input value={value} onChange={setValue} />;
}
```

---

Input doesn't own state.

Parent owns state.

---

Benefits:

- Predictable
- Validation
- Easy synchronization

---

# 5. Uncontrolled Components Pattern

DOM owns state.

---

```jsx id="10"
const inputRef = useRef()

<input ref={inputRef} />
```

---

Get value later:

```jsx id="11"
inputRef.current.value;
```

---

Used in:

- React Hook Form
- Large forms
- Performance-sensitive inputs

---

# 6. Controlled + Uncontrolled Hybrid Pattern

Very common in libraries.

---

Example:

```jsx id="12"
<Select value={value} defaultValue="A" />
```

Supports both:

```txt
Controlled
Uncontrolled
```

---

Used by:

- Material UI
- Ant Design
- Radix UI

---

# 7. Render Props Pattern

Popular before hooks.

Still appears in libraries.

---

```jsx id="13"
<DataFetcher render={(data) => <UserList users={data} />} />
```

---

Alternative:

```jsx id="14"
<DataFetcher>{(data) => <UserList users={data} />}</DataFetcher>
```

---

Provides flexibility.

---

Today often replaced by:

```txt
Custom Hooks
```

---

# 8. Higher Order Component (HOC)

Another older pattern.

---

```jsx id="15"
const Enhanced = withAuth(Component);
```

---

Example:

```jsx id="16"
export default withAuth(Dashboard);
```

---

HOC injects:

```txt
Authentication
Permissions
Tracking
Analytics
```

---

Modern React prefers:

```txt
Hooks
```

but HOCs still exist.

---

Examples:

```txt
connect()
withRouter()
```

---

# 9. Provider Pattern

Very important.

Uses Context.

---

Example:

```jsx id="17"
<AuthProvider>
  <App />
</AuthProvider>
```

---

Inside:

```jsx id="18"
<AuthContext.Provider
  value={...}
>
```

---

Consumers:

```jsx id="19"
const { user } = useAuth();
```

---

Used for:

```txt
Theme
Auth
Localization
Feature Flags
```

---

# 10. Headless Component Pattern

Huge modern trend.

---

Component provides:

```txt
Behavior
State
Accessibility
```

But no styling.

---

Example:

```jsx id="20"
const { open, toggle } = useAccordion();
```

You provide UI.

---

Benefits:

- Maximum customization
- Reusability

---

Examples:

- Radix UI
- Headless UI
- Downshift

---

# 11. State Reducer Pattern

Used by advanced component libraries.

---

Instead of:

```jsx id="21"
<Dropdown />
```

controlling everything.

Allow user to modify transitions.

---

Example:

```jsx id="22"
<Dropdown
  stateReducer={(state, action) => {
    ...
  }}
/>
```

---

Popularized by:

```txt
Downshift
```

---

# 12. Slots Pattern

Popular in Vue.

Growing in React.

---

Example:

```jsx id="23"
<Card header={<Header />} footer={<Footer />} />
```

---

Or:

```jsx id="24"
<Card>
  <Card.Header />
  <Card.Body />
  <Card.Footer />
</Card>
```

---

Provides flexible layouts.

---

# 13. Polymorphic Components

Very common in design systems.

---

Example:

```jsx id="25"
<Button as="a" href="/home">
  Home
</Button>
```

---

Renders:

```html
<a href="/home">Home</a>
```

---

Or:

```jsx id="26"
<Button as={Link} />
```

---

Used heavily by:

- Chakra UI
- Radix UI

---

# 14. Imperative API Pattern

Uses:

```txt
forwardRef
useImperativeHandle
```

---

Example:

```jsx id="27"
modalRef.current.open();
```

---

Good for:

```txt
Modals
Editors
Video Players
```

---

Not for ordinary state.

---

# 15. Composition Pattern (Most Important)

React philosophy:

```txt
Compose
Don't inherit
```

---

Bad:

```txt
BaseButton
PrimaryButton
SecondaryButton
DangerButton
```

Inheritance thinking.

---

Better:

```jsx id="28"
<Button variant="danger" />
```

---

Or:

```jsx id="29"
<Card>
  <Header />
  <Body />
</Card>
```

---

Small pieces combined together.

---

# Real Senior Example

Imagine building a Modal library.

---

You might combine:

```txt
Provider Pattern
+
Compound Components
+
Context
+
Custom Hooks
+
Imperative API
```

---

Example:

```jsx id="30"
<Modal>
  <Modal.Trigger />
  <Modal.Content />
</Modal>
```

Internally:

```txt
Context
State
Custom Hook
Accessibility Logic
```

---

User only sees:

```jsx
<Modal />
```

---

# Pattern Selection Guide

| Problem                        | Pattern                          |
| ------------------------------ | -------------------------------- |
| Share behavior                 | Custom Hook                      |
| Share global data              | Provider                         |
| Flexible UI composition        | Compound Components              |
| Parent owns state              | Controlled Component             |
| DOM owns state                 | Uncontrolled Component           |
| Expose imperative actions      | forwardRef + useImperativeHandle |
| Inject behavior into component | HOC                              |
| Maximum styling flexibility    | Headless Components              |
| Complex state transitions      | Reducer Pattern                  |
| Flexible rendering             | Render Props                     |

---

# What Senior Engineers Use Most Today

In modern React codebases:

### Very Common

✅ Custom Hooks

✅ Provider Pattern

✅ Compound Components

✅ Controlled Components

✅ Composition

---

### Sometimes

✅ Headless Components

✅ Polymorphic Components

✅ Imperative APIs

---

### Less Common (Legacy but still important)

✅ HOCs

✅ Render Props

---

# One-Sentence Summary

A senior React engineer isn't judged by knowing hooks individually; they're judged by knowing how to combine component patterns to create scalable, reusable, maintainable systems.

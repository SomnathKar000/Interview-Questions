---
title: "Pinia vs Vuex Lifecycle Hooks"
sidebar_position: 3
description: "Pinia vs Vuex lifecycle hooks — when each is called and why it matters."
---

These two topics are frequently asked in senior Vue interviews because they reveal whether you understand **state ownership** and **component lifecycle management**.

---

# Part 1: Pinia Deep Dive

---

## Why Do We Need Pinia?

Imagine:

```text
App
 ├── Navbar
 ├── Sidebar
 ├── Dashboard
 └── UserProfile
```

User information is needed everywhere.

Without Pinia:

```js
App
 ↓
 Navbar
 ↓
 Dashboard
 ↓
 UserProfile
```

Props drilling becomes painful.

---

Solution:

```text
Pinia Store

        UserStore
             │
 ┌───────────┼───────────┐
Navbar   Dashboard   Profile
```

Centralized state.

---

# Pinia vs Vuex

Vuex:

```js
store.commit("increment");
store.dispatch("fetchUsers");
```

Pinia:

```js
store.increment();
await store.fetchUsers();
```

Cleaner API.

---

Vuex:

```js
mutations;
actions;
getters;
state;
```

Pinia:

```js
state;
actions;
getters;
```

No mutations.

---

# Creating a Store

```js
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => ({
    count: 0,
  }),

  actions: {
    increment() {
      this.count++;
    },
  },
});
```

Usage:

```js
const store = useCounterStore();

store.increment();
```

---

# State

```js
state: () => ({
  user: null,
  loading: false,
});
```

Equivalent to:

```js
const user = ref(null);
const loading = ref(false);
```

inside a composable.

---

# Getters

Equivalent to computed.

```js
getters: {
  fullName(state) {
    return `${state.first} ${state.last}`
  }
}
```

Usage:

```js
store.fullName;
```

No parentheses.

---

# Actions

Equivalent to methods.

```js
actions: {
  async fetchUser() {
    this.loading = true

    this.user = await api.getUser()

    this.loading = false
  }
}
```

---

# Setup Store

Senior teams often prefer this.

```js
export const useUserStore = defineStore("user", () => {
  const user = ref(null);

  const login = async () => {
    user.value = await api.login();
  };

  return {
    user,
    login,
  };
});
```

Feels like a composable.

---

# Common Mistake

Destructuring:

```js
const store = useUserStore();

const { user } = store;
```

Breaks reactivity.

---

Use:

```js
import { storeToRefs } from "pinia";

const store = useUserStore();

const { user } = storeToRefs(store);
```

---

# When NOT To Use Pinia

Many developers overuse global state.

Bad:

```js
selectedTab;
modalOpen;
dropdownVisible;
```

These should remain local.

```js
const modalOpen = ref(false);
```

inside component.

---

Good candidates for Pinia:

```text
Authentication
Current User
Permissions
Theme
Notifications
Shopping Cart
Feature Flags
```

---

# Pinia Architecture (Senior)

Bad:

```text
Store
 ├── API Calls
 ├── Business Logic
 ├── UI Logic
 ├── Validation
 ├── Routing
```

1000-line store.

---

Better:

```text
services/
  user.service.js

stores/
  user.store.js

components/
```

Store:

```js
async fetchUser() {
  this.user = await userService.fetch()
}
```

---

# Pinia Reactivity

Store state is reactive.

```js
store.count++;
```

Triggers:

```text
Component Render
Computed
Watchers
Getters
```

Same Vue reactivity system underneath.

---

# Store Subscriptions

Listen to state changes.

```js
store.$subscribe((mutation, state) => {
  console.log(state);
});
```

Useful:

- localStorage sync
- analytics
- audit logs

---

# Store Patch

Update multiple values.

```js
store.$patch({
  count: 5,
  loading: false,
});
```

Single update cycle.

---

# Lifecycle Hooks Deep Dive

Most developers only know:

```js
onMounted();
```

Senior developers understand exactly when every hook runs.

---

# Component Lifecycle

```text
setup()

beforeMount

mounted

beforeUpdate

updated

beforeUnmount

unmounted
```

---

# setup()

Runs first.

```js
setup() {
  console.log('setup')
}
```

Composition API starts here.

---

At this point:

```text
Reactive State Available ✔
DOM Available ❌
```

Cannot do:

```js
element.focus();
```

yet.

---

# onBeforeMount()

```js
onBeforeMount(() => {});
```

Runs before initial render.

Rarely used.

---

State:

```text
Reactive State ✔
DOM ❌
```

---

# onMounted()

Most common hook.

```js
onMounted(() => {
  fetchUsers();
});
```

State:

```text
Reactive State ✔
DOM ✔
```

Perfect for:

```text
API Calls
Charts
Maps
Focus Inputs
Observers
```

---

Example:

```js
const input = ref();

onMounted(() => {
  input.value.focus();
});
```

---

# beforeUpdate

Component will rerender.

```js
onBeforeUpdate(() => {
  console.log("before update");
});
```

DOM still old.

---

# updated

DOM already updated.

```js
onUpdated(() => {
  console.log("updated");
});
```

Useful for:

```text
Third-party DOM libraries
Measurements
```

---

Example

```js
onUpdated(() => {
  console.log(container.value.offsetHeight);
});
```

---

# beforeUnmount

Cleanup preparation.

```js
onBeforeUnmount(() => {});
```

---

# unmounted

Component removed.

```js
onUnmounted(() => {});
```

Critical for cleanup.

---

Example

```js
onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
```

---

# Common Memory Leak

Bad:

```js
setInterval(() => {
  console.log("running");
}, 1000);
```

Navigate away.

Interval still exists.

---

Correct:

```js
let timer

onMounted(() => {
  timer = setInterval(...)
})

onUnmounted(() => {
  clearInterval(timer)
})
```

---

# KeepAlive Lifecycle

Many seniors miss this.

---

Suppose:

```vue
<KeepAlive>
  <UserPage />
</KeepAlive>
```

Component is NOT destroyed.

---

Instead:

```text
mounted

activated

deactivated

activated

deactivated
```

---

Hooks:

```js
onActivated(() => {});
```

```js
onDeactivated(() => {});
```

Useful for:

- tabs
- caching pages
- dashboards

---

# Async Setup

Vue 3 supports:

```js
async setup() {
  const user = await api.getUser()

  return {
    user
  }
}
```

Often paired with:

```vue
<Suspense>
```

for loading states.

---

# Lifecycle + Reactivity

Important concept.

---

When:

```js
count.value++;
```

Vue doesn't immediately rerender.

Flow:

```text
Reactive Change

↓

Watcher

↓

Computed Dirty

↓

Scheduler Queue

↓

beforeUpdate

↓

DOM Update

↓

updated
```

---

# Senior-Level Interview Questions

### Q1

When should you use Pinia?

Answer:

When state is shared across unrelated components or must survive route changes.

---

### Q2

Difference between local state and store state?

Local:

```js
const open = ref(false);
```

Component owns it.

Store:

```js
authStore.user;
```

Application owns it.

---

### Q3

Why use `storeToRefs()`?

Because direct destructuring breaks reactivity.

---

### Q4

Difference between `mounted` and `updated`?

Mounted:

```text
Initial render complete.
```

Updated:

```text
Subsequent rerenders complete.
```

---

### Q5

Most common lifecycle mistake?

Forgetting cleanup:

```js
addEventListener;
setInterval;
MutationObserver;
IntersectionObserver;
WebSocket;
```

which causes memory leaks.

---

### Senior Mental Model

Think in terms of ownership:

### Local Component State

```js
modalOpen;
searchInput;
hoveredRow;
```

→ `ref()`

---

### Shared Application State

```js
auth;
permissions;
theme;
notifications;
```

→ Pinia

---

### Lifecycle

```text
Create
Mount
Update
Destroy
```

Every side effect you create should have a clear cleanup path. That's one of the biggest differences between a mid-level Vue developer and a senior one working on large, long-running applications.

---
title: "Performance Tips in Vue"
sidebar_position: 5
description: "Performance tips in Vue for large applications — optimization strategies that matter in real projects."
---

Performance optimization in Vue is one of those topics where many developers memorize APIs (`computed`, `memo`, `lazy loading`) but don't understand **what actually causes slow applications**.

Most Vue performance problems come from:

1. Unnecessary re-renders
2. Large reactive objects
3. Expensive computations
4. Huge lists
5. Too much global state
6. Bundle size
7. Network requests
8. Memory leaks

---

## 1. Understand What Causes a Re-render

Consider:

```vue
<template>
  <Child :count="count" />
</template>

<script setup>
const count = ref(0);
</script>
```

When:

```js
count.value++;
```

Vue:

```text
Parent Render

↓

Child Render

↓

DOM Patch
```

Even if the child doesn't care about the change.

---

## Use Vue DevTools First

Before optimizing:

- Component render count
- Slow components
- Pinia updates
- Timeline profiling

Never optimize blindly.

---

## 2. Computed vs Methods

Bad:

```vue
<template>
  {{ expensiveCalculation() }}
</template>
```

```js
function expensiveCalculation() {
  return users.value.filter(...)
}
```

Runs every render.

---

Good:

```js
const filteredUsers = computed(() => {
  return users.value.filter(...)
})
```

Runs only when dependencies change.

---

## Real Example

Bad:

```js
function totalPrice() {
  return cart.value.reduce(...)
}
```

If component renders 20 times:

```text
20 recalculations
```

---

Computed:

```js
const totalPrice = computed(() =>
  cart.value.reduce(...)
)
```

```text
1 recalculation
```

until cart changes.

---

## 3. Avoid Unnecessary Reactive Data

Bad:

```js
const hugeApiResponse = reactive(response);
```

Imagine:

```js
1000 products
50 fields each
```

Vue creates deep reactivity.

Expensive.

---

Better:

```js
const products = shallowRef(response);
```

or

```js
const products = ref(response);
```

when deep tracking isn't needed.

---

## 4. Use shallowRef for Large Objects

Very common senior optimization.

Bad:

```js
const chart = ref(chartInstance);
```

Vue recursively tracks:

```text
chart
 ├─ datasets
 ├─ scales
 ├─ plugins
 ├─ options
```

Thousands of properties.

---

Good:

```js
const chart = shallowRef(chartInstance);
```

Vue only tracks:

```text
chart.value
```

not internals.

---

Useful for:

- Chart.js
- Monaco Editor
- Leaflet
- Google Maps
- TipTap
- Three.js

---

## 5. markRaw()

Tell Vue:

> Ignore this object completely.

```js
const editor = markRaw(new Editor());
```

Without:

```text
Vue creates proxies
Tracks dependencies
Consumes memory
```

---

With:

```text
No reactivity overhead
```

---

## 6. Virtualize Large Lists

Most common production issue.

Bad:

```vue
<div v-for="user in 10000Users" :key="user.id">
  {{ user.name }}
</div>
```

Browser creates:

```text
10000 DOM nodes
```

Slow.

---

Use virtualization.

Examples:

- Vue Virtual Scroller
- Virtual List

Render:

```text
Only visible rows
```

Maybe:

```text
30 nodes
```

instead of:

```text
10000 nodes
```

Huge improvement.

---

## 7. Avoid Deep Watchers

Bad:

```js
watch(
  user,
  () => {
    save();
  },
  {
    deep: true,
  },
);
```

Vue traverses entire object.

---

Example:

```js
user
 ├─ profile
 ├─ permissions
 ├─ teams
 ├─ settings
```

Every nested change tracked.

---

Better:

```js
watch(() => user.settings.theme, saveTheme);
```

Watch specific properties.

---

## 8. Lazy Load Routes

Bad:

```js
import Dashboard from "./Dashboard.vue";
```

Loads immediately.

---

Good:

```js
const Dashboard = () => import("./Dashboard.vue");
```

Route:

```js
{
  path: '/dashboard',
  component: Dashboard
}
```

Bundle split automatically.

---

Initial JS becomes much smaller.

---

## 9. Async Components

Heavy components:

```vue
<RichTextEditor />
```

---

Load only when needed.

```js
const RichTextEditor = defineAsyncComponent(
  () => import("./RichTextEditor.vue"),
);
```

---

Useful for:

- Editors
- Charts
- Reports
- Admin pages

---

## 10. v-if vs v-show

Interview favorite.

---

## v-if

```vue
<div v-if="show">
```

Creates/removes DOM.

---

Cost:

```text
Mount
Unmount
Mount
Unmount
```

---

Good for:

```text
Rarely shown components
```

Examples:

- Modal
- Settings page

---

## v-show

```vue
<div v-show="show">
```

Only toggles:

```css
display: none;
```

---

Good for:

```text
Frequently toggled UI
```

Examples:

- Tabs
- Dropdowns
- Menus

---

## 11. Stable Keys

Bad:

```vue
<div
  v-for="(item, index) in items"
  :key="index"
>
```

---

Suppose:

```js
items.unshift(newItem);
```

Vue thinks:

```text
Everything changed
```

Many rerenders.

---

Good:

```vue
:key="item.id"
```

Stable identity.

---

## 12. Avoid Reactive Derived State

Bad:

```js
const fullName = ref("");

watch([firstName, lastName], () => {
  fullName.value = `${firstName.value} ${lastName.value}`;
});
```

Extra reactive updates.

---

Better:

```js
const fullName = computed(() => `${firstName.value} ${lastName.value}`);
```

---

## 13. Pinia Performance

Common mistake.

---

Bad:

```js
const store = useUserStore();
```

Component now depends on whole store.

---

Better:

```js
const { user } = storeToRefs(store);
```

Only subscribe to required state.

---

Also avoid:

```js
watch(store, ...)
```

on large stores.

---

## 14. Debounce Expensive Operations

Bad:

```js
watch(search, async (value) => {
  await fetchUsers(value);
});
```

Typing:

```text
a
ab
abc
abcd
```

Triggers:

```text
4 API calls
```

---

Good:

```js
watch(
  search,
  debounce(async (value) => {
    await fetchUsers(value);
  }, 300),
);
```

---

## 15. Clean Up Side Effects

Memory leaks eventually become performance problems.

Bad:

```js
onMounted(() => {
  window.addEventListener("resize", resizeHandler);
});
```

Navigate 50 times.

Now:

```text
50 listeners
```

---

Good:

```js
onUnmounted(() => {
  window.removeEventListener("resize", resizeHandler);
});
```

---

## 16. Use Suspense for Heavy Async Components

```vue
<Suspense>
  <Dashboard />
  
  <template #fallback>
    Loading...
  </template>
</Suspense>
```

Improves perceived performance.

---

## 17. Reduce Reactive Scope

Bad:

```js
const state = reactive({
  users: [],
  settings: {},
  permissions: {},
  notifications: [],
});
```

Huge object.

---

Better:

```js
const users = ref([]);
const settings = ref({});
const notifications = ref([]);
```

Smaller dependency graphs.

---

## 18. Avoid Creating Functions in Templates

Bad:

```vue
<button
  @click="() => deleteUser(user.id)"
>
```

New function every render.

---

Better:

```vue
<button
  @click="deleteUser(user.id)"
>
```

or

```js
const deleteUser = (id) => {};
```

---

## 19. Use `v-memo` (Vue 3.2+)

Rare but useful.

```vue
<div
  v-memo="[user.id, user.status]"
>
```

Vue skips rendering if values unchanged.

Useful in:

```text
Large tables
Complex rows
Dashboards
```

---

## 20. Bundle Size Optimization

Biggest real-world performance gain.

Check:

```bash
npm run build
```

Analyze chunks.

---

Common offenders:

```text
moment.js
lodash
chart libraries
rich editors
ui frameworks
```

---

Instead of:

```js
import _ from "lodash";
```

Use:

```js
import debounce from "lodash/debounce";
```

---

## Performance Mindset of Senior Vue Engineers

When debugging slowness, ask:

### Is the problem:

**Rendering?**

- Virtualize lists
- Computed
- v-memo

---

**Reactivity?**

- shallowRef
- markRaw
- Avoid deep watch

---

**Network?**

- Debounce
- Cache
- Lazy fetch

---

**Bundle Size?**

- Route splitting
- Async components
- Tree shaking

---

**Memory?**

- Cleanup listeners
- Cleanup intervals
- Cleanup observers

---

A strong senior Vue engineer can usually identify performance issues by looking at three things first:

1. **Large lists** (`v-for` over hundreds/thousands of items)
2. **Overly reactive state** (`reactive`/deep watches on huge objects)
3. **Unnecessary rerenders** (expensive computations in templates and broad Pinia subscriptions)

Those three categories account for the majority of Vue performance problems in production applications.

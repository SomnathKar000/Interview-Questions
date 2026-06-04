---
title: "Composition API"
sidebar_position: 1
description: "Vue Composition API — techniques, trade-offs, and real-world implementation."
---

# Level 1: Surface Level

## What is Composition API?

Composition API organizes code by feature instead of option type.

### Options API

```vue
<script>
export default {
  data() {
    return {
      count: 0,
    };
  },

  methods: {
    increment() {
      this.count++;
    },
  },
};
</script>
```

### Composition API

```vue
<script setup>
import { ref } from "vue";

const count = ref(0);

const increment = () => {
  count.value++;
};
</script>
```

Benefits:

- Better code organization
- Reusable logic
- Better TypeScript support
- Easier testing

---

# Level 2: Understanding Reactivity

Senior developers should understand:

> Vue doesn't track variable changes.
> Vue tracks property access and mutations.

---

## ref()

Creates reactive primitive values.

```js
const count = ref(0);

count.value++;
```

Behind the scenes:

```js
const count = {
  value: 0,
};
```

Vue wraps `.value` using getters/setters.

---

### When to use ref

```js
const name = ref("");
const loading = ref(false);
const age = ref(25);
```

Use for:

- string
- number
- boolean
- null
- single values

---

## reactive()

Used for objects.

```js
const user = reactive({
  name: "John",
  age: 25,
});
```

Usage:

```js
user.age++;
```

No `.value`.

---

### Common Pitfall

```js
const user = reactive({
  name: "John",
});

const { name } = user;
```

This breaks reactivity.

```js
name = "new";
```

UI won't update.

---

Fix:

```js
import { toRefs } from "vue";

const user = reactive({
  name: "John",
});

const { name } = toRefs(user);
```

---

# Level 3: ref vs reactive

Many developers misuse these.

### Prefer ref

Vue team generally recommends:

```js
const user = ref({
  name: "John",
});
```

instead of

```js
const user = reactive({
  name: "John",
});
```

Why?

Easy reassignment:

```js
user.value = apiResponse;
```

Works.

---

Reactive problem:

```js
user = apiResponse;
```

Breaks reactivity.

---

Real-world:

```js
const profile = ref(null);

const fetchProfile = async () => {
  profile.value = await api.getProfile();
};
```

---

# Level 4: Computed

Derived state.

Bad:

```js
const fullName = ref("");

watch(firstName, () => {
  fullName.value = `${firstName.value} ${lastName.value}`;
});
```

Good:

```js
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`;
});
```

---

### Computed Caching

```js
const expensiveData = computed(() => {
  console.log("running");
  return heavyCalculation();
});
```

Runs only when dependencies change.

---

Senior interview question:

Difference:

```js
computed(() => ...)
```

vs

```js
function getValue() {}
```

Answer:

Computed caches.

Function executes every render.

---

# Level 5: watch

Most abused Composition API feature.

---

## Basic watch

```js
watch(search, (newValue) => {
  fetchResults(newValue);
});
```

Use when:

- API calls
- localStorage
- analytics
- side effects

---

### Do NOT use watch for derived state

Bad:

```js
watch(price, () => {
  total.value = price.value * quantity.value;
});
```

Use:

```js
computed(() => price.value * quantity.value);
```

---

## Watch Multiple Sources

```js
watch([firstName, lastName], ([first, last]) => {
  console.log(first, last);
});
```

---

## Deep Watch

```js
watch(
  user,
  () => {
    console.log("changed");
  },
  {
    deep: true,
  },
);
```

Expensive.

Avoid for large objects.

---

# Level 6: watchEffect

Vue automatically tracks dependencies.

```js
watchEffect(() => {
  console.log(user.value.name);
});
```

Equivalent to:

```js
watch(
  () => user.value.name,
  () => {},
);
```

---

When useful:

```js
watchEffect(async () => {
  data.value = await api(search.value);
});
```

---

Pitfall:

```js
watchEffect(() => {
  console.log(Math.random());
});
```

No reactive dependency.

Runs once.

---

# Level 7: Lifecycle Hooks

---

## onMounted

```js
onMounted(async () => {
  await fetchData();
});
```

Most common.

---

## onUnmounted

Cleanup.

```js
onMounted(() => {
  window.addEventListener("resize", resize);
});

onUnmounted(() => {
  window.removeEventListener("resize", resize);
});
```

---

Senior mistake:

Forgetting cleanup.

Causes:

- Memory leaks
- Duplicate listeners

---

# Level 8: Composables

This is where senior engineers spend most time.

---

Bad:

```js
component.vue;
```

contains

```js
- api calls
- form logic
- permissions
- pagination
- filters
```

800 lines.

---

Good:

```js
useUsers();
usePagination();
usePermissions();
```

---

Example

```js
// useCounter.js

export function useCounter() {
  const count = ref(0);

  const increment = () => count.value++;

  return {
    count,
    increment,
  };
}
```

Usage:

```js
const { count, increment } = useCounter();
```

---

# Level 9: Advanced Composables

### Shared State

```js
const state = ref(0);

export function useGlobalCounter() {
  return state;
}
```

Every component shares same state.

Like mini Pinia.

---

### Private State

```js
export function useCounter() {
  const count = ref(0);

  return { count };
}
```

Every component gets new instance.

---

Senior developers understand this distinction.

---

# Level 10: Dependency Tracking Internals

Vue uses:

```js
Proxy;
```

for objects.

Example:

```js
const user = reactive({
  name: "John",
});
```

Internally:

```js
new Proxy(user, {
  get() {},
  set() {},
});
```

---

Tracking:

```js
console.log(user.name);
```

Dependency collected.

Mutation:

```js
user.name = "Jane";
```

Trigger update.

---

This is the foundation of Vue reactivity.

---

# Level 11: Performance Optimization

---

## shallowRef

Avoid deep tracking.

```js
const chart = shallowRef(null);
```

Useful:

```js
const map = shallowRef(googleMap);
```

Don't make large third-party objects reactive.

---

## markRaw

```js
const editor = markRaw(new Editor());
```

Vue ignores it.

Useful:

- Monaco
- TipTap
- ChartJS
- Leaflet

---

## triggerRef

```js
const chart = shallowRef({});

chart.value.data.push(item);

triggerRef(chart);
```

Force update.

---

# Level 12: Senior-Level Watch Patterns

### API Search Debounce

```js
watch(
  search,
  debounce(async (value) => {
    await fetchResults(value);
  }, 300),
);
```

---

### URL Sync

```js
watch(filters, () => {
  router.replace({
    query: filters.value,
  });
});
```

---

### Auto Save

```js
watch(
  form,
  () => {
    saveDraft();
  },
  {
    deep: true,
  },
);
```

---

# Level 13: Common Pitfalls

---

## Pitfall 1

```js
const user = reactive({});

user = newUser;
```

Breaks reactivity.

---

## Pitfall 2

```js
const { name } = user;
```

Loses reactivity.

Use:

```js
toRefs(user);
```

---

## Pitfall 3

```js
watch(user.value.name, callback);
```

Wrong.

Use:

```js
watch(() => user.value.name, callback);
```

---

## Pitfall 4

Using watch instead of computed.

Very common.

---

## Pitfall 5

Huge deep watches.

```js
deep: true;
```

can become expensive.

---

# Level 14: Architecture Patterns Senior Engineers Use

---

## Feature Composables

```text
composables/
 ├─ useAuth.js
 ├─ useProjects.js
 ├─ usePermissions.js
 └─ useNotifications.js
```

---

## API Layer

```text
services/
 ├─ auth.service.js
 ├─ user.service.js
 └─ project.service.js
```

Composables call services.

Components call composables.

---

## State Layer

```text
stores/
 ├─ authStore.js
 ├─ projectStore.js
```

Pinia manages global state.

---

# What Interviewers Expect From a 3-Year Vue Engineer

You should comfortably explain:

✅ ref vs reactive

✅ computed vs watch

✅ watch vs watchEffect

✅ lifecycle hooks

✅ composables

✅ reactivity system (Proxy)

✅ shallowRef

✅ markRaw

✅ Pinia integration

✅ component communication

✅ performance optimization

✅ code-splitting and lazy loading

✅ reusable composable architecture

The jump from mid-level to senior Vue development usually happens when you stop thinking in components and start thinking in **reactive systems, composable architecture, state ownership, and rendering performance**.

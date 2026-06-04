---
title: "Reactivity System Deep Dive"
sidebar_position: 2
description: "Vue reactivity system — from Proxy to performance trade-offs."
---

If you're aiming for senior-level Vue knowledge, the reactivity system is probably the most important topic to deeply understand.

Most Vue developers know:

```js
const count = ref(0);

count.value++;
```

But senior engineers understand:

1. How Vue tracks dependencies
2. How updates propagate
3. Why some things are reactive and some aren't
4. Why destructuring breaks reactivity
5. How computed caching works
6. How watch works internally
7. When Vue schedules updates

---

## The Core Idea

Vue needs to answer two questions:

### 1. Who is using this data?

```js
const count = ref(0);

const double = computed(() => count.value * 2);
```

Vue must know:

> "double depends on count"

---

### 2. Who should rerun when data changes?

```js
count.value++;
```

Vue must know:

> "double depends on count, so rerun double"

This is the entire reactivity system.

---

## Vue 2 vs Vue 3

## Vue 2

Used:

```js
Object.defineProperty();
```

Example:

```js
const obj = {};

Object.defineProperty(obj, "name", {
  get() {},
  set() {},
});
```

Problems:

```js
user.age = 20;
```

Could not detect new properties.

Arrays were also problematic.

---

## Vue 3

Uses:

```js
Proxy;
```

Example:

```js
const proxy = new Proxy(target, {
  get() {},
  set() {},
});
```

Can detect:

```js
user.name;
user.age;
delete user.age;
array.push();
array.splice();
```

Much more powerful.

---

## Step 1: Dependency Tracking

Suppose:

```js
const state = reactive({
  count: 0,
});

effect(() => {
  console.log(state.count);
});
```

Internally Vue creates something like:

```js
WeakMap;
```

Structure:

```js
targetMap = WeakMap({
  state => Map({
    count => Set([
      effect1
    ])
  })
})
```

Visualization:

```text
WeakMap
 │
 └── state object
      │
      └── count
           │
           ├── effect1
           ├── effect2
           └── effect3
```

---

## Step 2: Track

When:

```js
console.log(state.count);
```

runs inside an active effect:

```js
effect(() => {
  console.log(state.count);
});
```

Vue executes:

```js
track(state, "count");
```

Pseudo code:

```js
function track(target, key) {
  deps.add(activeEffect);
}
```

Result:

```text
count
 └── effect1
```

Dependency recorded.

---

## Step 3: Trigger

Now:

```js
state.count++;
```

Proxy intercepts:

```js
set(target, key);
```

and calls:

```js
trigger(state, "count");
```

Pseudo code:

```js
function trigger(target, key) {
  const effects = deps.get(key);

  effects.forEach((effect) => {
    effect();
  });
}
```

Now Vue reruns:

```js
console.log(state.count);
```

automatically.

---

## Simplified Vue Reactivity

You can build a tiny version.

---

Active effect:

```js
let activeEffect = null;
```

---

Effect:

```js
function effect(fn) {
  activeEffect = fn;

  fn();

  activeEffect = null;
}
```

---

Dependency storage:

```js
const bucket = new Map();
```

---

Track:

```js
function track(key) {
  if (!activeEffect) return;

  let deps = bucket.get(key);

  if (!deps) {
    deps = new Set();
    bucket.set(key, deps);
  }

  deps.add(activeEffect);
}
```

---

Trigger:

```js
function trigger(key) {
  const deps = bucket.get(key);

  deps?.forEach((effect) => effect());
}
```

---

Proxy:

```js
const state = new Proxy(
  { count: 0 },
  {
    get(target, key) {
      track(key);

      return target[key];
    },

    set(target, key, value) {
      target[key] = value;

      trigger(key);

      return true;
    },
  },
);
```

---

Usage:

```js
effect(() => {
  console.log(state.count);
});
```

Output:

```text
0
```

Now:

```js
state.count++;
```

Output:

```text
1
```

Reactive system achieved.

---

## How ref Works

Many developers think:

```js
ref();
```

uses Proxy.

Not exactly.

---

Internally:

```js
const count = ref(0);
```

is roughly:

```js
{
  get value() {},
  set value() {}
}
```

Pseudo implementation:

```js
function ref(initialValue) {
  let value = initialValue;

  return {
    get value() {
      track("value");
      return value;
    },

    set value(newValue) {
      value = newValue;
      trigger("value");
    },
  };
}
```

---

## Why .value Exists

JavaScript cannot intercept:

```js
let count = 0;

count++;
```

No getter/setter possible.

Need wrapper:

```js
count.value;
```

so Vue can intercept access.

---

## Why Destructuring Breaks Reactivity

Consider:

```js
const user = reactive({
  name: "John",
});

const { name } = user;
```

Now:

```js
name;
```

is just:

```js
const name = "John";
```

No Proxy.

No tracking.

No updates.

---

Original:

```text
Proxy
 │
 └── name
```

After destructuring:

```text
string
```

Proxy removed.

Reactivity lost.

---

## Fix: toRefs()

```js
const { name } = toRefs(user);
```

Now:

```js
name.value;
```

still points back to:

```js
user.name;
```

Reactivity preserved.

---

## Computed Internals

Example:

```js
const fullName = computed(() => {
  return first.value + last.value;
});
```

Many think Vue recalculates every render.

It doesn't.

---

Computed is lazy.

Internal:

```js
let dirty = true;
let cache;
```

First access:

```js
fullName.value;
```

Runs:

```js
cache = getter();
dirty = false;
```

Returns cache.

---

Second access:

```js
fullName.value;
```

Returns:

```js
cache;
```

No recomputation.

---

When dependency changes:

```js
first.value = "Jane";
```

Vue marks:

```js
dirty = true;
```

Next access recalculates.

---

## Why Computed Is Faster Than Methods

Method:

```js
function fullName() {
  return first.value + last.value;
}
```

Every render:

```js
fullName();
fullName();
fullName();
```

Runs repeatedly.

---

Computed:

```js
fullName.value;
```

Runs once.

Returns cache.

---

## Watch Internals

Watch is basically:

```js
effect();
```

with old/new value tracking.

Example:

```js
watch(
  () => count.value,
  (newVal, oldVal) => {},
);
```

Vue:

1. Runs getter
2. Stores old value
3. Tracks dependencies
4. On change:
   - rerun getter
   - compare values
   - invoke callback

---

## Scheduler

Important senior concept.

Vue does NOT immediately rerender.

Imagine:

```js
count.value++;
count.value++;
count.value++;
```

Without batching:

```text
render
render
render
```

3 renders.

---

Vue batches:

```text
count++
count++
count++

render
```

1 render.

---

Uses microtasks:

```js
Promise.resolve().then(...)
```

to queue updates.

---

# nextTick()

Because updates are batched:

```js
count.value++;

console.log(element.textContent);
```

DOM may still be old.

Need:

```js
await nextTick();
```

Example:

```js
count.value++;

await nextTick();

console.log(element.textContent);
```

Now DOM updated.

---

## Effect Scope

Used heavily in composables.

Example:

```js
const scope = effectScope()

scope.run(() => {
  watch(...)
  computed(...)
})
```

Cleanup:

```js
scope.stop();
```

All effects removed.

Very useful in advanced composables.

---

## The Most Important Mental Model

Think of Vue as building a dependency graph.

```text
count
 │
 ├── computed(double)
 │
 ├── component render
 │
 └── watcher
```

When:

```js
count.value++;
```

Vue walks the graph:

```text
count changed

 ↓

computed dirty

 ↓

watch callback

 ↓

component rerender
```

Everything else in Vue's reactivity system is built on top of this dependency graph, tracking (`track()`), triggering (`trigger()`), effects, schedulers, and cached computations. Understanding that graph explains almost every "Why did Vue rerender?" or "Why didn't Vue update?" bug you'll encounter in large applications.

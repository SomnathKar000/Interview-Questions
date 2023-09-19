```javascript
function logNumbersWithDelay() {
  var i = 10;
  setTimeout(function () {
    console.log(i);
  }, 1000);
  console.log("hello");
}

logNumbersWithDelay();
```

The output of the given code will be:

```
hello
10
```

The `setTimeout` function is used to execute a function after a specified amount of time. In this case, the inner function is executed after 1000 milliseconds (1 second) ⁵. The `i` variable is defined in the outer function and is accessible to the inner function due to **closure** ¹²³. The `console.log(i)` statement inside the inner function logs the value of `i` to the console, which is `10` in this case. The `console.log("hello")` statement logs the string "hello" to the console before the `setTimeout` function is executed.

## Few questions are given below

---

**Question: Using `setTimeout` and closures, can you create a function that logs the numbers from 1 to 5 with a delay of one second between each number?**

**Hint: You'll need to use a closure to capture the current value of the number.**

---

**Solution:**

```javascript
function logNumbersWithDelay() {
  for (let i = 1; i <= 5; i++) {
    setTimeout(function () {
      console.log(i);
    }, i * 1000); // Delay in milliseconds
  }
}

logNumbersWithDelay();
```

Using var:

```javascript
const outer = () => {
  for (var i = 1; i <= 10; i++) {
    function closer(x) {
      setTimeout(function () {
        console.log("Time", x);
      }, x * 1000);
    }
    closer(i);
  }
  console.log("Output is done");
};
outer();
```

---

**Question: Can you give an example of Closure in JS**

---

**Solution:**

```javascript
function outer() {
  let a = 10;

  function inner() {
    console.log(a);
  }

  return inner;
}

let closureFunction = outer();
closureFunction();
```

In this example, the `inner` function forms a closure with its surrounding lexical environment, which includes the variable `a`. When `outer` is invoked and `inner` is returned, it carries along with it the reference to the environment in which it was created. Therefore, when you call `closureFunction()`, it still has access to the value of `a`, resulting in the correct output.

---

**Question:**

If you move the variable declaration (`let a = 10;`) before the `inner` function but after the `return` line, it will still form a closure as long as the variable `a` is referenced within the `inner` function. The sequence of declaration and function arrangement does not impact the formation of closures.

Here's the example:

```javascript
function outer() {
  function inner() {
    console.log(a);
  }

  let a = 10;

  return inner;
}

let closureFunction = outer();
closureFunction();
```

In this scenario, the `inner` function still captures the reference to the variable `a` from its outer scope, forming a closure that retains access to the value of `a` when `closureFunction()` is invoked.

---

**Question: Can you give tell me few advantages of Closure ?**

---

**Solution:**

Closure is very useful in JavaScript and Closure offer several advantages in JavaScript like It is used in Module Pattern, Function Currying, Data Encapsulation and data Privacy, Maintaining State, and in Higher-Order Functions.

---

**Question: How Closures helps in Data Encapsulation and data Privacy ?**

---

**Solution:**

Let suppose we have an veriable and we want to add some data privacy over it Like other functions or other pices of code can not have access to that data.

```javascript
let count = 0;
function increase() {
  count++;
}
```

The issue here is that any part of the code can access and modify the `count` variable, which can lead to unintended behavior. To address this, we can utilize closures to create a private context for the data.

```javascript
function counter() {
  let count = 0;
  return function increase() {
    count++;
    console.log(count);
  };
}

let counter1 = counter();
counter1(); // Output: 1
counter1(); // Output: 2
counter1(); // Output: 3
```

In this example, the `counter` function returns an inner function named `increase`. The `count` variable is encapsulated within the closure created by the `counter` function. This means that the `count` variable is only accessible through the `increase` function, and no external code can directly access or modify it.

Additionally, if we create another counter instance using `let counter2 = counter();`, it will have its own separate closure with its own private `count` variable starting at zero:

```javascript
let counter2 = counter();
counter2(); // Output: 1
counter2(); // Output: 2
counter2(); // Output: 3
```

---

**Question: Suppose we have to create a decrement counter also then how will you add that?**

---

**Solution:**

To create both an increment and a decrement counter, we can modify the constructor function to include both `increment` and `decrement` methods. Each method can modify the `count` variable accordingly.

```javascript
function Counter() {
  let count = 0;

  this.increment = function () {
    count++;
    console.log(count);
  };

  this.decrement = function () {
    count--;
    console.log(count);
  };
}

const counter1 = new Counter();
counter1.increment(); // Output: 1
counter1.increment(); // Output: 2
counter1.increment(); // Output: 3
counter1.decrement(); // Output: 2
```

In this solution, the `Counter` constructor function creates an instance with both `increment` and `decrement` methods attached to it. Each method modifies the `count` variable accordingly, allowing you to achieve both increment and decrement functionality.

---

**Question: Do you know any disadvantages of closure?**

---

**Solution:**

**Memory Consumption:** Closures can lead to increased memory consumption. Since closures retain references to their containing scopes, they can prevent variables from being garbage collected even when they're no longer needed, which might lead to memory leaks.

---

**Question: What is a garbage collector and what does it do?**

---

**Solution:**

SO garbage collector is like a program in the browser or in the javascript engine which frez the unutilize memory.

**Garbage Collector:**
A garbage collector is a built-in component of many programming languages, including JavaScript, designed to automatically manage memory by identifying and reclaiming unused or unreachable memory. Its primary purpose is to free up memory occupied by objects that are no longer needed or accessible, preventing memory leaks and improving the efficiency of memory usage.

---

**Question: Relation between Garbage collection, Memory leaks, and Closure?**

---

**Solution:**

```javascript
function createCounter() {
  let count = 0;

  // A closure capturing 'count'
  function increment() {
    count++;
    console.log(`Count is now ${count}`);
  }

  return increment;
}

const counter = createCounter();

// We create a closure 'counter' that captures 'count'
// Even though 'createCounter' function has finished executing, 'count' is not garbage collected
// as long as the 'counter' closure exists.
counter(); // Output: Count is now 1
counter(); // Output: Count is now 2
```

So here `count` memory cannot be freed because we may later use `counter()`

In the example:

- `createCounter` defines a closure `increment` that captures the `count` variable.
- When we call `createCounter()`, it returns the `increment` function, and we assign it to the `counter` variable.
- As long as the `counter` closure exists, it holds a reference to the `count` variable. This means that even after `createCounter` has finished executing, the `count` variable remains in memory and cannot be garbage collected.

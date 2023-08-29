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

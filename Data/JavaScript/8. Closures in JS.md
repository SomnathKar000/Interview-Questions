## Closures in JS

Function bundled with its lexical environment is known as a closure. Whenever function is returned, even if its vanished in execution context but still it remembers the reference it was pointing to. Its not just that function alone it returns but the entire closure.

### What is a Closure?

A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives you access to an outer function's scope from an inner function. In JavaScript, closures are created every time a function is created, at function creation time.

## Further Explanation with Examples

```javascript
function outer() {
  var a = 10;

  function inner() {
    console.log(a); // Accessing the variable a from the outer scope
  }

  return inner;
}

const closureFunction = outer(); // The inner function, along with its closure, is returned

closureFunction(); // Outputs: 10
```

In this example, the function `inner` is a closure. Although it is executed outside the `outer` function's scope, it still has access to the `a` variable due to the closure mechanism. When `closureFunction()` is called, it correctly logs the value of `a` from the outer function's lexical environment.

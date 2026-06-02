## Hoisting in JavaScript

Hoisting is a behavior in JavaScript that allows you to access variables and functions before they are actually initialized or assigned a value.

### Let's Clarify with Examples

Consider the following code:

```javascript
console.log(n);
print();

var n = 2;

function print() {
  console.log("Hello World");
}
```

The output of this code is:

```javascript
undefined
Hello World
```

This behavior occurs because, before the code is executed, memory space is allocated for variables and functions. In the global scope, `n` is allocated memory with the value `undefined`, and the function `print` is stored in memory with its entire code. During the memory creation phase of the Execution Context, JavaScript sets aside memory for variables and assigns a special placeholder value of `undefined` to them. This is why the function call `print()` works and logs "Hello World", and `n` outputs as `undefined`.

Let's examine another example:

```javascript
console.log(n);
print1();
print2();
let n = 5;

function print1() {
  console.log("Hello World");
}

var print2 = function () {
  console.log("Hello World");
};

var print3 = () => {
  console.log("Hello World");
};
```

The output of this code is:

```javascript
undefined
Hello World
Error: print2 is not a function
Error: print3 is not a function
```

In this case, errors occur for `print2` and `print3` because of how we defined these functions. Both `print2` and `print3` are stored in variables, causing them to be hoisted and assigned the value `undefined` during the memory creation phase. Therefore, when we attempt to call them as functions, we get errors since they are not recognized as functions.

In conclusion, hoisting refers to the behavior where variable and function declarations are moved to the top of their containing scope before execution. It's crucial to understand this behavior to avoid unexpected outcomes in your JavaScript code.

## Function Statement

```javascript
function a() {
  console.log("Hello");
}
```

So this way of creating a function is known as function statement. It is also known as Function Declaration.

## Function Expression

A **function expression** is a way to define a function by assigning it to a variable or a value. It allows you to create and use functions as first-class objects in JavaScript, meaning you can pass them as arguments to other functions, return them from functions, and store them in variables or data structures. Function expressions are versatile and enable more dynamic and flexible coding in JavaScript.

Here's an example of a function declaration:

```javascript
var b = function () {
  console.log("Hello");
};

b(); // Call the function using the variable 'b'.
```

## Function Statement vs Function Expression

The main difference between **Function Statement** and **Function Expression** is hoisting. When we call both functions even before creating them, we will get different behavior due to hoisting.

In the case of a **Function Statement**, during the memory creation phase, a memory space is allocated for the function, and the function is assigned to it. This allows us to call the function before its actual declaration in the code, and it will work as expected.

In contrast, with a **Function Expression**, the variable is treated like any other variable and stores a placeholder value `undefined` until the code reaches the line where the function expression is defined. As a result, trying to call the function before its definition will result in a `TypeError` because the variable is not yet assigned to a function.

```javascript
a(); // Output: a called
b(); // TypeError: b is not a function

function a() {
  console.log("a called");
}

var b = function () {
  console.log("b called");
};
```

This demonstrates how hoisting affects the behavior of function statements and function expressions when called before their respective definitions in the code.

## Function Declaration

A **function declaration** is a way to define a named function using the `function` keyword. It's hoisted, which means it's available for use throughout the entire scope in which it's defined, even before the actual declaration in the code.

Here's an example of a function declaration:

```javascript
a(); // This works even before the function declaration.

function a() {
  console.log("Hello");
}
```

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

## Anonymous Function

An **Anonymous Function** is a function without a name, and it does not have its own identity by default. When you create an **Anonymous Function**, it typically needs to be assigned to a variable or used as an argument within another function or expression.

Here's an example of an **Anonymous Function**:

```javascript
function () {
  console.log("Hello");
}
```

If you attempt to create an **Anonymous Function** like this directly, it will result in a syntax error because it lacks a name or assignment.

**Anonymous Functions** are often used in places where functions are treated as values or assigned to variables. You can think of them as a part of a function expression.

Here are examples of using **Anonymous Functions**:

```javascript
var a = function () {
  console.log("Anonymous Function a");
};

function b() {
  return function () {
    console.log("Anonymous Function b");
  };
}
```

In these examples, the first function (`a`) is an example of an **Anonymous Function** assigned to a variable, while the second function (`b`) returns an **Anonymous Function** as a result.

## Named Function Expression

A **Named Function Expression** (NFE) is a JavaScript function expression that has a name. Unlike regular function expressions, which are often anonymous (i.e., they don't have a name), NFEs have the advantage of being able to reference themselves, making them useful in scenarios like recursion or improving debugging by providing a clear identifier for the function.

Here's an example of a Named Function Expression:

```javascript
const factorial = function calcFactorial(n) {
  if (n === 0) {
    return 1;
  }
  return n * calcFactorial(n - 1);
};

console.log(factorial(5)); // Output: 120
```

In the example above, `calcFactorial` is a named function expression, and it's used to define a recursive function for calculating the factorial of a number. The name `calcFactorial` can be used within the function body to refer to itself.

Named Function Expressions are also helpful for providing more meaningful stack traces in debugging, as the name is used in error messages. They allow the function to have an identity while still keeping it within a limited scope, which is different from regular function declarations that create a variable in the surrounding scope.

Keep in mind that NFEs are not hoisted in the same way as function declarations. The function's name is only accessible within the function body itself, and not in the enclosing scope.

## Parameters and Arguments

In JavaScript, "parameters" and "arguments" are related but distinct concepts used when defining and invoking functions. Let's clarify the difference between them:

1. **Parameters**:

   - Parameters are placeholders or variables defined in a function's declaration or definition.
   - They act as local variables within the function's body, representing the values that the function expects to receive when it's called.
   - Parameters are used to define what data the function needs to operate on.
   - Parameters are declared in the function's parentheses following the function name.

   ```javascript
   function add(x, y) {
     // 'x' and 'y' are parameters
     return x + y;
   }
   ```

2. **Arguments**:

   - Arguments are the actual values passed to a function when it's invoked or called.
   - They correspond to the parameters defined in the function.
   - Arguments provide specific values for the function to work with.
   - The number and order of arguments should match the number and order of parameters in the function's definition.

   ```javascript
   const result = add(2, 3);
   // '2' and '3' are arguments
   ```

In the above example, the `add` function has two parameters (`x` and `y`). When we call `add(2, 3)`, we are passing `2` and `3` as arguments. Inside the function, `x` will have the value `2`, and `y` will have the value `3`, and the function will return `5`.

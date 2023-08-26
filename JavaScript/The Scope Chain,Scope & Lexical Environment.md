## The Scope Chain, Scope & Lexical Environment

### Scope:

**Scope** in JavaScript refers to the accessibility and visibility of variables, functions, and objects in different parts of your code during runtime. It determines where a variable can be accessed and where it cannot.

JavaScript has three main types of scope:

1. **Global Scope**: Variables declared outside of any function or block have global scope. They can be accessed from anywhere in the code.
2. **Local Scope (Function Scope)**: Variables declared within a function have local scope and are only accessible within that function.
3. **Block Scope**: Introduced with the `let` and `const` keywords, variables declared within blocks (like inside `if` or `for` statements) have block scope.

### Lexical Environment:

The **Lexical Environment** is an internal JavaScript construct that holds identifiers (variables, functions) and their values within a certain scope. It's created when a function is defined and contains all the variables and functions that are in scope at the time of that function's definition. The lexical environment also maintains a reference to its outer (enclosing) lexical environment, creating a chain of nested lexical environments. This chain of lexical environments is what enables the Scope Chain.

let's break down the concept of Lexical Environment further:

1. **Identifiers and Values**: The Lexical Environment is like a container that stores identifiers (variable and function names) and their associated values. When you declare variables or functions within a certain scope (like inside a function), they become part of that scope's Lexical Environment. For example, in the scope of a function `foo()`, if you have `let x = 10;`, then the Lexical Environment of `foo()` holds the identifier `x` and its value `10`.

2. **Creation and Definition**: The Lexical Environment is created at the time of function definition. When you define a function, its Lexical Environment is established. This environment captures the state of the scope in which the function was defined, including all the variables and functions declared within that scope.

3. **Nested Structure**: The Lexical Environment maintains a nested structure. Each Lexical Environment has a reference to its outer (enclosing) Lexical Environment. This outer reference forms a chain of lexical environments, where each environment points to the one that encloses it. This chain represents the hierarchy of scopes in your code.

4. **Scope Chain**: The chain of nested Lexical Environments is what enables the Scope Chain. When you access a variable or function within a certain scope, JavaScript first searches the Lexical Environment of that scope. If the identifier is not found there, it proceeds to the outer Lexical Environment and continues this process until the identifier is found or the global scope is reached.

Here's a visual breakdown of this concept:

```
Global Scope
    |
    v
Lexical Environment #1
    |
    v
Lexical Environment #2
    |
    v
Lexical Environment #3 (Current Scope)
```

In the example above, the current scope is Lexical Environment #3. If an identifier is not found in Lexical Environment #3, JavaScript will look in Lexical Environment #2 and then in Lexical Environment #1 until it reaches the Global Scope.

This chain of Lexical Environments and their outer references creates the foundation for variable scoping and accessibility in JavaScript. It's what allows functions to "remember" the variables from the scope where they were defined, even when they are executed in a different scope.

### Scope Chain:

The **Scope Chain** is a mechanism in JavaScript that allows variables to be accessible even in nested functions. When a function is executed, JavaScript searches for the value of a variable first within its own Lexical Environment, and if not found, it moves up the scope chain to the outer lexical environment. It continues searching until it reaches the global scope. This chain of nested lexical environments forms the scope chain.

In other words, the Scope Chain is a hierarchical order of Lexical Environments that determines where a variable can be accessed.

Here's a simple example to illustrate these concepts:

```javascript
let globalVar = "I'm global";

function outer() {
  let outerVar = "I'm in outer";

  function inner() {
    let innerVar = "I'm in inner";
    console.log(innerVar); // "I'm in inner"
    console.log(outerVar); // "I'm in outer"
    console.log(globalVar); // "I'm global"
  }

  inner();
}

outer();
```

In this example:

- `globalVar` is in the global scope.
- `outerVar` is in the `outer` function's scope.
- `innerVar` is in the `inner` function's scope.

When `inner` function is executed, it first looks for `innerVar` in its own scope. If not found, it goes up the Scope Chain and finds it in the `outer` function's scope. Similarly, it finds `outerVar` in the `outer` function's scope and `globalVar` in the global scope.

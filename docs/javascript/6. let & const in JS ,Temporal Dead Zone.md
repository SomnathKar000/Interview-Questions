# `let` & `const` in JavaScript: Temporal Dead Zone (TDZ)

The use of `let` and `const` in JavaScript introduces block-scoped variables that exhibit the behavior known as the Temporal Dead Zone (TDZ).

## Temporal Dead Zone (TDZ)

The Temporal Dead Zone (TDZ) is a phase in the execution of a JavaScript program where a variable declared with `let` or `const` exists but cannot be accessed or referenced until it has been formally declared. This is the time between the variable being hoisted (available for use) and its actual declaration.

Attempting to access a variable within its TDZ results in a `ReferenceError`. This concept encourages better coding practices by making it clear when a variable has been properly initialized.

## Example of Temporal Dead Zone

Consider the following code snippet:

```javascript
// Trying to access the variable 'x' before its declaration causes a ReferenceError
console.log(x); // Output: ReferenceError: Cannot access 'x' before initialization

// The variable 'x' is declared and initialized
let x = 42;

console.log(x); // Output: 42
```

In this example, attempting to access the variable 'x' before its declaration results in a `ReferenceError` due to the Temporal Dead Zone (TDZ). Once the variable 'x' is properly declared and initialized, it can be accessed without any issues.

```javascript
// Another example demonstrating TDZ with a block scope
if (true) {
  console.log(y); // Output: ReferenceError: Cannot access 'y' before initialization
  let y = 100;
  console.log(y); // Output: 100
}
```

In this second example, the variable 'y' is declared and initialized within a block. Attempting to access it before its declaration within the block results in a `ReferenceError` due to the TDZ.

Remember that `const` variables also exhibit the same TDZ behavior as `let` variables.

## Differences Between `let`, `const`, and `var`

- **`var`:**

  - Variables declared with `var` are function-scoped or globally scoped (if declared outside of any function).
  - They are hoisted to the top of their scope, which means you can use them before their declaration.
  - `var` does not respect block scope, which can sometimes lead to unintended behaviors.

- **`let`:**

  - Variables declared with `let` are block-scoped, meaning they are confined to the block where they are defined.
  - They are not hoisted to the top of their scope, and trying to access them before their declaration results in the Temporal Dead Zone (TDZ).
  - `let` allows reassignment after declaration.

- **`const`:**
  - Variables declared with `const` are also block-scoped and not hoisted.
  - Like `let`, accessing `const` variables before their declaration leads to the TDZ.
  - `const` variables cannot be reassigned after their initial assignment, but they are not necessarily immutable. The value they hold can still be mutated if it's an object or an array.

```

```

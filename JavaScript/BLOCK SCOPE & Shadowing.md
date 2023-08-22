# JavaScript Blocks and Block Scope

In JavaScript, a **block** is a group of statements enclosed within curly braces `{}`. It is also known as a **compound statement**. Blocks are used to combine multiple JavaScript statements into a single unit. This is particularly useful when JavaScript expects only one statement, but you want to execute multiple statements together.

## Purpose of Blocks

The primary purpose of using blocks is to group multiple JavaScript statements together. Instead of executing individual statements, you can use a block to treat them as a single entity. This is especially important in cases where JavaScript syntax requires a single statement, but you want to perform more than one action.

## Example of a Block

```javascript
{
  let x = 10;
  let y = 20;
  console.log(x + y); // Output: 30
  console.log("Multiple statements executed in a block.");
}
```

In this example, the block contains two statements: variable declarations (`let x = 10; let y = 20;`) and two `console.log` statements. By enclosing these statements within a block, you ensure they are treated as a single unit of execution.

## Block Scope

A **block scope** refers to the area within which variables and functions defined within a block are accessible. Variables and functions declared within a block are limited to that block's scope and are not accessible outside of it.

```javascript
var globalvar = "I am a var ";
{
  let blockVariable = "I'm inside the block!";
  const blockConst = "I am a const value";
  console.log(globalvar); //Output:  "I am a var "
  console.log(blockVariable); // Output: "I'm inside the block!"
  console.log(blockConst); //Output:  "I am a const value"
}
console.log(globalvar); //Output:  "I am a var "
console.log(blockVariable); // Error: blockVariable is not defined
console.log(blockConst); // Error: blockConst is not defined
```

Here:

- `globalvar` has a global scope.
- `blockVariable` has a block scope.
- `blockConst` has a block scope.

## Shadowing

If we have a variable with the same name outside a block, the variable inside that block shadows the outer variable.

```javascript
var a = 100;
let b = 200;
const c = 300;
{
  var a = 10;
  let b = 20;
  const c = 30;
  console.log(a); //Output:  10
  console.log(b); // Output: 20
  console.log(c); //Output:  30
}
console.log(a); //Output:  10
console.log(b); //Output:  200
console.log(c); //Output:  300
```

Here:

- When we try to access the variable `a` inside the block in which we declared `a`, the inner `a` shadows the outer variable. So, within the block, the value printed is 10.

- When we try to print the value of `a` outside the block, the value is 10. This is because these two values are located in the same memory location, the global scope, so the value gets modified.

- When we try to shadow the variable `b` and access the value outside the declared block, we get a different value. This happens because `b` is declared with `let`, which has block scope. This means each block has its separate memory space for variables, resulting in different values. This phenomenon is known as shadowing.

- The same concept applies to `const` variables since both `let` and `const` are block-scoped variables.

```javascript
var a = 100;
let b = 200;
const c = 300;
function d() {
  var a = 10;
  let b = 20;
  const c = 30;
  console.log(a); //Output:  10
  console.log(b); // Output: 20
  console.log(c); //Output:  30
}
d();
console.log(a); //Output:  10
console.log(b); //Output:  200
console.log(c); //Output:  300
```

Shadowing is not limited to blocks; it behaves similarly within functions as well.

## Illegal Shadowing

```javascript
let a = 100;

{
  var a = 10;
}
// Error: SyntaxError: Identifier 'a' has already been declared
```

Here:

- This is called illegal shadowing. If you attempt to shadow a variable inside a block using `var`, you will encounter an error.

```javascript
var a = 100;

{
  let a = 10;
}

let b = 20;

function x() {
  var b = 200;
}
x();
```

Here:

- However, this will not produce an error.
- If a variable is shadowing, it should not cross the boundary of its scope. In a particular scope, `let` cannot be redeclared, so `var` should not cross these limits. `var` is function-scoped, so if we declare a value inside a function, we will not get an error. The `var` is within its boundaries, so it will not interfere with the `let` variable. Similarly, `const` behaves like `let` in this case.

## Lexical Scope

Block scope follows lexical scope.

Lexical scoping means declaring block-scoped variables inside different blocks, with one block nested inside another.

```javascript
let a = 100;

{
  let a = 10;
  {
    let a = 1;
    console.log(a); // Output: 1
  }
  console.log(a); // Output: 10
}
console.log(a); // Output: 100
```

- Blocks follow lexical scope, creating a chain of nested blocks.
- If you add a debugger in a line and run the code, you will see that each block has its own lexical scope. Each block is nested inside another block, following the lexical scope chain pattern.

## Benefits of Using Blocks

- **Grouping Statements**: Blocks allow you to group multiple statements together, making your code more organized and readable.

- **Local Scope**: Variables and functions declared within a block have a limited scope, preventing unintended side effects in other parts of the code.

- **Encapsulation**: By encapsulating statements within a block, you can ensure that they operate as a single unit and maintain data integrity.

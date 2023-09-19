## How JavaScript code is run

When you run your code in JavaScript, it enters the process of creating an Execution Context. This context is composed of two crucial components: the Memory Component and the Code Component.

This Execution Context is created in two faces:

1. **Creation Phase**: Also referred to as the memory creation phase, during this stage, JavaScript scans through the entire program line by line. It allocates memory for all variables and functions encountered. Variables are initially assigned a special value called `undefined`. For functions, the entire function code is stored within the allocated memory space.

2. **Code execution Phese**: In this phase, JavaScript executes the code by traversing through the program line by line. Functions are invoked, and calculations are performed. The actual values of variables are determined and placed in their respective memory locations. When a function is invoked, a new execution context is generated within the existing global execution context. This nested execution context also consists of the Memory Component and Code Component. As such, the two phases, namely the Creation Phase and the Code Execution Phase, are repeated for this new context. However, the focus is solely on the invoked function's code during this process. Once the entire function is executed, its execution context is removed.

### Creation of Execution Context: An Example

Let's delve into the creation of an Execution Context using a simple example:

```javascript
var n = 2;

function square(num) {
  var ans = num * num;
  return ans;
}

var square2 = square(n);
var square4 = square(4);
```

The process involves two distinct phases: the Creation Phase and the Code Execution Phase.

#### Creation Phase

During the Creation Phase, JavaScript allocates memory for variables and functions, along with their initial values. This phase can be illustrated as follows:

1. The memory is allocated for the variable `n`, initially storing `undefined`.
2. The function `square` is allocated memory, containing the entire code of the function.
3. Memory for variables `square2` and `square4` is allocated, both storing `undefined`.

![Creation Phase](https://res.cloudinary.com/practicaldev/image/fetch/s--GKNbYzk4--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/68nk5l6806bax94k0tky.gif)

#### Code Execution Phase

Moving on to the Code Execution Phase, JavaScript goes through the program line by line, executing the code:

1. The value `2` is assigned to the variable `n`.
2. Upon reaching the function invocation `square(n)`, a new Execution Context is created within the global Execution Context. This new context has its own Memory and Code Components.

   ![New Execution Context](https://res.cloudinary.com/practicaldev/image/fetch/s--Z5ZMX2Nr--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zvfyis150o3i7bn1x6hy.gif)

   Inside this new Execution Context, the Creation Phase and Code Execution Phase are repeated. Memory is allocated for the variables `num` and `ans`, both initially storing `undefined`.

   ![New Execution Context Creation Phase](https://res.cloudinary.com/practicaldev/image/fetch/s--BrZHpOr9--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/e67rsojvcqmowwj3w75b.gif)

   During the Code Execution Phase of the new Execution Context, the code inside the `square` function is executed step by step:

   - The value of `num` becomes `2`.
   - The value of `ans` becomes the square of `num`, which is `4`.
   - The function returns `ans`, which is assigned to `square2`.

   Finally, the Execution Context of the `square` function is deleted.

   ![New Execution Context Code Execution Phase](https://res.cloudinary.com/practicaldev/image/fetch/s--NfH3YlZ7--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/b2zu35q2as6uy57qve9q.gif)

3. After the execution of the `square` function, its return value (`4`) is assigned to the variable `square2`.
4. Similarly, a new Execution Context is created for the invocation of `square(4)`, following the same process.

   ![Another New Execution Context](https://res.cloudinary.com/practicaldev/image/fetch/s--NnMsUB9l--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/q7wlgf8uj91cpglpvh0z.gif)

After the completion of the Code Execution Phase for the entire program, the global Execution Context is deleted. Understanding this meticulous process is key to comprehending how JavaScript handles memory allocation, code execution, and function invocations.

## Call Stack in JavaScript

JavaScript employs a Call Stack to manage the creation and deletion of Execution Contexts. This stack-based mechanism ensures orderly execution of code. Let's delve into how the Call Stack operates:

![Call Stack](https://res.cloudinary.com/practicaldev/image/fetch/s--LjUZjJan--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/idywyfc19t2vsf1nyww1.png)

Consider the Call Stack as a stack of Execution Contexts. At the bottom of this stack lies the global Execution Context. As code execution progresses, each new Execution Context is pushed onto the stack. When a function is invoked, a new Execution Context is created, representing that function's scope.

After the function's execution completes, its Execution Context is popped out of the stack, and control returns to the underlying Execution Context. The Call Stack solely manages these Execution Contexts. Once the entire code is executed, the Call Stack becomes empty.

![Call Stack Visual](https://res.cloudinary.com/practicaldev/image/fetch/s--hLhHObuJ--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/03bry7soja8z3ad143ry.gif)

### References

1. [How JavaScript Works - Visually Explained](https://dev.to/narottam04/how-javascript-works-visually-explained-269j)
2. [Namaste JavaScript Playlist on YouTube](https://www.youtube.com/watch?v=pN6jk0uUrD8&list=PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP&ab_channel=AkshaySaini)

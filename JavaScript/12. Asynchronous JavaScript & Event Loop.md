JavaScript is a synchronous, single-threaded language. It has one call stack and can do one thing at a time. This call stack is present inside the JavaScript engine, and all the code of JavaScript is executed through this call stack. Whenever any JavaScript program is run, a global execution context is created, and this global execution context is pushed inside the call stack.

## WEB APIs

These APIs are fundamental for web development and enable developers to create interactive and dynamic web applications. They are part of the core JavaScript language and the web browser's environment, allowing you to build web pages and web applications that can respond to user actions, fetch data from servers, and manipulate the DOM to create rich user experiences.

- setTimeout()
- DOM APIs
- fetech()
- localStorage
- console
- location

1. **setTimeout()**:

   - **Definition**: `setTimeout()` is a JavaScript function that schedules the execution of a provided function or code block after a specified delay in milliseconds.
   - **Impact**: It allows you to create delays in your code, which is essential for various tasks like animations, timeouts, and handling asynchronous operations. It prevents blocking the main thread and helps maintain a responsive user interface.

2. **DOM APIs** (Document Object Model):

   - **Definition**: DOM APIs provide a structured representation of a web page's document as objects, allowing you to interact with and manipulate HTML elements and their attributes.
   - **Impact**: DOM APIs are fundamental for web development. They enable you to dynamically update and modify web page content, respond to user interactions, and create interactive web applications.

3. **fetch()**:

   - **Definition**: `fetch()` is a built-in JavaScript function for making HTTP requests to retrieve data from a server, typically used to fetch resources like JSON, HTML, or images.
   - **Impact**: It simplifies data retrieval from web servers, making it easier to request and handle data asynchronously. This is crucial for building modern web applications that depend on external data.

4. **localStorage**:

   - **Definition**: `localStorage` is a client-side storage API that allows you to store key-value pairs persistently in a user's web browser.
   - **Impact**: It enables web applications to store and retrieve data on the user's device. This can be used for caching data, saving user preferences, and creating offline-capable applications.

5. **console**:

   - **Definition**: The `console` object provides methods for logging information, warnings, errors, and debugging messages to the developer console.
   - **Impact**: It is indispensable for debugging and monitoring JavaScript code during development. It helps developers identify and fix issues in their code by providing a way to log messages and examine variables.

6. **location**:
   - **Definition**: The `location` object represents the current URL of the browser and provides access to its components (e.g., hostname, pathname, query parameters).
   - **Impact**: It allows you to read and manipulate the URL, enabling features like client-side routing, deep linking, and redirection in web applications. It's crucial for navigation and interaction within web pages.

## Event Loop & Callback Queue

1. **Callback Queue**: When a `setTimeout` function's timer expires, it doesn't go directly to the Callback Queue. Instead, a callback function associated with that `setTimeout` is added to the Callback Queue. The Callback Queue holds these callback functions until they are ready to be executed.

2. **Event Loop**: Yes, the Event Loop acts as a gatekeeper in JavaScript's concurrency model. Its primary role is to continuously check the status of the Call Stack and Callback Queue. When the Call Stack is empty and there are functions waiting in the Callback Queue, the Event Loop will take a function from the Callback Queue and push it onto the Call Stack for execution.

Here's a more detailed step-by-step explanation of how this process typically works:

- When a `setTimeout` is called, it schedules the provided callback function to be executed after a specified delay.

- While the timer is running, JavaScript can continue executing other code.

- When the timer expires, the callback function is moved to the Callback Queue.

- The Event Loop continually checks the Call Stack and Callback Queue.

- When the Call Stack is empty, and there are functions in the Callback Queue, the Event Loop takes a function from the Callback Queue and pushes it onto the Call Stack.

- The function in the Call Stack is executed.

- This process continues, allowing asynchronous code like `setTimeout` to execute its callback functions without blocking the main thread.

let us see an example:

```javascript
console.log("Start");

setTimeout(function () {
  console.log("Inside setTimeout callback");
}, 2000); // This schedules the callback to run after a 2-second delay

console.log("End");
```

Here's what happens step by step:

1. The script starts, and "Start" is logged to the console.

2. The `setTimeout` function is called with a callback function and a delay of 2000 milliseconds (2 seconds). It schedules the callback to run after this delay but doesn't block the main thread.

3. "End" is logged to the console.

4. The main thread is idle while waiting for the 2-second timer to expire.

5. After 2 seconds, the timer expires, and the callback function (i.e., the function inside `setTimeout`) is added to the Callback Queue.

6. The Event Loop continually checks the Call Stack. It notices that the Call Stack is empty.

7. The Event Loop takes the callback function from the Callback Queue and pushes it onto the Call Stack.

8. The callback function is executed, and "Inside setTimeout callback" is logged to the console.

The output of the code will look like this:

```
Start
End
Inside setTimeout callback
```

This example demonstrates how the Event Loop manages the execution of asynchronous code (in this case, the `setTimeout` callback). It ensures that the callback is executed after the main thread has finished executing the synchronous code and the Call Stack is empty.

## Callack Queue & Microtask Queue

**Callback Queue (or Task Queue)**: The Callback Queue, also known as the Task Queue, is a queue that holds callback functions to be executed. Callbacks in the Callback Queue are processed after the main JavaScript thread has finished executing the current synchronous code. This queue includes tasks such as `setTimeout` callbacks and I/O callbacks (e.g., callbacks for handling file operations, network requests).

**Microtask Queue (or Job Queue)**: The Microtask Queue, also known as the Job Queue, is another queue that holds callback functions, but it has higher priority than the Callback Queue. Microtasks are executed before the next rendering or repaint of the browser, allowing them to respond quickly to changes. Promises and certain DOM events, like `MutationObserver` callbacks, are examples of tasks that go into the Microtask Queue.

Key Points:

1. **Priority**: Microtasks in the Microtask Queue indeed have higher priority than tasks in the Callback Queue. This means that Microtasks will be executed before Callback Queue tasks.

2. **Use Cases**:

   - **Microtask Queue**: Use the Microtask Queue when you have code that needs to execute as soon as possible after the current execution context, such as when working with Promises or handling certain DOM changes. It's often used for tasks that should have minimal delay.
   - **Callback Queue**: The Callback Queue is suitable for tasks that are less time-sensitive and can be executed after the main thread has finished its current work.

3. **Order of Execution**: The Event Loop checks the Microtask Queue before the Callback Queue. Once the main thread is idle and the Call Stack is empty, it will execute all pending microtasks before moving to tasks in the Callback Queue.

Here's a simplified example to illustrate the order of execution:

```javascript
console.log("Start");

setTimeout(function () {
  console.log("Callback Queue - setTimeout");
}, 0);

Promise.resolve().then(function () {
  console.log("Microtask Queue - Promise.resolve");
});

console.log("End");
```

The output will be:

```
Start
End
Microtask Queue - Promise.resolve
Callback Queue - setTimeout
```

In this example, the microtask (Promise) executes before the callback in the Callback Queue (setTimeout), demonstrating the higher priority of microtasks.

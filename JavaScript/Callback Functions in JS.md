## Callback Function in JavaScript

When you pass a function as an argument in another function it is known as Callback Function. This callback functions give us the asscss to the whole asynchronus world in a synchronus single thred language.

**Callback Function**: A callback function in JavaScript is a function that is passed as an argument to another function and is executed later, often after a specific task or operation has completed.

Here's a basic example of how callbacks work in JavaScript:

```JavaScript
function doSomethingAsync(callback) {
    setTimeout(function () {
        console.log("Task is done!");
        callback(); // Call the callback function after the task is done
    }, 1000);
}

function onComplete() {
    console.log("Callback function is executed.");
}

doSomethingAsync(onComplete);

```

## Blocking the main Thread

JavaScript has only one call stack, often referred to as the main thread. All code execution in a web page occurs through this call stack. When a function is called, it's added to the call stack, and the main thread processes it. If a function or operation takes a long time to complete, the main thread becomes blocked, causing delays in executing other code and potentially leading to unresponsiveness in the user interface. This phenomenon is known as 'blocking the main thread.' To ensure a smooth user experience, it's important to avoid long-running operations on the main thread and instead use asynchronous techniques or web workers to offload time-consuming tasks.

## Event listeners

Event listeners are a fundamental concept in web development and JavaScript. They allow you to listen for and respond to events that occur in a web page or application. Events can include user interactions (like clicks or keypresses) or other actions (like data loading or animations).

Here's how event listeners work:

1. **Event**: An event is something that happens in the web page or browser. It can be triggered by the user (e.g., clicking a button) or by the browser (e.g., the page finishing loading).

2. **Event Listener**: An event listener is a piece of code that "listens" for a specific event to occur. You attach an event listener to a specific element or target, like a button or the whole document.

3. **Callback Function**: When the specified event occurs, the event listener calls a function you provide, known as the "callback function." This function contains the code you want to execute in response to the event.

Here's an example of attaching an event listener to a button click:

```javascript
// Get a reference to the button element by its ID
const button = document.getElementById("myButton");

// Attach an event listener to the button
button.addEventListener("click", function () {
  alert("Button clicked!");
});
```

In this example:

- We get a reference to the button element with the ID `myButton`.
- We attach a click event listener to the button.
- When the button is clicked, the provided callback function displays an alert.

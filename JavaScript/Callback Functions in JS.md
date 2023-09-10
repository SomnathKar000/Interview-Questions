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

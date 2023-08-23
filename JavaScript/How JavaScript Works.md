## JavaScript

JavaScript is a synchronous single-thread language.
Everything in JavaScript happens inside an Execution Context.
You can assume this Execution Context to be a big box or a container in which the whole JavaScript code is executed

### Let's see how the Execution Context actually looks like

![Execution Context](https://res.cloudinary.com/practicaldev/image/fetch/s--AC5E-9bo--/c_imagga_scale,f_auto,fl_progressive,h_420,q_66,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/eiz3o1fe8lx4okxtmi27.gif)

The Execution Context is like a big box and it has two components in it.

1. **Memory Component (Variable Environment)**: The first component is also known as the Memory component, here all the variables and the functions are stored as key-value pairs.
   This Memory component is also known as the VARIABLE environment.

2. **Code Component (Thread of Execution)**: The second component of this EXECUTION context is the Code Component.
   This is the place where code is executed one line at a time.
   This component is also known as the THREAD of Execution.

This thread of execution is just like a thread in which the whole code is executed one line at a time.

### Synchronous Single-Thread Nature

The term "single-threaded" in JavaScript indicates that it can only execute one command at a time. "Synchronous" means that it proceeds to the next line only after the current line has finished execution. Hence, JavaScript is considered a synchronous, single-threaded language.

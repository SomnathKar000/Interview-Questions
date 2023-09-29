#### Existing App

```sh
npm install @reduxjs/toolkit react-redux
```

#### @reduxjs/toolkit

consists of few libraries

- redux (core library, state management)
- immer (allows to mutate state)
- redux-thunk (handles async actions)
- reselect (simplifies reducer functions)

## Components

- Store:- It keeps all the information in a centralized place, When ever i need somthing I can just ask the information from it.

- Reducer:- They are similer like controller which modify the data. It is an object which has some key value pairs and each key is almost like an action.

- useSelector:- We use this hook to interact with the store to get the data from store.

- useDispatch:- When ever you want to upadte some information in store we use this hook to interact with reducers.

### Reference

[redux-toolkit-tutorial](https://github.com/john-smilga/redux-toolkit-tutorial)

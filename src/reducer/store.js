// src/store/store.js (or store.ts if you're using TypeScript)
import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from '../reducer/reducers'; // Adjust the path to your reducer

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
);

export default store;

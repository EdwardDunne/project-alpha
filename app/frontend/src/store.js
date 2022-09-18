import { createStore, applyMiddleware, createStoreWithMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers'
import { configureStore } from '@reduxjs/toolkit'

const initialState = {};

const middleware = [thunk];

// const store = createStore(
//     rootReducer,
//     initialState,
//     composeWithDevTools(applyMiddleware(...middleware))
// );

const store = configureStore({
    reducer: rootReducer,
    middleware:  [...middleware],
    initialState
});

export default store;
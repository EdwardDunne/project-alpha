import thunk from 'redux-thunk';
import rootReducer from './reducers'
import { configureStore } from '@reduxjs/toolkit'

const initialState = {};
const middleware = [thunk];

const store = configureStore({
    reducer: rootReducer,
    middleware:  [...middleware],
    initialState
});

export default store;
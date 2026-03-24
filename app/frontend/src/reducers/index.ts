import { combineReducers } from 'redux';
import auth from './auth';
import profile from './profile';
import comics from './comics';

const rootReducer = combineReducers({
    auth,
    profile,
    comics
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

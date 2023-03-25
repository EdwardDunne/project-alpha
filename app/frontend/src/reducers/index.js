import { combineReducers } from 'redux';
import auth from './auth';
import profile from './profile';
import comics from './comics';

export default combineReducers ({
    auth,
    profile,
    comics
})
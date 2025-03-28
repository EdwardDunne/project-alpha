import {
    LOAD_USER_PROFILE_SUCCESS,
    LOAD_USER_PROFILE_FAIL,
    UPDATE_USER_PROFILE_SUCCESS,
    UPDATE_USER_PROFILE_FAIL
} from '../actions/types';

const initialState = {
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    is_staff: false
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case LOAD_USER_PROFILE_SUCCESS:
            return {
                ...state,
                username: payload.username,
                first_name: payload.profile.first_name,
                last_name: payload.profile.last_name,
                email: payload.profile.email,
                is_staff: payload.is_staff
            }
        case LOAD_USER_PROFILE_FAIL:
            return {
                ...state,
                username: '',
                first_name: '',
                last_name: '',
                email: '',
                is_staff: false
            }
        case UPDATE_USER_PROFILE_SUCCESS:
            return {
                ...state,
                username: payload.username,
                first_name: payload.profile.first_name,
                last_name: payload.profile.last_name,
                email: payload.profile.email
            }
        case UPDATE_USER_PROFILE_FAIL:
            return {
                ...state
            }
        default:
            return state
    }
}
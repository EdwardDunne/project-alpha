import Cookies from 'js-cookie'
import axios from 'axios';
import {
    LOAD_USER_PROFILE_SUCCESS,
    LOAD_USER_PROFILE_FAIL
} from './types';

export const load_user = () => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${window.location.origin}/api/profile/user`, config);

        if (res.data.error) {
            dispatch({
                type: LOAD_USER_PROFILE_FAIL
            });
        } else {
            dispatch({
                type: LOAD_USER_PROFILE_SUCCESS,
                payload: res.data
            });
        }
    } catch (error) {
        console.error(error);
        dispatch({
            type: LOAD_USER_PROFILE_FAIL
        });
    }

};
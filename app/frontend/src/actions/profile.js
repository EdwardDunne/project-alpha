import Cookies from 'js-cookie'
import axios from 'axios';
import httpUtil from '../utils/httpUtil';
import {
    LOAD_USER_PROFILE_SUCCESS,
    LOAD_USER_PROFILE_FAIL,
    UPDATE_USER_PROFILE_SUCCESS,
    UPDATE_USER_PROFILE_FAIL
} from './types';

export const load_user = () => async dispatch => {
    const config = {
        headers: httpUtil.get_headers('GET')
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
        dispatch({
            type: LOAD_USER_PROFILE_FAIL
        });
    }

};

export const update_profile = (first_name, last_name, email) => async dispatch => {
    const config = {
        headers: httpUtil.get_headers('PUT')
    };

    const body = JSON.stringify({
        'withCredentials': true,
        'first_name': first_name,
        'last_name': last_name,
        'email': email
    });

    try {
        const res = await axios.put(`${window.location.origin}/api/profile/user/update`, body, config);

        if (res.data.profile && res.data.username) {
            dispatch({
                type: UPDATE_USER_PROFILE_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: UPDATE_USER_PROFILE_FAIL
            });
        }
    } catch (error) {
        console.error(error);
        dispatch({
            type: UPDATE_USER_PROFILE_FAIL
        });
    }

};
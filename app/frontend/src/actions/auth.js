import Cookies from 'js-cookie'
import axios from 'axios';
import { load_user } from './profile';
import httpUtil from '../utils/httpUtil';
import {
    REGISTER_SUCCESS, REGISTER_FAIL,
    LOGIN_SUCCESS, LOGIN_FAIL,
    LOGOUT_SUCCESS, LOGOUT_FAIL,
    AUTHENTICATED_SUCCESS, AUTHENTICATED_FAIL,
    DELETE_USER_SUCCESS, DELETE_USER_FAIL
} from './types';

export const checkAuthenticated = () => async dispatch => {
    const config = {
        headers: httpUtil.get_headers('GET')
    };

    try {
        const res = await axios.get(`${window.location.origin}/api/authenticated`, config);

        if (res.data.error || res.data.isAuthenticated === 'error') {
            dispatch({
                type: AUTHENTICATED_FAIL,
                payload: false
            });
        } else if (res.data.isAuthenticated === 'success') {
            dispatch({
                type: AUTHENTICATED_SUCCESS,
                payload: true
            });
        } else {
            dispatch({
                type: AUTHENTICATED_FAIL,
                payload: false
            });
        }
    } catch (error) {
        dispatch({
            type: AUTHENTICATED_FAIL,
            payload: false
        });
    }

};

export const login = (username, password) => async dispatch => {
    const config = {
        headers: httpUtil.get_headers('POST')
    };

    const body = JSON.stringify({ username, password });

    try {
        const res = await axios.post(`${window.location.origin}/api/login`, body, config);

        if (res.data.success) {
            dispatch({
                type: LOGIN_SUCCESS
            });

            dispatch(load_user());
        } else {
            dispatch({
                type: LOGIN_FAIL
            });
        }
    } catch (error) {
        dispatch({
            type: LOGIN_FAIL
        });
    }

};

export const logout = () => async dispatch => {
    const config = {
        headers: httpUtil.get_headers('POST')
    };

    const body = JSON.stringify({
        'withCredentials': true
    });

    try {
        const res = await axios.post(`${window.location.origin}/api/logout`, body, config);

        if (res.data.success) {
            dispatch({
                type: LOGOUT_SUCCESS
            });
        } else {
            dispatch({
                type: LOGOUT_FAIL
            });
        }
    } catch (error) {
        dispatch({
            type: LOGOUT_FAIL
        });
    }

};

export const register = (username, password, re_password) => async dispatch => {
    const config = {
        headers: httpUtil.get_headers('POST')
    };

    const body = JSON.stringify({ username, password, re_password });

    try {
        const res = await axios.post(`${window.location.origin}/api/register`, body, config);

        if (res.data.error) {
            dispatch ({
                type: REGISTER_FAIL
            });
        } else {
            dispatch ({
                type: REGISTER_SUCCESS
            });
        }
    } catch (error) {
        dispatch ({
            type: REGISTER_FAIL
        });
    }
}

export const delete_account = () => async dispatch => {
    const config = {
        headers: httpUtil.get_headers('POST')
    };

    const body = JSON.stringify({
        'withCredentials': true
    });

    try {
        const res = await axios.post(`${window.location.origin}/api/delete-account`, body, config);
        
        if (res.data.success) {
            dispatch ({
                type: DELETE_USER_SUCCESS
            });
        } else {
            dispatch ({
                type: DELETE_USER_FAIL
            });
        }
    } catch (error) {
        dispatch ({
            type: DELETE_USER_FAIL
        });
    }
}
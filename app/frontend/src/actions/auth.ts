import axios from 'axios';
import { Dispatch } from 'redux';
import { toast } from 'react-toastify';
import { load_user } from './profile';
import httpUtil from '../utils/httpUtil';
import {
    REGISTER_SUCCESS, REGISTER_FAIL,
    LOGIN_SUCCESS, LOGIN_FAIL,
    LOGOUT_SUCCESS, LOGOUT_FAIL,
    AUTHENTICATED_SUCCESS, AUTHENTICATED_FAIL,
    DELETE_USER_SUCCESS, DELETE_USER_FAIL,
    UPDATE_IS_STAFF
} from './types';

export const checkAuthenticated = () => async (dispatch: Dispatch) => {
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
            dispatch({
                type: UPDATE_IS_STAFF,
                payload: res.data
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

export const login = (email: string, password: string) => async (dispatch: Dispatch) => {
    const config = {
        headers: httpUtil.get_headers('POST')
    };

    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post(`${window.location.origin}/api/login`, body, config);

        if (res.data.success) {
            dispatch({
                type: LOGIN_SUCCESS
            });

            dispatch(load_user() as any);
        } else {
            toast.error(res.data.error || 'Invalid email or password.');
            dispatch({
                type: LOGIN_FAIL
            });
        }
    } catch (error) {
        toast.error('Something went wrong logging in. Please try again.');
        dispatch({
            type: LOGIN_FAIL
        });
    }
};

export const logout = () => async (dispatch: Dispatch) => {
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

export const register = (email: string, password: string, re_password: string) => async (dispatch: Dispatch) => {
    const config = {
        headers: httpUtil.get_headers('POST')
    };

    const body = JSON.stringify({ email, password, re_password });

    try {
        const res = await axios.post(`${window.location.origin}/api/register`, body, config);

        if (res.data.error) {
            toast.error(res.data.error);
            dispatch({
                type: REGISTER_FAIL
            });
        } else {
            dispatch({
                type: REGISTER_SUCCESS
            });
        }
    } catch (error) {
        toast.error('Something went wrong registering. Please try again.');
        dispatch({
            type: REGISTER_FAIL
        });
    }
}

export const request_password_reset = async (email: string): Promise<boolean> => {
    const config = {
        headers: httpUtil.get_headers('POST')
    };

    const body = JSON.stringify({ email });

    try {
        const res = await axios.post(`${window.location.origin}/api/password-reset/request`, body, config);

        if (res.data.success) {
            toast.success(res.data.success);
            return true;
        } else {
            toast.error(res.data.error || 'Something went wrong. Please try again.');
            return false;
        }
    } catch (error) {
        toast.error('Something went wrong. Please try again.');
        return false;
    }
};

export const reset_password = async (uidb64: string, token: string, password: string, re_password: string): Promise<boolean> => {
    const config = {
        headers: httpUtil.get_headers('POST')
    };

    const body = JSON.stringify({ uidb64, token, password, re_password });

    try {
        const res = await axios.post(`${window.location.origin}/api/password-reset/confirm`, body, config);

        if (res.data.success) {
            toast.success(res.data.success);
            return true;
        } else {
            toast.error(res.data.error || 'Something went wrong. Please try again.');
            return false;
        }
    } catch (error) {
        toast.error('Something went wrong. Please try again.');
        return false;
    }
};

export const delete_account = () => async (dispatch: Dispatch) => {
    const config = {
        headers: httpUtil.get_headers('POST')
    };

    const body = JSON.stringify({
        'withCredentials': true
    });

    try {
        const res = await axios.post(`${window.location.origin}/api/delete-account`, body, config);

        if (res.data.success) {
            dispatch({
                type: DELETE_USER_SUCCESS
            });
        } else {
            dispatch({
                type: DELETE_USER_FAIL
            });
        }
    } catch (error) {
        dispatch({
            type: DELETE_USER_FAIL
        });
    }
}

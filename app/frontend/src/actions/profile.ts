import axios from 'axios';
import { Dispatch } from 'redux';
import httpUtil from '../utils/httpUtil';
import { getErrorMessage } from '../utils/apiError';
import { toast } from 'react-toastify';
import {
    LOAD_USER_PROFILE_SUCCESS,
    LOAD_USER_PROFILE_FAIL,
    UPDATE_USER_PROFILE_SUCCESS,
    UPDATE_USER_PROFILE_FAIL
} from './types';

export const load_user = () => async (dispatch: Dispatch) => {
    const config = {
        headers: httpUtil.get_headers('GET')
    };

    try {
        const res = await axios.get(`${window.location.origin}/api/profile/user`, config);

        dispatch({
            type: LOAD_USER_PROFILE_SUCCESS,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: LOAD_USER_PROFILE_FAIL
        });
    }
};

export const update_profile = (first_name: string, last_name: string) => async (dispatch: Dispatch) => {
    const config = {
        headers: httpUtil.get_headers('PUT')
    };

    const body = JSON.stringify({
        'withCredentials': true,
        'first_name': first_name,
        'last_name': last_name
    });

    try {
        const res = await axios.put(`${window.location.origin}/api/profile/user/update`, body, config);

        toast.success('Profile Updated!');
        dispatch({
            type: UPDATE_USER_PROFILE_SUCCESS,
            payload: res.data
        });
    } catch (error) {
        console.error(error);
        toast.error(getErrorMessage(error, 'Something went wrong...'));
        dispatch({
            type: UPDATE_USER_PROFILE_FAIL
        });
    }
};

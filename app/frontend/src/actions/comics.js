import Cookies from 'js-cookie'
import axios from 'axios';
import {
    LOAD_MARVEL_API_OMNIS_SUCCESS,
    LOAD_MARVEL_API_OMNIS_FAIL
} from './types';

export const get_marvel_omnis = () => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${window.location.origin}/api/get-marvel-omnis`, config);

        if (res.data.error) {
            dispatch({
                type: LOAD_MARVEL_API_OMNIS_FAIL
            });
        } else {
            dispatch({
                type: LOAD_MARVEL_API_OMNIS_SUCCESS,
                payload: res.data
            });
        }
    } catch (error) {
        dispatch({
            type: LOAD_MARVEL_API_OMNIS_FAIL
        });
    }

};

import Cookies from 'js-cookie'
import axios from 'axios';
import httpUtil from '../utils/httpUtil';
import {
    LOAD_MARVEL_API_OMNIS_SUCCESS, LOAD_MARVEL_API_OMNIS_FAIL,
    LOAD_DC_SCRAPED_OMNIS_SUCCESS, LOAD_DC_SCRAPED_OMNIS_FAIL,
    LOAD_MARVEL_SCRAPED_OMNIS_SUCCESS, LOAD_MARVEL_SCRAPED_OMNIS_FAIL
} from './types';

export const get_marvel_omnis = () => async dispatch => {
    const config = {
        headers: httpUtil.get_headers('GET')
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

export const scrape_dc_omnis = () => async dispatch => {
    const config = {
        headers: httpUtil.get_headers('GET')
    };

    try {
        const res = await axios.get(`${window.location.origin}/api/scrape-dc-omnis2`, config);

        if (res.data.error) {
            dispatch({
                type: LOAD_DC_SCRAPED_OMNIS_FAIL
            });
        } else {
            dispatch({
                type: LOAD_DC_SCRAPED_OMNIS_SUCCESS,
                payload: res.data
            });
        }
    } catch (error) {
        dispatch({
            type: LOAD_DC_SCRAPED_OMNIS_FAIL
        });
    }

};

export const scrape_marvel_omnis = () => async dispatch => {
    const config = {
        headers: httpUtil.get_headers('GET')
    };

    try {
        const res = await axios.get(`${window.location.origin}/api/scrape-marvel-omnis`, config);

        if (res.data.error) {
            dispatch({
                type: LOAD_MARVEL_SCRAPED_OMNIS_FAIL
            });
        } else {
            dispatch({
                type: LOAD_MARVEL_SCRAPED_OMNIS_SUCCESS,
                payload: res.data
            });
        }
    } catch (error) {
        dispatch({
            type: LOAD_MARVEL_SCRAPED_OMNIS_FAIL
        });
    }

};

import React from 'react';
import Cookies from 'js-cookie'
import axios from 'axios';
import httpUtil from '../utils/httpUtil';
import { toast } from 'react-toastify';
import {
    LOAD_MARVEL_API_OMNIS_SUCCESS, LOAD_MARVEL_API_OMNIS_FAIL,
    LOAD_DC_SCRAPED_OMNIS_SUCCESS, LOAD_DC_SCRAPED_OMNIS_FAIL,
    LOAD_MARVEL_SCRAPED_OMNIS_SUCCESS, LOAD_MARVEL_SCRAPED_OMNIS_FAIL
} from './types';

export const get_marvel_omnis = () => async dispatch => {
    const config = {
        headers: httpUtil.get_headers('GET')
    };

    const toastId = toast.loading("Getting Omnis from Marvel API...");
    try {
        const res = await axios.get(`${window.location.origin}/api/get-marvel-omnis`, config);

        if (res.data.error) {
            toast.dismiss(toastId);
            toast.error('Something went wrong...');
            dispatch({
                type: LOAD_MARVEL_API_OMNIS_FAIL
            });
        } else {
            toast.dismiss(toastId);
            toast.success('Marvel API Success!');
            dispatch({
                type: LOAD_MARVEL_API_OMNIS_SUCCESS,
                payload: res.data
            });
        }
    } catch (error) {
        toast.dismiss(toastId);
        toast.error('Something went wrong...');
        dispatch({
            type: LOAD_MARVEL_API_OMNIS_FAIL
        });
    }

};

export const scrape_dc_omnis = () => async dispatch => {
    const config = {
        headers: httpUtil.get_headers('GET')
    };

    const toastId = toast.loading("Scraping DC Omnis...");
    try {
        const res = await axios.get(`${window.location.origin}/api/scrape-dc-omnis2`, config);

        if (res.data.error) {
            toast.dismiss(toastId);
            toast.error('Something went wrong...');
            dispatch({
                type: LOAD_DC_SCRAPED_OMNIS_FAIL
            });
        } else {
            toast.dismiss(toastId);
            toast.success('DC Omnis Scraped!');
            dispatch({
                type: LOAD_DC_SCRAPED_OMNIS_SUCCESS,
                payload: res.data
            });
        }
    } catch (error) {
        toast.dismiss(toastId);
        toast.error('Something went wrong...');
        dispatch({
            type: LOAD_DC_SCRAPED_OMNIS_FAIL
        });
    }

};

export const scrape_marvel_omnis = () => async dispatch => {
    const config = {
        headers: httpUtil.get_headers('GET')
    };

    const toastId = toast.loading("Scraping Marvel Omnis...");
    try {
        const res = await axios.get(`${window.location.origin}/api/scrape-marvel-omnis`, config);

        if (res.data.error) {
            toast.dismiss(toastId);
            toast.error('Something went wrong...');
            dispatch({
                type: LOAD_MARVEL_SCRAPED_OMNIS_FAIL
            });
        } else {
            toast.dismiss(toastId);
            toast.success('Marvel Omnis Scraped!');
            dispatch({
                type: LOAD_MARVEL_SCRAPED_OMNIS_SUCCESS,
                payload: res.data
            });
        }
    } catch (error) {
        toast.dismiss(toastId);
        toast.error('Something went wrong...');
        dispatch({
            type: LOAD_MARVEL_SCRAPED_OMNIS_FAIL
        });
    }

};

export const getAllPublishers = async () => {
    const config = {
        headers: httpUtil.get_headers('GET'),
        params: {
            action: 'get_all'
        }
    }

    try {
        return await axios.get(`${window.location.origin}/api/comics/get-publishers`, config);
    } catch (error) {
        console.error(error);
        toast.error('Something went wrong...');
        return {}
    }
}

export const getAllCharacters = async () => {
    const config = {
        headers: httpUtil.get_headers('GET'),
        params: {
            action: 'get_all'
        }
    }

    try {
        return await axios.get(`${window.location.origin}/api/comics/get-characters`, config);
    } catch (error) {
        console.error(error);
        toast.error('Something went wrong...');
        return {}
    }
}

export const getAllOmnis = async () => {
    const config = {
        headers: httpUtil.get_headers('GET'),
        params: {
            action: 'get_all_omnis'
        }
    }

    try {
        return await axios.get(`${window.location.origin}/api/comics/get-omnis`, config);
    } catch (error) {
        console.error(error);
        toast.error('Something went wrong...');
        return {}
    }
}

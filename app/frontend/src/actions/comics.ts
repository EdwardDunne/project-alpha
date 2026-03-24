import axios from 'axios';
import { Dispatch } from 'redux';
import httpUtil from '../utils/httpUtil';
import { toast } from 'react-toastify';
import {
    LOAD_MARVEL_API_OMNIS_SUCCESS, LOAD_MARVEL_API_OMNIS_FAIL,
    LOAD_DC_SCRAPED_OMNIS_SUCCESS, LOAD_DC_SCRAPED_OMNIS_FAIL,
    LOAD_MARVEL_SCRAPED_OMNIS_SUCCESS, LOAD_MARVEL_SCRAPED_OMNIS_FAIL,
    LOAD_CHARACTERS_FAIL, LOAD_CHARACTERS_SUCCESS,
    LOAD_PUBLISHERS_FAIL, LOAD_PUBLISHERS_SUCCESS,
    LOAD_BOOKS_FAIL, LOAD_BOOKS_SUCCESS
} from './types';
import store from '../store';

export const get_marvel_omnis = () => async (dispatch: Dispatch) => {
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

export const scrape_dc_omnis = () => async (dispatch: Dispatch) => {
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

export const scrape_marvel_omnis = () => async (dispatch: Dispatch) => {
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

export const getAllCharacters = () => async (dispatch: Dispatch) => {
    const config = {
        headers: httpUtil.get_headers('GET'),
        params: {
            action: 'get_all'
        }
    }

    try {
        const res = await axios.get(`${window.location.origin}/api/comics/get-characters`, config);
        if (res.data.error) {
            toast.error('Error getting characters...');
            dispatch({
                type: LOAD_CHARACTERS_FAIL
            });
        } else {
            dispatch({
                type: LOAD_CHARACTERS_SUCCESS,
                payload: res.data
            });
        }
    } catch (error) {
        console.error(error);
        toast.error('Something went wrong...');
        return {}
    }
}

export const getAllPublishers = () => async (dispatch: Dispatch) => {
    const config = {
        headers: httpUtil.get_headers('GET'),
        params: {
            action: 'get_all'
        }
    }
    try {
        const res = await axios.get(`${window.location.origin}/api/comics/get-publishers`, config)
        if (res.data.error) {
            toast.error('Error getting publishers...')
            dispatch({
                type: LOAD_PUBLISHERS_FAIL
            })
        } else {
            dispatch({
                type: LOAD_PUBLISHERS_SUCCESS,
                payload: res.data
            })
        }
    } catch (error) {
        console.error(error);
        toast.error('Something went wrong...');
        return {}
    }
}

export const getAllBooks = () => async (dispatch: Dispatch) => {
    const config = {
        headers: httpUtil.get_headers('GET'),
        params: {
            action: 'get_all_books'
        }
    }

    try {
        const res = await axios.get(`${window.location.origin}/api/comics/get-omnis`, config)
        if (res.data.error) {
            toast.error('Error getting books...')
            dispatch({
                type: LOAD_BOOKS_FAIL
            })
        } else {
            dispatch({
                type: LOAD_BOOKS_SUCCESS,
                payload: res.data
            })
        }
    } catch (error) {
        console.error(error);
        toast.error('Something went wrong...');
        return {}
    }
}

export const addPublisher = async (formData: { key: string; name: string }, setDwModalOpen: (open: boolean) => void) => {
    const config = {
        headers: httpUtil.get_headers('POST')
    };

    const body = JSON.stringify({
        key: formData.key,
        name: formData.name,
    });

    try {
        const res = await axios.post(`${window.location.origin}/api/comics/add-publisher`, body, config);
        if (res['data']['new_publisher']) {
            toast.success('Publisher Added!')
            store.dispatch(getAllPublishers() as any) // Refresh publishers
            setDwModalOpen(false)
        } else {
            toast.error('Something went wrong...')
        }
    } catch (error) {
        console.error(error);
        toast.error('Something went wrong...');
    }
}

export const addCharacter = async (formData: { name: string; publisher: string }, setDwModalOpen: (open: boolean) => void) => {
    const config = {
        headers: httpUtil.get_headers('POST')
    };

    const body = JSON.stringify({
        name: formData.name,
        publisher: formData.publisher,
    });

    try {
        const res = await axios.post(`${window.location.origin}/api/comics/add-character`, body, config);
        if (res['data']['new_character']) {
            toast.success('Character Added!')
            store.dispatch(getAllCharacters() as any) // Refresh characters
            setDwModalOpen(false)
        } else {
            toast.error('Something went wrong...')
        }
    } catch (error) {
        console.error(error);
        toast.error('Something went wrong...');
    }
}

export const addBook = async (formData: {
    publisher: string;
    format: string;
    title: string;
    author: string;
    description: string;
    thumbnail_url: string;
    thumbnail: File | string;
    page_count: number;
    character: string;
    team: string;
}, setDwModalOpen: (open: boolean) => void) => {
    const config = {
        headers: httpUtil.get_headers('POSTFILE')
    };

    const _formData = new FormData();
    _formData.append('thumbnail', formData.thumbnail)
    _formData.append('title', formData.title)
    _formData.append('author', formData.author)
    _formData.append('description', formData.description)
    _formData.append('page_count', formData.page_count.toString())
    _formData.append('publisher', formData.publisher)
    _formData.append('character', formData.character)

    try {
        const res = await axios.post(`${window.location.origin}/api/comics/add-book`, _formData, config)
        if (res['data']['new_book']) {
            toast.success('Book Added!')
            store.dispatch(getAllBooks() as any) // Refresh Books
            setDwModalOpen(false)
        } else {
            toast.error('Something went wrong...')
        }
    } catch (error) {
        console.error(error);
        toast.error('Something went wrong...');
    }
}

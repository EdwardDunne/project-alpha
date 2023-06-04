import {
    LOAD_MARVEL_API_OMNIS_SUCCESS, LOAD_MARVEL_API_OMNIS_FAIL,
    LOAD_DC_SCRAPED_OMNIS_SUCCESS, LOAD_DC_SCRAPED_OMNIS_FAIL,
    LOAD_MARVEL_SCRAPED_OMNIS_SUCCESS, LOAD_MARVEL_SCRAPED_OMNIS_FAIL,
} from '../actions/types';


const initialState = {
    marvel_api_comics: [],
    dc_scraped_comics: [],
    marvel_scraped_comics: []
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case LOAD_MARVEL_API_OMNIS_SUCCESS:
            return {
                ...state,
                marvel_api_comics: payload.books
            }
        case LOAD_MARVEL_API_OMNIS_FAIL:
            return {
                ...state,
                marvel_api_comics: []
            }
        case LOAD_DC_SCRAPED_OMNIS_SUCCESS:
            return {
                ...state,
                dc_scraped_comics: payload.books
            }
        case LOAD_DC_SCRAPED_OMNIS_FAIL:
            return {
                ...state,
                dc_scraped_comics: []
            }
        case LOAD_MARVEL_SCRAPED_OMNIS_SUCCESS:
            return {
                ...state,
                marvel_scraped_comics: payload.books
            }
        case LOAD_MARVEL_SCRAPED_OMNIS_FAIL:
            return {
                ...state,
                marvel_scraped_comics: []
            }
        default:
            return state
    }
}
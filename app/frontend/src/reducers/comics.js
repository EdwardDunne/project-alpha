import {
    LOAD_MARVEL_API_OMNIS_SUCCESS,
    LOAD_MARVEL_API_OMNIS_FAIL,
} from '../actions/types';


const initialState = {
    marvel_api_comics: []
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
        default:
            return state
    }
}
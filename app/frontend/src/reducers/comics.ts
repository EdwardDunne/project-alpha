import { AnyAction } from "redux"
import {
    LOAD_CHARACTERS_SUCCESS,
    LOAD_CHARACTERS_FAIL,
    LOAD_PUBLISHERS_SUCCESS,
    LOAD_PUBLISHERS_FAIL,
    LOAD_AUTHORS_SUCCESS,
    LOAD_AUTHORS_FAIL,
    LOAD_ARTISTS_SUCCESS,
    LOAD_ARTISTS_FAIL,
    LOAD_FORMATS_SUCCESS,
    LOAD_FORMATS_FAIL,
    LOAD_SUB_CATEGORIES_SUCCESS,
    LOAD_SUB_CATEGORIES_FAIL,
    LOAD_TEAMS_SUCCESS,
    LOAD_TEAMS_FAIL,
    UPDATE_SHOULD_RELOAD_BOOKS,
} from "../actions/types"
import {
    Character,
    Publisher,
    Author,
    Artist,
    Format,
    SubCategory,
    Team,
} from "../types"

type ComicsState = {
    all_characters: Character[]
    all_publishers: Publisher[]
    all_authors: Author[]
    all_artists: Artist[]
    all_formats: Format[]
    all_sub_categories: SubCategory[]
    all_teams: Team[]
    shouldReloadBooks: boolean
}

const initialState: ComicsState = {
    all_characters: [],
    all_publishers: [],
    all_authors: [],
    all_artists: [],
    all_formats: [],
    all_sub_categories: [],
    all_teams: [],
    shouldReloadBooks: false,
}

export default function comicsReducer(
    state: ComicsState = initialState,
    action: AnyAction,
): ComicsState {
    const { type, payload } = action

    switch (type) {
        case LOAD_CHARACTERS_SUCCESS:
            return {
                ...state,
                all_characters: payload.characters,
            }
        case LOAD_CHARACTERS_FAIL:
            return {
                ...state,
                all_characters: [],
            }
        case LOAD_PUBLISHERS_SUCCESS:
            return {
                ...state,
                all_publishers: payload.publishers,
            }
        case LOAD_PUBLISHERS_FAIL:
            return {
                ...state,
                all_publishers: [],
            }
        case LOAD_AUTHORS_SUCCESS:
            return {
                ...state,
                all_authors: payload.authors,
            }
        case LOAD_AUTHORS_FAIL:
            return {
                ...state,
                all_authors: [],
            }
        case LOAD_ARTISTS_SUCCESS:
            return {
                ...state,
                all_artists: payload.artists,
            }
        case LOAD_ARTISTS_FAIL:
            return {
                ...state,
                all_artists: [],
            }
        case LOAD_FORMATS_SUCCESS:
            return {
                ...state,
                all_formats: payload.formats,
            }
        case LOAD_FORMATS_FAIL:
            return {
                ...state,
                all_formats: [],
            }
        case LOAD_SUB_CATEGORIES_SUCCESS:
            return {
                ...state,
                all_sub_categories: payload.sub_categories,
            }
        case LOAD_SUB_CATEGORIES_FAIL:
            return {
                ...state,
                all_sub_categories: [],
            }
        case LOAD_TEAMS_SUCCESS:
            return {
                ...state,
                all_teams: payload.teams,
            }
        case LOAD_TEAMS_FAIL:
            return {
                ...state,
                all_teams: [],
            }
        case UPDATE_SHOULD_RELOAD_BOOKS:
            return {
                ...state,
                shouldReloadBooks: payload.shouldReloadBooks,
            }
        default:
            return state
    }
}

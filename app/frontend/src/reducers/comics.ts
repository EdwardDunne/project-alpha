import { UnknownAction } from "redux"
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
    allCharacters: Character[]
    allPublishers: Publisher[]
    allAuthors: Author[]
    allArtists: Artist[]
    allFormats: Format[]
    allSubCategories: SubCategory[]
    allTeams: Team[]
    shouldReloadBooks: boolean
}

const initialState: ComicsState = {
    allCharacters: [],
    allPublishers: [],
    allAuthors: [],
    allArtists: [],
    allFormats: [],
    allSubCategories: [],
    allTeams: [],
    shouldReloadBooks: false,
}

interface LoadCharactersSuccessAction extends UnknownAction {
    type: typeof LOAD_CHARACTERS_SUCCESS
    payload: { characters: Character[] }
}
interface LoadCharactersFailAction extends UnknownAction {
    type: typeof LOAD_CHARACTERS_FAIL
}
interface LoadPublishersSuccessAction extends UnknownAction {
    type: typeof LOAD_PUBLISHERS_SUCCESS
    payload: { publishers: Publisher[] }
}
interface LoadPublishersFailAction extends UnknownAction {
    type: typeof LOAD_PUBLISHERS_FAIL
}
interface LoadAuthorsSuccessAction extends UnknownAction {
    type: typeof LOAD_AUTHORS_SUCCESS
    payload: { authors: Author[] }
}
interface LoadAuthorsFailAction extends UnknownAction {
    type: typeof LOAD_AUTHORS_FAIL
}
interface LoadArtistsSuccessAction extends UnknownAction {
    type: typeof LOAD_ARTISTS_SUCCESS
    payload: { artists: Artist[] }
}
interface LoadArtistsFailAction extends UnknownAction {
    type: typeof LOAD_ARTISTS_FAIL
}
interface LoadFormatsSuccessAction extends UnknownAction {
    type: typeof LOAD_FORMATS_SUCCESS
    payload: { formats: Format[] }
}
interface LoadFormatsFailAction extends UnknownAction {
    type: typeof LOAD_FORMATS_FAIL
}
interface LoadSubCategoriesSuccessAction extends UnknownAction {
    type: typeof LOAD_SUB_CATEGORIES_SUCCESS
    payload: { sub_categories: SubCategory[] }
}
interface LoadSubCategoriesFailAction extends UnknownAction {
    type: typeof LOAD_SUB_CATEGORIES_FAIL
}
interface LoadTeamsSuccessAction extends UnknownAction {
    type: typeof LOAD_TEAMS_SUCCESS
    payload: { teams: Team[] }
}
interface LoadTeamsFailAction extends UnknownAction {
    type: typeof LOAD_TEAMS_FAIL
}
interface UpdateShouldReloadBooksAction extends UnknownAction {
    type: typeof UPDATE_SHOULD_RELOAD_BOOKS
    payload: { shouldReloadBooks: boolean }
}

type ComicsAction =
    | LoadCharactersSuccessAction
    | LoadCharactersFailAction
    | LoadPublishersSuccessAction
    | LoadPublishersFailAction
    | LoadAuthorsSuccessAction
    | LoadAuthorsFailAction
    | LoadArtistsSuccessAction
    | LoadArtistsFailAction
    | LoadFormatsSuccessAction
    | LoadFormatsFailAction
    | LoadSubCategoriesSuccessAction
    | LoadSubCategoriesFailAction
    | LoadTeamsSuccessAction
    | LoadTeamsFailAction
    | UpdateShouldReloadBooksAction

export default function comicsReducer(
    state: ComicsState = initialState,
    action: ComicsAction,
): ComicsState {
    switch (action.type) {
        case LOAD_CHARACTERS_SUCCESS:
            return {
                ...state,
                allCharacters: action.payload.characters,
            }
        case LOAD_CHARACTERS_FAIL:
            return state
        case LOAD_PUBLISHERS_SUCCESS:
            return {
                ...state,
                allPublishers: action.payload.publishers,
            }
        case LOAD_PUBLISHERS_FAIL:
            return state
        case LOAD_AUTHORS_SUCCESS:
            return {
                ...state,
                allAuthors: action.payload.authors,
            }
        case LOAD_AUTHORS_FAIL:
            return state
        case LOAD_ARTISTS_SUCCESS:
            return {
                ...state,
                allArtists: action.payload.artists,
            }
        case LOAD_ARTISTS_FAIL:
            return state
        case LOAD_FORMATS_SUCCESS:
            return {
                ...state,
                allFormats: action.payload.formats,
            }
        case LOAD_FORMATS_FAIL:
            return state
        case LOAD_SUB_CATEGORIES_SUCCESS:
            return {
                ...state,
                allSubCategories: action.payload.sub_categories,
            }
        case LOAD_SUB_CATEGORIES_FAIL:
            return state
        case LOAD_TEAMS_SUCCESS:
            return {
                ...state,
                allTeams: action.payload.teams,
            }
        case LOAD_TEAMS_FAIL:
            return state
        case UPDATE_SHOULD_RELOAD_BOOKS:
            return {
                ...state,
                shouldReloadBooks: action.payload.shouldReloadBooks,
            }
        default:
            return state
    }
}

import { AnyAction } from "redux"
import {
    LOAD_MARVEL_API_OMNIS_SUCCESS,
    LOAD_MARVEL_API_OMNIS_FAIL,
    LOAD_DC_SCRAPED_OMNIS_SUCCESS,
    LOAD_DC_SCRAPED_OMNIS_FAIL,
    LOAD_MARVEL_SCRAPED_OMNIS_SUCCESS,
    LOAD_MARVEL_SCRAPED_OMNIS_FAIL,
    LOAD_CHARACTERS_SUCCESS,
    LOAD_CHARACTERS_FAIL,
    LOAD_PUBLISHERS_SUCCESS,
    LOAD_PUBLISHERS_FAIL,
    LOAD_BOOKS_SUCCESS,
    LOAD_BOOKS_FAIL,
} from "../actions/types"
import { Book, Character, Publisher } from "../types"

interface ComicsState {
    marvel_api_comics: any[]
    waltsDcScrapeResponse: { nextPageUrl: string; books: any[] }
    marvel_scraped_comics: any[]
    all_characters: Character[]
    all_publishers: Publisher[]
    all_books: Book[]
}

const initialState: ComicsState = {
    marvel_api_comics: [],
    waltsDcScrapeResponse: { nextPageUrl: "", books: [] },
    marvel_scraped_comics: [],
    all_characters: [],
    all_publishers: [],
    all_books: [],
}

export default function comicsReducer(
    state: ComicsState = initialState,
    action: AnyAction,
): ComicsState {
    const { type, payload } = action

    switch (type) {
        case LOAD_MARVEL_API_OMNIS_SUCCESS:
            return {
                ...state,
                marvel_api_comics: payload.books,
            }
        case LOAD_MARVEL_API_OMNIS_FAIL:
            return {
                ...state,
                marvel_api_comics: [],
            }
        case LOAD_DC_SCRAPED_OMNIS_SUCCESS:
            return {
                ...state,
                waltsDcScrapeResponse: {
                    nextPageUrl: payload.next_page_url,
                    books: payload.books,
                },
            }
        case LOAD_DC_SCRAPED_OMNIS_FAIL:
            return {
                ...state,
                waltsDcScrapeResponse: initialState.waltsDcScrapeResponse,
            }
        case LOAD_MARVEL_SCRAPED_OMNIS_SUCCESS:
            return {
                ...state,
                marvel_scraped_comics: payload.books,
            }
        case LOAD_MARVEL_SCRAPED_OMNIS_FAIL:
            return {
                ...state,
                marvel_scraped_comics: [],
            }
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
        case LOAD_BOOKS_SUCCESS:
            return {
                ...state,
                all_books: [...payload.books].sort((a: Book, b: Book) =>
                    a.title.toLowerCase() > b.title.toLowerCase()
                        ? 1
                        : b.title.toLowerCase() > a.title.toLowerCase()
                          ? -1
                          : 0,
                ),
            }
        case LOAD_BOOKS_FAIL:
            return {
                ...state,
                all_books: [],
            }
        default:
            return state
    }
}

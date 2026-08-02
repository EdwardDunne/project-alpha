import { AnyAction } from "redux"
import {
    LOAD_DC_SCRAPED_OMNIS_PB_SUCCESS,
    LOAD_DC_SCRAPED_OMNIS_PB_FAIL,
    LOAD_CHARACTERS_SUCCESS,
    LOAD_CHARACTERS_FAIL,
    LOAD_PUBLISHERS_SUCCESS,
    LOAD_PUBLISHERS_FAIL,
    LOAD_AUTHORS_SUCCESS,
    LOAD_AUTHORS_FAIL,
    LOAD_ARTISTS_SUCCESS,
    LOAD_ARTISTS_FAIL,
    LOAD_BOOKS_SUCCESS,
    LOAD_BOOKS_FAIL,
} from "../actions/types"
import { Book, Character, Publisher, Author, Artist } from "../types"

export type ScrapedBooksPage = {
    nextPageUrl: string
    books: Book[]
}

type ComicsState = {
    pbDcScrapeResponse: ScrapedBooksPage
    all_characters: Character[]
    all_publishers: Publisher[]
    all_authors: Author[]
    all_artists: Artist[]
    all_books: Book[]
}

const initialState: ComicsState = {
    pbDcScrapeResponse: { nextPageUrl: "", books: [] },
    all_characters: [],
    all_publishers: [],
    all_authors: [],
    all_artists: [],
    all_books: [],
}

export default function comicsReducer(
    state: ComicsState = initialState,
    action: AnyAction,
): ComicsState {
    const { type, payload } = action

    switch (type) {
        case LOAD_DC_SCRAPED_OMNIS_PB_SUCCESS:
            return {
                ...state,
                pbDcScrapeResponse: {
                    nextPageUrl: payload.next_page_url,
                    books: payload.books,
                },
            }
        case LOAD_DC_SCRAPED_OMNIS_PB_FAIL:
            return {
                ...state,
                pbDcScrapeResponse: initialState.pbDcScrapeResponse,
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

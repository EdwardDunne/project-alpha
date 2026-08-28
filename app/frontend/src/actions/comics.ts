import axios from "axios"
import { Dispatch } from "redux"
import httpUtil from "../utils/httpUtil"
import { getErrorMessage } from "../utils/apiError"
import { toast } from "react-toastify"
import {
    LOAD_CHARACTERS_FAIL,
    LOAD_CHARACTERS_SUCCESS,
    LOAD_PUBLISHERS_FAIL,
    LOAD_PUBLISHERS_SUCCESS,
    LOAD_AUTHORS_FAIL,
    LOAD_AUTHORS_SUCCESS,
    LOAD_ARTISTS_FAIL,
    LOAD_ARTISTS_SUCCESS,
    LOAD_FORMATS_FAIL,
    LOAD_FORMATS_SUCCESS,
    LOAD_SUB_CATEGORIES_FAIL,
    LOAD_SUB_CATEGORIES_SUCCESS,
    LOAD_TEAMS_FAIL,
    LOAD_TEAMS_SUCCESS,
    UPDATE_SHOULD_RELOAD_BOOKS,
} from "./types"
import store from "../store"
import {
    Book,
    Publisher,
    Character,
    Author,
    Artist,
    Format,
    SubCategory,
    Team,
} from "../types"

// Generic Action Factory
function makeViewSetActions<
    TItem extends { id: number },
    TCreateBody extends Record<string, unknown>,
    TUpdateBody extends { id: number },
>(cfg: {
    url: string // example /api/comics/authors/
    label: string // example "Author Added!"
    pluralLabel: string // example"Error getting authors..."
    successType: string
    failType: string
    selectList: () => TItem[]
    buildPayload: (list: TItem[]) => Record<string, TItem[]>
}) {
    const url = `${window.location.origin}/api/comics/${cfg.url}/`

    const getAll = () => async (dispatch: Dispatch) => {
        const config = { headers: httpUtil.getHeaders("GET") }
        try {
            const res = await axios.get(url, config)
            dispatch({
                type: cfg.successType,
                payload: cfg.buildPayload(res.data),
            })
        } catch (error) {
            console.error(error)
            toast.error(
                getErrorMessage(error, `Error getting ${cfg.pluralLabel}...`),
            )
            dispatch({ type: cfg.failType })
        }
    }

    const add = async (
        body: TCreateBody,
        setDwModalOpen: (open: boolean) => void,
        onDataChanged?: () => void,
    ) => {
        const config = { headers: httpUtil.getHeaders("POST") }
        try {
            const res = await axios.post(url, JSON.stringify(body), config)
            toast.success(`${cfg.label} Added!`)
            store.dispatch({
                type: cfg.successType,
                payload: cfg.buildPayload([...cfg.selectList(), res.data]),
            })
            setDwModalOpen(false)
            onDataChanged?.()
        } catch (error) {
            console.error(error)
            toast.error(getErrorMessage(error, "Something went wrong..."))
        }
    }

    const update = async (
        body: TUpdateBody,
        onSuccess?: () => void,
        onDataChanged?: () => void,
    ) => {
        const config = { headers: httpUtil.getHeaders("PUT") }
        try {
            const res = await axios.put(
                `${url}${body.id}/`,
                JSON.stringify(body),
                config,
            )
            toast.success(`${cfg.label} Updated!`)
            const updatedList = cfg
                .selectList()
                .map((item) => (item.id === res.data.id ? res.data : item))
            store.dispatch({
                type: cfg.successType,
                payload: cfg.buildPayload(updatedList),
            })
            onSuccess?.()
            onDataChanged?.()
        } catch (error) {
            console.error(error)
            toast.error(getErrorMessage(error, "Something went wrong..."))
        }
    }

    const del = async (id: number, onDataChanged?: () => void) => {
        const config = { headers: httpUtil.getHeaders("DELETE") }
        try {
            await axios.delete(`${url}${id}/`, config)
            toast.success(`${cfg.label} Deleted!`)
            const remainingList = cfg
                .selectList()
                .filter((item) => item.id !== id)
            store.dispatch({
                type: cfg.successType,
                payload: cfg.buildPayload(remainingList),
            })
            onDataChanged?.()
        } catch (error) {
            console.error(error)
            toast.error(getErrorMessage(error, "Something went wrong..."))
        }
    }

    return { getAll, add, update, del }
}

// Publisher Actions
const publisherActions = makeViewSetActions<
    Publisher,
    { name: string },
    { id: number; name: string }
>({
    url: "publishers",
    label: "Publisher",
    pluralLabel: "publishers",
    successType: LOAD_PUBLISHERS_SUCCESS,
    failType: LOAD_PUBLISHERS_FAIL,
    selectList: () => store.getState().comics.all_publishers,
    buildPayload: (publishers) => ({ publishers }),
})
export const getAllPublishers = publisherActions.getAll
export const addPublisher = publisherActions.add
export const updatePublisher = publisherActions.update
export const deletePublisher = publisherActions.del

// Character Actions
const characterActions = makeViewSetActions<
    Character,
    { name: string; publisher: string },
    { id: number; name: string; publisher: string }
>({
    url: "characters",
    label: "Character",
    pluralLabel: "characters",
    successType: LOAD_CHARACTERS_SUCCESS,
    failType: LOAD_CHARACTERS_FAIL,
    selectList: () => store.getState().comics.all_characters,
    buildPayload: (characters) => ({ characters }),
})
export const getAllCharacters = characterActions.getAll
export const addCharacter = characterActions.add
export const updateCharacter = characterActions.update
export const deleteCharacter = characterActions.del

// Author Actions
const authorActions = makeViewSetActions<
    Author,
    { name: string },
    { id: number; name: string }
>({
    url: "authors",
    label: "Author",
    pluralLabel: "authors",
    successType: LOAD_AUTHORS_SUCCESS,
    failType: LOAD_AUTHORS_FAIL,
    selectList: () => store.getState().comics.all_authors,
    buildPayload: (authors) => ({ authors }),
})
export const getAllAuthors = authorActions.getAll
export const addAuthor = authorActions.add
export const updateAuthor = authorActions.update
export const deleteAuthor = authorActions.del

// Artist Actions
const artistActions = makeViewSetActions<
    Artist,
    { name: string },
    { id: number; name: string }
>({
    url: "artists",
    label: "Artist",
    pluralLabel: "artists",
    successType: LOAD_ARTISTS_SUCCESS,
    failType: LOAD_ARTISTS_FAIL,
    selectList: () => store.getState().comics.all_artists,
    buildPayload: (artists) => ({ artists }),
})
export const getAllArtists = artistActions.getAll
export const addArtist = artistActions.add
export const updateArtist = artistActions.update
export const deleteArtist = artistActions.del

// Format Actions
const formatActions = makeViewSetActions<
    Format,
    { name: string; abbreviation: string },
    { id: number; name: string; abbreviation: string }
>({
    url: "formats",
    label: "Format",
    pluralLabel: "formats",
    successType: LOAD_FORMATS_SUCCESS,
    failType: LOAD_FORMATS_FAIL,
    selectList: () => store.getState().comics.all_formats,
    buildPayload: (formats) => ({ formats }),
})
export const getAllFormats = formatActions.getAll
export const addFormat = formatActions.add
export const updateFormat = formatActions.update
export const deleteFormat = formatActions.del

// Sub Category Actions
const subCategoryActions = makeViewSetActions<
    SubCategory,
    { name: string },
    { id: number; name: string }
>({
    url: "sub-categories",
    label: "Sub Category",
    pluralLabel: "sub categories",
    successType: LOAD_SUB_CATEGORIES_SUCCESS,
    failType: LOAD_SUB_CATEGORIES_FAIL,
    selectList: () => store.getState().comics.all_sub_categories,
    buildPayload: (sub_categories) => ({ sub_categories }),
})
export const getAllSubCategories = subCategoryActions.getAll
export const addSubCategory = subCategoryActions.add
export const updateSubCategory = subCategoryActions.update
export const deleteSubCategory = subCategoryActions.del

// Team Actions
const teamActions = makeViewSetActions<
    Team,
    { name: string; characters: string[] },
    { id: number; name: string; characters: string[] }
>({
    url: "teams",
    label: "Team",
    pluralLabel: "teams",
    successType: LOAD_TEAMS_SUCCESS,
    failType: LOAD_TEAMS_FAIL,
    selectList: () => store.getState().comics.all_teams,
    buildPayload: (teams) => ({ teams }),
})
export const getAllTeams = teamActions.getAll
export const addTeam = teamActions.add
export const updateTeam = teamActions.update
export const deleteTeam = teamActions.del

// Book Actions
// Get paginated/filtered Books
export const BOOKS_PAGE_SIZE = 24

export type BooksPageFilters = {
    title?: string
    publisherIds?: number[]
    formatIds?: number[]
    characterIds?: number[]
    artistIds?: number[]
    authorIds?: number[]
    teamIds?: number[]
    wishlistedOnly?: boolean
    ownedOnly?: boolean
}

export type BooksPageResult = {
    books: Book[]
    hasMore: boolean
    count: number
}

export async function fetchBooksPage(
    page: number,
    filters: BooksPageFilters,
): Promise<BooksPageResult> {
    const params = new URLSearchParams()
    params.set("page", String(page))
    params.set("page_size", String(BOOKS_PAGE_SIZE))
    if (filters.title) params.set("title", filters.title)
    filters.publisherIds?.forEach((id) =>
        params.append("publisher", String(id)),
    )
    // Named "book_format" not "format" (DRF reserves the "format" query
    // param).
    filters.formatIds?.forEach((id) => params.append("book_format", String(id)))
    filters.characterIds?.forEach((id) =>
        params.append("characters", String(id)),
    )
    filters.artistIds?.forEach((id) => params.append("artists", String(id)))
    filters.authorIds?.forEach((id) => params.append("authors", String(id)))
    filters.teamIds?.forEach((id) => params.append("team", String(id)))
    if (filters.wishlistedOnly) params.set("wishlisted", "true")
    if (filters.ownedOnly) params.set("owned", "true")

    const config = {
        headers: httpUtil.getHeaders("GET"),
    }

    const res = await axios.get(
        `${window.location.origin}/api/comics/books/?${params.toString()}`,
        config,
    )

    return {
        books: res.data.books,
        hasMore: res.data.has_more,
        count: res.data.count,
    }
}

// Toggle whether the logged in user has this book wishlisted/owned.
export async function toggleWishlist(
    bookId: number,
): Promise<boolean | undefined> {
    const config = {
        headers: httpUtil.getHeaders("POST"),
    }

    try {
        const res = await axios.post(
            `${window.location.origin}/api/comics/books/${bookId}/wishlist/`,
            null,
            config,
        )
        toast.success(
            res.data.is_wishlisted
                ? "Added to wishlist!"
                : "Removed from wishlist!",
        )
        return res.data.is_wishlisted
    } catch (error) {
        console.error(error)
        toast.error(getErrorMessage(error, "Error updating your wishlist..."))
        return undefined
    }
}

export async function toggleOwned(
    bookId: number,
): Promise<boolean | undefined> {
    const config = {
        headers: httpUtil.getHeaders("POST"),
    }

    try {
        const res = await axios.post(
            `${window.location.origin}/api/comics/books/${bookId}/owned/`,
            null,
            config,
        )
        toast.success(
            res.data.is_owned
                ? "Added to owned books!"
                : "Removed from owned books!",
        )
        return res.data.is_owned
    } catch (error) {
        console.error(error)
        toast.error(
            getErrorMessage(error, "Error updating your owned books..."),
        )
        return undefined
    }
}

// Add Book
export const addBook = async (
    formData: {
        publisher: string
        format: string
        sub_category: string
        title: string
        authors: string[]
        artists: string[]
        description: string
        thumbnail_url: string
        thumbnail: File | string
        page_count: number
        volume_number: number
        characters: string[]
        team: string
    },
    setDwModalOpen: (open: boolean) => void,
    onSuccess?: () => void,
) => {
    const config = {
        headers: httpUtil.getHeaders("POSTFILE"),
    }

    const _formData = new FormData()
    _formData.append("thumbnail", formData.thumbnail)
    _formData.append("title", formData.title)
    formData.authors.forEach((id) => _formData.append("authors", id))
    formData.artists.forEach((id) => _formData.append("artists", id))
    _formData.append("description", formData.description)
    _formData.append("page_count", formData.page_count.toString())
    if (formData.volume_number)
        _formData.append("volume_number", formData.volume_number.toString())
    _formData.append("publisher", formData.publisher)
    _formData.append("format", formData.format)
    _formData.append("sub_category", formData.sub_category)
    _formData.append("team", formData.team)
    formData.characters.forEach((id) => _formData.append("characters", id))

    try {
        await axios.post(
            `${window.location.origin}/api/comics/books/`,
            _formData,
            config,
        )
        toast.success("Book Added!")
        setDwModalOpen(false)
        onSuccess?.()
    } catch (error) {
        console.error(error)
        toast.error(getErrorMessage(error, "Something went wrong..."))
    }
}

// Update Book
export const updateBook = async (
    formData: {
        id: number
        publisher: string
        format: string
        sub_category: string
        title: string
        authors: string[]
        artists: string[]
        description: string
        thumbnail_url: string
        thumbnail: File | string
        page_count: number
        volume_number: number
        characters: string[]
        team: string
    },
    setDwModalOpen: (open: boolean) => void,
    onSuccess?: () => void,
) => {
    const config = {
        headers: httpUtil.getHeaders("POSTFILE"),
    }

    const _formData = new FormData()
    _formData.append("id", formData.id.toString())
    if (formData.thumbnail) _formData.append("thumbnail", formData.thumbnail)
    _formData.append("title", formData.title)
    formData.authors.forEach((id) => _formData.append("authors", id))
    formData.artists.forEach((id) => _formData.append("artists", id))
    _formData.append("description", formData.description)
    _formData.append("page_count", formData.page_count.toString())
    if (formData.volume_number)
        _formData.append("volume_number", formData.volume_number.toString())
    _formData.append("publisher", formData.publisher)
    _formData.append("format", formData.format)
    _formData.append("sub_category", formData.sub_category)
    _formData.append("team", formData.team)
    formData.characters.forEach((id) => _formData.append("characters", id))

    try {
        await axios.put(
            `${window.location.origin}/api/comics/books/${formData.id}/`,
            _formData,
            config,
        )
        toast.success("Book Updated!")
        setDwModalOpen(false)
        onSuccess?.()
    } catch (error) {
        console.error(error)
        toast.error(getErrorMessage(error, "Something went wrong..."))
    }
}

// Delete Book
export const deleteBook = async (
    id: number,
    setDwModalOpen: (open: boolean) => void,
    onSuccess?: () => void,
) => {
    const config = {
        headers: httpUtil.getHeaders("DELETE"),
    }

    try {
        await axios.delete(
            `${window.location.origin}/api/comics/books/${id}/`,
            config,
        )
        toast.success("Book Deleted!")
        setDwModalOpen(false)
        onSuccess?.()
    } catch (error) {
        console.error(error)
        toast.error(getErrorMessage(error, "Something went wrong..."))
    }
}

export const setShouldReloadBooks = (shouldReloadBooks: boolean) => {
    store.dispatch({
        type: UPDATE_SHOULD_RELOAD_BOOKS,
        payload: { shouldReloadBooks: shouldReloadBooks },
    })
}

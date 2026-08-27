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
    LOAD_BOOKS_FAIL,
    LOAD_BOOKS_SUCCESS,
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

// Get all books from DB, this is cached unless you are an admin
export const getAllBooks = () => async (dispatch: Dispatch) => {
    const config = {
        headers: httpUtil.getHeaders("GET"),
    }

    try {
        const res = await axios.get(
            `${window.location.origin}/api/comics/books`,
            config,
        )
        dispatch({
            type: LOAD_BOOKS_SUCCESS,
            payload: res.data,
        })
    } catch (error) {
        console.error(error)
        toast.error(getErrorMessage(error, "Error getting books..."))
        dispatch({
            type: LOAD_BOOKS_FAIL,
        })
    }
}

// PAGINATED / FILTERED BOOK FEED
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
    // Named "book_format", not "format" - DRF reserves the "format" query
    // param for response content-negotiation (e.g. ?format=json).
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
        `${window.location.origin}/api/comics/books?${params.toString()}`,
        config,
    )

    return {
        books: res.data.books,
        hasMore: res.data.has_more,
        count: res.data.count,
    }
}

// Toggle whether the logged-in user has this book wishlisted/owned.
export async function toggleWishlist(
    bookId: number,
): Promise<boolean | undefined> {
    const config = {
        headers: httpUtil.getHeaders("POST"),
    }

    try {
        const res = await axios.post(
            `${window.location.origin}/api/comics/books/wishlist`,
            JSON.stringify({ id: bookId }),
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
            `${window.location.origin}/api/comics/books/owned`,
            JSON.stringify({ id: bookId }),
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

// GENERIC COMIC ENTITY ACTIONS
type ComicEntityConfig<TItem extends { id: number }> = {
    url: string // e.g. "publishers" -> /api/comics/publishers (GET/POST/PUT/DELETE)
    label: string // e.g. "Publisher" -> "Publisher Added!"
    pluralLabel: string // e.g. "publishers" -> "Error getting publishers..."
    newItemKey: string // e.g. "new_publisher"
    successType: string
    failType: string
    selectList: () => TItem[]
    buildPayload: (list: TItem[]) => Record<string, TItem[]>
}

function getComicData<TItem extends { id: number }>(
    cfg: ComicEntityConfig<TItem>,
) {
    return () => async (dispatch: Dispatch) => {
        const config = {
            headers: httpUtil.getHeaders("GET"),
        }

        try {
            const res = await axios.get(
                `${window.location.origin}/api/comics/${cfg.url}`,
                config,
            )
            dispatch({ type: cfg.successType, payload: res.data })
        } catch (error) {
            console.error(error)
            toast.error(
                getErrorMessage(error, `Error getting ${cfg.pluralLabel}...`),
            )
            dispatch({ type: cfg.failType })
        }
    }
}

function createComicData<
    TBody extends Record<string, unknown>,
    TItem extends { id: number },
>(cfg: ComicEntityConfig<TItem>) {
    return async (
        body: TBody,
        setDwModalOpen: (open: boolean) => void,
        // Explicit action to refetch paginated book data.
        onDataChanged?: () => void,
    ) => {
        const config = {
            headers: httpUtil.getHeaders("POST"),
        }

        try {
            const res = await axios.post(
                `${window.location.origin}/api/comics/${cfg.url}`,
                JSON.stringify(body),
                config,
            )
            const newItem = res.data[cfg.newItemKey]
            toast.success(`${cfg.label} Added!`)
            store.dispatch({
                type: cfg.successType,
                payload: cfg.buildPayload([...cfg.selectList(), newItem]),
            })
            store.dispatch(getAllBooks()) // Refresh books' derived names
            setDwModalOpen(false)
            onDataChanged?.()
        } catch (error) {
            console.error(error)
            toast.error(getErrorMessage(error, "Something went wrong..."))
        }
    }
}

function updateComicData<
    TBody extends { id: number },
    TItem extends { id: number },
>(cfg: ComicEntityConfig<TItem>) {
    return async (
        body: TBody,
        onSuccess?: () => void,
        onDataChanged?: () => void,
    ) => {
        const config = {
            headers: httpUtil.getHeaders("PUT"),
        }

        try {
            const res = await axios.put(
                `${window.location.origin}/api/comics/${cfg.url}`,
                JSON.stringify(body),
                config,
            )
            const updatedItem = res.data[cfg.newItemKey]
            toast.success(`${cfg.label} Updated!`)
            const updatedList = cfg
                .selectList()
                .map((item) =>
                    item.id === updatedItem.id ? updatedItem : item,
                )
            store.dispatch({
                type: cfg.successType,
                payload: cfg.buildPayload(updatedList),
            })
            store.dispatch(getAllBooks()) // Refresh books' derived names
            onSuccess?.()
            onDataChanged?.()
        } catch (error) {
            console.error(error)
            toast.error(getErrorMessage(error, "Something went wrong..."))
        }
    }
}

function deleteComicData<TItem extends { id: number }>(
    cfg: ComicEntityConfig<TItem>,
) {
    return async (id: number, onDataChanged?: () => void) => {
        const config = {
            headers: httpUtil.getHeaders("DELETE"),
            data: { id },
        }

        try {
            await axios.delete(
                `${window.location.origin}/api/comics/${cfg.url}`,
                config,
            )
            toast.success(`${cfg.label} Deleted!`)
            const remainingList = cfg
                .selectList()
                .filter((item) => item.id !== id)
            store.dispatch({
                type: cfg.successType,
                payload: cfg.buildPayload(remainingList),
            })
            store.dispatch(getAllBooks()) // Refresh books' derived names
            onDataChanged?.()
        } catch (error) {
            console.error(error)
            toast.error(getErrorMessage(error, "Something went wrong..."))
        }
    }
}

// PUBLISHER ACTIONS
const publisherConfig: ComicEntityConfig<Publisher> = {
    url: "publishers",
    label: "Publisher",
    pluralLabel: "publishers",
    newItemKey: "new_publisher",
    successType: LOAD_PUBLISHERS_SUCCESS,
    failType: LOAD_PUBLISHERS_FAIL,
    selectList: () => store.getState().comics.all_publishers,
    buildPayload: (publishers) => ({ publishers }),
}

export const getAllPublishers = getComicData(publisherConfig)
export const addPublisher = createComicData<{ name: string }, Publisher>(
    publisherConfig,
)
export const updatePublisher = updateComicData<
    { id: number; name: string },
    Publisher
>(publisherConfig)
export const deletePublisher = deleteComicData(publisherConfig)

// AUTHOR ACTIONS
const authorConfig: ComicEntityConfig<Author> = {
    url: "authors",
    label: "Author",
    pluralLabel: "authors",
    newItemKey: "new_author",
    successType: LOAD_AUTHORS_SUCCESS,
    failType: LOAD_AUTHORS_FAIL,
    selectList: () => store.getState().comics.all_authors,
    buildPayload: (authors) => ({ authors }),
}

export const getAllAuthors = getComicData(authorConfig)
export const addAuthor = createComicData<{ name: string }, Author>(authorConfig)
export const updateAuthor = updateComicData<
    { id: number; name: string },
    Author
>(authorConfig)
export const deleteAuthor = deleteComicData(authorConfig)

// ARTIST ACTIONS
const artistConfig: ComicEntityConfig<Artist> = {
    url: "artists",
    label: "Artist",
    pluralLabel: "artists",
    newItemKey: "new_artist",
    successType: LOAD_ARTISTS_SUCCESS,
    failType: LOAD_ARTISTS_FAIL,
    selectList: () => store.getState().comics.all_artists,
    buildPayload: (artists) => ({ artists }),
}

export const getAllArtists = getComicData(artistConfig)
export const addArtist = createComicData<{ name: string }, Artist>(artistConfig)
export const updateArtist = updateComicData<
    { id: number; name: string },
    Artist
>(artistConfig)
export const deleteArtist = deleteComicData(artistConfig)

// FORMAT ACTIONS
const formatConfig: ComicEntityConfig<Format> = {
    url: "formats",
    label: "Format",
    pluralLabel: "formats",
    newItemKey: "new_format",
    successType: LOAD_FORMATS_SUCCESS,
    failType: LOAD_FORMATS_FAIL,
    selectList: () => store.getState().comics.all_formats,
    buildPayload: (formats) => ({ formats }),
}

export const getAllFormats = getComicData(formatConfig)
export const addFormat = createComicData<
    { name: string; abbreviation: string },
    Format
>(formatConfig)
export const updateFormat = updateComicData<
    { id: number; name: string; abbreviation: string },
    Format
>(formatConfig)
export const deleteFormat = deleteComicData(formatConfig)

// SUB CATEGORY ACTIONS
const subCategoryConfig: ComicEntityConfig<SubCategory> = {
    url: "sub-categories",
    label: "Sub Category",
    pluralLabel: "sub categories",
    newItemKey: "new_sub_category",
    successType: LOAD_SUB_CATEGORIES_SUCCESS,
    failType: LOAD_SUB_CATEGORIES_FAIL,
    selectList: () => store.getState().comics.all_sub_categories,
    buildPayload: (sub_categories) => ({ sub_categories }),
}

export const getAllSubCategories = getComicData(subCategoryConfig)
export const addSubCategory = createComicData<{ name: string }, SubCategory>(
    subCategoryConfig,
)
export const updateSubCategory = updateComicData<
    { id: number; name: string },
    SubCategory
>(subCategoryConfig)
export const deleteSubCategory = deleteComicData(subCategoryConfig)

// TEAM ACTIONS
const teamConfig: ComicEntityConfig<Team> = {
    url: "teams",
    label: "Team",
    pluralLabel: "teams",
    newItemKey: "new_team",
    successType: LOAD_TEAMS_SUCCESS,
    failType: LOAD_TEAMS_FAIL,
    selectList: () => store.getState().comics.all_teams,
    buildPayload: (teams) => ({ teams }),
}

export const getAllTeams = getComicData(teamConfig)
export const addTeam = createComicData<
    { name: string; characters: string[] },
    Team
>(teamConfig)
export const updateTeam = updateComicData<
    { id: number; name: string; characters: string[] },
    Team
>(teamConfig)
export const deleteTeam = deleteComicData(teamConfig)

// CHARACTER ACTIONS
const characterConfig: ComicEntityConfig<Character> = {
    url: "characters",
    label: "Character",
    pluralLabel: "characters",
    newItemKey: "new_character",
    successType: LOAD_CHARACTERS_SUCCESS,
    failType: LOAD_CHARACTERS_FAIL,
    selectList: () => store.getState().comics.all_characters,
    buildPayload: (characters) => ({ characters }),
}

export const getAllCharacters = getComicData(characterConfig)
export const addCharacter = createComicData<
    { name: string; publisher: string },
    Character
>(characterConfig)
export const updateCharacter = updateComicData<
    { id: number; name: string; publisher: string },
    Character
>(characterConfig)
export const deleteCharacter = deleteComicData(characterConfig)

// BOOK ACTIONS
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
            `${window.location.origin}/api/comics/books`,
            _formData,
            config,
        )
        toast.success("Book Added!")
        store.dispatch(getAllBooks()) // Refresh Books (kept for future use of the full-list view)
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
            `${window.location.origin}/api/comics/books`,
            _formData,
            config,
        )
        toast.success("Book Updated!")
        store.dispatch(getAllBooks()) // Refresh Books (kept for future use of the full-list view)
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
        data: { id },
    }

    try {
        await axios.delete(`${window.location.origin}/api/comics/books`, config)
        toast.success("Book Deleted!")
        // Kept for future use of the full-list view.
        const books = store.getState().comics.all_books
        store.dispatch({
            type: LOAD_BOOKS_SUCCESS,
            payload: { books: books.filter((b) => b.id !== id) },
        })
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

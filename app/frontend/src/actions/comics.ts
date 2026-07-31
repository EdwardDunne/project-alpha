import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios"
import { Dispatch } from "redux"
import httpUtil from "../utils/httpUtil"
import { toast } from "react-toastify"
import {
    LOAD_DC_SCRAPED_OMNIS_PB_SUCCESS,
    LOAD_DC_SCRAPED_OMNIS_PB_FAIL,
    LOAD_CHARACTERS_FAIL,
    LOAD_CHARACTERS_SUCCESS,
    LOAD_PUBLISHERS_FAIL,
    LOAD_PUBLISHERS_SUCCESS,
    LOAD_AUTHORS_FAIL,
    LOAD_AUTHORS_SUCCESS,
    LOAD_BOOKS_FAIL,
    LOAD_BOOKS_SUCCESS,
} from "./types"
import store from "../store"

export const scrape_dc_omnis_panel_bound =
    (nextPageUrl?: string) => async (dispatch: Dispatch) => {
        const defaultPBDCUrl =
            "/collections/dc-comics?filter.p.product_type=Omnibus&page=1&sort_by=title-ascending"

        const config = {
            headers: httpUtil.get_headers("GET") as AxiosRequestHeaders,
        }

        const toastId = toast.loading("Scraping DC Omnis (Panel Bound)...")
        try {
            const res = await axios.get(
                `${window.location.origin}/api/scrape-pb-dc`,
                {
                    ...config,
                    params: {
                        nextPageUrl: nextPageUrl ?? defaultPBDCUrl,
                        publisher: "dc",
                    },
                } as AxiosRequestConfig,
            )

            if (res.data.error) {
                toast.dismiss(toastId)
                toast.error("Something went wrong...")
                dispatch({
                    type: LOAD_DC_SCRAPED_OMNIS_PB_FAIL,
                })
            } else {
                toast.dismiss(toastId)
                toast.success("DC Omnis Scraped!")
                dispatch({
                    type: LOAD_DC_SCRAPED_OMNIS_PB_SUCCESS,
                    payload: res.data,
                })
            }
        } catch (error) {
            console.error(error)
            toast.dismiss(toastId)
            toast.error("Something went wrong...")
            dispatch({
                type: LOAD_DC_SCRAPED_OMNIS_PB_FAIL,
            })
        }
    }

export const getAllCharacters = () => async (dispatch: Dispatch) => {
    const config = {
        headers: httpUtil.get_headers("GET"),
        params: {
            action: "get_all",
        },
    }

    try {
        const res = await axios.get(
            `${window.location.origin}/api/comics/get-characters`,
            config as AxiosRequestConfig<string>,
        )
        if (res.data.error) {
            toast.error("Error getting characters...")
            dispatch({
                type: LOAD_CHARACTERS_FAIL,
            })
        } else {
            dispatch({
                type: LOAD_CHARACTERS_SUCCESS,
                payload: res.data,
            })
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
        return {}
    }
}

export const getAllPublishers = () => async (dispatch: Dispatch) => {
    const config = {
        headers: httpUtil.get_headers("GET"),
        params: {
            action: "get_all",
        },
    }
    try {
        const res = await axios.get(
            `${window.location.origin}/api/comics/get-publishers`,
            config as AxiosRequestConfig<string>,
        )
        if (res.data.error) {
            toast.error("Error getting publishers...")
            dispatch({
                type: LOAD_PUBLISHERS_FAIL,
            })
        } else {
            dispatch({
                type: LOAD_PUBLISHERS_SUCCESS,
                payload: res.data,
            })
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
        return {}
    }
}

export const getAllAuthors = () => async (dispatch: Dispatch) => {
    const config = {
        headers: httpUtil.get_headers("GET"),
        params: {
            action: "get_all",
        },
    }
    try {
        const res = await axios.get(
            `${window.location.origin}/api/comics/get-authors`,
            config as AxiosRequestConfig<string>,
        )
        if (res.data.error) {
            toast.error("Error getting authors...")
            dispatch({
                type: LOAD_AUTHORS_FAIL,
            })
        } else {
            dispatch({
                type: LOAD_AUTHORS_SUCCESS,
                payload: res.data,
            })
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
        return {}
    }
}

export const getAllBooks = () => async (dispatch: Dispatch) => {
    const config = {
        headers: httpUtil.get_headers("GET"),
        params: {
            action: "get_all_books",
        },
    }

    try {
        const res = await axios.get(
            `${window.location.origin}/api/comics/get-omnis`,
            config as AxiosRequestConfig<string>,
        )
        if (res.data.error) {
            toast.error("Error getting books...")
            dispatch({
                type: LOAD_BOOKS_FAIL,
            })
        } else {
            dispatch({
                type: LOAD_BOOKS_SUCCESS,
                payload: res.data,
            })
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
        return {}
    }
}

export const addPublisher = async (
    formData: { name: string },
    setDwModalOpen: (open: boolean) => void,
) => {
    const config = {
        headers: httpUtil.get_headers("POST"),
    }

    const body = JSON.stringify({
        name: formData.name,
    })

    try {
        const res = await axios.post(
            `${window.location.origin}/api/comics/add-publisher`,
            body,
            config as AxiosRequestConfig<string>,
        )
        if (res["data"]["new_publisher"]) {
            toast.success("Publisher Added!")
            const publishers = store.getState().comics.all_publishers
            store.dispatch({
                type: LOAD_PUBLISHERS_SUCCESS,
                payload: { publishers: [...publishers, res.data.new_publisher] },
            })
            store.dispatch(getAllBooks()) // Refresh books' publisher_name
            setDwModalOpen(false)
        } else {
            toast.error(res.data.error || "Something went wrong...")
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
    }
}

export const addAuthor = async (
    formData: { name: string },
    setDwModalOpen: (open: boolean) => void,
) => {
    const config = {
        headers: httpUtil.get_headers("POST"),
    }

    const body = JSON.stringify({
        name: formData.name,
    })

    try {
        const res = await axios.post(
            `${window.location.origin}/api/comics/add-author`,
            body,
            config as AxiosRequestConfig<string>,
        )
        if (res["data"]["new_author"]) {
            toast.success("Author Added!")
            const authors = store.getState().comics.all_authors
            store.dispatch({
                type: LOAD_AUTHORS_SUCCESS,
                payload: { authors: [...authors, res.data.new_author] },
            })
            store.dispatch(getAllBooks()) // Refresh books' author_names
            setDwModalOpen(false)
        } else {
            toast.error(res.data.error || "Something went wrong...")
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
    }
}

export const addCharacter = async (
    formData: { name: string; publisher: string },
    setDwModalOpen: (open: boolean) => void,
) => {
    const config = {
        headers: httpUtil.get_headers("POST"),
    }

    const body = JSON.stringify({
        name: formData.name,
        publisher: formData.publisher,
    })

    try {
        const res = await axios.post(
            `${window.location.origin}/api/comics/add-character`,
            body,
            config as AxiosRequestConfig<string>,
        )
        if (res["data"]["new_character"]) {
            toast.success("Character Added!")
            const characters = store.getState().comics.all_characters
            store.dispatch({
                type: LOAD_CHARACTERS_SUCCESS,
                payload: { characters: [...characters, res.data.new_character] },
            })
            store.dispatch(getAllBooks()) // Refresh books' character_names
            setDwModalOpen(false)
        } else {
            toast.error(res.data.error || "Something went wrong...")
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
    }
}

export const updatePublisher = async (
    formData: { id: number; name: string },
    onSuccess?: () => void,
) => {
    const config = {
        headers: httpUtil.get_headers("PUT"),
    }

    const body = JSON.stringify({
        id: formData.id,
        name: formData.name,
    })

    try {
        const res = await axios.put(
            `${window.location.origin}/api/comics/add-publisher`,
            body,
            config as AxiosRequestConfig<string>,
        )
        if (res["data"]["new_publisher"]) {
            toast.success("Publisher Updated!")
            const publishers = store.getState().comics.all_publishers
            store.dispatch({
                type: LOAD_PUBLISHERS_SUCCESS,
                payload: {
                    publishers: publishers.map(p =>
                        p.id === res.data.new_publisher.id ? res.data.new_publisher : p,
                    ),
                },
            })
            store.dispatch(getAllBooks()) // Refresh books' publisher_name
            onSuccess?.()
        } else {
            toast.error(res.data.error || "Something went wrong...")
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
    }
}

export const deletePublisher = async (id: number) => {
    const config = {
        headers: httpUtil.get_headers("DELETE"),
        data: { id },
    }

    try {
        const res = await axios.delete(
            `${window.location.origin}/api/comics/add-publisher`,
            config as AxiosRequestConfig,
        )
        if (res["data"]["success"]) {
            toast.success("Publisher Deleted!")
            const publishers = store.getState().comics.all_publishers
            store.dispatch({
                type: LOAD_PUBLISHERS_SUCCESS,
                payload: { publishers: publishers.filter(p => p.id !== id) },
            })
            store.dispatch(getAllBooks()) // Refresh books' publisher_name
        } else {
            toast.error(res.data.error || "Something went wrong...")
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
    }
}

export const updateAuthor = async (
    formData: { id: number; name: string },
    onSuccess?: () => void,
) => {
    const config = {
        headers: httpUtil.get_headers("PUT"),
    }

    const body = JSON.stringify({
        id: formData.id,
        name: formData.name,
    })

    try {
        const res = await axios.put(
            `${window.location.origin}/api/comics/add-author`,
            body,
            config as AxiosRequestConfig<string>,
        )
        if (res["data"]["new_author"]) {
            toast.success("Author Updated!")
            const authors = store.getState().comics.all_authors
            store.dispatch({
                type: LOAD_AUTHORS_SUCCESS,
                payload: {
                    authors: authors.map(a =>
                        a.id === res.data.new_author.id ? res.data.new_author : a,
                    ),
                },
            })
            store.dispatch(getAllBooks()) // Refresh books' author_names
            onSuccess?.()
        } else {
            toast.error(res.data.error || "Something went wrong...")
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
    }
}

export const deleteAuthor = async (id: number) => {
    const config = {
        headers: httpUtil.get_headers("DELETE"),
        data: { id },
    }

    try {
        const res = await axios.delete(
            `${window.location.origin}/api/comics/add-author`,
            config as AxiosRequestConfig,
        )
        if (res["data"]["success"]) {
            toast.success("Author Deleted!")
            const authors = store.getState().comics.all_authors
            store.dispatch({
                type: LOAD_AUTHORS_SUCCESS,
                payload: { authors: authors.filter(a => a.id !== id) },
            })
            store.dispatch(getAllBooks()) // Refresh books' author_names
        } else {
            toast.error(res.data.error || "Something went wrong...")
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
    }
}

export const updateCharacter = async (
    formData: { id: number; name: string; publisher: string },
    onSuccess?: () => void,
) => {
    const config = {
        headers: httpUtil.get_headers("PUT"),
    }

    const body = JSON.stringify({
        id: formData.id,
        name: formData.name,
        publisher: formData.publisher,
    })

    try {
        const res = await axios.put(
            `${window.location.origin}/api/comics/add-character`,
            body,
            config as AxiosRequestConfig<string>,
        )
        if (res["data"]["new_character"]) {
            toast.success("Character Updated!")
            const characters = store.getState().comics.all_characters
            store.dispatch({
                type: LOAD_CHARACTERS_SUCCESS,
                payload: {
                    characters: characters.map(c =>
                        c.id === res.data.new_character.id ? res.data.new_character : c,
                    ),
                },
            })
            store.dispatch(getAllBooks()) // Refresh books' character_names
            onSuccess?.()
        } else {
            toast.error(res.data.error || "Something went wrong...")
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
    }
}

export const deleteCharacter = async (id: number) => {
    const config = {
        headers: httpUtil.get_headers("DELETE"),
        data: { id },
    }

    try {
        const res = await axios.delete(
            `${window.location.origin}/api/comics/add-character`,
            config as AxiosRequestConfig,
        )
        if (res["data"]["success"]) {
            toast.success("Character Deleted!")
            const characters = store.getState().comics.all_characters
            store.dispatch({
                type: LOAD_CHARACTERS_SUCCESS,
                payload: { characters: characters.filter(c => c.id !== id) },
            })
            store.dispatch(getAllBooks()) // Refresh books' character_names
        } else {
            toast.error(res.data.error || "Something went wrong...")
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
    }
}

export const addBook = async (
    formData: {
        publisher: string
        format: string
        title: string
        authors: string[]
        description: string
        thumbnail_url: string
        thumbnail: File | string
        page_count: number
        characters: string[]
        team: string
    },
    setDwModalOpen: (open: boolean) => void,
) => {
    const config = {
        headers: httpUtil.get_headers("POSTFILE"),
    }

    const _formData = new FormData()
    _formData.append("thumbnail", formData.thumbnail)
    _formData.append("title", formData.title)
    formData.authors.forEach(id => _formData.append("authors", id))
    _formData.append("description", formData.description)
    _formData.append("page_count", formData.page_count.toString())
    _formData.append("publisher", formData.publisher)
    formData.characters.forEach(id => _formData.append("characters", id))

    try {
        const res = await axios.post(
            `${window.location.origin}/api/comics/add-book`,
            _formData,
            config as AxiosRequestConfig<FormData>,
        )
        if (res["data"]["new_book"]) {
            toast.success("Book Added!")
            store.dispatch(getAllBooks()) // Refresh Books
            setDwModalOpen(false)
        } else {
            toast.error(res.data.error || "Something went wrong...")
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
    }
}

export const updateBook = async (
    formData: {
        id: number
        publisher: string
        format: string
        title: string
        authors: string[]
        description: string
        thumbnail_url: string
        thumbnail: File | string
        page_count: number
        characters: string[]
        team: string
    },
    setDwModalOpen: (open: boolean) => void,
) => {
    const config = {
        headers: httpUtil.get_headers("POSTFILE"),
    }

    const _formData = new FormData()
    _formData.append("id", formData.id.toString())
    if (formData.thumbnail) _formData.append("thumbnail", formData.thumbnail)
    _formData.append("title", formData.title)
    formData.authors.forEach(id => _formData.append("authors", id))
    _formData.append("description", formData.description)
    _formData.append("page_count", formData.page_count.toString())
    _formData.append("publisher", formData.publisher)
    formData.characters.forEach(id => _formData.append("characters", id))

    try {
        const res = await axios.put(
            `${window.location.origin}/api/comics/add-book`,
            _formData,
            config as AxiosRequestConfig<FormData>,
        )
        if (res["data"]["new_book"]) {
            toast.success("Book Updated!")
            store.dispatch(getAllBooks()) // Refresh Books
            setDwModalOpen(false)
        } else {
            toast.error(res.data.error || "Something went wrong...")
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
    }
}

export const deleteBook = async (
    id: number,
    setDwModalOpen: (open: boolean) => void,
) => {
    const config = {
        headers: httpUtil.get_headers("DELETE"),
        data: { id },
    }

    try {
        const res = await axios.delete(
            `${window.location.origin}/api/comics/add-book`,
            config as AxiosRequestConfig,
        )
        if (res["data"]["success"]) {
            toast.success("Book Deleted!")
            const books = store.getState().comics.all_books
            store.dispatch({
                type: LOAD_BOOKS_SUCCESS,
                payload: { books: books.filter(b => b.id !== id) },
            })
            setDwModalOpen(false)
        } else {
            toast.error(res.data.error || "Something went wrong...")
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
    }
}

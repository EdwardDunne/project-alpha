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
            store.dispatch(getAllPublishers()) // Refresh publishers
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
            store.dispatch(getAllCharacters()) // Refresh characters
            setDwModalOpen(false)
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
        author: string
        description: string
        thumbnail_url: string
        thumbnail: File | string
        page_count: number
        character: string
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
    _formData.append("author", formData.author)
    _formData.append("description", formData.description)
    _formData.append("page_count", formData.page_count.toString())
    _formData.append("publisher", formData.publisher)
    _formData.append("character", formData.character)

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
        author: string
        description: string
        thumbnail_url: string
        thumbnail: File | string
        page_count: number
        character: string
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
    _formData.append("author", formData.author)
    _formData.append("description", formData.description)
    _formData.append("page_count", formData.page_count.toString())
    _formData.append("publisher", formData.publisher)
    _formData.append("character", formData.character)

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

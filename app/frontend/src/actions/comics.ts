import axios, { AxiosRequestConfig } from "axios"
import { Dispatch } from "redux"
import httpUtil from "../utils/httpUtil"
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
} from "./types"
import store from "../store"

// Get all characters from DB, this is cached unless you are an admin
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

// Get all publishers from DB, this is cached unless you are an admin
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

// Get all authors from DB, this is cached unless you are an admin
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

// Get all artists from DB, this is cached unless you are an admin
export const getAllArtists = () => async (dispatch: Dispatch) => {
    const config = {
        headers: httpUtil.get_headers("GET"),
        params: {
            action: "get_all",
        },
    }
    try {
        const res = await axios.get(
            `${window.location.origin}/api/comics/get-artists`,
            config as AxiosRequestConfig<string>,
        )
        if (res.data.error) {
            toast.error("Error getting artists...")
            dispatch({
                type: LOAD_ARTISTS_FAIL,
            })
        } else {
            dispatch({
                type: LOAD_ARTISTS_SUCCESS,
                payload: res.data,
            })
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
        return {}
    }
}

// Get all formats from DB, this is cached unless you are an admin
export const getAllFormats = () => async (dispatch: Dispatch) => {
    const config = {
        headers: httpUtil.get_headers("GET"),
        params: {
            action: "get_all",
        },
    }
    try {
        const res = await axios.get(
            `${window.location.origin}/api/comics/get-formats`,
            config as AxiosRequestConfig<string>,
        )
        if (res.data.error) {
            toast.error("Error getting formats...")
            dispatch({
                type: LOAD_FORMATS_FAIL,
            })
        } else {
            dispatch({
                type: LOAD_FORMATS_SUCCESS,
                payload: res.data,
            })
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
        return {}
    }
}

// Get all sub categories from DB, this is cached unless you are an admin
export const getAllSubCategories = () => async (dispatch: Dispatch) => {
    const config = {
        headers: httpUtil.get_headers("GET"),
        params: {
            action: "get_all",
        },
    }
    try {
        const res = await axios.get(
            `${window.location.origin}/api/comics/get-sub-categories`,
            config as AxiosRequestConfig<string>,
        )
        if (res.data.error) {
            toast.error("Error getting sub categories...")
            dispatch({
                type: LOAD_SUB_CATEGORIES_FAIL,
            })
        } else {
            dispatch({
                type: LOAD_SUB_CATEGORIES_SUCCESS,
                payload: res.data,
            })
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
        return {}
    }
}

// Get all teams from DB, this is cached unless you are an admin
export const getAllTeams = () => async (dispatch: Dispatch) => {
    const config = {
        headers: httpUtil.get_headers("GET"),
        params: {
            action: "get_all",
        },
    }
    try {
        const res = await axios.get(
            `${window.location.origin}/api/comics/get-teams`,
            config as AxiosRequestConfig<string>,
        )
        if (res.data.error) {
            toast.error("Error getting teams...")
            dispatch({
                type: LOAD_TEAMS_FAIL,
            })
        } else {
            dispatch({
                type: LOAD_TEAMS_SUCCESS,
                payload: res.data,
            })
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
        return {}
    }
}

// Get all books from DB, this is cached unless you are an admin
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

// PUBLISHER ACTIONS
// Add new Publisher
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
                payload: {
                    publishers: [...publishers, res.data.new_publisher],
                },
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

// Update Publisher
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
                    publishers: publishers.map((p) =>
                        p.id === res.data.new_publisher.id
                            ? res.data.new_publisher
                            : p,
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

// Delete Publisher
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
                payload: { publishers: publishers.filter((p) => p.id !== id) },
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

// AUTHOR ACTIONS
// Add new Author
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

// Update Author
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
                    authors: authors.map((a) =>
                        a.id === res.data.new_author.id
                            ? res.data.new_author
                            : a,
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

// Delete Author
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
                payload: { authors: authors.filter((a) => a.id !== id) },
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

// ARTIST ACTIONS
// Add new Artist
export const addArtist = async (
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
            `${window.location.origin}/api/comics/add-artist`,
            body,
            config as AxiosRequestConfig<string>,
        )
        if (res["data"]["new_artist"]) {
            toast.success("Artist Added!")
            const artists = store.getState().comics.all_artists
            store.dispatch({
                type: LOAD_ARTISTS_SUCCESS,
                payload: { artists: [...artists, res.data.new_artist] },
            })
            store.dispatch(getAllBooks()) // Refresh books' artist_names
            setDwModalOpen(false)
        } else {
            toast.error(res.data.error || "Something went wrong...")
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
    }
}

// Update Artist
export const updateArtist = async (
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
            `${window.location.origin}/api/comics/add-artist`,
            body,
            config as AxiosRequestConfig<string>,
        )
        if (res["data"]["new_artist"]) {
            toast.success("Artist Updated!")
            const artists = store.getState().comics.all_artists
            store.dispatch({
                type: LOAD_ARTISTS_SUCCESS,
                payload: {
                    artists: artists.map((a) =>
                        a.id === res.data.new_artist.id
                            ? res.data.new_artist
                            : a,
                    ),
                },
            })
            store.dispatch(getAllBooks()) // Refresh books' artist_names
            onSuccess?.()
        } else {
            toast.error(res.data.error || "Something went wrong...")
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
    }
}

// Delete Artist
export const deleteArtist = async (id: number) => {
    const config = {
        headers: httpUtil.get_headers("DELETE"),
        data: { id },
    }

    try {
        const res = await axios.delete(
            `${window.location.origin}/api/comics/add-artist`,
            config as AxiosRequestConfig,
        )
        if (res["data"]["success"]) {
            toast.success("Artist Deleted!")
            const artists = store.getState().comics.all_artists
            store.dispatch({
                type: LOAD_ARTISTS_SUCCESS,
                payload: { artists: artists.filter((a) => a.id !== id) },
            })
            store.dispatch(getAllBooks()) // Refresh books' artist_names
        } else {
            toast.error(res.data.error || "Something went wrong...")
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
    }
}

// FORMAT ACTIONS
// Add new Format
export const addFormat = async (
    formData: { name: string; abbreviation: string },
    setDwModalOpen: (open: boolean) => void,
) => {
    const config = {
        headers: httpUtil.get_headers("POST"),
    }

    const body = JSON.stringify({
        name: formData.name,
        abbreviation: formData.abbreviation,
    })

    try {
        const res = await axios.post(
            `${window.location.origin}/api/comics/add-format`,
            body,
            config as AxiosRequestConfig<string>,
        )
        if (res["data"]["new_format"]) {
            toast.success("Format Added!")
            const formats = store.getState().comics.all_formats
            store.dispatch({
                type: LOAD_FORMATS_SUCCESS,
                payload: { formats: [...formats, res.data.new_format] },
            })
            store.dispatch(getAllBooks()) // Refresh books' format_name
            setDwModalOpen(false)
        } else {
            toast.error(res.data.error || "Something went wrong...")
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
    }
}

// Update Format
export const updateFormat = async (
    formData: { id: number; name: string; abbreviation: string },
    onSuccess?: () => void,
) => {
    const config = {
        headers: httpUtil.get_headers("PUT"),
    }

    const body = JSON.stringify({
        id: formData.id,
        name: formData.name,
        abbreviation: formData.abbreviation,
    })

    try {
        const res = await axios.put(
            `${window.location.origin}/api/comics/add-format`,
            body,
            config as AxiosRequestConfig<string>,
        )
        if (res["data"]["new_format"]) {
            toast.success("Format Updated!")
            const formats = store.getState().comics.all_formats
            store.dispatch({
                type: LOAD_FORMATS_SUCCESS,
                payload: {
                    formats: formats.map((f) =>
                        f.id === res.data.new_format.id
                            ? res.data.new_format
                            : f,
                    ),
                },
            })
            store.dispatch(getAllBooks()) // Refresh books' format_name
            onSuccess?.()
        } else {
            toast.error(res.data.error || "Something went wrong...")
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
    }
}

// Delete Format
export const deleteFormat = async (id: number) => {
    const config = {
        headers: httpUtil.get_headers("DELETE"),
        data: { id },
    }

    try {
        const res = await axios.delete(
            `${window.location.origin}/api/comics/add-format`,
            config as AxiosRequestConfig,
        )
        if (res["data"]["success"]) {
            toast.success("Format Deleted!")
            const formats = store.getState().comics.all_formats
            store.dispatch({
                type: LOAD_FORMATS_SUCCESS,
                payload: { formats: formats.filter((f) => f.id !== id) },
            })
            store.dispatch(getAllBooks()) // Refresh books' format_name
        } else {
            toast.error(res.data.error || "Something went wrong...")
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
    }
}

// SUB CATEGORY ACTIONS
// Add new Sub Category
export const addSubCategory = async (
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
            `${window.location.origin}/api/comics/add-sub-category`,
            body,
            config as AxiosRequestConfig<string>,
        )
        if (res["data"]["new_sub_category"]) {
            toast.success("Sub Category Added!")
            const subCategories = store.getState().comics.all_sub_categories
            store.dispatch({
                type: LOAD_SUB_CATEGORIES_SUCCESS,
                payload: {
                    sub_categories: [
                        ...subCategories,
                        res.data.new_sub_category,
                    ],
                },
            })
            store.dispatch(getAllBooks()) // Refresh books' sub_category_name
            setDwModalOpen(false)
        } else {
            toast.error(res.data.error || "Something went wrong...")
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
    }
}

// Update Sub Category
export const updateSubCategory = async (
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
            `${window.location.origin}/api/comics/add-sub-category`,
            body,
            config as AxiosRequestConfig<string>,
        )
        if (res["data"]["new_sub_category"]) {
            toast.success("Sub Category Updated!")
            const subCategories = store.getState().comics.all_sub_categories
            store.dispatch({
                type: LOAD_SUB_CATEGORIES_SUCCESS,
                payload: {
                    sub_categories: subCategories.map((s) =>
                        s.id === res.data.new_sub_category.id
                            ? res.data.new_sub_category
                            : s,
                    ),
                },
            })
            store.dispatch(getAllBooks()) // Refresh books' sub_category_name
            onSuccess?.()
        } else {
            toast.error(res.data.error || "Something went wrong...")
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
    }
}

// Delete Sub Category
export const deleteSubCategory = async (id: number) => {
    const config = {
        headers: httpUtil.get_headers("DELETE"),
        data: { id },
    }

    try {
        const res = await axios.delete(
            `${window.location.origin}/api/comics/add-sub-category`,
            config as AxiosRequestConfig,
        )
        if (res["data"]["success"]) {
            toast.success("Sub Category Deleted!")
            const subCategories = store.getState().comics.all_sub_categories
            store.dispatch({
                type: LOAD_SUB_CATEGORIES_SUCCESS,
                payload: {
                    sub_categories: subCategories.filter((s) => s.id !== id),
                },
            })
            store.dispatch(getAllBooks()) // Refresh books' sub_category_name
        } else {
            toast.error(res.data.error || "Something went wrong...")
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
    }
}

// TEAM ACTIONS
// Add new Team
export const addTeam = async (
    formData: { name: string; characters: string[] },
    setDwModalOpen: (open: boolean) => void,
) => {
    const config = {
        headers: httpUtil.get_headers("POST"),
    }

    const body = JSON.stringify({
        name: formData.name,
        characters: formData.characters,
    })

    try {
        const res = await axios.post(
            `${window.location.origin}/api/comics/add-team`,
            body,
            config as AxiosRequestConfig<string>,
        )
        if (res["data"]["new_team"]) {
            toast.success("Team Added!")
            const teams = store.getState().comics.all_teams
            store.dispatch({
                type: LOAD_TEAMS_SUCCESS,
                payload: { teams: [...teams, res.data.new_team] },
            })
            store.dispatch(getAllBooks()) // Refresh books' team_name
            setDwModalOpen(false)
        } else {
            toast.error(res.data.error || "Something went wrong...")
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
    }
}

// Update Team
export const updateTeam = async (
    formData: { id: number; name: string; characters: string[] },
    onSuccess?: () => void,
) => {
    const config = {
        headers: httpUtil.get_headers("PUT"),
    }

    const body = JSON.stringify({
        id: formData.id,
        name: formData.name,
        characters: formData.characters,
    })

    try {
        const res = await axios.put(
            `${window.location.origin}/api/comics/add-team`,
            body,
            config as AxiosRequestConfig<string>,
        )
        if (res["data"]["new_team"]) {
            toast.success("Team Updated!")
            const teams = store.getState().comics.all_teams
            store.dispatch({
                type: LOAD_TEAMS_SUCCESS,
                payload: {
                    teams: teams.map((t) =>
                        t.id === res.data.new_team.id ? res.data.new_team : t,
                    ),
                },
            })
            store.dispatch(getAllBooks()) // Refresh books' team_name
            onSuccess?.()
        } else {
            toast.error(res.data.error || "Something went wrong...")
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
    }
}

// Delete Team
export const deleteTeam = async (id: number) => {
    const config = {
        headers: httpUtil.get_headers("DELETE"),
        data: { id },
    }

    try {
        const res = await axios.delete(
            `${window.location.origin}/api/comics/add-team`,
            config as AxiosRequestConfig,
        )
        if (res["data"]["success"]) {
            toast.success("Team Deleted!")
            const teams = store.getState().comics.all_teams
            store.dispatch({
                type: LOAD_TEAMS_SUCCESS,
                payload: { teams: teams.filter((t) => t.id !== id) },
            })
            store.dispatch(getAllBooks()) // Refresh books' team_name
        } else {
            toast.error(res.data.error || "Something went wrong...")
        }
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong...")
    }
}

// CHARACTER ACTIONS
// Add new Character
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
                payload: {
                    characters: [...characters, res.data.new_character],
                },
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

// Update Character
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
                    characters: characters.map((c) =>
                        c.id === res.data.new_character.id
                            ? res.data.new_character
                            : c,
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

// Delete Character
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
                payload: { characters: characters.filter((c) => c.id !== id) },
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

// BOOK ACTIONS
// Add new Book
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
) => {
    const config = {
        headers: httpUtil.get_headers("POSTFILE"),
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
) => {
    const config = {
        headers: httpUtil.get_headers("POSTFILE"),
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

// Delete Book
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
                payload: { books: books.filter((b) => b.id !== id) },
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

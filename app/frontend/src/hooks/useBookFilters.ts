import { useEffect, useMemo, useState } from "react"
import { BooksPageFilters } from "../actions/comics"
import { usePersistedState } from "./usePersistedState"
import { useDebounce } from "./useDebounce"
import { Character, Publisher, Artist, Author, Team, Format } from "../types"

type Options = {
    // Format name to pre-select the first time the page is visited
    // (e.g. "Omnibus"). Requires allFormats so the name can be resolved.
    defaultFormatName?: string
    allFormats?: Format[]
}

// Owns all book-filter state for a page: each filter persists across
// unmounts under `storagePrefix`, is debounced, and is combined into the
// BooksPageFilters object that usePaginatedBooks consumes.
export function useBookFilters(storagePrefix: string, options: Options = {}) {
    const { defaultFormatName, allFormats = [] } = options
    const key = (name: string) => `${storagePrefix}:${name}`

    const [titleSearch, setTitleSearch] = usePersistedState(key("titleSearch"), "")
    const [minPages, setMinPages] = usePersistedState(key("minPagesFilter"), "")
    const [maxPages, setMaxPages] = usePersistedState(key("maxPagesFilter"), "")
    const [characters, setCharacters] = usePersistedState<Character[]>(
        key("characterFilter"),
        [],
    )
    const [publishers, setPublishers] = usePersistedState<Publisher[]>(
        key("publisherFilter"),
        [],
    )
    const [artists, setArtists] = usePersistedState<Artist[]>(
        key("artistFilter"),
        [],
    )
    const [authors, setAuthors] = usePersistedState<Author[]>(
        key("authorFilter"),
        [],
    )
    const [teams, setTeams] = usePersistedState<Team[]>(key("teamFilter"), [])
    const [wishlistedOnly, setWishlistedOnly] = usePersistedState(
        key("wishlistOnlyFilter"),
        false,
    )
    const [ownedOnly, setOwnedOnly] = usePersistedState(
        key("ownedOnlyFilter"),
        false,
    )
    // undefined = not yet resolved (still waiting on allFormats to load so
    // the default format can be applied); [] = user explicitly wants no
    // format filter. Without a defaultFormatName it starts resolved as [].
    const [formats, setFormats] = usePersistedState<Format[] | undefined>(
        key("formatFilter"),
        defaultFormatName ? undefined : [],
    )
    // Bumped on clear so the selectors remount with empty selections
    const [resetKey, setResetKey] = useState(0)

    // Apply the default format once, never overriding a later explicit
    // choice (including clearing the filter, which sets it to [])
    useEffect(() => {
        if (formats !== undefined || allFormats.length === 0) return
        const match = allFormats.find((f) => f.name === defaultFormatName)
        setFormats(match ? [match] : [])
    }, [allFormats, formats])

    const debouncedTitle = useDebounce(titleSearch)
    const debouncedMinPages = useDebounce(minPages)
    const debouncedMaxPages = useDebounce(maxPages)
    const debouncedPublishers = useDebounce(publishers)
    const debouncedFormats = useDebounce(formats ?? [])
    const debouncedCharacters = useDebounce(characters)
    const debouncedArtists = useDebounce(artists)
    const debouncedAuthors = useDebounce(authors)
    const debouncedTeams = useDebounce(teams)

    const filters: BooksPageFilters = useMemo(
        () => ({
            title: debouncedTitle || undefined,
            minPages: Number(debouncedMinPages) || undefined,
            maxPages: Number(debouncedMaxPages) || undefined,
            publisherIds: debouncedPublishers.map((p) => p.id),
            formatIds: debouncedFormats.map((f) => f.id),
            characterIds: debouncedCharacters.map((c) => c.id),
            artistIds: debouncedArtists.map((a) => a.id),
            authorIds: debouncedAuthors.map((a) => a.id),
            teamIds: debouncedTeams.map((t) => t.id),
            wishlistedOnly,
            ownedOnly,
        }),
        [
            debouncedTitle,
            debouncedMinPages,
            debouncedMaxPages,
            debouncedPublishers,
            debouncedFormats,
            debouncedCharacters,
            debouncedArtists,
            debouncedAuthors,
            debouncedTeams,
            wishlistedOnly,
            ownedOnly,
        ],
    )

    // False until the format filter is resolved and its debounce has caught
    // up, so the first books request already includes the default format
    const ready =
        formats !== undefined &&
        JSON.stringify(debouncedFormats.map((f) => f.id).sort()) ===
            JSON.stringify(formats.map((f) => f.id).sort())

    const clearFilters = () => {
        setTitleSearch("")
        setMinPages("")
        setMaxPages("")
        setPublishers([])
        setFormats([])
        setCharacters([])
        setArtists([])
        setAuthors([])
        setTeams([])
        setWishlistedOnly(false)
        setOwnedOnly(false)
        setResetKey((k) => k + 1)
    }

    return {
        filters,
        ready,
        clearFilters,
        resetKey,
        titleSearch,
        setTitleSearch,
        minPages,
        setMinPages,
        maxPages,
        setMaxPages,
        formats: formats ?? [],
        setFormats,
        publishers,
        setPublishers,
        characters,
        setCharacters,
        teams,
        setTeams,
        authors,
        setAuthors,
        artists,
        setArtists,
        wishlistedOnly,
        setWishlistedOnly,
        ownedOnly,
        setOwnedOnly,
    }
}

export type BookFiltersState = ReturnType<typeof useBookFilters>

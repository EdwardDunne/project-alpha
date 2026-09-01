import React, { useEffect, useMemo, useRef, useState } from "react"
import { connect } from "react-redux"
import { Heart, BookOpenCheck } from "lucide-react"
import {
    BooksPageFilters,
    toggleWishlist,
    toggleOwned,
    getAllFormats,
    setShouldReloadBooks,
} from "../actions/comics"
import { usePaginatedBooks } from "../hooks/usePaginatedBooks"
import { usePersistedState } from "../hooks/usePersistedState"
import { ThemeProvider, Switch, FormControlLabel } from "@mui/material"
import { darkTheme } from "../App"
import PublishersMultiSelector from "../components/PublishersMultiSelector"
import CharactersMultiSelector from "../components/CharactersMultiSelector"
import ArtistsSelector from "../components/ArtistsSelector"
import AuthorsSelector from "../components/AuthorsSelector"
import TeamsMultiSelector from "../components/TeamsMultiSelector"
import FormatsMultiSelector from "../components/FormatsMultiSelector"
import DunneWebModal from "../modals/DunneWebModal"
import FloatingMenuButton from "../components/FloatingMenuButton"
import FilterListIcon from "@mui/icons-material/FilterList"
import SidePanel from "../components/SidePanel"
import {
    Book,
    Character,
    Publisher,
    Artist,
    Author,
    Team,
    Format,
} from "../types"
import BookModalContent from "modals/dwModalContent/BookModalContent"
import { useDebounce } from "../hooks/useDebounce"
import { RootState } from "../reducers"

interface Props {
    isAuthenticated: boolean | null
    allFormats: Format[]
    shouldReloadBooks: boolean
    getAllFormats: () => void
}

const ComicsPage: React.FC<Props> = ({
    isAuthenticated,
    allFormats,
    shouldReloadBooks,
    getAllFormats,
}) => {
    const [characterFilter, setCharacterFilter] = usePersistedState<
        Character[]
    >("comics-public:characterFilter", [])
    const [publisherFilter, setPublisherFilter] = usePersistedState<
        Publisher[]
    >("comics-public:publisherFilter", [])
    const [artistFilter, setArtistFilter] = usePersistedState<Artist[]>(
        "comics-public:artistFilter",
        [],
    )
    const [authorFilter, setAuthorFilter] = usePersistedState<Author[]>(
        "comics-public:authorFilter",
        [],
    )
    const [teamFilter, setTeamFilter] = usePersistedState<Team[]>(
        "comics-public:teamFilter",
        [],
    )
    const [titleSearch, setTitleSearch] = usePersistedState(
        "comics-public:titleSearch",
        "",
    )
    const [wishlistOnlyFilter, setWishlistOnlyFilter] = usePersistedState(
        "comics-public:wishlistOnlyFilter",
        false,
    )
    const [ownedOnlyFilter, setOwnedOnlyFilter] = usePersistedState(
        "comics-public:ownedOnlyFilter",
        false,
    )
    // undefined = not yet resolved (still waiting on allFormats to load so
    // we can default to ["Omnibus"]); [] = user explicitly wants no format
    // filter. Once resolved (to either a non-empty array or []), it persists
    // like every other filter and this distinction stops mattering.
    const [formatFilter, setFormatFilter] = usePersistedState<
        Format[] | undefined
    >("comics-public:formatFilter", undefined)
    const [dwModalOpen, setDwModalOpen] = useState(false)
    const [selectedBook, setSelectedBook] = useState<Book | null>(null)
    const [filterOpen, setFilterOpen] = useState(false)
    const [filterResetKey, setFilterResetKey] = useState(0)

    const debouncedTitleSearch = useDebounce(titleSearch)
    const debouncedPublisherFilter = useDebounce(publisherFilter)
    const debouncedFormatFilter = useDebounce(formatFilter ?? [])
    const debouncedCharacterFilter = useDebounce(characterFilter)
    const debouncedArtistFilter = useDebounce(artistFilter)
    const debouncedAuthorFilter = useDebounce(authorFilter)
    const debouncedTeamFilter = useDebounce(teamFilter)

    const scrollContainerRef = useRef<HTMLDivElement | null>(null)

    // Bootstrap the format list (FormatsMultiSelector also does this itself,
    // but we need it here too to resolve the "Omnibus" default below).
    useEffect(() => {
        if (allFormats.length === 0) getAllFormats()
    }, [])

    // Default to ["Omnibus"] the first time this page is ever visited in
    // this session, but only once - never override an explicit later choice
    // (including explicitly clearing the filter, which sets it to []).
    useEffect(() => {
        if (formatFilter !== undefined || allFormats.length === 0) return
        const omnibus = allFormats.find((f) => f.name === "Omnibus")
        setFormatFilter(omnibus ? [omnibus] : [])
    }, [allFormats, formatFilter])

    const filters: BooksPageFilters = useMemo(
        () => ({
            title: debouncedTitleSearch || undefined,
            publisherIds: debouncedPublisherFilter.map((p) => p.id),
            formatIds: debouncedFormatFilter.map((f) => f.id),
            characterIds: debouncedCharacterFilter.map((c) => c.id),
            artistIds: debouncedArtistFilter.map((a) => a.id),
            authorIds: debouncedAuthorFilter.map((a) => a.id),
            teamIds: debouncedTeamFilter.map((t) => t.id),
            wishlistedOnly: wishlistOnlyFilter,
            ownedOnly: ownedOnlyFilter,
        }),
        [
            debouncedTitleSearch,
            debouncedPublisherFilter,
            debouncedFormatFilter,
            debouncedCharacterFilter,
            debouncedArtistFilter,
            debouncedAuthorFilter,
            debouncedTeamFilter,
            wishlistOnlyFilter,
            ownedOnlyFilter,
        ],
    )

    // Don't make first books request until formats have loaded
    const formatFilterReady =
        formatFilter !== undefined &&
        JSON.stringify(debouncedFormatFilter.map((f) => f.id).sort()) ===
            JSON.stringify(formatFilter.map((f) => f.id).sort())

    const { books, loading, sentinelRef, updateBook, removeBook, reload } =
        usePaginatedBooks(
            "comics-public",
            filters,
            scrollContainerRef,
            formatFilterReady,
        )

    useEffect(() => {
        if (shouldReloadBooks) {
            setShouldReloadBooks(false)
            reload()
        }
    }, [])

    // Jump back to the top of the grid whenever the filters produce a new feed.
    useEffect(() => {
        scrollContainerRef.current?.scrollTo({ top: 0 })
    }, [filters])

    // with both switches on, a book matches if it's wishlisted OR owned, so
    // toggling one off shouldn't drop a book that still satisfies the other
    // active filter.
    const matchesWishlistOwnedFilters = (
        book: Pick<Book, "is_wishlisted" | "is_owned">,
    ) => {
        if (wishlistOnlyFilter && ownedOnlyFilter) {
            return book.is_wishlisted || book.is_owned
        }
        if (wishlistOnlyFilter) return !!book.is_wishlisted
        if (ownedOnlyFilter) return !!book.is_owned
        return true
    }

    const handleToggleWishlist = async (e: React.MouseEvent, book: Book) => {
        e.stopPropagation()
        const result = await toggleWishlist(book.id)
        if (result === undefined) return
        if (!matchesWishlistOwnedFilters({ ...book, is_wishlisted: result })) {
            removeBook(book.id)
        } else {
            updateBook(book.id, { is_wishlisted: result })
        }
    }

    const handleToggleOwned = async (e: React.MouseEvent, book: Book) => {
        e.stopPropagation()
        const result = await toggleOwned(book.id)
        if (result === undefined) return
        if (!matchesWishlistOwnedFilters({ ...book, is_owned: result })) {
            removeBook(book.id)
        } else {
            updateBook(book.id, { is_owned: result })
        }
    }

    function renderBook(book: Book) {
        return (
            <div
                key={book.id}
                className="m-[0.5rem] w-[calc(50%-1rem)] sm:w-[calc(33.33%-1rem)] md:w-[20rem] cursor-pointer
                            flex flex-col justify-center items-center"
                onClick={() => {
                    setSelectedBook(book)
                    setDwModalOpen(true)
                }}
            >
                <div className="relative flex content-center items-center h-[29.5rem]">
                    <img
                        className="rounded-[1rem] object-cover min-w-0 h-[29.5rem]"
                        src={book.thumbnail}
                        alt={book.title}
                    />
                    {isAuthenticated && (
                        <div className="absolute top-2 right-2 flex gap-1.5">
                            <button
                                type="button"
                                aria-label={
                                    book.is_wishlisted
                                        ? "Remove from wishlist"
                                        : "Add to wishlist"
                                }
                                onClick={(e) => handleToggleWishlist(e, book)}
                                className="p-1.5 rounded-full bg-black/80 hover:bg-black/70 transition-colors"
                            >
                                <Heart
                                    size={20}
                                    className={
                                        book.is_wishlisted
                                            ? "text-brand"
                                            : "text-white"
                                    }
                                    fill={
                                        book.is_wishlisted
                                            ? "currentColor"
                                            : "none"
                                    }
                                />
                            </button>
                            <button
                                type="button"
                                aria-label={
                                    book.is_owned
                                        ? "Remove from owned books"
                                        : "Mark as owned"
                                }
                                onClick={(e) => handleToggleOwned(e, book)}
                                className="p-1.5 rounded-full bg-black/80 hover:bg-black/70 transition-colors"
                            >
                                <BookOpenCheck
                                    size={20}
                                    strokeWidth={3}
                                    className={
                                        book.is_owned
                                            ? "text-brand"
                                            : "text-white"
                                    }
                                />
                            </button>
                        </div>
                    )}
                </div>
                <div className="h-fit text-ellipsis text-center text-[1.6rem] mt-1">
                    {book.title}
                </div>
            </div>
        )
    }

    const clearFilters = () => {
        setTitleSearch("")
        setPublisherFilter([])
        setFormatFilter([])
        setCharacterFilter([])
        setArtistFilter([])
        setAuthorFilter([])
        setTeamFilter([])
        setWishlistOnlyFilter(false)
        setOwnedOnlyFilter(false)
        setFilterResetKey((key) => key + 1)
    }

    const filterPanel = (
        <ThemeProvider theme={darkTheme}>
            <div className="w-full p-[2rem]">
                <span className="w-full flex justify-center items-center text-center p-2.5 font-semibold text-gray-300 uppercase tracking-wider">
                    Filter Books
                </span>
                <input
                    className="w-full mt-3 bg-[#3f4a58] border border-gray-500 rounded px-3 py-2 text-[1.4rem] text-white 
                            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                    type="text"
                    placeholder="Search title..."
                    value={titleSearch}
                    onChange={(e) => setTitleSearch(e.target.value)}
                />
                {isAuthenticated && (
                    <div className="flex flex-row mt-2 text-white font-bold">
                        <FormControlLabel
                            sx={{
                                "& .MuiFormControlLabel-label": {
                                    fontSize: "1.5rem",
                                },
                            }}
                            control={
                                <Switch
                                    checked={wishlistOnlyFilter}
                                    onChange={(e) =>
                                        setWishlistOnlyFilter(e.target.checked)
                                    }
                                    color="primary"
                                />
                            }
                            label="Wishlist"
                        />
                        <FormControlLabel
                            sx={{
                                "& .MuiFormControlLabel-label": {
                                    fontSize: "1.5rem",
                                },
                            }}
                            control={
                                <Switch
                                    checked={ownedOnlyFilter}
                                    onChange={(e) =>
                                        setOwnedOnlyFilter(e.target.checked)
                                    }
                                    color="primary"
                                />
                            }
                            label="Owned"
                        />
                    </div>
                )}
                <ul className="list-none p-0">
                    <FormatsMultiSelector
                        key={`format-${filterResetKey}`}
                        setFormats={setFormatFilter}
                        initialFormatIds={(formatFilter ?? []).map((f) => f.id)}
                    />
                    <PublishersMultiSelector
                        key={`publishers-${filterResetKey}`}
                        setPublishers={setPublisherFilter}
                        initialPublisherIds={publisherFilter.map((p) => p.id)}
                    />
                    <CharactersMultiSelector
                        key={`characters-${filterResetKey}`}
                        setCharacters={setCharacterFilter}
                        initialCharacterIds={characterFilter.map((c) => c.id)}
                    />
                    <TeamsMultiSelector
                        key={`teams-${filterResetKey}`}
                        setTeams={setTeamFilter}
                        initialTeamIds={teamFilter.map((t) => t.id)}
                    />
                    <AuthorsSelector
                        key={`authors-${filterResetKey}`}
                        setAuthors={setAuthorFilter}
                        initialAuthorIds={authorFilter.map((a) => a.id)}
                    />
                    <ArtistsSelector
                        key={`artists-${filterResetKey}`}
                        setArtists={setArtistFilter}
                        initialArtistIds={artistFilter.map((a) => a.id)}
                    />
                </ul>
                <button
                    className="w-full mt-3 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors font-semibold text-[1.4rem]"
                    onClick={clearFilters}
                >
                    Clear Filters
                </button>
            </div>
        </ThemeProvider>
    )

    return (
        <>
            {dwModalOpen && selectedBook && (
                <DunneWebModal onClose={() => setDwModalOpen(false)}>
                    <BookModalContent
                        book={selectedBook}
                        setDwModalOpen={setDwModalOpen}
                    />
                </DunneWebModal>
            )}

            <div
                id="admin-main-container"
                className="flex w-full h-full"
            >
                <SidePanel
                    open={filterOpen}
                    onClose={() => setFilterOpen(false)}
                    closeAriaLabel="Close filters"
                >
                    {filterPanel}
                </SidePanel>

                {/* Mobile: floating filter button — hidden on desktop */}
                {!filterOpen && (
                    <FloatingMenuButton
                        onClick={() => setFilterOpen(true)}
                        ariaLabel="Open filters"
                        icon={
                            <FilterListIcon
                                sx={{ color: "white", fontSize: "2.8em" }}
                            />
                        }
                    />
                )}

                {/* Main content */}
                <div className="flex flex-col items-center w-full md:flex-1 h-[calc(100dvh-6rem)] pt-5 md:pr-[1.5rem]">
                    <h4 className="text-center mb-4 font-semibold text-[3rem]">
                        Comics
                    </h4>
                    <div
                        ref={scrollContainerRef}
                        className="w-full overflow-y-scroll h-full md:visible-scrollbar"
                    >
                        <div className="flex justify-center items-start flex-row flex-wrap">
                            {books.map(renderBook)}
                        </div>
                        {!loading && books.length === 0 && (
                            <div className="text-center text-[2.4rem] text-gray-400 py-8">
                                No books found.
                            </div>
                        )}
                        <div
                            ref={sentinelRef}
                            className="h-1"
                        />
                        {loading && (
                            <div className="text-center text-[2.4rem] text-gray-400 py-4">
                                Loading...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = (state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    allFormats: state.comics.allFormats,
    shouldReloadBooks: state.comics.shouldReloadBooks,
})

export default connect(mapStateToProps, { getAllFormats })(ComicsPage)

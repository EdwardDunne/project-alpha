import React, { useEffect, useMemo, useRef, useState } from "react"
import { ThemeProvider } from "@mui/material"
import Button from "@mui/material/Button"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import DunneWebModal from "../modals/DunneWebModal"
import FloatingMenuButton from "../components/FloatingMenuButton"
import SidePanel from "../components/SidePanel"
import PublishersMultiSelector from "../components/PublishersMultiSelector"
import CharactersMultiSelector from "../components/CharactersMultiSelector"
import TeamsMultiSelector from "../components/TeamsMultiSelector"
import AuthorsSelector from "../components/AuthorsSelector"
import ArtistsSelector from "../components/ArtistsSelector"
import FormatsMultiSelector from "../components/FormatsMultiSelector"
import AddEditBookModalContent from "../modals/dwModalContent/AddEditBookModalContent"
import ManagePublishersModalContent from "../modals/dwModalContent/ManagePublishersModalContent"
import ManageCharactersModalContent from "../modals/dwModalContent/ManageCharactersModalContent"
import ManageAuthorsModalContent from "../modals/dwModalContent/ManageAuthorsModalContent"
import ManageArtistsModalContent from "../modals/dwModalContent/ManageArtistsModalContent"
import ManageFormatsModalContent from "../modals/dwModalContent/ManageFormatsModalContent"
import ManageSubCategoriesModalContent from "../modals/dwModalContent/ManageSubCategoriesModalContent"
import ManageTeamsModalContent from "../modals/dwModalContent/ManageTeamsModalContent"
import { darkTheme } from "../App"
import {
    type Book,
    Character,
    Publisher,
    Artist,
    Author,
    Team,
    Format,
} from "types"
import { useDebounce } from "../hooks/useDebounce"
import { usePaginatedBooks } from "../hooks/usePaginatedBooks"
import { usePersistedState } from "../hooks/usePersistedState"
import { BooksPageFilters } from "../actions/comics"

const ComicsAdmin: React.FC = () => {
    const [selectedBook, setSelectedBook] = useState<Book | null>(null)
    const [dwModalOpen, setDwModalOpen] = useState(false)
    const [dwModalType, setDwModalType] = useState("book")
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const [filtersOpen, setFiltersOpen] = useState(false)
    const [filterResetKey, setFilterResetKey] = useState(0)

    const [titleSearch, setTitleSearch] = usePersistedState(
        "comics-admin:titleSearch",
        "",
    )
    const [characterFilter, setCharacterFilter] = usePersistedState<
        Character[]
    >("comics-admin:characterFilter", [])
    const [publisherFilter, setPublisherFilter] = usePersistedState<
        Publisher[]
    >("comics-admin:publisherFilter", [])
    const [artistFilter, setArtistFilter] = usePersistedState<Artist[]>(
        "comics-admin:artistFilter",
        [],
    )
    const [authorFilter, setAuthorFilter] = usePersistedState<Author[]>(
        "comics-admin:authorFilter",
        [],
    )
    const [teamFilter, setTeamFilter] = usePersistedState<Team[]>(
        "comics-admin:teamFilter",
        [],
    )
    const [formatFilter, setFormatFilter] = usePersistedState<Format[]>(
        "comics-admin:formatFilter",
        [],
    )

    const debouncedTitleSearch = useDebounce(titleSearch)
    const debouncedPublisherFilter = useDebounce(publisherFilter)
    const debouncedFormatFilter = useDebounce(formatFilter)
    const debouncedCharacterFilter = useDebounce(characterFilter)
    const debouncedArtistFilter = useDebounce(artistFilter)
    const debouncedAuthorFilter = useDebounce(authorFilter)
    const debouncedTeamFilter = useDebounce(teamFilter)

    const scrollContainerRef = useRef<HTMLDivElement | null>(null)

    const filters: BooksPageFilters = useMemo(
        () => ({
            title: debouncedTitleSearch || undefined,
            publisherIds: debouncedPublisherFilter.map((p) => p.id),
            formatIds: debouncedFormatFilter.map((f) => f.id),
            characterIds: debouncedCharacterFilter.map((c) => c.id),
            artistIds: debouncedArtistFilter.map((a) => a.id),
            authorIds: debouncedAuthorFilter.map((a) => a.id),
            teamIds: debouncedTeamFilter.map((t) => t.id),
        }),
        [
            debouncedTitleSearch,
            debouncedPublisherFilter,
            debouncedFormatFilter,
            debouncedCharacterFilter,
            debouncedArtistFilter,
            debouncedAuthorFilter,
            debouncedTeamFilter,
        ],
    )

    const { books, loading, sentinelRef, reload } = usePaginatedBooks(
        "comics-admin",
        filters,
        scrollContainerRef,
    )

    // Jump back to the top of the list whenever the filters produce a new feed.
    useEffect(() => {
        scrollContainerRef.current?.scrollTo({ top: 0 })
    }, [filters])

    function displayBook(book: Book) {
        const thumbnail_url = book.thumbnail

        return (
            <div
                key={book.id}
                className="m-[0.5rem] w-full md:w-[70rem] border border-gray-200 rounded-[1rem]
                    flex justify-start cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => {
                    setDwModalOpen(true)
                    setDwModalType("book")
                    setSelectedBook(book)
                }}
            >
                <div className="flex justify-center items-center w-[30%]">
                    <img
                        src={`${thumbnail_url}`}
                        className="h-[20rem] object-contain my-4 rounded-[1rem]"
                        alt="..."
                    />
                </div>
                <div className="flex flex-col justify-center items-start w-[70%] p-4">
                    <h5 className="font-semibold mb-2">{book.title}</h5>
                    <div className="flex flex-col gap-1 text-[1.4rem] text-gray-600">
                        <span>
                            <b>Publisher</b>: {book.publisher_data?.name}
                        </span>
                        <span>
                            <b>Characters</b>:{" "}
                            {book.characters_data
                                ?.map((c) => c.name)
                                .join(", ")}
                        </span>
                        <span>
                            <b>Authors</b>:{" "}
                            {book.authors_data?.map((a) => a.name).join(", ")}
                        </span>
                        <span>
                            <b>Artists</b>:{" "}
                            {book.artists_data?.map((a) => a.name).join(", ")}
                        </span>
                        <span>
                            <b>Format</b>: {book.format_data?.name}
                        </span>
                        <span>
                            <b>Sub Category</b>: {book.sub_category_data?.name}
                        </span>
                        <span>
                            <b>Team</b>: {book.team_data?.name}
                        </span>
                        <span>
                            <b>Page Count</b>: {book.page_count}
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    const manageButtonSx = { margin: "0.2rem", fontSize: "1.4rem" }

    const clearFilters = () => {
        setPublisherFilter([])
        setFormatFilter([])
        setCharacterFilter([])
        setArtistFilter([])
        setAuthorFilter([])
        setTeamFilter([])
        setFilterResetKey((key) => key + 1)
    }

    const sidebarContent = (
        <div className="list-none text-white w-full p-[2rem] flex flex-col h-full">
            <span
                className="w-full flex justify-center items-center text-center p-2.5
                    font-semibold text-gray-300 uppercase tracking-wider"
            >
                Search
            </span>
            <input
                className="w-full mb-2 bg-[#3f4a58] border border-gray-500 rounded px-3 py-2 text-[1.4rem] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                type="text"
                placeholder="Search title..."
                value={titleSearch}
                onChange={(e) => setTitleSearch(e.target.value)}
            />

            <button
                className="w-full flex justify-center items-center gap-1 text-center p-2.5
                    font-semibold text-gray-300 uppercase tracking-wider"
                onClick={() => setFiltersOpen((open) => !open)}
            >
                Filters
                <ExpandMoreIcon
                    sx={{
                        fontSize: "2.2rem",
                        transform: filtersOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.2s",
                    }}
                />
            </button>
            {filtersOpen && (
                <ThemeProvider theme={darkTheme}>
                    <ul className="list-none p-0">
                        <FormatsMultiSelector
                            key={`format-${filterResetKey}`}
                            setFormats={setFormatFilter}
                            initialFormatIds={formatFilter.map((f) => f.id)}
                        />
                        <PublishersMultiSelector
                            key={`publishers-${filterResetKey}`}
                            setPublishers={setPublisherFilter}
                            initialPublisherIds={publisherFilter.map(
                                (p) => p.id,
                            )}
                        />
                        <CharactersMultiSelector
                            key={`characters-${filterResetKey}`}
                            setCharacters={setCharacterFilter}
                            initialCharacterIds={characterFilter.map(
                                (c) => c.id,
                            )}
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
                        className="w-full mt-3 mb-2 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors font-semibold text-[1.4rem]"
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </button>
                </ThemeProvider>
            )}

            <ul className="list-none p-0">
                <li
                    className="w-full flex justify-center items-center text-center p-2.5
                        font-semibold text-gray-300 uppercase tracking-wider"
                >
                    Actions
                </li>
            </ul>
            <div className="flex flex-col mt-2 gap-1 pb-4">
                {[
                    { label: "Add Book", type: "addBook" },
                    { label: "Manage Characters", type: "manageCharacters" },
                    { label: "Manage Teams", type: "manageTeams" },
                    { label: "Manage Authors", type: "manageAuthors" },
                    { label: "Manage Artists", type: "manageArtists" },
                    { label: "Manage Publishers", type: "managePublishers" },
                    { label: "Manage Formats", type: "manageFormats" },
                    {
                        label: "Manage Sub Categories",
                        type: "manageSubCategories",
                    },
                ].map(({ label, type }) => (
                    <Button
                        key={type}
                        variant="contained"
                        sx={manageButtonSx}
                        onClick={() => {
                            setDwModalOpen(true)
                            setDwModalType(type)
                            setSidebarOpen(false)
                        }}
                    >
                        {label}
                    </Button>
                ))}
            </div>
        </div>
    )

    return (
        <>
            {dwModalOpen && (
                <DunneWebModal onClose={() => setDwModalOpen(false)}>
                    {dwModalType === "book" && selectedBook ? (
                        <AddEditBookModalContent
                            book={selectedBook}
                            setDwModalOpen={setDwModalOpen}
                            onBookChanged={reload}
                        />
                    ) : dwModalType === "addBook" ? (
                        <AddEditBookModalContent
                            setDwModalOpen={setDwModalOpen}
                            onBookChanged={reload}
                        />
                    ) : dwModalType === "manageCharacters" ? (
                        <ManageCharactersModalContent onDataChanged={reload} />
                    ) : dwModalType === "managePublishers" ? (
                        <ManagePublishersModalContent onDataChanged={reload} />
                    ) : dwModalType === "manageAuthors" ? (
                        <ManageAuthorsModalContent onDataChanged={reload} />
                    ) : dwModalType === "manageArtists" ? (
                        <ManageArtistsModalContent onDataChanged={reload} />
                    ) : dwModalType === "manageFormats" ? (
                        <ManageFormatsModalContent onDataChanged={reload} />
                    ) : dwModalType === "manageSubCategories" ? (
                        <ManageSubCategoriesModalContent
                            onDataChanged={reload}
                        />
                    ) : dwModalType === "manageTeams" ? (
                        <ManageTeamsModalContent onDataChanged={reload} />
                    ) : (
                        ""
                    )}
                </DunneWebModal>
            )}

            <div className="flex w-full h-full">
                <SidePanel
                    open={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    closeAriaLabel="Close menu"
                >
                    {sidebarContent}
                </SidePanel>

                {/* Mobile: floating button */}
                {!sidebarOpen && (
                    <FloatingMenuButton
                        onClick={() => setSidebarOpen(true)}
                        ariaLabel="Open admin menu"
                    />
                )}

                {/* Main content */}
                <div className="w-full md:flex-1 md:pr-[1.5rem]">
                    <div className="h-[7rem] flex justify-center items-center">
                        <h4 className="font-semibold m-0 text-[3rem]">
                            Comics Admin
                        </h4>
                    </div>
                    <div
                        ref={scrollContainerRef}
                        className="flex flex-col items-center overflow-y-scroll h-[calc(100vh-13rem)] px-2 md:visible-scrollbar"
                    >
                        {books.map(displayBook)}
                        {!loading && books.length === 0 && (
                            <div className="text-center text-[1.4rem] text-gray-400 py-8">
                                No books found.
                            </div>
                        )}
                        <div
                            ref={sentinelRef}
                            className="h-1 w-full"
                        />
                        {loading && (
                            <div className="text-center text-[1.4rem] text-gray-400 py-4">
                                Loading...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ComicsAdmin

import React, { useEffect, useState } from "react"
import { getAllBooks } from "../actions/comics"
import { connect } from "react-redux"
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
import AddEditBookModalContent from "../modals/dwModalContant/AddEditBookModalContent"
import ManagePublishersModalContent from "../modals/dwModalContant/ManagePublishersModalContent"
import ManageCharactersModalContent from "../modals/dwModalContant/ManageCharactersModalContent"
import ManageAuthorsModalContent from "../modals/dwModalContant/ManageAuthorsModalContent"
import ManageArtistsModalContent from "../modals/dwModalContant/ManageArtistsModalContent"
import ManageFormatsModalContent from "../modals/dwModalContant/ManageFormatsModalContent"
import ManageSubCategoriesModalContent from "../modals/dwModalContant/ManageSubCategoriesModalContent"
import ManageTeamsModalContent from "../modals/dwModalContant/ManageTeamsModalContent"
import { RootState } from "../reducers"
import { darkTheme } from "../App"
import { type Book, Character, Publisher, Artist, Author, Team } from "types"
import { useDebounce } from "../hooks/useDebounce"

type Props = {
    getAllBooks: () => void
    allBooks: Book[]
}

const ComicsAdmin: React.FC<Props> = ({ getAllBooks, allBooks }) => {
    const [selectedBook, setSelectedBook] = useState<Book | null>(null)
    const [dwModalOpen, setDwModalOpen] = useState(false)
    const [dwModalType, setDwModalType] = useState("book")
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [titleSearch, setTitleSearch] = useState("")

    const [filtersOpen, setFiltersOpen] = useState(false)
    const [filterResetKey, setFilterResetKey] = useState(0)
    const [characterFilter, setCharacterFilter] = useState<Character[]>([])
    const [publisherFilter, setPublisherFilter] = useState<Publisher[]>([])
    const [artistFilter, setArtistFilter] = useState<Artist[]>([])
    const [authorFilter, setAuthorFilter] = useState<Author[]>([])
    const [teamFilter, setTeamFilter] = useState<Team[]>([])

    const debouncedTitleSearch = useDebounce(titleSearch)
    const debouncedPublisherFilter = useDebounce(publisherFilter)
    const debouncedCharacterFilter = useDebounce(characterFilter)
    const debouncedArtistFilter = useDebounce(artistFilter)
    const debouncedAuthorFilter = useDebounce(authorFilter)
    const debouncedTeamFilter = useDebounce(teamFilter)

    useEffect(() => {
        if (!allBooks.length) getAllBooks()
    }, [])

    function matchesFilters(book: Book) {
        const bookPublisher = book["publisher"]
        const bookCharacters = book["characters"] ?? []
        const bookArtists = book["artists"] ?? []
        const bookAuthors = book["authors"] ?? []
        const bookTeam = book["team"]

        return (
            (!debouncedPublisherFilter.length ||
                debouncedPublisherFilter.some((p) => p.id === bookPublisher)) &&
            (!debouncedCharacterFilter.length ||
                debouncedCharacterFilter.some((c) =>
                    bookCharacters.includes(c.id),
                )) &&
            (!debouncedArtistFilter.length ||
                debouncedArtistFilter.some((a) =>
                    bookArtists.includes(a.id),
                )) &&
            (!debouncedAuthorFilter.length ||
                debouncedAuthorFilter.some((a) =>
                    bookAuthors.includes(a.id),
                )) &&
            (!debouncedTeamFilter.length ||
                debouncedTeamFilter.some((t) => t.id === bookTeam)) &&
            (book.title ?? "")
                .toLowerCase()
                .includes(debouncedTitleSearch.toLowerCase())
        )
    }

    function displayBook(book: Book) {
        const thumbnail_url = book.thumbnail
            ? `${window.location.origin}${book.thumbnail}`
            : book.thumbnail_url

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
                            <b>Publisher</b>: {book.publisher_name}
                        </span>
                        <span>
                            <b>Characters</b>:{" "}
                            {book.character_names?.join(", ")}
                        </span>
                        <span>
                            <b>Authors</b>: {book.author_names?.join(", ")}
                        </span>
                        <span>
                            <b>Artists</b>: {book.artist_names?.join(", ")}
                        </span>
                        <span>
                            <b>Format</b>: {book.format_name}
                        </span>
                        <span>
                            <b>Sub Category</b>: {book.sub_category_name}
                        </span>
                        <span>
                            <b>Team</b>: {book.team_name}
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

    const filteredBooks = allBooks.filter(matchesFilters)

    const clearFilters = () => {
        setPublisherFilter([])
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
            <div className="flex flex-col mt-2 gap-1">
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
                        />
                    ) : dwModalType === "addBook" ? (
                        <AddEditBookModalContent
                            setDwModalOpen={setDwModalOpen}
                        />
                    ) : dwModalType === "manageCharacters" ? (
                        <ManageCharactersModalContent
                            setDwModalOpen={setDwModalOpen}
                        />
                    ) : dwModalType === "managePublishers" ? (
                        <ManagePublishersModalContent
                            setDwModalOpen={setDwModalOpen}
                        />
                    ) : dwModalType === "manageAuthors" ? (
                        <ManageAuthorsModalContent
                            setDwModalOpen={setDwModalOpen}
                        />
                    ) : dwModalType === "manageArtists" ? (
                        <ManageArtistsModalContent
                            setDwModalOpen={setDwModalOpen}
                        />
                    ) : dwModalType === "manageFormats" ? (
                        <ManageFormatsModalContent
                            setDwModalOpen={setDwModalOpen}
                        />
                    ) : dwModalType === "manageSubCategories" ? (
                        <ManageSubCategoriesModalContent
                            setDwModalOpen={setDwModalOpen}
                        />
                    ) : dwModalType === "manageTeams" ? (
                        <ManageTeamsModalContent
                            setDwModalOpen={setDwModalOpen}
                        />
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
                <div className="w-full md:flex-1">
                    <div className="h-[7rem] flex justify-center items-center">
                        <h4 className="font-semibold m-0 text-[3rem]">
                            Comics Admin
                        </h4>
                    </div>
                    <div className="flex flex-col items-center overflow-y-scroll h-[calc(100vh-20rem)] px-2">
                        {filteredBooks.map(displayBook)}
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = (state: RootState) => ({
    allBooks: state.comics.all_books,
})

export default connect(mapStateToProps, {
    getAllBooks,
})(ComicsAdmin)

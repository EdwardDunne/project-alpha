import React, { useEffect, useState } from "react"
import { getAllBooks } from "../actions/comics"
import { connect } from "react-redux"
import { ThemeProvider } from "@mui/material"
import { darkTheme } from "../App"
import PublishersMultiSelector from "../components/PublishersMultiSelector"
import CharactersMultiSelector from "../components/CharactersMultiSelector"
import ArtistsSelector from "../components/ArtistsSelector"
import AuthorsSelector from "../components/AuthorsSelector"
import TeamsMultiSelector from "../components/TeamsMultiSelector"
import DunneWebModal from "../modals/DunneWebModal"
import FloatingMenuButton from "../components/FloatingMenuButton"
import FilterListIcon from "@mui/icons-material/FilterList"
import SidePanel from "../components/SidePanel"
import { Book, Character, Publisher, Artist, Author, Team } from "../types"
import { RootState } from "../reducers"
import BookModalContent from "modals/dwModalContant/BookModalContent"
import { useDebounce } from "../hooks/useDebounce"

interface Props {
    getAllBooks: () => void
    allBooks: Book[]
}

const ComicsPage: React.FC<Props> = ({ getAllBooks, allBooks }) => {
    const [characterFilter, setCharacterFilter] = useState<Character[]>([])
    const [publisherFilter, setPublisherFilter] = useState<Publisher[]>([])
    const [artistFilter, setArtistFilter] = useState<Artist[]>([])
    const [authorFilter, setAuthorFilter] = useState<Author[]>([])
    const [teamFilter, setTeamFilter] = useState<Team[]>([])
    const [dwModalOpen, setDwModalOpen] = useState(false)
    const [selectedBook, setSelectedBook] = useState<Book | null>(null)
    const [filterOpen, setFilterOpen] = useState(false)
    const [titleSearch, setTitleSearch] = useState("")
    const [filterResetKey, setFilterResetKey] = useState(0)

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

    function renderBook(book: Book) {
        return (
            <div
                key={book.id}
                className="m-[0.5rem] w-[calc(50%-1rem)] sm:w-[calc(33.33%-1rem)] md:w-[20rem] cursor-pointer"
                onClick={() => {
                    setSelectedBook(book)
                    setDwModalOpen(true)
                }}
            >
                <div className="flex-none">
                    <img
                        className="rounded-[1rem] w-full md:w-48"
                        src={`${window.location.origin}${book.thumbnail}`}
                        alt={book.title}
                    />
                </div>
                <div className="h-12 overflow-hidden text-ellipsis text-center text-[1.4rem] mt-1">
                    {book.title}
                </div>
            </div>
        )
    }

    const clearFilters = () => {
        setTitleSearch("")
        setPublisherFilter([])
        setCharacterFilter([])
        setArtistFilter([])
        setAuthorFilter([])
        setTeamFilter([])
        setFilterResetKey((key) => key + 1)
    }

    const filterPanel = (
        <ThemeProvider theme={darkTheme}>
            <div className="w-full p-[2rem]">
                <span className="w-full flex justify-center items-center text-center p-2.5 font-semibold text-gray-300 uppercase tracking-wider">
                    Filter Books
                </span>
                <input
                    className="w-full mt-3 bg-[#3f4a58] border border-gray-500 rounded px-3 py-2 text-[1.4rem] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                    type="text"
                    placeholder="Search title..."
                    value={titleSearch}
                    onChange={(e) => setTitleSearch(e.target.value)}
                />
                <ul className="list-none p-0">
                    <PublishersMultiSelector
                        key={`publishers-${filterResetKey}`}
                        setPublishers={setPublisherFilter}
                    />
                    <CharactersMultiSelector
                        key={`characters-${filterResetKey}`}
                        setCharacters={setCharacterFilter}
                    />
                    <TeamsMultiSelector
                        key={`teams-${filterResetKey}`}
                        setTeams={setTeamFilter}
                    />
                    <AuthorsSelector
                        key={`authors-${filterResetKey}`}
                        setAuthors={setAuthorFilter}
                    />
                    <ArtistsSelector
                        key={`artists-${filterResetKey}`}
                        setArtists={setArtistFilter}
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
                <div className="flex flex-col items-center w-full md:flex-1 h-[calc(100dvh-6rem)] pt-5">
                    <h4 className="text-center mb-4 font-semibold text-[3rem]">
                        Comics
                    </h4>
                    <div className="w-full px-4 overflow-y-scroll h-full">
                        <div className="flex justify-center items-center flex-row flex-wrap">
                            {allBooks.filter(matchesFilters).map(renderBook)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = (state: RootState) => ({
    allBooks: state.comics.all_books,
})

export default connect(mapStateToProps, { getAllBooks })(ComicsPage)

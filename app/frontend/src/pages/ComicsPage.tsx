import React, { useEffect, useState } from "react"
import { getAllBooks } from "../actions/comics"
import { connect } from "react-redux"
import { ThemeProvider } from "@mui/material"
import { darkTheme } from "../App"
import PublishersSelector from "../components/PublishersSelector"
import CharactersSelector from "../components/CharactersSelector"
import DunneWebModal from "../modals/DunneWebModal"
import FloatingMenuButton from "../components/FloatingMenuButton"
import FilterAltIcon from "@mui/icons-material/FilterAlt"
import FilterListIcon from "@mui/icons-material/FilterList"
import SidePanel from "../components/SidePanel"
import { Book, Character, Publisher } from "../types"
import { RootState } from "../reducers"
import BookModalContent from "modals/dwModalContant/BookModalContent"

interface Props {
    getAllBooks: () => void
    allBooks: Book[]
}

const ComicsPage: React.FC<Props> = ({ getAllBooks, allBooks }) => {
    const [books, setBooks] = useState<Book[]>([])
    const [characterFilter, setCharacterFilter] = useState<Character | null>(
        null,
    )
    const [publisherFilter, setPublisherFilter] = useState<Publisher | null>(
        null,
    )
    const [dwModalOpen, setDwModalOpen] = useState(false)
    const [selectedBook, setSelectedBook] = useState<Book>({} as Book)
    const [filterOpen, setFilterOpen] = useState(false)

    useEffect(() => {
        allBooks.length ? setBooks(allBooks) : getAllBooks()
    }, [])

    useEffect(() => {
        setBooks(allBooks)
    }, [allBooks])

    function getDisplayedBooks(book: Book, i: number) {
        const bookPublisher = book["publisher"]
        const bookCharacters = book["characters"] ?? []

        if (
            (!publisherFilter || bookPublisher === publisherFilter["id"]) &&
            (!characterFilter || bookCharacters.includes(characterFilter["id"]))
        ) {
            return (
                <div
                    key={i}
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
    }

    const filterPanel = (
        <ThemeProvider theme={darkTheme}>
            <div className="w-full p-[2rem]">
                <span className="w-full flex justify-center items-center text-center p-2.5 font-semibold text-gray-300 uppercase tracking-wider">
                    Filter Books
                </span>
                <ul className="list-none p-0">
                    <PublishersSelector setPublisher={setPublisherFilter} />
                    <CharactersSelector setCharacter={setCharacterFilter} />
                </ul>
            </div>
        </ThemeProvider>
    )

    return (
        <>
            {dwModalOpen && (
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
                            {books.map((book, i) => getDisplayedBooks(book, i))}
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

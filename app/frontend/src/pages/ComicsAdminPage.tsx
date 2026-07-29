import React, { useEffect, useState } from "react"
import {
    getAllBooks,
    scrape_dc_omnis_panel_bound,
} from "../actions/comics"
import { connect } from "react-redux"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import ToggleButton from "@mui/material/ToggleButton"
import Button from "@mui/material/Button"
import DunneWebModal from "../modals/DunneWebModal"
import FloatingMenuButton from "../components/FloatingMenuButton"
import SidePanel from "../components/SidePanel"
import AddEditBookModalContent from "../modals/dwModalContant/AddEditBookModalContent"
import AddPublisherModalContent from "../modals/dwModalContant/AddPublisherModalContent"
import AddCharacterModalContent from "../modals/dwModalContant/AddCharacterModalContent"
import { RootState } from "../reducers"
import { type Book } from "types"
import { ScrapedBooksPage } from "reducers/comics"

type Props = {
    getAllBooks: () => void
    scrape_dc_omnis_panel_bound: (nextPageUrlPbWalts?: string) => void
    pbDcScrapeResponse: ScrapedBooksPage
    allBooks: Book[]
}

const ComicsAdmin: React.FC<Props> = ({
    getAllBooks,
    scrape_dc_omnis_panel_bound,
    pbDcScrapeResponse,
    allBooks,
}) => {
    const [displayedBooks, setDisplayedBooks] = useState<Book[]>([])
    const [selectedResultSet, setselectedResultSet] = useState("dunneweb-db")

    const [selectedBook, setSelectedBook] = useState<Book>({} as Book)
    const [dwModalOpen, setDwModalOpen] = useState(false)
    const [dwModalType, setDwModalType] = useState("book")
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const [prevPageUrlDcPb, setPrevPageUrlDcPb] = useState<string>("")
    const [nextPageUrlDcPb, setNextPageUrlDcPb] = useState<string>("")

    useEffect(() => {
        allBooks.length ? handleChange(selectedResultSet) : getAllBooks()
    }, [])

    useEffect(() => {
        setDisplayedBooks(allBooks)
    }, [allBooks])

    useEffect(() => {
        if (selectedResultSet === "dc-pb") {
            setDisplayedBooks(
                [...pbDcScrapeResponse.books].sort((a, b) =>
                    a.title.localeCompare(b.title),
                ),
            )
        }

        setPrevPageUrlDcPb(nextPageUrlDcPb)
        setNextPageUrlDcPb(pbDcScrapeResponse.nextPageUrl)
    }, [pbDcScrapeResponse])

    const scrapeDComnisPB = (e: React.MouseEvent) => {
        e.preventDefault()
        scrape_dc_omnis_panel_bound()
    }

    const getNewPageDcPB = (nextPageUrl: string) => {
        scrape_dc_omnis_panel_bound(nextPageUrl)
    }

    const handleChange = (event) => {
        const tab = event?.target?.value ?? "dunneweb-db"
        setselectedResultSet(tab)
        setDisplayedBooks(tab === "dc-pb" ? pbDcScrapeResponse.books : allBooks)
    }

    function displayBook(book: Book, i: number, omniListType: string) {
        console.log(book)
        let title = ""
        let thumbnail_url = `${window.location.origin}${book.thumbnail}`
        switch (omniListType) {
            case "marvelApi":
                title = book.title
                break
            case "dcScraped":
                title = book.title
                thumbnail_url = book.thumbnail_url
                break
        }

        return (
            <div
                key={i}
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
                    <h5 className="font-semibold mb-2">{title}</h5>
                    <div className="flex flex-col gap-1 text-[1.4rem] text-gray-600">
                        <span>
                            <b>Publisher</b>: {book.publisher_name}
                        </span>
                        <span>
                            <b>Character</b>: {book.character_name}
                        </span>
                        <span>
                            <b>Author</b>: {book.author}
                        </span>
                        <span>
                            <b>Page Count</b>: {book.page_count}
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    const addBtn = "mx-[0.5rem] bg-brand hover:bg-brand-dark"

    const sidebarContent = (
        <div className="list-none text-white w-full p-[2rem] flex flex-col h-full">
            <ul className="list-none p-0">
                <li
                    className="w-full flex justify-center items-center text-center p-2.5
                        font-semibold text-gray-300 uppercase tracking-wider"
                >
                    Actions
                </li>
                {[
                    {
                        label: "Scrape DC Omnis - Panel Bound",
                        handler: scrapeDComnisPB,
                    },
                ].map(({ label, handler }) => (
                    <li
                        key={label}
                        className="p-2.5"
                        onClick={(e) => {
                            handler(e as React.MouseEvent)
                            setSidebarOpen(false)
                        }}
                    >
                        <a
                            href="#"
                            className="text-white no-underline hover:text-gray-300
                            transition-colors text-[1.4rem]"
                        >
                            {label}
                        </a>
                    </li>
                ))}
            </ul>
            <div className="flex flex-col mt-2 gap-1">
                {[
                    { label: "Add Book", type: "addBook" },
                    { label: "Add Character", type: "addCharacter" },
                    { label: "Add Publisher", type: "addPublisher" },
                ].map(({ label, type }) => (
                    <Button
                        key={type}
                        className={addBtn}
                        sx={{
                            backgroundColor: "#536de6",
                            "&:hover": { backgroundColor: "#4558c2" },
                            margin: "0.2rem",
                            fontSize: "1.4rem",
                        }}
                        variant="contained"
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

    const pagination = () => {
        return (
            <div className="w-full md:w-[70rem] flex items-center justify-end">
                {prevPageUrlDcPb && (
                    <Button
                        className={addBtn}
                        sx={{
                            backgroundColor: "#536de6",
                            "&:hover": {
                                backgroundColor: "#4558c2",
                            },
                            margin: "0.2rem",
                            fontSize: "1.4rem",
                        }}
                        variant="contained"
                        onClick={() => {
                            getNewPageDcPB(prevPageUrlDcPb)
                        }}
                    >
                        Back
                    </Button>
                )}
                {nextPageUrlDcPb && (
                    <Button
                        className={addBtn}
                        sx={{
                            backgroundColor: "#536de6",
                            "&:hover": {
                                backgroundColor: "#4558c2",
                            },
                            margin: "0.2rem",
                            fontSize: "1.4rem",
                        }}
                        variant="contained"
                        onClick={() => {
                            getNewPageDcPB(nextPageUrlDcPb)
                        }}
                    >
                        Next
                    </Button>
                )}
            </div>
        )
    }

    return (
        <>
            {dwModalOpen && (
                <DunneWebModal onClose={() => setDwModalOpen(false)}>
                    {dwModalType === "book" ? (
                        <AddEditBookModalContent
                            book={selectedBook}
                            setDwModalOpen={setDwModalOpen}
                        />
                    ) : dwModalType === "addBook" ? (
                        <AddEditBookModalContent setDwModalOpen={setDwModalOpen} />
                    ) : dwModalType === "addCharacter" ? (
                        <AddCharacterModalContent
                            setDwModalOpen={setDwModalOpen}
                        />
                    ) : dwModalType === "addPublisher" ? (
                        <AddPublisherModalContent
                            setDwModalOpen={setDwModalOpen}
                        />
                    ) : (
                        ""
                    )}
                </DunneWebModal>
            )}

            <div className="flex w-full h-full">
                <SidePanel open={sidebarOpen} onClose={() => setSidebarOpen(false)} closeAriaLabel="Close menu">
                    {sidebarContent}
                </SidePanel>

                {/* Mobile: floating button */}
                {!sidebarOpen && (
                    <FloatingMenuButton onClick={() => setSidebarOpen(true)} ariaLabel="Open admin menu" />
                )}

                {/* Main content */}
                <div className="w-full md:flex-1">
                    <div className="h-[7rem] flex justify-center items-center">
                        <h4 className="font-semibold m-0 text-[3rem]">
                            Comics Admin
                        </h4>
                    </div>
                    <div className="flex justify-center items-center mb-4 overflow-x-auto px-2">
                        <ToggleButtonGroup
                            color="primary"
                            value={selectedResultSet}
                            onChange={handleChange}
                            sx={{
                                "& .MuiToggleButton-root": {
                                    fontSize: "1.4rem",
                                },
                            }}
                        >
                            <ToggleButton value="dunneweb-db">
                                Omni Trackers
                            </ToggleButton>
                            <ToggleButton value="dc-pb">
                                DC Panel Bound
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                    <div className="flex flex-col items-center overflow-y-scroll h-[calc(100vh-20rem)] px-2">
                        {pagination()}
                        {displayedBooks.map((book, i) =>
                            displayBook(
                                book,
                                i,
                                selectedResultSet === "dunneweb-db"
                                    ? "marvelApi"
                                    : "dcScraped",
                            ),
                        )}
                        {pagination()}
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = (state: RootState) => ({
    pbDcScrapeResponse: state.comics.pbDcScrapeResponse,
    allBooks: state.comics.all_books,
})

export default connect(mapStateToProps, {
    scrape_dc_omnis_panel_bound,
    getAllBooks,
})(ComicsAdmin)

import React, { useEffect, useState } from "react"
import {
    get_marvel_omnis,
    getAllBooks,
    scrape_dc_omnis_walts,
    scrape_dc_omnis_panel_bound,
    scrape_marvel_omnis,
} from "../actions/comics"
import { connect } from "react-redux"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import ToggleButton from "@mui/material/ToggleButton"
import Button from "@mui/material/Button"
import DunneWebModal from "../modals/DunneWebModal"
import AddBookModalContent from "../modals/dwModalContant/AddBookModalContent"
import AddPublisherModalContent from "../modals/dwModalContant/AddPublisherModalContent"
import AddCharacterModalContent from "../modals/dwModalContant/AddCharacterModalContent"
import { RootState } from "../reducers"
import { type Book } from "types"
import BookModalContent from "modals/dwModalContant/BookModalContent"
import { ScrapedBooksPage } from "reducers/comics"

type Props = {
    get_marvel_omnis: () => void
    marvel_api_comics: Book[]
    scrape_dc_omnis_walts: (nextPageUrlDcWalts?: string) => void
    scrape_dc_omnis_panel_bound: (nextPageUrlPbWalts?: string) => void
    scrape_marvel_omnis: () => void
    waltsDcScrapeResponse: ScrapedBooksPage
    pbDcScrapeResponse: ScrapedBooksPage
    marvel_scraped_comics: Book[]
    allBooks: Book[]
    getAllBooks: () => void
}

const ComicsAdmin: React.FC<Props> = ({
    get_marvel_omnis,
    marvel_api_comics,
    scrape_dc_omnis_walts,
    scrape_dc_omnis_panel_bound,
    scrape_marvel_omnis,
    waltsDcScrapeResponse,
    pbDcScrapeResponse,
    marvel_scraped_comics,
    allBooks,
    getAllBooks,
}) => {
    const [displayedBooks, setDisplayedBooks] = useState<Book[]>([])
    const [selectedResultSet, setselectedResultSet] = useState("dunneweb-db")

    const [selectedBook, setSelectedBook] = useState<Book>({} as Book)
    const [dwModalOpen, setDwModalOpen] = useState(false)
    const [dwModalType, setDwModalType] = useState("book")
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const [prevPageUrlDcWalts, setPrevPageUrlDcWalts] = useState<string>("")
    const [nextPageUrlDcWalts, setNextPageUrlDcWalts] = useState<string>("")
    const [prevPageUrlDcPb, setPrevPageUrlDcPb] = useState<string>("")
    const [nextPageUrlDcPb, setNextPageUrlDcPb] = useState<string>("")

    useEffect(() => {
        allBooks.length ? handleChange(selectedResultSet) : getAllBooks()
    }, [])

    useEffect(() => {
        setDisplayedBooks(allBooks)
    }, [allBooks])

    useEffect(() => {
        if (selectedResultSet === "dc-walts") {
            setDisplayedBooks(
                [...waltsDcScrapeResponse.books].sort((a, b) =>
                    a.title.localeCompare(b.title),
                ),
            )
        } else if (selectedResultSet === "dc-pb") {
            setDisplayedBooks(
                [...pbDcScrapeResponse.books].sort((a, b) =>
                    a.title.localeCompare(b.title),
                ),
            )
        }

        setPrevPageUrlDcWalts(nextPageUrlDcWalts)
        setNextPageUrlDcWalts(waltsDcScrapeResponse.nextPageUrl)
    }, [waltsDcScrapeResponse])

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

    useEffect(() => {
        if (selectedResultSet === "marvel-walts")
            setDisplayedBooks(marvel_scraped_comics)
    }, [marvel_scraped_comics])

    useEffect(() => {
        if (selectedResultSet === "marvel-api")
            setDisplayedBooks(marvel_api_comics)
    }, [marvel_api_comics])

    const getMarvelOmnis = (e: React.MouseEvent) => {
        e.preventDefault()
        get_marvel_omnis()
    }

    const scrapeDComnisWalts = (e: React.MouseEvent) => {
        e.preventDefault()
        scrape_dc_omnis_walts()
    }

    const getNewPageDcWalts = (nextPageUrl: string) => {
        scrape_dc_omnis_walts(nextPageUrl)
    }

    const scrapeDComnisPB = (e: React.MouseEvent) => {
        e.preventDefault()
        scrape_dc_omnis_panel_bound()
    }

    const getNewPageDcPB = (nextPageUrl: string) => {
        scrape_dc_omnis_panel_bound(nextPageUrl)
    }

    const scrapeMarvelOmnis = (e: React.MouseEvent) => {
        e.preventDefault()
        scrape_marvel_omnis()
    }

    const handleChange = (event) => {
        const tab = event?.target?.value ?? "dunneweb-db"
        setselectedResultSet(tab)
        setDisplayedBooks(
            tab === "dunneweb-db"
                ? allBooks
                : tab === "dc-pb"
                  ? pbDcScrapeResponse.books
                  : tab === "dc-walts"
                    ? waltsDcScrapeResponse.books
                    : tab === "marvel-walts"
                      ? marvel_scraped_comics
                      : marvel_scraped_comics,
        )
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
            case "marvelScraped":
                title = book.title
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
                    { label: "Get Marvel Omnis", handler: getMarvelOmnis },
                    {
                        label: "Scrape DC Omnis - Walts",
                        handler: scrapeDComnisWalts,
                    },
                    {
                        label: "Scrape DC Omnis - Panel Bound",
                        handler: scrapeDComnisPB,
                    },
                    {
                        label: "Scrape Marvel Omnis",
                        handler: scrapeMarvelOmnis,
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
                {prevPageUrlDcWalts && (
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
                            getNewPageDcWalts(prevPageUrlDcWalts)
                        }}
                    >
                        Back
                    </Button>
                )}
                {nextPageUrlDcWalts && (
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
                            getNewPageDcWalts(nextPageUrlDcWalts)
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
                        <BookModalContent
                            book={selectedBook}
                            setDwModalOpen={setDwModalOpen}
                        />
                    ) : dwModalType === "addBook" ? (
                        <AddBookModalContent setDwModalOpen={setDwModalOpen} />
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
                {/* Desktop sidebar */}
                <div
                    className="hidden md:flex w-[30rem] h-[41rem] fixed 
                        p-0 bg-[#313a46] m-[2rem] rounded-[0.5rem]"
                >
                    {sidebarContent}
                </div>

                {/* Mobile: floating button */}
                <button
                    className="md:hidden fixed bottom-8 right-8 z-50 w-14 h-14 bg-brand 
                    text-white rounded-full shadow-lg flex items-center 
                    justify-center text-[2.4rem] leading-none"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open admin menu"
                >
                    ☰
                </button>

                {/* Mobile: backdrop */}
                {sidebarOpen && (
                    <div
                        className="md:hidden fixed inset-0 bg-black/50 z-40"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Mobile: slide-in drawer */}
                <div
                    className={`md:hidden fixed top-0 left-0 h-full w-[30rem] max-w-[85vw] 
                    bg-[#313a46] z-50 transition-transform duration-300 
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <button
                        className="absolute top-4 right-4 text-white text-[2.4rem] leading-none z-10"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close menu"
                    >
                        ✕
                    </button>
                    {sidebarContent}
                </div>

                {/* Main content */}
                <div className="w-full md:w-[calc(100%-31.5rem)] md:ml-[31.5rem]">
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
                            <ToggleButton value="dc-walts">
                                DC Walts
                            </ToggleButton>
                            <ToggleButton value="marvel-walts">
                                Marvel Walts
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                    <div className="flex flex-col items-center overflow-y-scroll h-[calc(100vh-20rem)] px-2">
                        {selectedResultSet === "dc-walts" &&
                            `Scraped Books Count: ${displayedBooks.length}`}
                        {pagination()}
                        {displayedBooks.map((book, i) =>
                            displayBook(
                                book,
                                i,
                                selectedResultSet === "dunneweb-db"
                                    ? "marvelApi"
                                    : selectedResultSet === "dc-pb"
                                      ? "dcScraped"
                                      : selectedResultSet === "dc-walts"
                                        ? "dcScraped"
                                        : "marvelScraped",
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
    marvel_api_comics: state.comics.marvel_api_comics,
    waltsDcScrapeResponse: state.comics.waltsDcScrapeResponse,
    pbDcScrapeResponse: state.comics.pbDcScrapeResponse,
    marvel_scraped_comics: state.comics.marvel_scraped_comics,
    allBooks: state.comics.all_books,
})

export default connect(mapStateToProps, {
    get_marvel_omnis,
    scrape_dc_omnis_walts,
    scrape_dc_omnis_panel_bound,
    scrape_marvel_omnis,
    getAllBooks,
})(ComicsAdmin)

import React, { useEffect, useRef, useState } from "react"
import { connect } from "react-redux"
import {
    toggleWishlist,
    toggleOwned,
    getAllFormats,
    setShouldReloadBooks,
} from "../actions/comics"
import { usePaginatedBooks } from "../hooks/usePaginatedBooks"
import { useBookFilters } from "../hooks/useBookFilters"
import BookFilterFields, {
    TitleSearchInput,
} from "../components/BookFilterFields"
import DunneWebModal from "../modals/DunneWebModal"
import FloatingMenuButton from "../components/FloatingMenuButton"
import FilterListIcon from "@mui/icons-material/FilterList"
import SidePanel from "../components/SidePanel"
import { Book, Format } from "../types"
import BookModalContent from "modals/dwModalContent/BookModalContent"
import WishlistOwnedButtons from "../components/WishlistOwnedButtons"
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
    const bookFilters = useBookFilters("comics-public", {
        defaultFormatName: "Omnibus",
        allFormats,
    })
    const { filters, wishlistedOnly, ownedOnly } = bookFilters
    const [dwModalOpen, setDwModalOpen] = useState(false)
    const [selectedBook, setSelectedBook] = useState<Book | null>(null)
    const [filterOpen, setFilterOpen] = useState(false)

    const scrollContainerRef = useRef<HTMLDivElement | null>(null)

    // Bootstrap the format list (FormatsMultiSelector also does this itself,
    // but the hook needs it to resolve the "Omnibus" default).
    useEffect(() => {
        if (allFormats.length === 0) getAllFormats()
    }, [])

    const { books, loading, sentinelRef, updateBook, removeBook, reload } =
        usePaginatedBooks(
            "comics-public",
            filters,
            scrollContainerRef,
            bookFilters.ready,
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
        if (wishlistedOnly && ownedOnly) {
            return book.is_wishlisted || book.is_owned
        }
        if (wishlistedOnly) return !!book.is_wishlisted
        if (ownedOnly) return !!book.is_owned
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
        // Keep the open modal's copy of the book in sync
        setSelectedBook((prev) =>
            prev?.id === book.id ? { ...prev, is_wishlisted: result } : prev,
        )
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
        // Keep the open modal's copy of the book in sync
        setSelectedBook((prev) =>
            prev?.id === book.id ? { ...prev, is_owned: result } : prev,
        )
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
                        <WishlistOwnedButtons
                            book={book}
                            onToggleWishlist={handleToggleWishlist}
                            onToggleOwned={handleToggleOwned}
                            className="absolute top-2 right-2"
                        />
                    )}
                </div>
                <div className="h-fit text-ellipsis text-center text-[1.6rem] mt-1">
                    {book.title}
                </div>
            </div>
        )
    }

    const filterPanel = (
        <div className="w-full p-[2rem]">
            <span className="w-full flex justify-center items-center text-center p-2.5 font-semibold text-gray-300 uppercase tracking-wider">
                Filter Books
            </span>
            <TitleSearchInput bookFilters={bookFilters} className="mt-3" />
            <BookFilterFields
                bookFilters={bookFilters}
                showOwnershipToggles={!!isAuthenticated}
            />
        </div>
    )

    return (
        <>
            {dwModalOpen && selectedBook && (
                <DunneWebModal onClose={() => setDwModalOpen(false)}>
                    <BookModalContent
                        book={selectedBook}
                        setDwModalOpen={setDwModalOpen}
                        onToggleWishlist={
                            isAuthenticated ? handleToggleWishlist : undefined
                        }
                        onToggleOwned={
                            isAuthenticated ? handleToggleOwned : undefined
                        }
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

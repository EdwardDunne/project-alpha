import React, { useEffect, useState } from "react";
import { getAllBooks } from '../actions/comics';
import { connect } from 'react-redux';
import { ThemeProvider } from "@mui/material";
import { darkTheme } from "../App";
import PublishersSelector from "../components/PublishersSelector";
import CharactersSelector from "../components/CharactersSelector";
import DunneWebModal from "../modals/DunneWebModal";
import Book from "../modals/dwModalContant/Book";
import { Book as BookType, Character, Publisher } from '../types';
import { RootState } from "../reducers";

interface Props {
    getAllBooks: () => void;
    allBooks: BookType[];
}

const ComicsPage: React.FC<Props> = ({ getAllBooks, allBooks }) => {

    const [books, setBooks] = useState<BookType[]>([])
    const [characterFilter, setCharacterFilter] = useState<Character | null>(null)
    const [publisherFilter, setPublisherFilter] = useState<Publisher | null>(null)
    const [dwModalOpen, setDwModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<BookType>({} as BookType);
    const [filterOpen, setFilterOpen] = useState(false);

    useEffect(() => {
        allBooks.length ? setBooks(allBooks) : getAllBooks()
    }, [])

    useEffect(() => {
        setBooks(allBooks)
    }, [allBooks]);

    function getDisplayedBooks(book: BookType, i: number) {
        const bookPublisher = book['publisher']
        const bookCharacter = book['character']

        if (
            (!publisherFilter || bookPublisher === publisherFilter['id']) &&
            (!characterFilter || bookCharacter === characterFilter['id'])
        ) {
            return (
                <div
                    key={i}
                    className='m-[0.5rem] w-[calc(50%-1rem)] sm:w-[calc(33.33%-1rem)] md:w-[20rem] cursor-pointer'
                    onClick={() => {
                        setSelectedBook(book)
                        setDwModalOpen(true)
                    }}
                >
                    <div className='flex-none'>
                        <img
                            className='rounded-[1rem] w-full md:w-48'
                            src={`${window.location.origin}${book.thumbnail}`}
                            alt={book.title}
                        />
                    </div>
                    <div className='h-12 overflow-hidden text-ellipsis text-center text-[1.4rem] mt-1'>
                        {book.title}
                    </div>
                </div>
            )
        }
    }

    const filterPanel = (
        <ThemeProvider theme={darkTheme}>
            <div className="w-full p-[2rem]">
                <span className='w-full flex justify-center items-center text-center p-2.5 font-semibold text-gray-300 uppercase tracking-wider'>
                    Filter Books
                </span>
                <ul className='list-none p-0'>
                    <PublishersSelector setPublisher={setPublisherFilter}/>
                    <CharactersSelector setCharacter={setCharacterFilter}/>
                </ul>
            </div>
        </ThemeProvider>
    );

    return (
        <>
        {dwModalOpen &&
            <DunneWebModal onClose={() => setDwModalOpen(false)}>
                <Book book={selectedBook} setDwModalOpen={setDwModalOpen}/>
            </DunneWebModal>
        }

        <div id="admin-main-container" className='flex w-full h-full'>

            {/* Desktop sidebar — hidden on mobile */}
            <div className='hidden md:flex w-[30rem] h-[41rem] fixed p-0 bg-[#313a46] m-[2rem] rounded-[0.5rem]'>
                {filterPanel}
            </div>

            {/* Mobile: floating filter button — hidden on desktop */}
            <button
                className='md:hidden fixed bottom-8 right-8 z-50 w-14 h-14 bg-brand text-white rounded-full shadow-lg flex items-center justify-center text-[2.4rem] leading-none'
                onClick={() => setFilterOpen(true)}
                aria-label="Open filters"
            >
                ☰
            </button>

            {/* Mobile: backdrop */}
            {filterOpen && (
                <div
                    className='md:hidden fixed inset-0 bg-black/50 z-40'
                    onClick={() => setFilterOpen(false)}
                />
            )}

            {/* Mobile: slide-in drawer */}
            <div className={`md:hidden fixed top-0 left-0 h-full w-[32rem] max-w-[85vw] bg-[#313a46] z-50 transition-transform duration-300 ${filterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <button
                    className='absolute top-4 right-4 text-white text-[2.4rem] leading-none'
                    onClick={() => setFilterOpen(false)}
                    aria-label="Close filters"
                >
                    ✕
                </button>
                {filterPanel}
            </div>

            {/* Main content */}
            <div className='flex flex-col items-center w-full md:w-[calc(100%-31.5rem)] md:ml-[31.5rem] h-[calc(100dvh-6rem)] pt-5'>
                <h4 className='text-center mb-4 font-semibold text-[3rem]'>Comics</h4>
                <div className='w-full px-4 overflow-y-scroll h-full'>
                    <div className='flex justify-center items-center flex-row flex-wrap'>
                        {books.map((book, i) => getDisplayedBooks(book, i))}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

const mapStateToProps = (state: RootState) => ({
    allBooks: state.comics.all_books
})

export default connect(mapStateToProps, { getAllBooks })(ComicsPage)

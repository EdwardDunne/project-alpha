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

    if (window.location.hostname === 'dunneweb.com')
        window.location.href = 'omnitrackers.com/about'

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
                    className='m-[5px] w-[200px] cursor-pointer'
                    onClick={() => {
                        setSelectedBook(book)
                        setDwModalOpen(true)
                    }}
                >
                    <div className='flex-none'>
                        <img
                            className='rounded-[10px] w-48'
                            src={`${window.location.origin}${book.thumbnail}`}
                            alt={book.title}
                        />
                    </div>
                    <div className='h-12 overflow-hidden text-ellipsis text-center text-sm mt-1'>
                        {book.title}
                    </div>
                </div>
            )
        }
    }

    return (
        <>
        {dwModalOpen &&
            <DunneWebModal onClose={() => setDwModalOpen(false)}>
                <Book book={selectedBook} setDwModalOpen={setDwModalOpen}/>
            </DunneWebModal>
        }

        <div id="admin-main-container" className='flex w-full h-full'>
            {/* Sidebar */}
            <div className='w-[300px] flex h-[410px] fixed p-0 bg-[#313a46] m-[20px] rounded-[5px]'>
                <ThemeProvider theme={darkTheme}>
                    <div className="w-[300px] p-[20px]">
                        <span className='w-[100%] flex justify-center items-center text-center p-2.5 font-semibold text-gray-300 uppercase tracking-wider'>Filter Books</span>
                        <ul className='list-none p-0'>
                            <PublishersSelector setPublisher={setPublisherFilter}/>
                            <CharactersSelector setCharacter={setCharacterFilter}/>
                        </ul>
                    </div>
                </ThemeProvider>
            </div>

            {/* Main content */}
            <div className='flex flex-col items-center w-[calc(100%-315px)] ml-[315px] h-[calc(100dvh-60px)] pt-5'>
                <h4 className='text-center mb-4 font-semibold text-3xl'>Comics</h4>
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

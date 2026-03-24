import React, { useEffect, useState } from "react";
import OmniDetailsModal from "../modals/OmniDetailsModal";
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

    // Use allBooks cache if it is not empty
    useEffect(() => {
        allBooks.length ? setBooks(allBooks) : getAllBooks()
    }, [])

    useEffect(() => {
        setBooks(allBooks)
    }, [allBooks]);

    const bookListContainerStyles: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    }

    const bookCardStyles: React.CSSProperties = {
        margin: '5px',
        width: '200px',
        cursor: 'pointer',
    }

    const imageContainerStyles: React.CSSProperties = {
        flex: '0 0 auto',
    }

    const bookTitleStyles: React.CSSProperties = {
        display: '-webkit-box',
        height: '3rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textAlign: 'center',
    }

    const leftPanelStyles: React.CSSProperties = {
        width: '300px',
        display: 'flex',
        height: '410px',
        position: 'fixed',
        padding: "0px",
    }

    const booksContainerStyles: React.CSSProperties = {
        width: '100%',
        padding: '1rem',
        overflowY: 'scroll',
        height: 'calc(100vh - 60px)',
    }

    const mainContentStyles: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: 'calc(100% - 315px)',
        marginLeft: '315px',
        height: 'calc(100dvh - 60px)',
        paddingTop: '20px',
    }

    const imgStyles: React.CSSProperties = {
        borderRadius: '10px',
        width: '12rem',
    }

    function getDisplayedBooks(book: BookType, i: number) {
        const bookPublisher = book['publisher']
        const bookCharacter = book['character']

        if (
            (!publisherFilter || bookPublisher === publisherFilter['id']) &&
            (!characterFilter || bookCharacter === characterFilter['id'])
        ) {
            return (
                <div
                style={bookCardStyles}
                key={i}
                onClick={() => {
                    setSelectedBook(book)
                    setDwModalOpen(true)
                }}
                >
                    <div style={imageContainerStyles}>
                        <img
                            style={imgStyles}
                            src={`${window.location.origin}${book.thumbnail}`}
                            alt={book.title}
                        />
                    </div>
                    <div style={bookTitleStyles}>{book.title}</div>
                </div>
            )
        }
    }

    return (
        <>
        {
            dwModalOpen &&
            <DunneWebModal onClose={() => setDwModalOpen(false)}>
                <Book book={selectedBook} setDwModalOpen={setDwModalOpen}/>
            </DunneWebModal>
        }
        <div id="admin-main-container">
            <div style={leftPanelStyles}>
                <ThemeProvider theme={darkTheme}>
                    <div className="side-nav" style={{width: '300px'}}>
                        <span style={{textAlign: 'center'}}>Filter Books</span>
                        <ul className="side-nav-list">
                            <PublishersSelector setPublisher={setPublisherFilter}/>
                            <CharactersSelector setCharacter={setCharacterFilter}/>
                        </ul>
                        <div className="clearfix"></div>
                    </div>
                </ThemeProvider>
            </div>

            <div style={mainContentStyles}>
                <span>
                    <h4 style={{textAlign: 'center'}}>Comics</h4>
                </span>
                <div style={booksContainerStyles}>
                        <div style={bookListContainerStyles}>
                            {books.map((book, i) => {
                                return getDisplayedBooks(book, i)
                            })}
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

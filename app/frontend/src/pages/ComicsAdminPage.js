import React, { useEffect, useState } from "react";
import { get_marvel_omnis, getAllBooks, scrape_dc_omnis, scrape_marvel_omnis } from '../actions/comics';
import { connect } from 'react-redux';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Button from '@mui/material/Button'
import DunneWebModal from "../modals/DunneWebModal";
import AddBook from "../modals/dwModalContant/AddBook";
import AddPublisher from "../modals/dwModalContant/AddPublisher";
import AddCharacter from "../modals/dwModalContant/AddCharacter";
import Book from "../modals/dwModalContant/Book";

const ComicsAdmin = ({
    get_marvel_omnis, marvel_api_comics,
    scrape_dc_omnis, scrape_marvel_omnis,
    dc_scraped_comics, marvel_scraped_comics,
    allBooks, getAllBooks,
}) => {

    const [displayedBooks, setDisplayedBooks] = useState([]);
    const [selectedResultSet, setselectedResultSet] = useState('dunneweb-db');

    const [selectedBook, setSelectedBook] = useState({});
    const [dwModalOpen, setDwModalOpen] = useState(false);
    const [dwModalType, setDwModalType] = useState('book')

    useEffect(() => {
        allBooks.length ? handleChange(selectedResultSet) : getAllBooks()
    }, [])

    useEffect(() => {
        setDisplayedBooks(allBooks)
    }, [allBooks])

    useEffect(() => {
        if (selectedResultSet === 'dc-amz')
            setDisplayedBooks(dc_scraped_comics);
    }, [dc_scraped_comics])

    useEffect(() => {
        if (selectedResultSet === 'marvel-amz')
            setDisplayedBooks(marvel_scraped_comics);
    }, [marvel_scraped_comics])

    useEffect(() => {
        if (selectedResultSet === 'marvel-api')
            setDisplayedBooks(marvel_api_comics);
    }, [marvel_api_comics]);

    const getMarvelOmnis = async (event) => {
        event.preventDefault();
        get_marvel_omnis();
    }

    const scrapeDCOmnis = async (event) => {
        event.preventDefault();
        scrape_dc_omnis();
    }

    const scrapeMarvelOmnis = async (event) => {
        event.preventDefault();
        scrape_marvel_omnis();
    }

    const handleChange = ( event ) => {
        const toggleValue = event?.target?.value ? event.target.value : 'dunneweb-db'
        setselectedResultSet(toggleValue)
        setDisplayedBooks(
            toggleValue === 'dunneweb-db' ? allBooks : 
            toggleValue === 'marvel-api' ? marvel_api_comics : 
            toggleValue === 'marvel-cgn' ? marvel_cgn_comics_global : 
            toggleValue === 'dc-cgn' ? dc_cgn_comics_global :
            toggleValue === 'dc-amz' ? dc_scraped_comics : 
            toggleValue === 'marvel-amz' ? marvel_scraped_comics : marvel_scraped_comics
        );
    };

    function displayBooks(book, i, omniListType) {
        let imgUrl = '';
        let title = '';

        switch(omniListType) {
            case 'marvelApi':
                imgUrl = book.thumbnail.path + '.' + book.thumbnail.extension;
                title = book.title;
                break;
            case 'dcScraped':
                imgUrl = book.book_img_url;
                title = book.book_title;
                break;
            case 'marvelScraped':
                imgUrl = book.book_img_url;
                title = book.book_title;
                break;
            default:
                break;
        }

        return (
            <div 
                className="card omni-list-card" 
                key={i} 
                onClick={() => {
                    setDwModalOpen(true)
                    setDwModalType('book')
                    setSelectedBook(book)
                }}
            >
                <div className="row g-0 align-items-center">
                    <div className="col-md-4" style={imgContainerStyles}>
                        <img src={`${window.location.origin}${book.thumbnail}`} style={imgStyles} alt="..."/>
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <h5 className="card-title">{title}</h5>
                            <div style={bookDetailsContainer}>
                                <span><b>Publisher</b>: {book.publisher_name}</span>
                                <span><b>Character</b>: {book.character_name}</span>
                                <span><b>Author</b>: {book.author}</span>
                                <span><b>Page Count</b>: {book.page_count}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const imgStyles = {
        height: '200px',
        objectFit: 'contain',
        margin: '1rem 0',
        borderRadius: '10px',
    }

    const imgContainerStyles = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }

    const bookDetailsContainer = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexDirection: 'column',
        marginTop: '0.9rem',
    }

    const addButtonStyles = {
        margin: '5px',
        backgroundColor: 'rgb(83, 109, 230)',
    }

    const toggleContainer = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '1rem'
    }

    const booksContainerStyles = {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
        overflowY: 'scroll',
        height: 'calc(100vh - 200px)',
    }

    return (
        <>
        {
            dwModalOpen && 
            <DunneWebModal
                onClose={() => setDwModalOpen(false)}
            > 
                {
                    dwModalType === 'book' ? <Book book={selectedBook} setDwModalOpen={setDwModalOpen}/> : 
                    dwModalType === 'addBook' ? <AddBook setDwModalOpen={setDwModalOpen}/> : 
                    dwModalType === 'addCharacter' ? <AddCharacter setDwModalOpen={setDwModalOpen}/> :
                    dwModalType === 'addPublisher' ? <AddPublisher setDwModalOpen={setDwModalOpen}/>  : ''
                }
            </DunneWebModal>
        }

        <div id="admin-main-container">
            <div className="admin-leftside-content" style={{"padding": "0px"}}>
                <div className="side-nav">
                    <ul className="side-nav-list">
                        <li className="side-nav-title side-nav-item">Actions</li>
                        <li className="side-nav-item" onClick={e => getMarvelOmnis(e)}>
                            <a href="#" className="side-nav-link">
                                <i className="uil-book-alt"></i>
                                <span> Get Marvel Omnis</span>
                            </a>
                        </li>
                        <li className="side-nav-item" onClick={e => scrapeDCOmnis(e)}>
                            <a href="#" className="side-nav-link">
                                <i className="uil-book-alt"></i>
                                <span> Scrape DC Omnis</span>
                            </a>
                        </li>
                        <li className="side-nav-item" onClick={e => scrapeMarvelOmnis(e)}>
                            <a href="#" className="side-nav-link">
                                <i className="uil-book-alt"></i>
                                <span> Scrape Marvel Omnis</span>
                            </a>
                        </li>
                    </ul>
                    <Button
                        style={addButtonStyles}
                        variant="contained"
                        onClick={() => {
                            setDwModalOpen(true)
                            setDwModalType('addBook')
                        }}
                        value="Add Omnibus"
                    >
                        Add Book
                    </Button>
                    <Button
                        style={addButtonStyles}
                        variant="contained"
                        onClick={() => {
                            setDwModalOpen(true)
                            setDwModalType('addCharacter')
                        }}
                        value="Add Character"
                    >
                        Add Character
                    </Button>
                    <Button
                        style={addButtonStyles}
                        variant="contained"
                        onClick={() => {
                            setDwModalOpen(true)
                            setDwModalType('addPublisher')
                        }}
                        value="Add Publisher"
                    >
                        Add Publisher
                    </Button>
                    <div className="clearfix"></div>
                </div>
            </div>

            <div className="admin-main-content">
                    <div className="page-title-box">
                        <h4 className="page-title">Comics Admin</h4>
                    </div>
                    <div style={toggleContainer}>
                        <ToggleButtonGroup
                        color="primary" value={selectedResultSet} exclusive 
                        onChange={handleChange} aria-label="Result Set">
                            <ToggleButton value="dunneweb-db">Dunne Web Comics</ToggleButton>
                            <ToggleButton value="marvel-api">Marvel API</ToggleButton>
                            <ToggleButton value="dc-amz">DC AMZ</ToggleButton>
                            <ToggleButton value="marvel-amz">Marvel AMZ</ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                    <div style={booksContainerStyles}>
                        {displayedBooks
                            .map((book, i) => { 
                            return displayBooks(
                                book, i, 
                                selectedResultSet === 'dunneweb-db' ? 'marvelApi' :
                                selectedResultSet === 'marvel-api' ? 'marvelApi' : 
                                selectedResultSet === 'dc-amz' ? 'dcScraped' :
                                selectedResultSet === 'marvel-amz' ? 'marvelScraped' : 'marvelScraped') 
                        })}
                    </div>
            </div> 
        </div>
        </>
    );
}

const mapStateToProps = state => ({
    marvel_api_comics: state.comics.marvel_api_comics,
    dc_scraped_comics: state.comics.dc_scraped_comics,
    marvel_scraped_comics: state.comics.marvel_scraped_comics,
    allBooks: state.comics.all_books,
})

export default connect(mapStateToProps, { 
    get_marvel_omnis, scrape_dc_omnis, scrape_marvel_omnis, getAllBooks
})(ComicsAdmin)

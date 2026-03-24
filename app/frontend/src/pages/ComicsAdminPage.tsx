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
import { Book as BookType } from '../types';
import { RootState } from "../reducers";

interface Props {
    get_marvel_omnis: () => void;
    marvel_api_comics: any[];
    scrape_dc_omnis: () => void;
    scrape_marvel_omnis: () => void;
    dc_scraped_comics: any[];
    marvel_scraped_comics: any[];
    allBooks: BookType[];
    getAllBooks: () => void;
}

const ComicsAdmin: React.FC<Props> = ({
    get_marvel_omnis, marvel_api_comics,
    scrape_dc_omnis, scrape_marvel_omnis,
    dc_scraped_comics, marvel_scraped_comics,
    allBooks, getAllBooks,
}) => {

    const [displayedBooks, setDisplayedBooks] = useState<any[]>([]);
    const [selectedResultSet, setselectedResultSet] = useState('dunneweb-db');
    const [selectedBook, setSelectedBook] = useState<BookType>({} as BookType);
    const [dwModalOpen, setDwModalOpen] = useState(false);
    const [dwModalType, setDwModalType] = useState('book')

    useEffect(() => {
        allBooks.length ? handleChange(selectedResultSet) : getAllBooks()
    }, [])

    useEffect(() => { setDisplayedBooks(allBooks) }, [allBooks])
    useEffect(() => { if (selectedResultSet === 'dc-amz') setDisplayedBooks(dc_scraped_comics) }, [dc_scraped_comics])
    useEffect(() => { if (selectedResultSet === 'marvel-amz') setDisplayedBooks(marvel_scraped_comics) }, [marvel_scraped_comics])
    useEffect(() => { if (selectedResultSet === 'marvel-api') setDisplayedBooks(marvel_api_comics) }, [marvel_api_comics]);

    const getMarvelOmnis  = (e: React.MouseEvent) => { e.preventDefault(); get_marvel_omnis(); }
    const scrapeDCOmnis   = (e: React.MouseEvent) => { e.preventDefault(); scrape_dc_omnis(); }
    const scrapeMarvelOmnis = (e: React.MouseEvent) => { e.preventDefault(); scrape_marvel_omnis(); }

    const handleChange = (event: any) => {
        const v = event?.target?.value ?? 'dunneweb-db'
        setselectedResultSet(v)
        setDisplayedBooks(
            v === 'dunneweb-db' ? allBooks :
            v === 'marvel-api'  ? marvel_api_comics :
            v === 'dc-amz'      ? dc_scraped_comics :
            v === 'marvel-amz'  ? marvel_scraped_comics : marvel_scraped_comics
        );
    };

    function displayBooks(book: any, i: number, omniListType: string) {
        let title = '';
        switch (omniListType) {
            case 'marvelApi':    title = book.title; break;
            case 'dcScraped':
            case 'marvelScraped': title = book.book_title; break;
        }

        return (
            <div
                key={i}
                className='m-[5px] w-[700px] border border-gray-200 rounded-[10px] flex justify-start cursor-pointer hover:border-gray-400 transition-colors'
                onClick={() => { setDwModalOpen(true); setDwModalType('book'); setSelectedBook(book) }}
            >
                <div className='flex justify-center items-center w-[30%]'>
                    <img src={`${window.location.origin}${book.thumbnail}`} className='h-[200px] object-contain my-4 rounded-[10px]' alt="..."/>
                </div>
                <div className='flex flex-col justify-center items-start w-[70%] p-4'>
                    <h5 className='font-semibold mb-2'>{title}</h5>
                    <div className='flex flex-col gap-1 text-sm text-gray-600'>
                        <span><b>Publisher</b>: {book.publisher_name}</span>
                        <span><b>Character</b>: {book.character_name}</span>
                        <span><b>Author</b>: {book.author}</span>
                        <span><b>Page Count</b>: {book.page_count}</span>
                    </div>
                </div>
            </div>
        )
    }

    const addBtn = 'mx-[5px] bg-brand hover:bg-brand-dark'

    return (
        <>
        {dwModalOpen &&
            <DunneWebModal onClose={() => setDwModalOpen(false)}>
                {dwModalType === 'book'         ? <Book book={selectedBook} setDwModalOpen={setDwModalOpen}/> :
                 dwModalType === 'addBook'       ? <AddBook setDwModalOpen={setDwModalOpen}/> :
                 dwModalType === 'addCharacter'  ? <AddCharacter setDwModalOpen={setDwModalOpen}/> :
                 dwModalType === 'addPublisher'  ? <AddPublisher setDwModalOpen={setDwModalOpen}/> : ''}
            </DunneWebModal>
        }

        <div className='flex w-full h-full'>
            {/* Sidebar */}
            <div className='flex h-[410px] fixed p-0'>
                <div className='list-none bg-[#313a46] text-white px-5 py-5 m-[15px] rounded-[5px] flex flex-col'>
                    <ul className='list-none p-0'>
                        <li className='p-2.5 font-semibold text-gray-300 text-xs uppercase tracking-wider'>Actions</li>
                        {[
                            { label: 'Get Marvel Omnis',  handler: getMarvelOmnis },
                            { label: 'Scrape DC Omnis',   handler: scrapeDCOmnis },
                            { label: 'Scrape Marvel Omnis', handler: scrapeMarvelOmnis },
                        ].map(({ label, handler }) => (
                            <li key={label} className='p-2.5' onClick={handler}>
                                <a href="#" className='text-white no-underline hover:text-gray-300 transition-colors text-sm'>
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className='flex flex-col mt-2 gap-1'>
                        {[
                            { label: 'Add Book',      type: 'addBook' },
                            { label: 'Add Character', type: 'addCharacter' },
                            { label: 'Add Publisher', type: 'addPublisher' },
                        ].map(({ label, type }) => (
                            <Button
                                key={type}
                                className={addBtn}
                                sx={{ backgroundColor: '#536de6', '&:hover': { backgroundColor: '#4558c2' }, margin: '2px' }}
                                variant="contained"
                                size="small"
                                onClick={() => { setDwModalOpen(true); setDwModalType(type) }}
                            >
                                {label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className='w-[calc(100%-265px)] ml-[265px]'>
                <div className='h-[70px] flex justify-center items-center'>
                    <h4 className='font-semibold m-0'>Comics Admin</h4>
                </div>
                <div className='flex justify-center items-center mb-4'>
                    <ToggleButtonGroup color="primary" value={selectedResultSet} onChange={handleChange}>
                        <ToggleButton value="dunneweb-db">Dunne Web Comics</ToggleButton>
                        <ToggleButton value="marvel-api">Marvel API</ToggleButton>
                        <ToggleButton value="dc-amz">DC AMZ</ToggleButton>
                        <ToggleButton value="marvel-amz">Marvel AMZ</ToggleButton>
                    </ToggleButtonGroup>
                </div>
                <div className='flex flex-col items-center overflow-y-scroll h-[calc(100vh-200px)]'>
                    {displayedBooks.map((book, i) =>
                        displayBooks(book, i,
                            selectedResultSet === 'dunneweb-db' ? 'marvelApi' :
                            selectedResultSet === 'marvel-api'  ? 'marvelApi' :
                            selectedResultSet === 'dc-amz'      ? 'dcScraped' : 'marvelScraped'
                        )
                    )}
                </div>
            </div>
        </div>
        </>
    );
}

const mapStateToProps = (state: RootState) => ({
    marvel_api_comics:   state.comics.marvel_api_comics,
    dc_scraped_comics:   state.comics.dc_scraped_comics,
    marvel_scraped_comics: state.comics.marvel_scraped_comics,
    allBooks:            state.comics.all_books,
})

export default connect(mapStateToProps, {
    get_marvel_omnis, scrape_dc_omnis, scrape_marvel_omnis, getAllBooks
})(ComicsAdmin)

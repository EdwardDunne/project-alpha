import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import OmniDetailsModal from "../modals/OmniDetailsModal";
import { get_marvel_omnis, scrape_dc_omnis, scrape_marvel_omnis } from '../actions/comics';
import { connect } from 'react-redux';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Button from '@mui/material/Button'
import DunneWebModal from "../modals/DunneWebModal";
import AddOmnibus from "../modals/dwModalContant/AddOmnibus";
import AddPublisher from "../modals/dwModalContant/AddPublisher";
import AddCharacter from "../modals/dwModalContant/AddCharacter";

const ComicsAdmin = ({
    get_marvel_omnis, marvel_api_comics,
    scrape_dc_omnis, scrape_marvel_omnis,
    dc_scraped_comics, marvel_scraped_comics
}) => {

    const [displayedOmnis, setDisplayedOmnis] = useState([]);
    const [selectedResultSet, setselectedResultSet] = useState('marvel-api');

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [selectedBook, setSelectedBook] = useState({});

    const [dwModalOpen, setDwModalOpen] = useState(false);
    const [dwModalType, setDwModalType] = useState('book')
    
    let marvel_cgn_comics_global = []; // TEMP: need to create global state var
    let dc_cgn_comics_global = []; // TEMP: need to create global state var

    useEffect(() => {
        if (selectedResultSet === 'dc-amz')
            setDisplayedOmnis(dc_scraped_comics);
    }, [dc_scraped_comics])

    useEffect(() => {
        if (selectedResultSet === 'marvel-amz')
            setDisplayedOmnis(marvel_scraped_comics);
    }, [marvel_scraped_comics])

    useEffect(() => {
        if (selectedResultSet === 'marvel-api')
            setDisplayedOmnis(marvel_api_comics);
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

    function omniClicked(type, book) {
        setDetailsOpen(true);
        setModalType(type);
        setSelectedBook(book);
    }

    const handleChange = ( event, newAlignment ) => {
        setselectedResultSet(newAlignment);
        setDisplayedOmnis(
            newAlignment === 'marvel-api' ? marvel_api_comics : 
            newAlignment === 'marvel-cgn' ? marvel_cgn_comics_global : 
            newAlignment === 'dc-cgn' ? dc_cgn_comics_global :
            newAlignment === 'dc-amz' ? dc_scraped_comics : 
            newAlignment === 'marvel-amz' ? marvel_scraped_comics : marvel_scraped_comics
        );
    };

    function displayOmnis(book, i, omniListType) {
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
            <div className="card omni-list-card" key={i} onClick={() => omniClicked(omniListType, book)}>
                <div className="row g-0 align-items-center">
                    <div className="col-md-4">
                        <img src={imgUrl} className="card-img" alt="..."/>
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <h5 className="card-title">{title}</h5>
                            <p className="card-text">{book.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const addButtonStyles = {
        margin: '5px'
    }

    return (
        <>
        {
            detailsOpen && 
            <OmniDetailsModal 
                open={detailsOpen} 
                onClose={() => setDetailsOpen(false)} 
                modalType={modalType}
                selectedBook={selectedBook}>
            </OmniDetailsModal>}
        {
            dwModalOpen && 
            <DunneWebModal
                onClose={() => setDwModalOpen(false)}
            > 
                {
                    dwModalType === 'book' ? <AddOmnibus/> : 
                    dwModalType === 'character' ? <AddCharacter/> :
                    dwModalType === 'publisher' ? <AddPublisher/>  : ''
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
                            setDwModalType('book')
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
                            setDwModalType('character')
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
                            setDwModalType('publisher')
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
                    <div id="comics-admin-results-toggle-container">
                        <ToggleButtonGroup
                        color="primary" value={selectedResultSet} exclusive 
                        onChange={handleChange} aria-label="Result Set">
                            <ToggleButton value="marvel-api">Marvel API</ToggleButton>
                            <ToggleButton value="dc-amz">DC AMZ</ToggleButton>
                            <ToggleButton value="marvel-amz">Marvel AMZ</ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                    <div className="book-card-container">
                        {displayedOmnis.map((book, i) => { 
                            return displayOmnis(
                                book, i, 
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
})

export default connect(mapStateToProps, { 
    get_marvel_omnis, scrape_dc_omnis, scrape_marvel_omnis
})(ComicsAdmin)

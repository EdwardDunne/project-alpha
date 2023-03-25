import React, { Component, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import httpUtil from '../utils/httpUtil';
import OmniDetailsModal from "../modals/OmniDetailsModal";
import { get_marvel_omnis } from '../actions/comics';
import { connect } from 'react-redux';

const ComicsAdmin = ({
    get_marvel_omnis,
    marvel_api_comics_global
}) => {

    let navigate = useNavigate();

    const [marvelOmnis, setMarvelOmnis] = useState([]);
    const [scrapedDCOmnis, setScrapedDCOmnis] = useState([]);

    const [isOpen, setIsOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [selectedBook, setSelectedBook] = useState({});

    useEffect(() => {
        console.log(marvelOmnis);
    }, [marvelOmnis])

    useEffect(() => {
        for (let book of scrapedDCOmnis) {
            // scrapeAmazonDetails(book.book_url);
        }
    }, [scrapedDCOmnis])

    useEffect(() => {
        setMarvelOmnis(marvel_api_comics_global);
    }, [marvel_api_comics_global]);
    

    function pageChange(event) {
        navigate('/');
    }

    const testMarvelApi = async (event) => {
        event.preventDefault();
        const config = {
            headers: httpUtil.get_headers('GET')
        };

        const res = await axios.get(`${window.location.origin}/api/test-marvel`, config);
        console.log(res);
    }

    const getMarvelOmnis = async (event) => {
        event.preventDefault();
        // const config = {
        //     headers: httpUtil.get_headers('GET')
        // };

        // const res = await axios.get(`${window.location.origin}/api/get-marvel-omnis`, config);
        // console.log(res);
        // setMarvelOmnis(res.data.books);

        get_marvel_omnis();
    }

    const scrapeDCOmnis = async (event) => {
        event.preventDefault();
        const config = {
            headers: httpUtil.get_headers('GET')
        };

        const res = await axios.get(`${window.location.origin}/api/scrape-dc-omnis`, config);
        console.log(res);
        setScrapedDCOmnis(res.data.books);
    }

    const scrapeAmazonDetails = async (book_url) => {
        const config = {
            headers: httpUtil.get_headers('POST')
        };

        const body = JSON.stringify({ book_url });
        const res = await axios.post(`${window.location.origin}/api/scrape-amazon-details`, body, config);
        console.log(res);
    }

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
            default:
                break;
        }

        return (
            <div className="card omni-list-card" key={i} onClick={e => omniClicked(omniListType, book)}>
                <div className="row g-0 align-items-center">
                    <div className="col-md-4">
                        <img src={imgUrl} className="card-img" alt="..."/>
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <h5 className="card-title">{title}</h5>
                            <p className="card-text">{book.description}</p>
                            {/* <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p> */}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    function omniClicked(type, book) {
        setIsOpen(true);
        setModalType(type);
        setSelectedBook(book);
    }

    return (
        <>

        <OmniDetailsModal 
            open={isOpen} 
            onClose={() => setIsOpen(false)} 
            modalType={modalType}
            selectedBook={selectedBook}>
        </OmniDetailsModal>

        <div id="admin-main-container">
            <div className="admin-leftside-content" style={{"padding": "0px"}}>
                <ul className="side-nav">
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
                    <li className="side-nav-item">
                        <a href="#" className="side-nav-link">
                            <i className="uil-book-alt"></i>
                            <span> Scrape Marvel Omnis</span>
                        </a>
                    </li>
                </ul>
                <div className="clearfix"></div>
            </div>

            <div className="admin-main-content">
                    <div className="page-title-box">
                        <h4 className="page-title">Comics Admin</h4>
                    </div>
                    <div className="admin-btn-panel">
                        <button className="btn btn-primary" onClick={e => pageChange(e)}>Test Page Change</button>
                        <button className="btn btn-primary" onClick={e => getMarvelOmnis(e)}>Get Marvel Omnis</button>
                        <button className="btn btn-primary" onClick={e => testMarvelApi(e)}>Test Marvel Api</button>
                    </div>
                    <div className="book-card-container">
                        {marvelOmnis.map((book, i) => { return displayOmnis(book, i, 'marvelApi') })}
                        {scrapedDCOmnis.map((book, i) => { return displayOmnis(book, i, 'dcScraped') })}
                    </div>
            </div> 
        </div>
        </>
    );
}

const mapStateToProps = state => ({
    marvel_api_comics_global: state.comics.marvel_api_comics
})

export default connect(mapStateToProps, { 
    get_marvel_omnis, 
})(ComicsAdmin)

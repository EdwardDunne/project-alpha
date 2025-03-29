import React, { Component, useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import axios from 'axios';
import httpUtil from '../utils/httpUtil';
import { connect } from 'react-redux';


const OmniDetailsModal = ({ open, onClose, modalType, selectedBook, children }) => {

    const [omniDetails, setOmniDetails] = useState({
        contributors: [],
        publishDate: 'loading...',
        pages: 'loading...'
    });

    useEffect(() => {
        if (modalType === 'dcScraped' || modalType === 'marvelScraped')
            scrapeAmazonDetails(selectedBook.book_url);
    }, []);

    const scrapeAmazonDetails = async (book_url) => {
        const config = {
            headers: httpUtil.get_headers('POST')
        };

        const body = JSON.stringify({ book_url });
        const res = await axios.post(`${window.location.origin}/api/scrape-amazon-details`, body, config);
        console.log(res);

        let _omniDetails = res.data.omni_details;
        setOmniDetails({
            contributors: _omniDetails.contributors,
            publishDate: _omniDetails.publish_date,
            pages: _omniDetails.pages
        });
    }

    function MarvelApiBook() {
        return (
            <>
            <div className="omni-details-modal-container marvel">
                <div className="omni-title">{selectedBook.title}</div>
                <div className="content-container">
                    <img src={selectedBook.thumbnail.path + '.' + selectedBook.thumbnail.extension}/>
                    <div className="details-container">
                        <span><b>ISBN</b>: {selectedBook.isbn}</span>
                        <span><b>Marvel DB ID</b>: {selectedBook.id}</span>
                        <span><b>Test2</b>: placeholder placeholder placeholder</span>
                        <span><b>Test3</b>: placeholder placeholder placeholder</span>
                        <span><b>Test4</b>: placeholder placeholder placeholder</span>
                    </div>
                </div>
                <button className="btn btn-primary m-3" onClick={onClose}>Close Modal</button>
                
                { children }
            </div>
            </>
        );
    }
      
    function ScrapedBook() {
        return (
            <>
            <div className="omni-details-modal-container">
                <div className="omni-title">{selectedBook.book_title}</div>
                <div className="content-container">
                    <img src={selectedBook.book_img_url}/>
                    <div className="details-container">
                        <span><b>ASIN</b>: {selectedBook.book_asin}</span>
                        <span><b>Contributors</b>:{"\n"} {getContributors()}</span>
                        <span><b>Release Date</b>: {omniDetails.publishDate}</span>
                        <span><b>Pages</b>: {omniDetails.pages}</span>
                    </div>
                </div>
                <button className="btn btn-primary m-3" onClick={onClose}>Close Modal</button>
            </div>
            </>
        );
    }

    function getContributors() {
        if (!omniDetails.contributors.length)
            return 'loading...';

        return (
            <>
                {omniDetails.contributors.map(contributor => {
                    return (contributor + '\n')
                })}
            </>
        );
    }

    let modalContent;
    switch(modalType) {
        case 'marvelApi':
            modalContent = <MarvelApiBook/>;
            break;
        default:
            modalContent = <ScrapedBook/>; 
            break;
    }

    console.log(selectedBook);

    return ReactDom.createPortal(
        <>
            <div className='modal-overlay' onClick={onClose}/>
            <div className='omni-details-modal'>
                {modalContent}
            </div>
        </>,
        document.getElementById('portal')
    )
}

const mapStateToProps = state => ({})
export default connect(mapStateToProps, {})(OmniDetailsModal)

import { BorderAll } from '@material-ui/icons';
import React from 'react';
import ReactDom from 'react-dom';

export default function OmniDetailsModal({ open, onClose, modalType, selectedBook, children }) {
  
    if (!open) return null;

    function MarvelApiBook() {
        return (
            <>
            <div className="omni-details-modal-container marvel">
                <div className="omni-title">{selectedBook.title}</div>
                <div className="content-container">
                    <img src={selectedBook.thumbnail.path + '.' + selectedBook.thumbnail.extension}/>
                    <div className="details-container">
                        <span><b>ISBN</b>: {selectedBook.isbn}</span>
                        <span><b>Test1</b>: placeholder placeholder placeholder</span>
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
      
    function DCScrapedBook() {
        return (
            <>
            <div className="omni-details-modal-container">
                <div className="omni-title">{selectedBook.book_title}</div>
                <div className="content-container">
                    <img src={selectedBook.book_img_url}/>
                    <div className="details-container">
                        <span><b>ASIN</b>: {selectedBook.book_asin}</span>
                        <span><b>Test1</b>: placeholder placeholder placeholder</span>
                        <span><b>Test2</b>: placeholder placeholder placeholder</span>
                        <span><b>Test3</b>: placeholder placeholder placeholder</span>
                        <span><b>Test4</b>: placeholder placeholder placeholder</span>
                    </div>
                </div>
                <button className="btn btn-primary m-3" onClick={onClose}>Close Modal</button>
            </div>
            </>
        );
    }

    let modalContent;
    switch(modalType) {
        case 'marvelApi':
            modalContent = <MarvelApiBook/>;
            break;
        default:
            modalContent = <DCScrapedBook/>; 
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

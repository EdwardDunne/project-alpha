import React from 'react';
import ReactDom from 'react-dom';

export default function HomePageModal({ open, children, onClose, modalType }) {
  
    if (!open) return null;
    let modal_title = modalType.charAt(0).toUpperCase() + modalType.slice(1);

    let content = modalType === 'contact' ? 'Email: edunne05@gmail.com' : <>Coming Soon!</>

    return ReactDom.createPortal(
        <>
            <div className='modal-overlay' onClick={onClose}/>
            <div className='hex-modal'>
                <h1 style={{textAlign: 'center', width: '100%'}}>{modal_title}</h1>
                <span style={{textAlign: 'center', width: '100%'}}>
                    {content}
                </span>
                <span className="modal-footer-btns-container">
                    <button className="btn btn-primary close-btn" onClick={onClose}>Close</button>
                </span>
            </div>
        </>,
        document.getElementById('portal')
    )
}

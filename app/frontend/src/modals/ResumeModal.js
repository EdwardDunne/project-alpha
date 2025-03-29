
import React, { useEffect, useState } from 'react';
import ReactDom from 'react-dom';


export default function ResumeModal({ open, children, onClose }) {
  
    if (!open) return null;
    const modal_title = 'Resume'

    return ReactDom.createPortal(
        <>
            <div className='modal-overlay' onClick={onClose}/>
            <div className='hex-modal' style={
                {
                    height: '80vh', 
                    width: '80vw',
                    maxWidth: '1060px',
                    padding: '20px', 
                    justifyContent: 'space-between',
                    flexDirection: 'column',
                    flexWrap: 'nowrap',
                }}>
                <h1 style={{textAlign: 'center', width: '100%'}}>{modal_title}</h1>
                <span style={{textAlign: 'center', width: '100%', height: '60vh', overflow: 'scroll'}}>
                <img src="https://drive.google.com/thumbnail?id=1486IJXRqbg4imoPuZxW6JDQVPuTHjbGd&sz=w1000" alt=""/>
                <img src="https://drive.google.com/thumbnail?id=1uxFUcBdgGHew7DUdjlfhkSBU02XdyKK3&sz=w1000" alt=""/>
                </span>
                <span className="modal-footer-btns-container">
                    <button 
                        className="btn btn-primary close-btn" 
                        style={{marginRight: '10px'}}
                        onClick={(e) => {window.open("https://drive.google.com/u/1/uc?id=1486IJXRqbg4imoPuZxW6JDQVPuTHjbGd&export=download", "_blank");}}
                    >
                        Download
                    </button>
                    <button className="btn btn-primary close-btn" onClick={onClose}>Close Modal</button>
                </span>
            </div>
        </>,
        document.getElementById('portal')
    )
}

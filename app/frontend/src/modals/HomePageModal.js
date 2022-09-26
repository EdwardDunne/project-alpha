import { BorderAll } from '@material-ui/icons';
import React from 'react';
import ReactDom from 'react-dom';

export default function HomePageModal({ open, children, onClose, modalType }) {
  
    if (!open) return null;

    function ResumeContent() {
        return (
            <>
            <button onClick={onClose}>Close Modal</button>
            RESUME
            { children }
            </>
        );
    }
      
    function OtherContent() {
        return (
            <>
            <button onClick={onClose}>Close Modal</button>
            OTHER
            { children }
            </>
        );
    }

    let modalContent;
    switch(modalType) {
        case 'resume':
            modalContent = <ResumeContent/>;
            break;
        default:
            modalContent = <OtherContent/>; 
            break;
    }

    return ReactDom.createPortal(
        <>
            <div className='modal-overlay' onClick={onClose}/>
            <div className='hex-modal'>
                {modalContent}
            </div>
        </>,
        document.getElementById('portal')
    )
}

import { BorderAll } from '@material-ui/icons'
import React from 'react'

const MODAL_STYLES = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#FFF',
    padding: '50px',
    zIndex: 1000,
    border: '3px solid black'
}

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
            console.log(modalType);
            modalContent = <OtherContent/>; 
            break;
    }

    return (
    <div style={MODAL_STYLES}>
        {modalContent}
    </div>
    
  )
}

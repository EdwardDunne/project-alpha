import React from 'react';
import ReactDom from 'react-dom';

interface Props {
    open: boolean;
    children?: React.ReactNode;
    onClose: () => void;
    modalType: string | null;
}

export default function HomePageModal({ open, children, onClose, modalType }: Props) {

    if (!open || !modalType) return null;
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
                    <button className='px-5 py-2 bg-brand text-white rounded hover:bg-brand-dark transition-colors font-semibold' onClick={onClose}>Close</button>
                </span>
            </div>
        </>,
        document.getElementById('portal') as Element
    )
}

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
            <div className='fixed inset-0 bg-black/[0.43] z-[1000]' onClick={onClose}/>
            <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-[1001] rounded-[0.6rem] max-h-[90dvh] overflow-y-auto w-[92vw] px-[2rem] py-[2.5rem] md:w-[50vw] md:p-[5rem] flex justify-start items-center flex-wrap'>
                <h1 className='text-center w-full text-[2.4rem] font-semibold'>{modal_title}</h1>
                <span className='text-center w-full'>
                    {content}
                </span>
                <span className='flex justify-end items-center w-full'>
                    <button className='px-5 py-2 bg-brand text-white rounded hover:bg-brand-dark transition-colors font-semibold' onClick={onClose}>Close</button>
                </span>
            </div>
        </>,
        document.getElementById('portal') as Element
    )
}

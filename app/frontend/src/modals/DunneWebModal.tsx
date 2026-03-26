import React from 'react';
import ReactDom from 'react-dom';
import { connect } from 'react-redux';

interface Props {
    onClose: () => void;
    children: React.ReactNode;
}

const DunneWebModal: React.FC<Props> = ({ onClose, children }) => {
    return ReactDom.createPortal(
        <>
            <div className='modal-overlay' onClick={onClose}/>
            <div className='dunne-web-modal'>
                <button
                    className='absolute top-2.5 right-2.5 w-9 h-9 rounded-full border-2 border-brand bg-white text-brand font-bold text-[1.4rem] hover:bg-brand hover:text-white transition-colors'
                    onClick={onClose}
                >
                    ✕
                </button>
                {children}
            </div>
        </>,
        document.getElementById('portal') as Element
    )
}

const mapStateToProps = () => ({})
export default connect(mapStateToProps, {})(DunneWebModal)

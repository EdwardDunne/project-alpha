import React from 'react';
import ReactDom from 'react-dom';
import { connect } from 'react-redux';

interface Props {
    onClose: () => void;
    children: React.ReactNode;
}

const DunneWebModal: React.FC<Props> = ({ onClose, children }) => {

    const closeButtonStyles: React.CSSProperties = {
        fontFamily: 'Nunito',
        fontWeight: 600,
        fontSize: '20px',
        border: 'solid 2px rgb(83, 109, 230)',
        borderRadius: '40px',
        background: 'white',
        color: 'rgb(83, 109, 230)',
        lineHeight: '10px',
        padding: '12px 10px 10px 10px',
        position: 'absolute',
        right: '10px',
        top: '10px',
    }

    return ReactDom.createPortal(
        <>
            <div className='modal-overlay' onClick={onClose}/>
            <div className='dunne-web-modal'>
                <button style={closeButtonStyles} onClick={onClose}>X</button>
                {children}
            </div>
        </>,
        document.getElementById('portal') as Element
    )
}

const mapStateToProps = () => ({})
export default connect(mapStateToProps, {})(DunneWebModal)

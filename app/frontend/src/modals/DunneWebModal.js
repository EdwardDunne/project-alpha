import React from 'react';
import ReactDom from 'react-dom';

import { connect } from 'react-redux';


const DunneWebModal = ({ onClose, children }) => {


    return ReactDom.createPortal(
        <>
            <div className='modal-overlay' onClick={onClose}/>
            <div className='dunne-web-modal'>
                {children}
                <div className='dunne-web-modal-footer'>
                    <button className="btn btn-primary m-3" onClick={onClose}>Close</button>
                </div>
            </div>
        </>,
        document.getElementById('portal')
    )
}

const mapStateToProps = state => ({})
export default connect(mapStateToProps, {})(DunneWebModal)
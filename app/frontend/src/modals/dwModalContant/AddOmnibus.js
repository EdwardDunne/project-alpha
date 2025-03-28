import React, { Fragment } from 'react'
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';

const AddOmnibus = ({ open, onClose, content, children }) => {

    return (
        <div className="dw-modal-container">
            <div className="dw-modal-title">Add Omnibus</div>
            <div className="dw-modal-content-container">
                ANOTHER TEST
            </div>
        </div>
    )
}

const mapStateToProps = state => ({})
export default connect(mapStateToProps, {})(AddOmnibus)

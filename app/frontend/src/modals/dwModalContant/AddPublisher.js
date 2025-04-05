import React, { useState } from 'react'
import { connect } from 'react-redux';
import { addPublisher, getAllPublishers } from '../../actions/comics';

const AddPublisher = ({ setDwModalOpen, getAllPublishers }) => {

    const [formData, setFormData] = useState({
        key: '',
        name: '',
    });

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        addPublisher(formData, setDwModalOpen)
    }

    const titleStyles = {
        width: '100%',
        height: '4rem',
        padding: '1rem',
        textAlign: 'center',
        fontWeight:  600,
        fontSize: '2rem'
    }

    const footerStyles = {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        width: '100%',
        height: '4rem'
    }

    return (
        <div className="dw-modal-container">
            <div style={titleStyles} className="dw-modal-title">Add Publisher</div>
            <div className="dw-modal-content-container">
                <form onSubmit={e => onSubmit(e)}>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='key'>Key</label>
                        <input
                            className='form-control'
                            type='text'
                            name='key'
                            placeholder={`Key`}
                            onChange={e => onChange(e)}
                        />
                    </div>
                    <div className='form-group mt-3'>
                        <label className='form-label' htmlFor='name'>Name</label>
                        <input
                            className='form-control'
                            type='text'
                            name='name'
                            placeholder={`Name`}
                            onChange={e => onChange(e)}
                        />
                    </div>
                    <div style={footerStyles}>
                        <button 
                            className='btn btn-primary update-btn' 
                            type='submit'
                            style={{margin: 0}}
                        >
                            Add Publisher
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({})
export default connect(mapStateToProps, { getAllPublishers })(AddPublisher)

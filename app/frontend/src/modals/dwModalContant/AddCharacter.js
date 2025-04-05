import React, { useState } from 'react'
import { connect } from 'react-redux';
import PublishersSelector from '../../components/PublishersSelector';
import { addCharacter } from '../../actions/comics';

const AddCharacter = ({ setDwModalOpen }) => {

    const [formData, setFormData] = useState({ name: '', publisher: '', });

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const setPublisher = (publisher) => {
        setFormData({ ...formData, publisher: publisher['key'] })
    }

    const onSubmit = async e => {
        e.preventDefault();
        addCharacter(formData, setDwModalOpen)
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
            <div style={titleStyles}>Add Character</div>
            <div className="dw-modal-content-container">
                <form onSubmit={e => onSubmit(e)}>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='name'>Name</label>
                        <input
                            className='form-control'
                            type='text'
                            name='name'
                            placeholder={`Name`}
                            onChange={e => onChange(e)}
                        />
                    </div>
                    <PublishersSelector setPublisher={setPublisher}/>
                    <div style={footerStyles}>
                        <button 
                            className='btn btn-primary update-btn' 
                            type='submit'
                            style={{margin: 0}}
                        >
                            Add Character
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({})
export default connect(mapStateToProps, {})(AddCharacter)

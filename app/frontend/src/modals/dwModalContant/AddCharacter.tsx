import React, { useState } from 'react'
import { connect } from 'react-redux';
import PublishersSelector from '../../components/PublishersSelector';
import { addCharacter } from '../../actions/comics';
import { Publisher } from '../../types';

interface Props {
    setDwModalOpen: (open: boolean) => void;
}

const AddCharacter: React.FC<Props> = ({ setDwModalOpen }) => {

    const [formData, setFormData] = useState({ name: '', publisher: '' });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const setPublisher = (publisher: Publisher | null) => {
        if (publisher) setFormData({ ...formData, publisher: publisher['key'] })
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addCharacter(formData, setDwModalOpen)
    }

    const titleStyles: React.CSSProperties = {
        width: '100%',
        height: '4rem',
        padding: '1rem',
        textAlign: 'center',
        fontWeight: 600,
        fontSize: '2rem'
    }

    const footerStyles: React.CSSProperties = {
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
                <form onSubmit={onSubmit}>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='name'>Name</label>
                        <input
                            className='form-control'
                            type='text'
                            name='name'
                            placeholder={`Name`}
                            onChange={onChange}
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

const mapStateToProps = () => ({})
export default connect(mapStateToProps, {})(AddCharacter)

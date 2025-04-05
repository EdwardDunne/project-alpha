import React, { useState } from 'react'
import { connect } from 'react-redux';
import PublishersSelector from '../../components/PublishersSelector';
import CharactersSelector from '../../components/CharactersSelector';
import { addBook } from '../../actions/comics';

const AddBook = ({ setDwModalOpen }) => {

    const [formData, setFormData] = useState({
        publisher: '',
        format: '',
        title: '',
        description: '',
        thumbnail_url: '',
        thumbnail: '',
        author: '',
        page_count: 0,
        character: '',
        team: ''
    });

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const setPublisher = (publisher) => {
        setFormData({ ...formData, publisher: publisher['key'] })
    }

    const setCharacter = (character) => {
        setFormData({ ...formData, character: character['id'] })
    }

    const onSubmit = async e => {
        e.preventDefault();
        addBook(formData, setDwModalOpen)
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
            <div style={titleStyles}>Add Book</div>
            <div className="dw-modal-content-container">
                <form onSubmit={e => onSubmit(e)}>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='title'>Title</label>
                        <input
                            className='form-control'
                            type='text'
                            name='title'
                            placeholder={`Title`}
                            onChange={e => onChange(e)}
                        />
                    </div>
                    <div className='form-group mt-3'>
                        <label className='form-label' htmlFor='description'>Description</label>
                        <input
                            className='form-control'
                            type='text'
                            name='description'
                            placeholder={`Description`}
                            onChange={e => onChange(e)}
                        />
                    </div>
                    <div className='form-group mt-3'>
                        <label className='form-label' htmlFor='thumbnail'>Thumbnail</label>
                        <input
                            className='form-control'
                            type='file'
                            name='thumbnail'
                            placeholder={`Thumbnail`}
                            onChange={e => setFormData({ ...formData, [e.target.name]: e.target.files[0] })}
                        />
                    </div>
                    <div className='form-group mt-3'>
                        <label className='form-label' htmlFor='page_count'>Page Count</label>
                        <input
                            className='form-control'
                            type='number'
                            name='page_count'
                            placeholder={`Page Count`}
                            onChange={e => onChange(e)}
                        />
                    </div>
                    <PublishersSelector setPublisher={setPublisher}/>
                    <CharactersSelector setCharacter={setCharacter}/>
                    <div style={footerStyles}>
                        <button 
                            className='btn btn-primary update-btn' 
                            type='submit'
                            style={{margin: 0}}
                        >
                            Add Book
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({})
export default connect(mapStateToProps, {})(AddBook)

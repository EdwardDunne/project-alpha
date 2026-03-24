import React, { useState } from 'react'
import { connect } from 'react-redux';
import PublishersSelector from '../../components/PublishersSelector';
import CharactersSelector from '../../components/CharactersSelector';
import { addBook } from '../../actions/comics';
import { Publisher, Character } from '../../types';

interface Props {
    setDwModalOpen: (open: boolean) => void;
}

interface AddBookFormData {
    publisher: string;
    format: string;
    title: string;
    author: string;
    description: string;
    thumbnail_url: string;
    thumbnail: File | string;
    page_count: number;
    character: string;
    team: string;
}

const AddBook: React.FC<Props> = ({ setDwModalOpen }) => {

    const [formData, setFormData] = useState<AddBookFormData>({
        publisher: '',
        format: '',
        title: '',
        author: '',
        description: '',
        thumbnail_url: '',
        thumbnail: '',
        page_count: 0,
        character: '',
        team: ''
    });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const setPublisher = (publisher: Publisher | null) => {
        if (publisher) setFormData({ ...formData, publisher: publisher['key'] })
    }

    const setCharacter = (character: Character | null) => {
        if (character) setFormData({ ...formData, character: String(character['id']) })
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addBook(formData, setDwModalOpen)
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

    const inputContainerStyles: React.CSSProperties = {
        maxHeight: '60vh',
        overflowY: 'scroll',
        overflowX: 'hidden'
    }

    return (
        <div className="dw-modal-container">
            <div style={titleStyles}>Add Book</div>
            <div className="dw-modal-content-container">
                <form onSubmit={onSubmit}>
                    <div style={inputContainerStyles}>
                        <div className='form-group'>
                            <label className='form-label' htmlFor='title'>Title</label>
                            <input
                                className='form-control'
                                type='text'
                                name='title'
                                placeholder={`Title`}
                                onChange={onChange}
                            />
                        </div>
                        <div className='form-group mt-3'>
                            <label className='form-label' htmlFor='author'>Author</label>
                            <input
                                className='form-control'
                                type='text'
                                name='author'
                                placeholder={`Author`}
                                onChange={onChange}
                            />
                        </div>
                        <div className='form-group mt-3'>
                            <label className='form-label' htmlFor='description'>Description</label>
                            <input
                                className='form-control'
                                type='text'
                                name='description'
                                placeholder={`Description`}
                                onChange={onChange}
                            />
                        </div>
                        <div className='form-group mt-3'>
                            <label className='form-label' htmlFor='thumbnail'>Thumbnail</label>
                            <input
                                className='form-control'
                                type='file'
                                name='thumbnail'
                                placeholder={`Thumbnail`}
                                onChange={e => {
                                    if (e.target.files) {
                                        setFormData({ ...formData, [e.target.name]: e.target.files[0] })
                                    }
                                }}
                            />
                        </div>
                        <div className='form-group mt-3'>
                            <label className='form-label' htmlFor='page_count'>Page Count</label>
                            <input
                                className='form-control'
                                type='number'
                                name='page_count'
                                placeholder={`Page Count`}
                                onChange={onChange}
                            />
                        </div>
                        <PublishersSelector setPublisher={setPublisher}/>
                        <CharactersSelector setCharacter={setCharacter}/>
                    </div>
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

const mapStateToProps = () => ({})
export default connect(mapStateToProps, {})(AddBook)

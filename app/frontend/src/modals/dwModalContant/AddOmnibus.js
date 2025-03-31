import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import httpUtil from '../../utils/httpUtil';
import { Autocomplete, TextField } from '@mui/material';
import { getAllCharacters, getAllPublishers } from '../../actions/comics';

const AddOmnibus = () => {

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
    const [publisherOptions, setPublisherOptions] = useState([])
    const [characterOptions, setCharacterOptions] = useState([])

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Get Publishers list
    useEffect(() => {
        _getAllPublishers()
        _getAllCharacters()
    }, [])

    const _getAllPublishers = async () => {
        const res = await getAllPublishers()
        if (res['data'] && res['data']['success']) 
            setPublisherOptions(res['data']['publishers'])
    }

    const _getAllCharacters = async () => {
        const res = await getAllCharacters()
        if (res['data'] && res['data']['success']) 
            setCharacterOptions(res['data']['characters'])
    }

    const onSubmit = async e => {
        e.preventDefault();
        const config = {
            headers: httpUtil.get_headers('POSTFILE')
        };
    
        const body = JSON.stringify({
            publisher: formData.publisher,
            format: formData.format,
            title: formData.title,
            description: formData.description,
            thumbnail_url: formData.thumbnail_url,
            thumbnail: formData.thumbnail,
            author: formData.author,
            page_count: formData.page_count,
            character: formData.character,
            team: formData.team
        });

        const _formData = new FormData();
        _formData.append('thumbnail', formData.thumbnail)
        _formData.append('title', formData.title)
        _formData.append('description', formData.description)
        _formData.append('page_count', formData.page_count.toString())
        _formData.append('publisher', formData.publisher)
        _formData.append('character', formData.character)

        try {
            const res = await axios.post(`${window.location.origin}/api/comics/add-book`, _formData, config);
            console.log(res)
            res['data']['new_book'] ? toast.success('Book Added!') : toast.error('Something went wrong...')
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong...');
        }
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
                    <div className='form-group mt-3'>
                        <Autocomplete
                            options={publisherOptions}
                            getOptionLabel={(option) => option['name']}
                            renderInput={params => <TextField {...params} label="Publisher" variant="standard" />}
                            onChange={(e, publisher) => setFormData({ ...formData, publisher: publisher['key'] })}
                        />
                    </div>
                    <div className='form-group mt-3'>
                        <Autocomplete
                            options={characterOptions}
                            getOptionLabel={(option) => option['name']}
                            renderInput={params => <TextField {...params} label="Character" variant="standard" />}
                            onChange={(e, character) => setFormData({ ...formData, character: character['name'] })}
                        />
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

const mapStateToProps = state => ({})
export default connect(mapStateToProps, {})(AddOmnibus)

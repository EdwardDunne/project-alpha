import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import httpUtil from '../../utils/httpUtil';
import { Autocomplete, TextField } from '@mui/material';
import { getAllPublishers } from '../../actions/comics';

const AddCharacter = () => {

    const [formData, setFormData] = useState({ name: '', publisher: '', });
    const [publisherOptions, setPublisherOptions] = useState([])

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Get Publishers list
    useEffect(() => {
        _getAllPublishers()
    }, [])

    const _getAllPublishers = async () => {
        const res = await getAllPublishers()
        if (res['data'] && res['data']['success']) 
            setPublisherOptions(res['data']['publishers'])
    }

    const onSubmit = async e => {
        e.preventDefault();
        const config = {
            headers: httpUtil.get_headers('POST')
        };
    
        const body = JSON.stringify({
            name: formData.name,
            publisher: formData.publisher,
        });

        try {
            const res = await axios.post(`${window.location.origin}/api/comics/add-character`, body, config);
            res['data']['new_character'] ? toast.success('Character Added!') : toast.error('Something went wrong...')
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
                    <div className='form-group mt-3'>
                        <Autocomplete
                            options={publisherOptions}
                            getOptionLabel={(option) => option['name']}
                            renderInput={params => <TextField {...params} label="Publisher" variant="standard" />}
                            onChange={(e, publisher) => setFormData({ ...formData, publisher: publisher['key'] })}
                        />
                    </div>
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

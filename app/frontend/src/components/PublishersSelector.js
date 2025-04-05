import { Autocomplete, TextField } from '@mui/material';
import { getAllPublishers } from '../actions/comics';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';

const PublishersSelector = ({ setPublisher }) => {
    const [publisherOptions, setPublisherOptions] = useState([])

    useEffect(() => {
        _getAllPublishers()
    }, [])

    const _getAllPublishers = async () => {
        const res = await getAllPublishers()
        if (res['data'] && res['data']['success']) 
            setPublisherOptions(
                res['data']['publishers']
                    .sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
            )
    }

    return (
        <div className='form-group mt-3'>
            <Autocomplete
                id="filled-basic"
                options={publisherOptions}
                getOptionLabel={(option) => option['name']}
                renderInput={params => 
                    <TextField {...params} label="Publisher" variant="filled" />}
                onChange={(e, publisher) => setPublisher(publisher)}
            />
        </div>
    )
}

const mapStateToProps = state => ({})
export default connect(mapStateToProps, {})(PublishersSelector)

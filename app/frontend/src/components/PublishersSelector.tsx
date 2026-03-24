import { Autocomplete, TextField } from '@mui/material';
import { getAllPublishers } from '../actions/comics';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { Publisher } from '../types';
import { RootState } from '../reducers';

interface Props {
    setPublisher: (publisher: Publisher | null) => void;
    variant?: 'standard' | 'outlined' | 'filled';
    allPublishers: Publisher[];
    getAllPublishers: () => void;
}

const PublishersSelector: React.FC<Props> = ({ setPublisher, variant = 'standard', allPublishers, getAllPublishers }) => {
    const [publisherOptions, setPublisherOptions] = useState<Publisher[]>([])

    // Use allPublishers cache if it is not empty
    useEffect(() => {
        allPublishers.length ? _setPublisherOptions(allPublishers) : getAllPublishers()
    }, [])

    useEffect(() => {
        _setPublisherOptions(allPublishers)
    }, [allPublishers]);

    const _setPublisherOptions = (publishers: Publisher[]) => {
        setPublisherOptions(
            [...publishers]
                .sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
        )
    }

    return (
        <div className='form-group mt-3'>
            <Autocomplete
                id="filled-basic"
                options={publisherOptions}
                getOptionLabel={(option) => option['name']}
                renderInput={params =>
                    <TextField {...params} label="Publisher" variant={variant} />}
                onChange={(e, publisher) => setPublisher(publisher)}
            />
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    allPublishers: state.comics.all_publishers
})
export default connect(mapStateToProps, { getAllPublishers })(PublishersSelector)

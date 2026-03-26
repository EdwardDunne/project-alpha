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
        <div className='mt-3'>
            <Autocomplete
                id="publisher-selector"
                options={publisherOptions}
                getOptionLabel={(option) => option['name']}
                renderInput={params =>
                    <TextField {...params} label="Publisher" variant={variant}
                        InputProps={{ ...params.InputProps, sx: { fontSize: '1.6rem' } }}
                        InputLabelProps={{ ...params.InputLabelProps, sx: { fontSize: '1.6rem' } }}
                    />}
                onChange={(e, publisher) => setPublisher(publisher)}
                slotProps={{ paper: { sx: { fontSize: '1.6rem' } } }}
            />
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    allPublishers: state.comics.all_publishers
})
export default connect(mapStateToProps, { getAllPublishers })(PublishersSelector)

import { Autocomplete, TextField } from '@mui/material';
import { getAllPublishers } from '../actions/comics';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { Publisher } from '../types';
import { RootState } from '../reducers';

interface Props {
    setPublishers: (publishers: Publisher[]) => void;
    variant?: 'standard' | 'outlined' | 'filled';
    allPublishers: Publisher[];
    getAllPublishers: () => void;
    initialPublisherIds?: number[];
}

const PublishersMultiSelector: React.FC<Props> = ({ setPublishers, variant = 'standard', allPublishers, getAllPublishers, initialPublisherIds }) => {
    const [publisherOptions, setPublisherOptions] = useState<Publisher[]>([])
    const [selectedPublishers, setSelectedPublishers] = useState<Publisher[]>([])
    const [hasAppliedInitial, setHasAppliedInitial] = useState(false)

    useEffect(() => {
        allPublishers.length ? _setPublisherOptions(allPublishers) : getAllPublishers()
    }, [])

    useEffect(() => {
        _setPublisherOptions(allPublishers)
    }, [allPublishers]);

    useEffect(() => {
        if (initialPublisherIds?.length && !hasAppliedInitial && publisherOptions.length) {
            const matches = publisherOptions.filter(p => initialPublisherIds.includes(p.id))
            if (matches.length) {
                setSelectedPublishers(matches)
                setPublishers(matches)
                setHasAppliedInitial(true)
            }
        }
    }, [initialPublisherIds, publisherOptions]);

    const _setPublisherOptions = (publishers: Publisher[]) => {
        setPublisherOptions(
            [...publishers]
                .sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
        )
    }

    return (
        <div className='mt-3'>
            <Autocomplete
                multiple
                id="publisher-multi-selector"
                options={publisherOptions}
                value={selectedPublishers}
                getOptionLabel={(option) => option['name']}
                renderInput={params =>
                    <TextField {...params} label="Publishers" variant={variant}
                        InputProps={{ ...params.InputProps, sx: { fontSize: '1.6rem' } }}
                        InputLabelProps={{ ...params.InputLabelProps, sx: { fontSize: '1.6rem' } }}
                    />}
                onChange={(e, publishers) => { setSelectedPublishers(publishers); setPublishers(publishers) }}
                slotProps={{ paper: { sx: { fontSize: '1.6rem' } } }}
                sx={{
                    '& .MuiChip-root': { height: 'auto', paddingY: '4px' },
                    '& .MuiChip-label': { fontSize: '1.4rem', whiteSpace: 'normal' },
                    '& .MuiAutocomplete-popupIndicator svg': { fontSize: '2rem' },
                    '& .MuiAutocomplete-clearIndicator svg': { fontSize: '2rem' },
                }}
            />
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    allPublishers: state.comics.all_publishers
})
export default connect(mapStateToProps, { getAllPublishers })(PublishersMultiSelector)

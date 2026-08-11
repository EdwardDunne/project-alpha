import { Autocomplete, TextField } from '@mui/material';
import { getAllAuthors } from '../actions/comics';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { Author } from '../types';
import { RootState } from '../reducers';

interface Props {
    setAuthors: (authors: Author[]) => void;
    variant?: 'standard' | 'outlined' | 'filled';
    allAuthors: Author[];
    getAllAuthors: () => void;
    initialAuthorIds?: number[];
}

const AuthorsSelector: React.FC<Props> = ({ setAuthors, variant = 'standard', allAuthors, getAllAuthors, initialAuthorIds }) => {
    const [authorOptions, setAuthorOptions] = useState<Author[]>([])
    const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([])
    const [hasAppliedInitial, setHasAppliedInitial] = useState(false)

    useEffect(() => {
        allAuthors.length ? _setAuthorOptions(allAuthors) : getAllAuthors()
    }, [])

    useEffect(() => {
        _setAuthorOptions(allAuthors)
    }, [allAuthors]);

    useEffect(() => {
        if (initialAuthorIds?.length && !hasAppliedInitial && authorOptions.length) {
            const matches = authorOptions.filter(a => initialAuthorIds.includes(a.id))
            if (matches.length) {
                setSelectedAuthors(matches)
                setAuthors(matches)
                setHasAppliedInitial(true)
            }
        }
    }, [initialAuthorIds, authorOptions]);

    const _setAuthorOptions = (authors: Author[]) => {
        setAuthorOptions(
            [...authors]
                .sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
        )
    }

    return (
        <div className='mt-3'>
            <Autocomplete
                multiple
                disableCloseOnSelect
                id="author-selector"
                options={authorOptions}
                value={selectedAuthors}
                getOptionLabel={(option) => option['name']}
                renderInput={params =>
                    <TextField {...params} label="Authors" variant={variant}
                        InputProps={{ ...params.InputProps, sx: { fontSize: '1.6rem' } }}
                        InputLabelProps={{ ...params.InputLabelProps, sx: { fontSize: '1.6rem' } }}
                    />}
                onChange={(e, authors) => { setSelectedAuthors(authors); setAuthors(authors) }}
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
    allAuthors: state.comics.all_authors
})
export default connect(mapStateToProps, { getAllAuthors })(AuthorsSelector)

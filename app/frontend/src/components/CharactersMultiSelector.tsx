import { Autocomplete, TextField } from '@mui/material';
import { getAllCharacters } from '../actions/comics';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { Character } from '../types';
import { RootState } from '../reducers';

interface Props {
    setCharacters: (characters: Character[]) => void;
    variant?: 'standard' | 'outlined' | 'filled';
    allCharacters: Character[];
    getAllCharacters: () => void;
    initialCharacterIds?: number[];
}

const CharactersMultiSelector: React.FC<Props> = ({ setCharacters, variant = 'standard', allCharacters, getAllCharacters, initialCharacterIds }) => {
    const [characterOptions, setCharacterOptions] = useState<Character[]>([])
    const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([])
    const [hasAppliedInitial, setHasAppliedInitial] = useState(false)

    useEffect(() => {
        allCharacters.length ? _setCharacterOptions(allCharacters) : getAllCharacters()
    }, [])

    useEffect(() => {
        _setCharacterOptions(allCharacters)
    }, [allCharacters]);

    useEffect(() => {
        if (initialCharacterIds?.length && !hasAppliedInitial && characterOptions.length) {
            const matches = characterOptions.filter(c => initialCharacterIds.includes(c.id))
            if (matches.length) {
                setSelectedCharacters(matches)
                setCharacters(matches)
                setHasAppliedInitial(true)
            }
        }
    }, [initialCharacterIds, characterOptions]);

    const _setCharacterOptions = (characters: Character[]) => {
        setCharacterOptions(
            [...characters]
                .sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
        )
    }

    return (
        <div className='mt-3'>
            <Autocomplete
                multiple
                disableCloseOnSelect
                id="character-multi-selector"
                options={characterOptions}
                value={selectedCharacters}
                getOptionLabel={(option) => option['name']}
                renderInput={params =>
                    <TextField {...params} label="Characters" variant={variant}
                        InputProps={{ ...params.InputProps, sx: { fontSize: '1.6rem' } }}
                        InputLabelProps={{ ...params.InputLabelProps, sx: { fontSize: '1.6rem' } }}
                    />}
                onChange={(e, characters) => { setSelectedCharacters(characters); setCharacters(characters) }}
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
    allCharacters: state.comics.all_characters
})
export default connect(mapStateToProps, { getAllCharacters })(CharactersMultiSelector)

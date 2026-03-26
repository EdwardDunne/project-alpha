import { Autocomplete, TextField } from '@mui/material';
import { getAllCharacters } from '../actions/comics';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { Character } from '../types';
import { RootState } from '../reducers';

interface Props {
    setCharacter: (character: Character | null) => void;
    variant?: 'standard' | 'outlined' | 'filled';
    allCharacters: Character[];
    getAllCharacters: () => void;
}

const CharactersSelector: React.FC<Props> = ({ setCharacter, variant = 'standard', allCharacters, getAllCharacters }) => {
    const [characterOptions, setCharacterOptions] = useState<Character[]>([])

    useEffect(() => {
        allCharacters.length ? _setCharacterOptions(allCharacters) : getAllCharacters()
    }, [])

    useEffect(() => {
        _setCharacterOptions(allCharacters)
    }, [allCharacters]);

    const _setCharacterOptions = (characters: Character[]) => {
        setCharacterOptions(
            [...characters]
                .sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
        )
    }

    return (
        <div className='mt-3'>
            <Autocomplete
                id="character-selector"
                options={characterOptions}
                getOptionLabel={(option) => option['name']}
                renderInput={params =>
                    <TextField {...params} label="Character" variant={variant}
                        InputProps={{ ...params.InputProps, sx: { fontSize: '1.6rem' } }}
                        InputLabelProps={{ ...params.InputLabelProps, sx: { fontSize: '1.6rem' } }}
                    />}
                onChange={(e, character) => setCharacter(character)}
                slotProps={{ paper: { sx: { fontSize: '1.6rem' } } }}
            />
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    allCharacters: state.comics.all_characters
})
export default connect(mapStateToProps, { getAllCharacters })(CharactersSelector)

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

    // Use allCharacters cache if it is not empty
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
        <div className='form-group mt-3'>
            <Autocomplete
                id="filled-basic"
                options={characterOptions}
                getOptionLabel={(option) => option['name']}
                renderInput={params =>
                    <TextField {...params} label="Character" variant={variant} />}
                onChange={(e, character) => setCharacter(character)}
            />
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    allCharacters: state.comics.all_characters
})
export default connect(mapStateToProps, { getAllCharacters })(CharactersSelector)

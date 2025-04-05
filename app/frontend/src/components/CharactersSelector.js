import { Autocomplete, TextField } from '@mui/material';
import { getAllCharacters } from '../actions/comics';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';

const CharactersSelector = ({ setCharacter, variant = 'standard', allCharacters, getAllCharacters }) => {
    const [characterOptions, setCharacterOptions] = useState([])

    // Use allCharacters cache if it is not empty
    useEffect(() => {
        allCharacters.length ? _setCharacterOptions(allCharacters) : getAllCharacters()
    }, [])

    useEffect(() => {
        _setCharacterOptions(allCharacters)
    }, [allCharacters]);

    const _setCharacterOptions = (characters) => {
        setCharacterOptions(
            characters
                .sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
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

const mapStateToProps = state => ({
    allCharacters: state.comics.all_characters
})
export default connect(mapStateToProps, { getAllCharacters })(CharactersSelector)

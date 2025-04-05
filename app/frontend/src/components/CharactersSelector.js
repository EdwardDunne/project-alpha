import { Autocomplete, TextField } from '@mui/material';
import { getAllCharacters } from '../actions/comics';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';

const CharactersSelector = ({ setCharacter }) => {
    const [characterOptions, setCharacterOptions] = useState([])

    useEffect(() => {
        _getAllCharacters()
    }, [])

    const _getAllCharacters = async () => {
        const res = await getAllCharacters()
        if (res['data'] && res['data']['success']) 
            setCharacterOptions(
                res['data']['characters']
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
                    <TextField {...params} label="Character" variant="filled" />}
                onChange={(e, character) => setCharacter(character)}
            />
        </div>
    )
}

const mapStateToProps = state => ({})
export default connect(mapStateToProps, {})(CharactersSelector)

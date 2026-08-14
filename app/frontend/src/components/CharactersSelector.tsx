import { Autocomplete, TextField } from "@mui/material"
import { getAllCharacters } from "../actions/comics"
import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { Character } from "../types"
import { RootState } from "../reducers"

interface Props {
    setCharacter: (character: Character | null) => void
    variant?: "standard" | "outlined" | "filled"
    allCharacters: Character[]
    getAllCharacters: () => void
    initialCharacterId?: number
}

const CharactersSelector: React.FC<Props> = ({
    setCharacter,
    variant = "standard",
    allCharacters,
    getAllCharacters,
    initialCharacterId,
}) => {
    const [characterOptions, setCharacterOptions] = useState<Character[]>([])
    const [selectedCharacter, setSelectedCharacter] =
        useState<Character | null>(null)

    useEffect(() => {
        allCharacters.length
            ? _setCharacterOptions(allCharacters)
            : getAllCharacters()
    }, [])

    useEffect(() => {
        _setCharacterOptions(allCharacters)
    }, [allCharacters])

    useEffect(() => {
        if (initialCharacterId && !selectedCharacter) {
            const match = characterOptions.find(
                (c) => c.id === initialCharacterId,
            )
            if (match) {
                setSelectedCharacter(match)
                setCharacter(match)
            }
        }
    }, [initialCharacterId, characterOptions])

    const _setCharacterOptions = (characters: Character[]) => {
        // Already sorted server-side
        setCharacterOptions(characters)
    }

    return (
        <div className="mt-3">
            <Autocomplete
                id="character-selector"
                options={characterOptions}
                value={selectedCharacter}
                getOptionLabel={(option) => option["name"]}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Character"
                        variant={variant}
                        InputProps={{
                            ...params.InputProps,
                            sx: { fontSize: "1.6rem" },
                        }}
                        InputLabelProps={{
                            ...params.InputLabelProps,
                            sx: { fontSize: "1.6rem" },
                        }}
                    />
                )}
                onChange={(e, character) => {
                    setSelectedCharacter(character)
                    setCharacter(character)
                }}
                slotProps={{ paper: { sx: { fontSize: "1.6rem" } } }}
                sx={{
                    "& .MuiAutocomplete-popupIndicator svg": {
                        fontSize: "2rem",
                    },
                    "& .MuiAutocomplete-clearIndicator svg": {
                        fontSize: "2rem",
                    },
                }}
            />
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    allCharacters: state.comics.all_characters,
})
export default connect(mapStateToProps, { getAllCharacters })(
    CharactersSelector,
)

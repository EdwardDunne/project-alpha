import { Autocomplete, TextField } from "@mui/material"
import { getAllCharacters } from "../actions/comics"
import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { Character } from "../types"
import { RootState } from "../reducers"
import MobileMultiSelect from "./MobileMultiSelect"
import { useSyncSelectedFromIds } from "../hooks/useSyncSelectedFromIds"

interface Props {
    setCharacters: (characters: Character[]) => void
    variant?: "standard" | "outlined" | "filled"
    allCharacters: Character[]
    getAllCharacters: () => void
    initialCharacterIds?: number[]
}

const CharactersMultiSelector: React.FC<Props> = ({
    setCharacters,
    variant = "standard",
    allCharacters,
    getAllCharacters,
    initialCharacterIds,
}) => {
    const [characterOptions, setCharacterOptions] = useState<Character[]>([])
    const [selectedCharacters, setSelectedCharacters] = useState<Character[]>(
        [],
    )

    useEffect(() => {
        allCharacters.length
            ? _setCharacterOptions(allCharacters)
            : getAllCharacters()
    }, [])

    useEffect(() => {
        _setCharacterOptions(allCharacters)
    }, [allCharacters])

    useSyncSelectedFromIds(
        initialCharacterIds,
        characterOptions,
        selectedCharacters,
        setSelectedCharacters,
    )

    const _setCharacterOptions = (characters: Character[]) => {
        // Already sorted server-side
        setCharacterOptions(characters)
    }

    return (
        <>
            <div className="hidden md:block mt-3">
                <Autocomplete
                    multiple
                    disableCloseOnSelect
                    id="character-multi-selector"
                    options={characterOptions}
                    value={selectedCharacters}
                    getOptionLabel={(option) => option["name"]}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Characters"
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
                    onChange={(e, characters) => {
                        setSelectedCharacters(characters)
                        setCharacters(characters)
                    }}
                    slotProps={{ paper: { sx: { fontSize: "1.6rem" } } }}
                    sx={{
                        "& .MuiChip-root": {
                            height: "auto",
                            paddingY: "4px",
                        },
                        "& .MuiChip-label": {
                            fontSize: "1.4rem",
                            whiteSpace: "normal",
                        },
                        "& .MuiAutocomplete-popupIndicator svg": {
                            fontSize: "2rem",
                        },
                        "& .MuiAutocomplete-clearIndicator svg": {
                            fontSize: "2rem",
                        },
                    }}
                />
            </div>
            <MobileMultiSelect
                label="Characters"
                options={characterOptions}
                selected={selectedCharacters}
                onChange={(next) => {
                    setSelectedCharacters(next)
                    setCharacters(next)
                }}
                getOptionLabel={(c) => c.name}
                searchPlaceholder="Find a character..."
            />
        </>
    )
}

const mapStateToProps = (state: RootState) => ({
    allCharacters: state.comics.allCharacters,
})
export default connect(mapStateToProps, { getAllCharacters })(
    CharactersMultiSelector,
)

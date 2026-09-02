import { Autocomplete, TextField } from "@mui/material"
import { getAllArtists } from "../actions/comics"
import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { Artist } from "../types"
import { RootState } from "../reducers"
import MobileMultiSelect from "./MobileMultiSelect"
import { useSyncSelectedFromIds } from "../hooks/useSyncSelectedFromIds"

interface Props {
    setArtists: (artists: Artist[]) => void
    variant?: "standard" | "outlined" | "filled"
    allArtists: Artist[]
    getAllArtists: () => void
    initialArtistIds?: number[]
}

const ArtistsSelector: React.FC<Props> = ({
    setArtists,
    variant = "standard",
    allArtists,
    getAllArtists,
    initialArtistIds,
}) => {
    const [artistOptions, setArtistOptions] = useState<Artist[]>([])
    const [selectedArtists, setSelectedArtists] = useState<Artist[]>([])

    useEffect(() => {
        allArtists.length ? _setArtistOptions(allArtists) : getAllArtists()
    }, [])

    useEffect(() => {
        _setArtistOptions(allArtists)
    }, [allArtists])

    useSyncSelectedFromIds(
        initialArtistIds,
        artistOptions,
        selectedArtists,
        setSelectedArtists,
    )

    const _setArtistOptions = (artists: Artist[]) => {
        // Already sorted server-side
        setArtistOptions(artists)
    }

    return (
        <>
            <div className="hidden md:block mt-3">
                <Autocomplete
                    multiple
                    disableCloseOnSelect
                    id="artist-selector"
                    options={artistOptions}
                    value={selectedArtists}
                    getOptionLabel={(option) => option["name"]}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Artists"
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
                    onChange={(e, artists) => {
                        setSelectedArtists(artists)
                        setArtists(artists)
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
                label="Artists"
                options={artistOptions}
                selected={selectedArtists}
                onChange={(next) => {
                    setSelectedArtists(next)
                    setArtists(next)
                }}
                getOptionLabel={(a) => a.name}
                searchPlaceholder="Find an artist..."
            />
        </>
    )
}

const mapStateToProps = (state: RootState) => ({
    allArtists: state.comics.allArtists,
})
export default connect(mapStateToProps, { getAllArtists })(ArtistsSelector)

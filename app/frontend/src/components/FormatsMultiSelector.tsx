import { Autocomplete, TextField } from "@mui/material"
import { getAllFormats } from "../actions/comics"
import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { Format } from "../types"
import { RootState } from "../reducers"
import MobileMultiSelect from "./MobileMultiSelect"
import { useSyncSelectedFromIds } from "../hooks/useSyncSelectedFromIds"

interface Props {
    setFormats: (formats: Format[]) => void
    variant?: "standard" | "outlined" | "filled"
    allFormats: Format[]
    getAllFormats: () => void
    initialFormatIds?: number[]
}

const FormatsMultiSelector: React.FC<Props> = ({
    setFormats,
    variant = "standard",
    allFormats,
    getAllFormats,
    initialFormatIds,
}) => {
    const [formatOptions, setFormatOptions] = useState<Format[]>([])
    const [selectedFormats, setSelectedFormats] = useState<Format[]>([])

    useEffect(() => {
        allFormats.length ? _setFormatOptions(allFormats) : getAllFormats()
    }, [])

    useEffect(() => {
        _setFormatOptions(allFormats)
    }, [allFormats])

    useSyncSelectedFromIds(
        initialFormatIds,
        formatOptions,
        selectedFormats,
        setSelectedFormats,
    )

    const _setFormatOptions = (formats: Format[]) => {
        // Already sorted server-side
        setFormatOptions(formats)
    }

    return (
        <>
            <div className="hidden md:block mt-3">
                <Autocomplete
                    multiple
                    disableCloseOnSelect
                    id="format-multi-selector"
                    options={formatOptions}
                    value={selectedFormats}
                    getOptionLabel={(option) =>
                        `${option["name"]} (${option["abbreviation"]})`
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Formats"
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
                    onChange={(e, formats) => {
                        setSelectedFormats(formats)
                        setFormats(formats)
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
                label="Formats"
                options={formatOptions}
                selected={selectedFormats}
                onChange={(next) => {
                    setSelectedFormats(next)
                    setFormats(next)
                }}
                getOptionLabel={(f) => `${f.name} (${f.abbreviation})`}
                searchPlaceholder="Find a format..."
            />
        </>
    )
}

const mapStateToProps = (state: RootState) => ({
    allFormats: state.comics.allFormats,
})
export default connect(mapStateToProps, { getAllFormats })(
    FormatsMultiSelector,
)

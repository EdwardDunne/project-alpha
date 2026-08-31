import { Autocomplete, TextField } from "@mui/material"
import { getAllFormats } from "../actions/comics"
import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { Format } from "../types"
import { RootState } from "../reducers"

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
    const [hasAppliedInitial, setHasAppliedInitial] = useState(false)

    useEffect(() => {
        allFormats.length ? _setFormatOptions(allFormats) : getAllFormats()
    }, [])

    useEffect(() => {
        _setFormatOptions(allFormats)
    }, [allFormats])

    useEffect(() => {
        if (
            initialFormatIds?.length &&
            !hasAppliedInitial &&
            formatOptions.length
        ) {
            const matches = formatOptions.filter((f) =>
                initialFormatIds.includes(f.id),
            )
            if (matches.length) {
                setSelectedFormats(matches)
                setFormats(matches)
                setHasAppliedInitial(true)
            }
        }
    }, [initialFormatIds, formatOptions])

    const _setFormatOptions = (formats: Format[]) => {
        // Already sorted server-side
        setFormatOptions(formats)
    }

    return (
        <div className="mt-3">
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
                    "& .MuiChip-root": { height: "auto", paddingY: "4px" },
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
    )
}

const mapStateToProps = (state: RootState) => ({
    allFormats: state.comics.allFormats,
})
export default connect(mapStateToProps, { getAllFormats })(
    FormatsMultiSelector,
)

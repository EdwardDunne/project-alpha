import { Autocomplete, TextField } from "@mui/material"
import { getAllFormats } from "../actions/comics"
import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { Format } from "../types"
import { RootState } from "../reducers"

interface Props {
    setFormat: (format: Format | null) => void
    variant?: "standard" | "outlined" | "filled"
    allFormats: Format[]
    getAllFormats: () => void
    initialFormatId?: number
    extraClasses?: string
}

const FormatSelector: React.FC<Props> = ({
    setFormat,
    variant = "standard",
    allFormats,
    getAllFormats,
    initialFormatId,
    extraClasses,
}) => {
    const [formatOptions, setFormatOptions] = useState<Format[]>([])
    const [selectedFormat, setSelectedFormat] = useState<Format | null>(null)

    useEffect(() => {
        allFormats.length ? _setFormatOptions(allFormats) : getAllFormats()
    }, [])

    useEffect(() => {
        _setFormatOptions(allFormats)
    }, [allFormats])

    useEffect(() => {
        if (initialFormatId && !selectedFormat) {
            const match = formatOptions.find((f) => f.id === initialFormatId)
            if (match) {
                setSelectedFormat(match)
                setFormat(match)
            }
        }
    }, [initialFormatId, formatOptions])

    const _setFormatOptions = (formats: Format[]) => {
        // Already sorted server-side
        setFormatOptions(formats)
    }

    return (
        <div className={"mt-3 " + extraClasses}>
            <Autocomplete
                id="format-selector"
                options={formatOptions}
                value={selectedFormat}
                getOptionLabel={(option) =>
                    `${option["name"]} (${option["abbreviation"]})`
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Format"
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
                onChange={(e, format) => {
                    setSelectedFormat(format)
                    setFormat(format)
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
    allFormats: state.comics.allFormats,
})
export default connect(mapStateToProps, { getAllFormats })(FormatSelector)

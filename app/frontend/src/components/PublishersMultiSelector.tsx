import { Autocomplete, TextField } from "@mui/material"
import { getAllPublishers } from "../actions/comics"
import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { Publisher } from "../types"
import { RootState } from "../reducers"
import MobileMultiSelect from "./MobileMultiSelect"
import { useSyncSelectedFromIds } from "../hooks/useSyncSelectedFromIds"

interface Props {
    setPublishers: (publishers: Publisher[]) => void
    variant?: "standard" | "outlined" | "filled"
    allPublishers: Publisher[]
    getAllPublishers: () => void
    initialPublisherIds?: number[]
}

const PublishersMultiSelector: React.FC<Props> = ({
    setPublishers,
    variant = "standard",
    allPublishers,
    getAllPublishers,
    initialPublisherIds,
}) => {
    const [publisherOptions, setPublisherOptions] = useState<Publisher[]>([])
    const [selectedPublishers, setSelectedPublishers] = useState<Publisher[]>(
        [],
    )

    useEffect(() => {
        allPublishers.length
            ? _setPublisherOptions(allPublishers)
            : getAllPublishers()
    }, [])

    useEffect(() => {
        _setPublisherOptions(allPublishers)
    }, [allPublishers])

    useSyncSelectedFromIds(
        initialPublisherIds,
        publisherOptions,
        selectedPublishers,
        setSelectedPublishers,
    )

    const _setPublisherOptions = (publishers: Publisher[]) => {
        // Already sorted server-side
        setPublisherOptions(publishers)
    }

    return (
        <>
            <div className="hidden md:block mt-3">
                <Autocomplete
                    multiple
                    disableCloseOnSelect
                    id="publisher-multi-selector"
                    options={publisherOptions}
                    value={selectedPublishers}
                    getOptionLabel={(option) => option["name"]}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Publishers"
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
                    onChange={(e, publishers) => {
                        setSelectedPublishers(publishers)
                        setPublishers(publishers)
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
                label="Publishers"
                options={publisherOptions}
                selected={selectedPublishers}
                onChange={(next) => {
                    setSelectedPublishers(next)
                    setPublishers(next)
                }}
                getOptionLabel={(p) => p.name}
                searchPlaceholder="Find a publisher..."
            />
        </>
    )
}

const mapStateToProps = (state: RootState) => ({
    allPublishers: state.comics.allPublishers,
})
export default connect(mapStateToProps, { getAllPublishers })(
    PublishersMultiSelector,
)

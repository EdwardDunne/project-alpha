import { Autocomplete, TextField } from "@mui/material"
import { getAllPublishers } from "../actions/comics"
import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { Publisher } from "../types"
import { RootState } from "../reducers"

interface Props {
    setPublisher: (publisher: Publisher | null) => void
    variant?: "standard" | "outlined" | "filled"
    allPublishers: Publisher[]
    getAllPublishers: () => void
    initialPublisherId?: number
    extraClasses?: string
}

const PublishersSelector: React.FC<Props> = ({
    setPublisher,
    variant = "standard",
    allPublishers,
    getAllPublishers,
    initialPublisherId,
    extraClasses,
}) => {
    const [publisherOptions, setPublisherOptions] = useState<Publisher[]>([])
    const [selectedPublisher, setSelectedPublisher] =
        useState<Publisher | null>(null)

    useEffect(() => {
        allPublishers.length
            ? _setPublisherOptions(allPublishers)
            : getAllPublishers()
    }, [])

    useEffect(() => {
        _setPublisherOptions(allPublishers)
    }, [allPublishers])

    useEffect(() => {
        if (initialPublisherId && !selectedPublisher) {
            const match = publisherOptions.find(
                (p) => p.id === initialPublisherId,
            )
            if (match) {
                setSelectedPublisher(match)
                setPublisher(match)
            }
        }
    }, [initialPublisherId, publisherOptions])

    const _setPublisherOptions = (publishers: Publisher[]) => {
        // Already sorted server-side
        setPublisherOptions(publishers)
    }

    return (
        <div className={"mt-3 " + extraClasses}>
            <Autocomplete
                id="publisher-selector"
                options={publisherOptions}
                value={selectedPublisher}
                getOptionLabel={(option) => option["name"]}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Publisher"
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
                onChange={(e, publisher) => {
                    setSelectedPublisher(publisher)
                    setPublisher(publisher)
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
    allPublishers: state.comics.allPublishers,
})
export default connect(mapStateToProps, { getAllPublishers })(
    PublishersSelector,
)

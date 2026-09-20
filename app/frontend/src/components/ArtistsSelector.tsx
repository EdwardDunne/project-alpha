import { Autocomplete, TextField } from "@mui/material"
import { searchArtists } from "../actions/comics"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { Artist } from "../types"
import VirtualizedMobileMultiSelect from "./VirtualizedMobileMultiSelect"
import { useVirtualizedSearch } from "../hooks/useVirtualizedSearch"
import {
    createVirtualizedListbox,
    VirtualizedPopper,
    VirtualizedSearchController,
} from "./VirtualizedListbox"

interface Props {
    setArtists: (artists: Artist[]) => void
    variant?: "standard" | "outlined" | "filled"
    initialArtists?: Artist[]
}

const ArtistsSelector: React.FC<Props> = ({
    setArtists,
    variant = "standard",
    initialArtists,
}) => {
    const [selectedArtists, setSelectedArtists] = useState<Artist[]>(
        initialArtists ?? [],
    )
    const { query, setQuery, options, hasMore, loading, loadMore } =
        useVirtualizedSearch(searchArtists)

    useEffect(() => {
        if (!initialArtists) return
        const currentIds = selectedArtists.map((a) => a.id)
        const nextIds = initialArtists.map((a) => a.id)
        const inSync =
            currentIds.length === nextIds.length &&
            currentIds.every((id) => nextIds.includes(id))
        if (!inSync) setSelectedArtists(initialArtists)
    }, [initialArtists])

    const controllerRef = useRef<VirtualizedSearchController>({
        hasMore,
        loading,
        loadMore,
    })
    useEffect(() => {
        controllerRef.current = { hasMore, loading, loadMore }
    })
    const ListboxComponent = useMemo(
        () => createVirtualizedListbox(controllerRef),
        [],
    )

    return (
        <>
            <div className="hidden md:block mt-3">
                <Autocomplete
                    multiple
                    disableCloseOnSelect
                    disableListWrap
                    id="artist-selector"
                    options={options}
                    value={selectedArtists}
                    loading={loading}
                    filterOptions={(x) => x}
                    isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                    }
                    onInputChange={(e, value, reason) => {
                        if (reason === "input") setQuery(value)
                        else if (reason === "reset" || reason === "clear")
                            setQuery("")
                    }}
                    ListboxComponent={ListboxComponent}
                    PopperComponent={VirtualizedPopper}
                    getOptionLabel={(option) => option["name"]}
                    renderOption={(props, option) =>
                        [props, option.name] as React.ReactNode
                    }
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
            <VirtualizedMobileMultiSelect
                label="Artists"
                options={options}
                selected={selectedArtists}
                onChange={(next) => {
                    setSelectedArtists(next)
                    setArtists(next)
                }}
                getOptionLabel={(a) => a.name}
                searchPlaceholder="Find an artist..."
                query={query}
                onQueryChange={setQuery}
                hasMore={hasMore}
                loading={loading}
                onLoadMore={loadMore}
            />
        </>
    )
}

export default ArtistsSelector

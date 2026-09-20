import { Autocomplete, TextField } from "@mui/material"
import { searchAuthors } from "../actions/comics"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { Author } from "../types"
import VirtualizedMobileMultiSelect from "./VirtualizedMobileMultiSelect"
import { useVirtualizedSearch } from "../hooks/useVirtualizedSearch"
import {
    createVirtualizedListbox,
    VirtualizedPopper,
    VirtualizedSearchController,
} from "./VirtualizedListbox"

interface Props {
    setAuthors: (authors: Author[]) => void
    variant?: "standard" | "outlined" | "filled"
    initialAuthors?: Author[]
}

const AuthorsSelector: React.FC<Props> = ({
    setAuthors,
    variant = "standard",
    initialAuthors,
}) => {
    const [selectedAuthors, setSelectedAuthors] = useState<Author[]>(
        initialAuthors ?? [],
    )
    const { query, setQuery, options, hasMore, loading, loadMore } =
        useVirtualizedSearch(searchAuthors)

    useEffect(() => {
        if (!initialAuthors) return
        const currentIds = selectedAuthors.map((a) => a.id)
        const nextIds = initialAuthors.map((a) => a.id)
        const inSync =
            currentIds.length === nextIds.length &&
            currentIds.every((id) => nextIds.includes(id))
        if (!inSync) setSelectedAuthors(initialAuthors)
    }, [initialAuthors])

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
            <div className="hidden md:block w-full mt-3">
                <Autocomplete
                    multiple
                    disableCloseOnSelect
                    disableListWrap
                    id="author-selector"
                    options={options}
                    value={selectedAuthors}
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
                            label="Authors"
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
                    onChange={(e, authors) => {
                        setSelectedAuthors(authors)
                        setAuthors(authors)
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
                label="Authors"
                options={options}
                selected={selectedAuthors}
                onChange={(next) => {
                    setSelectedAuthors(next)
                    setAuthors(next)
                }}
                getOptionLabel={(a) => a.name}
                searchPlaceholder="Find an author..."
                query={query}
                onQueryChange={setQuery}
                hasMore={hasMore}
                loading={loading}
                onLoadMore={loadMore}
            />
        </>
    )
}

export default AuthorsSelector

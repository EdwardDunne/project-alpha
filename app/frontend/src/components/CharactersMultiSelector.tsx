import { Autocomplete, TextField } from "@mui/material"
import { searchCharacters } from "../actions/comics"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { Character } from "../types"
import VirtualizedMobileMultiSelect from "./VirtualizedMobileMultiSelect"
import { characterLabel } from "../utils/characterLabel"
import { useVirtualizedSearch } from "../hooks/useVirtualizedSearch"
import {
    createVirtualizedListbox,
    VirtualizedPopper,
    VirtualizedSearchController,
} from "./VirtualizedListbox"

interface Props {
    setCharacters: (characters: Character[]) => void
    variant?: "standard" | "outlined" | "filled"
    initialCharacters?: Character[]
}

const CharactersMultiSelector: React.FC<Props> = ({
    setCharacters,
    variant = "standard",
    initialCharacters,
}) => {
    const [selectedCharacters, setSelectedCharacters] = useState<Character[]>(
        initialCharacters ?? [],
    )
    const { query, setQuery, options, hasMore, loading, loadMore } =
        useVirtualizedSearch(searchCharacters)

    useEffect(() => {
        if (!initialCharacters) return
        const currentIds = selectedCharacters.map((c) => c.id)
        const nextIds = initialCharacters.map((c) => c.id)
        const inSync =
            currentIds.length === nextIds.length &&
            currentIds.every((id) => nextIds.includes(id))
        if (!inSync) setSelectedCharacters(initialCharacters)
    }, [initialCharacters])

    // Reads current hasMore/loading/loadMore via the ref
    // instead of a stale closure. Keeps render consistent
    // for scroll position
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
                    id="character-multi-selector"
                    options={options}
                    value={selectedCharacters}
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
                    getOptionLabel={characterLabel}
                    renderOption={(props, option) =>
                        [props, characterLabel(option)] as React.ReactNode
                    }
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
            <VirtualizedMobileMultiSelect
                label="Characters"
                options={options}
                selected={selectedCharacters}
                onChange={(next) => {
                    setSelectedCharacters(next)
                    setCharacters(next)
                }}
                getOptionLabel={characterLabel}
                searchPlaceholder="Find a character..."
                query={query}
                onQueryChange={setQuery}
                hasMore={hasMore}
                loading={loading}
                onLoadMore={loadMore}
            />
        </>
    )
}

export default CharactersMultiSelector

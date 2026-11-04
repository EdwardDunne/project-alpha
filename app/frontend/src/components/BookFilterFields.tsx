import React from "react"
import { ThemeProvider, Switch, FormControlLabel } from "@mui/material"
import { darkTheme } from "../App"
import { BookFiltersState } from "../hooks/useBookFilters"
import FormatsMultiSelector from "./FormatsMultiSelector"
import PublishersMultiSelector from "./PublishersMultiSelector"
import CharactersMultiSelector from "./CharactersMultiSelector"
import TeamsMultiSelector from "./TeamsMultiSelector"
import AuthorsSelector from "./AuthorsSelector"
import ArtistsSelector from "./ArtistsSelector"

interface Props {
    bookFilters: BookFiltersState
    // Wishlist / Owned toggles (only meaningful for a signed-in user)
    showOwnershipToggles?: boolean
}

const inputClassName =
    "bg-[#3f4a58] border border-gray-500 rounded px-3 py-2 text-[1.4rem] text-white " +
    "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"

const switchLabelSx = { "& .MuiFormControlLabel-label": { fontSize: "1.5rem" } }

// Title search box, styled to match the rest of the filter fields. Kept
// separate from BookFilterFields so each page can place it where it wants.
export const TitleSearchInput: React.FC<{
    bookFilters: BookFiltersState
    className?: string
}> = ({ bookFilters, className = "" }) => (
    <input
        className={`w-full ${inputClassName} ${className}`}
        type="text"
        placeholder="Search title..."
        value={bookFilters.titleSearch}
        onChange={(e) => bookFilters.setTitleSearch(e.target.value)}
    />
)

// Text input with a numeric keyboard rather than type="number", so there
// are no spinner arrows; non-digits are stripped as you type
const PageCountInput: React.FC<{
    placeholder: string
    value: string
    setValue: (value: string) => void
}> = ({ placeholder, value, setValue }) => (
    <input
        className={`w-full min-w-0 ${inputClassName}`}
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value.replace(/\D/g, ""))}
    />
)

// The book filter controls shared by the comics and comics admin pages.
const BookFilterFields: React.FC<Props> = ({
    bookFilters: f,
    showOwnershipToggles = false,
}) => (
    <ThemeProvider theme={darkTheme}>
        {showOwnershipToggles && (
            <div className="flex flex-row mt-2 text-white font-bold">
                <FormControlLabel
                    sx={switchLabelSx}
                    control={
                        <Switch
                            checked={f.wishlistedOnly}
                            onChange={(e) =>
                                f.setWishlistedOnly(e.target.checked)
                            }
                            color="primary"
                        />
                    }
                    label="Wishlist"
                />
                <FormControlLabel
                    sx={switchLabelSx}
                    control={
                        <Switch
                            checked={f.ownedOnly}
                            onChange={(e) => f.setOwnedOnly(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Owned"
                />
            </div>
        )}
        <ul className="list-none p-0">
            <FormatsMultiSelector
                key={`format-${f.resetKey}`}
                setFormats={f.setFormats}
                initialFormatIds={f.formats.map((x) => x.id)}
            />
            <PublishersMultiSelector
                key={`publishers-${f.resetKey}`}
                setPublishers={f.setPublishers}
                initialPublisherIds={f.publishers.map((x) => x.id)}
            />
            <CharactersMultiSelector
                key={`characters-${f.resetKey}`}
                setCharacters={f.setCharacters}
                initialCharacters={f.characters}
            />
            <TeamsMultiSelector
                key={`teams-${f.resetKey}`}
                setTeams={f.setTeams}
                initialTeamIds={f.teams.map((x) => x.id)}
            />
            <AuthorsSelector
                key={`authors-${f.resetKey}`}
                setAuthors={f.setAuthors}
                initialAuthors={f.authors}
            />
            <ArtistsSelector
                key={`artists-${f.resetKey}`}
                setArtists={f.setArtists}
                initialArtists={f.artists}
            />
        </ul>
        <div className="flex gap-3 mt-3">
            <PageCountInput
                placeholder="Min pages..."
                value={f.minPages}
                setValue={f.setMinPages}
            />
            <PageCountInput
                placeholder="Max pages..."
                value={f.maxPages}
                setValue={f.setMaxPages}
            />
        </div>
        <button
            className="w-full mt-3 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors font-semibold text-[1.4rem]"
            onClick={f.clearFilters}
        >
            Clear Filters
        </button>
    </ThemeProvider>
)

export default BookFilterFields

import { Autocomplete, TextField } from "@mui/material"
import { getAllTeams } from "../actions/comics"
import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { Team } from "../types"
import { RootState } from "../reducers"
import MobileMultiSelect from "./MobileMultiSelect"
import { useSyncSelectedFromIds } from "../hooks/useSyncSelectedFromIds"

interface Props {
    setTeams: (teams: Team[]) => void
    variant?: "standard" | "outlined" | "filled"
    allTeams: Team[]
    getAllTeams: () => void
    initialTeamIds?: number[]
}

const TeamsMultiSelector: React.FC<Props> = ({
    setTeams,
    variant = "standard",
    allTeams,
    getAllTeams,
    initialTeamIds,
}) => {
    const [teamOptions, setTeamOptions] = useState<Team[]>([])
    const [selectedTeams, setSelectedTeams] = useState<Team[]>([])

    useEffect(() => {
        allTeams.length ? _setTeamOptions(allTeams) : getAllTeams()
    }, [])

    useEffect(() => {
        _setTeamOptions(allTeams)
    }, [allTeams])

    useSyncSelectedFromIds(
        initialTeamIds,
        teamOptions,
        selectedTeams,
        setSelectedTeams,
    )

    const _setTeamOptions = (teams: Team[]) => {
        // Already sorted server-side
        setTeamOptions(teams)
    }

    return (
        <>
            <div className="hidden md:block mt-3">
                <Autocomplete
                    multiple
                    disableCloseOnSelect
                    id="team-multi-selector"
                    options={teamOptions}
                    value={selectedTeams}
                    getOptionLabel={(option) => option["name"]}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Teams"
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
                    onChange={(e, teams) => {
                        setSelectedTeams(teams)
                        setTeams(teams)
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
                label="Teams"
                options={teamOptions}
                selected={selectedTeams}
                onChange={(next) => {
                    setSelectedTeams(next)
                    setTeams(next)
                }}
                getOptionLabel={(t) => t.name}
                searchPlaceholder="Find a team..."
            />
        </>
    )
}

const mapStateToProps = (state: RootState) => ({
    allTeams: state.comics.allTeams,
})
export default connect(mapStateToProps, { getAllTeams })(TeamsMultiSelector)

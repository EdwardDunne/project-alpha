import { Autocomplete, TextField } from "@mui/material"
import { getAllTeams } from "../actions/comics"
import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { Team } from "../types"
import { RootState } from "../reducers"

interface Props {
    setTeam: (team: Team | null) => void
    variant?: "standard" | "outlined" | "filled"
    allTeams: Team[]
    getAllTeams: () => void
    initialTeamId?: number
    extraClasses?: string
}

const TeamSelector: React.FC<Props> = ({
    setTeam,
    variant = "standard",
    allTeams,
    getAllTeams,
    initialTeamId,
    extraClasses,
}) => {
    const [teamOptions, setTeamOptions] = useState<Team[]>([])
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

    useEffect(() => {
        allTeams.length ? _setTeamOptions(allTeams) : getAllTeams()
    }, [])

    useEffect(() => {
        _setTeamOptions(allTeams)
    }, [allTeams])

    useEffect(() => {
        if (initialTeamId && !selectedTeam) {
            const match = teamOptions.find((t) => t.id === initialTeamId)
            if (match) {
                setSelectedTeam(match)
                setTeam(match)
            }
        }
    }, [initialTeamId, teamOptions])

    const _setTeamOptions = (teams: Team[]) => {
        // Already sorted server-side
        setTeamOptions(teams)
    }

    return (
        <div className={"mt-3 " + extraClasses}>
            <Autocomplete
                id="team-selector"
                options={teamOptions}
                value={selectedTeam}
                getOptionLabel={(option) => option["name"]}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Team"
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
                onChange={(e, team) => {
                    setSelectedTeam(team)
                    setTeam(team)
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
    allTeams: state.comics.allTeams,
})
export default connect(mapStateToProps, { getAllTeams })(TeamSelector)

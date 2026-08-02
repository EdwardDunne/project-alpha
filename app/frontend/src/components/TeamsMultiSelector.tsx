import { Autocomplete, TextField } from '@mui/material';
import { getAllTeams } from '../actions/comics';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { Team } from '../types';
import { RootState } from '../reducers';

interface Props {
    setTeams: (teams: Team[]) => void;
    variant?: 'standard' | 'outlined' | 'filled';
    allTeams: Team[];
    getAllTeams: () => void;
    initialTeamIds?: number[];
}

const TeamsMultiSelector: React.FC<Props> = ({ setTeams, variant = 'standard', allTeams, getAllTeams, initialTeamIds }) => {
    const [teamOptions, setTeamOptions] = useState<Team[]>([])
    const [selectedTeams, setSelectedTeams] = useState<Team[]>([])
    const [hasAppliedInitial, setHasAppliedInitial] = useState(false)

    useEffect(() => {
        allTeams.length ? _setTeamOptions(allTeams) : getAllTeams()
    }, [])

    useEffect(() => {
        _setTeamOptions(allTeams)
    }, [allTeams]);

    useEffect(() => {
        if (initialTeamIds?.length && !hasAppliedInitial && teamOptions.length) {
            const matches = teamOptions.filter(t => initialTeamIds.includes(t.id))
            if (matches.length) {
                setSelectedTeams(matches)
                setTeams(matches)
                setHasAppliedInitial(true)
            }
        }
    }, [initialTeamIds, teamOptions]);

    const _setTeamOptions = (teams: Team[]) => {
        setTeamOptions(
            [...teams]
                .sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
        )
    }

    return (
        <div className='mt-3'>
            <Autocomplete
                multiple
                id="team-multi-selector"
                options={teamOptions}
                value={selectedTeams}
                getOptionLabel={(option) => option['name']}
                renderInput={params =>
                    <TextField {...params} label="Teams" variant={variant}
                        InputProps={{ ...params.InputProps, sx: { fontSize: '1.6rem' } }}
                        InputLabelProps={{ ...params.InputLabelProps, sx: { fontSize: '1.6rem' } }}
                    />}
                onChange={(e, teams) => { setSelectedTeams(teams); setTeams(teams) }}
                slotProps={{ paper: { sx: { fontSize: '1.6rem' } } }}
                sx={{
                    '& .MuiChip-root': { height: 'auto', paddingY: '4px' },
                    '& .MuiChip-label': { fontSize: '1.4rem', whiteSpace: 'normal' },
                    '& .MuiAutocomplete-popupIndicator svg': { fontSize: '2rem' },
                    '& .MuiAutocomplete-clearIndicator svg': { fontSize: '2rem' },
                }}
            />
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    allTeams: state.comics.all_teams
})
export default connect(mapStateToProps, { getAllTeams })(TeamsMultiSelector)

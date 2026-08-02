import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import CharactersMultiSelector from "../../components/CharactersMultiSelector"
import {
    addTeam,
    getAllTeams,
    updateTeam,
    deleteTeam,
} from "../../actions/comics"
import { Team, Character } from "../../types"
import { RootState } from "../../reducers"
import ConfirmDialog from "../../components/ConfirmDialog"

interface Props {
    setDwModalOpen: (open: boolean) => void
    getAllTeams: () => void
    allTeams: Team[]
}

const inputClass =
    "w-[calc(100%-1rem)] border border-gray-300 rounded px-3 py-2 text-[1.4rem] focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
const labelClass = "block text-[1.4rem] font-medium text-gray-700 mb-1"
const editBtnClass =
    "px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors font-semibold text-[1.4rem] whitespace-nowrap"
const deleteBtnClass =
    "px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-semibold text-[1.4rem] whitespace-nowrap"
const saveBtnClass =
    "px-3 py-2 bg-brand text-white rounded hover:bg-brand-dark transition-colors font-semibold text-[1.4rem] whitespace-nowrap"

const ManageTeamsModalContent: React.FC<Props> = ({
    setDwModalOpen,
    getAllTeams,
    allTeams,
}) => {
    const [formData, setFormData] = useState<{
        name: string
        characters: string[]
    }>({ name: "", characters: [] })
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editingName, setEditingName] = useState("")
    const [editingCharacters, setEditingCharacters] = useState<string[]>([])
    const [deleteTarget, setDeleteTarget] = useState<Team | null>(null)
    const [search, setSearch] = useState("")

    useEffect(() => {
        if (!allTeams.length) getAllTeams()
    }, [])

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

    const setCharacters = (characters: Character[]) => {
        setFormData((prev) => ({
            ...prev,
            characters: characters.map((c) => String(c.id)),
        }))
    }

    const resetForm = () => setFormData({ name: "", characters: [] })

    const startEditing = (team: Team) => {
        setEditingId(team.id)
        setEditingName(team.name)
        setEditingCharacters(team.characters.map((id) => String(id)))
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditingName("")
        setEditingCharacters([])
    }

    const saveEditing = (id: number) =>
        updateTeam(
            { id, name: editingName, characters: editingCharacters },
            cancelEditing,
        )

    const sortedTeams = [...allTeams].sort((a, b) =>
        a.name.localeCompare(b.name),
    )
    const filteredTeams = sortedTeams.filter((team) =>
        team.name.toLowerCase().includes(search.toLowerCase()),
    )

    return (
        <div className="flex flex-col w-full">
            <h2 className="text-[2.4rem] font-semibold text-center py-4 border-b border-gray-100">
                Manage Teams
            </h2>
            <div className="pt-4">
                <input
                    className={inputClass}
                    type="text"
                    placeholder="Search teams..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex-1 py-4 space-y-3 max-h-[30rem] overflow-y-auto">
                {filteredTeams.map((team) => (
                    <div
                        key={team.id}
                        className="flex flex-col gap-2 border-b border-gray-100 pb-3"
                    >
                        {editingId === team.id ? (
                            <>
                                <input
                                    className={inputClass}
                                    type="text"
                                    value={editingName}
                                    onChange={(e) =>
                                        setEditingName(e.target.value)
                                    }
                                />
                                <div className="w-[calc(100%-1rem)]">
                                    <CharactersMultiSelector
                                        setCharacters={(characters) =>
                                            setEditingCharacters(
                                                characters.map((c) =>
                                                    String(c.id),
                                                ),
                                            )
                                        }
                                        initialCharacterIds={team.characters}
                                    />
                                </div>
                                <div className="flex justify-end gap-2 w-[calc(100%-1rem)]">
                                    <button
                                        className={saveBtnClass}
                                        onClick={() => saveEditing(team.id)}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className={editBtnClass}
                                        onClick={cancelEditing}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="flex-1 text-[1.4rem]">
                                    {team.name}
                                    {/* For now I don't what the characters shown
                                        next to the team name in this modal */}
                                    {/* {team.character_names?.length
                                        ? ` (${team.character_names.join(", ")})`
                                        : ""} */}
                                </span>
                                <button
                                    className={editBtnClass}
                                    onClick={() => startEditing(team)}
                                >
                                    Edit
                                </button>
                                <button
                                    className={deleteBtnClass}
                                    onClick={() => setDeleteTarget(team)}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="pt-4 border-t border-gray-100 space-y-3">
                <div>
                    <label
                        className={labelClass}
                        htmlFor="name"
                    >
                        Name
                    </label>
                    <input
                        className={inputClass}
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={onChange}
                    />
                </div>
                <CharactersMultiSelector setCharacters={setCharacters} />
                <div className="flex justify-end">
                    <button
                        className="px-5 py-2 bg-brand text-white rounded hover:bg-brand-dark transition-colors font-semibold"
                        onClick={() => addTeam(formData, resetForm)}
                    >
                        Add Team
                    </button>
                </div>
            </div>
            {deleteTarget && (
                <ConfirmDialog
                    message={`Delete team "${deleteTarget.name}"?`}
                    onConfirm={() => {
                        deleteTeam(deleteTarget.id)
                        setDeleteTarget(null)
                    }}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    allTeams: state.comics.all_teams,
})
export default connect(mapStateToProps, { getAllTeams })(
    ManageTeamsModalContent,
)

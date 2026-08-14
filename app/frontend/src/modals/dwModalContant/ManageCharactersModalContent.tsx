import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import PublishersSelector from "../../components/PublishersSelector"
import {
    addCharacter,
    getAllCharacters,
    updateCharacter,
    deleteCharacter,
} from "../../actions/comics"
import { Character, Publisher } from "../../types"
import { RootState } from "../../reducers"
import ConfirmDialog from "../../components/ConfirmDialog"

interface Props {
    getAllCharacters: () => void
    allCharacters: Character[]
    // Lets a paginated book feed (e.g. ComicsAdminPage) refresh itself,
    // since renaming/adding/deleting a character changes books' derived
    // character_names and that feed isn't driven by Redux.
    onDataChanged?: () => void
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

const ManageCharactersModalContent: React.FC<Props> = ({
    getAllCharacters,
    allCharacters,
    onDataChanged,
}) => {
    const [formData, setFormData] = useState({ name: "", publisher: "" })
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editingName, setEditingName] = useState("")
    const [editingPublisher, setEditingPublisher] = useState("")
    const [deleteTarget, setDeleteTarget] = useState<Character | null>(null)
    const [search, setSearch] = useState("")

    useEffect(() => {
        if (!allCharacters.length) getAllCharacters()
    }, [])

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

    const setPublisher = (publisher: Publisher | null) => {
        if (publisher)
            setFormData((prev) => ({
                ...prev,
                publisher: String(publisher.id),
            }))
    }

    const resetForm = () => setFormData({ name: "", publisher: "" })

    const startEditing = (character: Character) => {
        setEditingId(character.id)
        setEditingName(character.name)
        setEditingPublisher(
            character.publisher ? String(character.publisher) : "",
        )
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditingName("")
        setEditingPublisher("")
    }

    const saveEditing = (id: number) =>
        updateCharacter(
            { id, name: editingName, publisher: editingPublisher },
            cancelEditing,
            onDataChanged,
        )

    const sortedCharacters = [...allCharacters].sort((a, b) =>
        a.name.localeCompare(b.name),
    )
    const filteredCharacters = sortedCharacters.filter((character) =>
        character.name.toLowerCase().includes(search.toLowerCase()),
    )

    return (
        <div className="flex flex-col w-full">
            <h2 className="text-[2.4rem] font-semibold text-center py-4 border-b border-gray-100">
                Manage Characters
            </h2>
            <div className="pt-4">
                <input
                    className={inputClass}
                    type="text"
                    placeholder="Search characters..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex-1 py-4 space-y-3 max-h-[30rem] overflow-y-auto">
                {filteredCharacters.map((character) => (
                    <div
                        key={character.id}
                        className="flex flex-col gap-2 border-b border-gray-100 pb-3"
                    >
                        {editingId === character.id ? (
                            <>
                                <input
                                    className={inputClass}
                                    type="text"
                                    value={editingName}
                                    onChange={(e) =>
                                        setEditingName(e.target.value)
                                    }
                                />
                                <PublishersSelector
                                    setPublisher={(p) =>
                                        setEditingPublisher(
                                            p ? String(p.id) : "",
                                        )
                                    }
                                    initialPublisherId={character.publisher}
                                    extraClasses={"w-[calc(100%-1rem)]"}
                                />
                                <div className="flex justify-end gap-2 w-[calc(100%-1rem)]">
                                    <button
                                        className={saveBtnClass}
                                        onClick={() =>
                                            saveEditing(character.id)
                                        }
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
                                    {character.name}
                                </span>
                                <button
                                    className={editBtnClass}
                                    onClick={() => startEditing(character)}
                                >
                                    Edit
                                </button>
                                <button
                                    className={deleteBtnClass}
                                    onClick={() => setDeleteTarget(character)}
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
                <PublishersSelector setPublisher={setPublisher} />
                <div className="flex justify-end">
                    <button
                        className="px-5 py-2 bg-brand text-white rounded hover:bg-brand-dark transition-colors font-semibold"
                        onClick={() =>
                            addCharacter(formData, resetForm, onDataChanged)
                        }
                    >
                        Add Character
                    </button>
                </div>
            </div>
            {deleteTarget && (
                <ConfirmDialog
                    message={`Delete character "${deleteTarget.name}"?`}
                    onConfirm={() => {
                        deleteCharacter(deleteTarget.id, onDataChanged)
                        setDeleteTarget(null)
                    }}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    allCharacters: state.comics.all_characters,
})
export default connect(mapStateToProps, { getAllCharacters })(
    ManageCharactersModalContent,
)

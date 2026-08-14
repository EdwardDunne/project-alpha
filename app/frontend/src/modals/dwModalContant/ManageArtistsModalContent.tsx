import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import {
    addArtist,
    getAllArtists,
    updateArtist,
    deleteArtist,
} from "../../actions/comics"
import { Artist } from "../../types"
import { RootState } from "../../reducers"
import ConfirmDialog from "../../components/ConfirmDialog"

interface Props {
    getAllArtists: () => void
    allArtists: Artist[]
    // Lets a paginated book feed (e.g. ComicsAdminPage) refresh itself,
    // since renaming/adding/deleting an artist changes books' derived
    // artists_data and that feed isn't driven by Redux.
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

const ManageArtistsModalContent: React.FC<Props> = ({
    getAllArtists,
    allArtists,
    onDataChanged,
}) => {
    const [formData, setFormData] = useState({ name: "" })
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editingName, setEditingName] = useState("")
    const [deleteTarget, setDeleteTarget] = useState<Artist | null>(null)
    const [search, setSearch] = useState("")

    useEffect(() => {
        if (!allArtists.length) getAllArtists()
    }, [])

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

    const resetForm = () => setFormData({ name: "" })

    const startEditing = (artist: Artist) => {
        setEditingId(artist.id)
        setEditingName(artist.name)
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditingName("")
    }

    const saveEditing = (id: number) =>
        updateArtist({ id, name: editingName }, cancelEditing, onDataChanged)

    // allArtists already arrives sorted server-side
    const filteredArtists = allArtists.filter((artist) =>
        artist.name.toLowerCase().includes(search.toLowerCase()),
    )

    return (
        <div className="flex flex-col w-full">
            <h2 className="text-[2.4rem] font-semibold text-center py-4 border-b border-gray-100">
                Manage Artists
            </h2>
            <div className="pt-4">
                <input
                    className={inputClass}
                    type="text"
                    placeholder="Search artists..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex-1 py-4 space-y-2 max-h-[30rem] overflow-y-auto">
                {filteredArtists.map((artist) => (
                    <div
                        key={artist.id}
                        className="flex items-center gap-2 border-b border-gray-100 pb-2"
                    >
                        {editingId === artist.id ? (
                            <>
                                <input
                                    className={inputClass}
                                    type="text"
                                    value={editingName}
                                    onChange={(e) =>
                                        setEditingName(e.target.value)
                                    }
                                />
                                <button
                                    className={saveBtnClass}
                                    onClick={() => saveEditing(artist.id)}
                                >
                                    Save
                                </button>
                                <button
                                    className={editBtnClass}
                                    onClick={cancelEditing}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="flex-1 text-[1.4rem]">
                                    {artist.name}
                                </span>
                                <button
                                    className={editBtnClass}
                                    onClick={() => startEditing(artist)}
                                >
                                    Edit
                                </button>
                                <button
                                    className={deleteBtnClass}
                                    onClick={() => setDeleteTarget(artist)}
                                >
                                    Delete
                                </button>
                            </>
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
                <div className="flex justify-end">
                    <button
                        className="px-5 py-2 bg-brand text-white rounded hover:bg-brand-dark transition-colors font-semibold"
                        onClick={() =>
                            addArtist(formData, resetForm, onDataChanged)
                        }
                    >
                        Add Artist
                    </button>
                </div>
            </div>
            {deleteTarget && (
                <ConfirmDialog
                    message={`Delete artist "${deleteTarget.name}"?`}
                    onConfirm={() => {
                        deleteArtist(deleteTarget.id, onDataChanged)
                        setDeleteTarget(null)
                    }}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    allArtists: state.comics.all_artists,
})
export default connect(mapStateToProps, { getAllArtists })(
    ManageArtistsModalContent,
)

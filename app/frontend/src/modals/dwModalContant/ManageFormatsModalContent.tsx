import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import {
    addFormat,
    getAllFormats,
    updateFormat,
    deleteFormat,
} from "../../actions/comics"
import { Format } from "../../types"
import { RootState } from "../../reducers"
import ConfirmDialog from "../../components/ConfirmDialog"

interface Props {
    getAllFormats: () => void
    allFormats: Format[]
    // Lets a paginated book feed (e.g. ComicsAdminPage) refresh itself,
    // since renaming/adding/deleting a format changes books' derived
    // format_data and that feed isn't driven by Redux.
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

const ManageFormatsModalContent: React.FC<Props> = ({
    getAllFormats,
    allFormats,
    onDataChanged,
}) => {
    const [formData, setFormData] = useState({ name: "", abbreviation: "" })
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editingName, setEditingName] = useState("")
    const [editingAbbreviation, setEditingAbbreviation] = useState("")
    const [deleteTarget, setDeleteTarget] = useState<Format | null>(null)
    const [search, setSearch] = useState("")

    useEffect(() => {
        if (!allFormats.length) getAllFormats()
    }, [])

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

    const resetForm = () => setFormData({ name: "", abbreviation: "" })

    const startEditing = (format: Format) => {
        setEditingId(format.id)
        setEditingName(format.name)
        setEditingAbbreviation(format.abbreviation)
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditingName("")
        setEditingAbbreviation("")
    }

    const saveEditing = (id: number) =>
        updateFormat(
            { id, name: editingName, abbreviation: editingAbbreviation },
            cancelEditing,
            onDataChanged,
        )

    // allFormats already arrives sorted server-side
    const filteredFormats = allFormats.filter(
        (format) =>
            format.name.toLowerCase().includes(search.toLowerCase()) ||
            format.abbreviation.toLowerCase().includes(search.toLowerCase()),
    )

    return (
        <div className="flex flex-col w-full">
            <h2 className="text-[2.4rem] font-semibold text-center py-4 border-b border-gray-100">
                Manage Formats
            </h2>
            <div className="pt-4">
                <input
                    className={inputClass}
                    type="text"
                    placeholder="Search formats..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex-1 py-4 space-y-3 max-h-[30rem] overflow-y-auto">
                {filteredFormats.map((format) => (
                    <div
                        key={format.id}
                        className="flex flex-col gap-2 border-b border-gray-100 pb-3"
                    >
                        {editingId === format.id ? (
                            <>
                                <input
                                    className={inputClass}
                                    type="text"
                                    placeholder="Name"
                                    value={editingName}
                                    onChange={(e) =>
                                        setEditingName(e.target.value)
                                    }
                                />
                                <input
                                    className={inputClass}
                                    type="text"
                                    placeholder="Abbreviation"
                                    value={editingAbbreviation}
                                    onChange={(e) =>
                                        setEditingAbbreviation(e.target.value)
                                    }
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        className={saveBtnClass}
                                        onClick={() => saveEditing(format.id)}
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
                                    {format.name} ({format.abbreviation})
                                </span>
                                <button
                                    className={editBtnClass}
                                    onClick={() => startEditing(format)}
                                >
                                    Edit
                                </button>
                                <button
                                    className={deleteBtnClass}
                                    onClick={() => setDeleteTarget(format)}
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
                <div>
                    <label
                        className={labelClass}
                        htmlFor="abbreviation"
                    >
                        Abbreviation
                    </label>
                    <input
                        className={inputClass}
                        type="text"
                        name="abbreviation"
                        placeholder="Abbreviation"
                        value={formData.abbreviation}
                        onChange={onChange}
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        className="px-5 py-2 bg-brand text-white rounded hover:bg-brand-dark transition-colors font-semibold"
                        onClick={() =>
                            addFormat(formData, resetForm, onDataChanged)
                        }
                    >
                        Add Format
                    </button>
                </div>
            </div>
            {deleteTarget && (
                <ConfirmDialog
                    message={`Delete format "${deleteTarget.name}"?`}
                    onConfirm={() => {
                        deleteFormat(deleteTarget.id, onDataChanged)
                        setDeleteTarget(null)
                    }}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    allFormats: state.comics.all_formats,
})
export default connect(mapStateToProps, { getAllFormats })(
    ManageFormatsModalContent,
)

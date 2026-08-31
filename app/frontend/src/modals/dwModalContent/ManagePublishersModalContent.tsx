import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import {
    addPublisher,
    getAllPublishers,
    updatePublisher,
    deletePublisher,
} from "../../actions/comics"
import { Publisher } from "../../types"
import { RootState } from "../../reducers"
import ConfirmDialog from "../../components/ConfirmDialog"

interface Props {
    getAllPublishers: () => void
    allPublishers: Publisher[]
    // Refresh books feed on change
    onDataChanged?: () => void
}

const inputClass =
    "w-full border border-gray-300 rounded px-3 py-2 text-[1.4rem] focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
const labelClass = "block text-[1.4rem] font-medium text-gray-700 mb-1"
const editBtnClass =
    "px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors font-semibold text-[1.4rem] whitespace-nowrap"
const deleteBtnClass =
    "px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-semibold text-[1.4rem] whitespace-nowrap"
const saveBtnClass =
    "px-3 py-2 bg-brand text-white rounded hover:bg-brand-dark transition-colors font-semibold text-[1.4rem] whitespace-nowrap"

const ManagePublishersModalContent: React.FC<Props> = ({
    getAllPublishers,
    allPublishers,
    onDataChanged,
}) => {
    const [formData, setFormData] = useState({ name: "" })
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editingName, setEditingName] = useState("")
    const [deleteTarget, setDeleteTarget] = useState<Publisher | null>(null)
    const [search, setSearch] = useState("")

    useEffect(() => {
        if (!allPublishers.length) getAllPublishers()
    }, [])

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

    const resetForm = () => setFormData({ name: "" })

    const startEditing = (publisher: Publisher) => {
        setEditingId(publisher.id)
        setEditingName(publisher.name)
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditingName("")
    }

    const saveEditing = (id: number) =>
        updatePublisher({ id, name: editingName }, cancelEditing, onDataChanged)

    // allPublishers already arrives sorted server-side
    const filteredPublishers = allPublishers.filter((publisher) =>
        publisher.name.toLowerCase().includes(search.toLowerCase()),
    )

    return (
        <div className="flex flex-col w-full">
            <h2 className="text-[2.4rem] font-semibold text-center py-4 border-b border-gray-100">
                Manage Publishers
            </h2>
            <div className="pt-4">
                <input
                    className={inputClass}
                    type="text"
                    placeholder="Search publishers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex-1 py-4 space-y-2 max-h-[30rem] overflow-y-auto">
                {filteredPublishers.map((publisher) => (
                    <div
                        key={publisher.id}
                        className="flex items-center gap-2 border-b border-gray-100 pb-2"
                    >
                        {editingId === publisher.id ? (
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
                                    onClick={() => saveEditing(publisher.id)}
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
                                    {publisher.name}
                                </span>
                                <button
                                    className={editBtnClass}
                                    onClick={() => startEditing(publisher)}
                                >
                                    Edit
                                </button>
                                <button
                                    className={deleteBtnClass}
                                    onClick={() => setDeleteTarget(publisher)}
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
                            addPublisher(formData, resetForm, onDataChanged)
                        }
                    >
                        Add Publisher
                    </button>
                </div>
            </div>
            {deleteTarget && (
                <ConfirmDialog
                    message={`Delete publisher "${deleteTarget.name}"?`}
                    onConfirm={() => {
                        deletePublisher(deleteTarget.id, onDataChanged)
                        setDeleteTarget(null)
                    }}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    allPublishers: state.comics.allPublishers,
})
export default connect(mapStateToProps, { getAllPublishers })(
    ManagePublishersModalContent,
)

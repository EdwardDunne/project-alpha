import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import {
    addAuthor,
    getAllAuthors,
    updateAuthor,
    deleteAuthor,
} from "../../actions/comics"
import { Author } from "../../types"
import { RootState } from "../../reducers"
import ConfirmDialog from "../../components/ConfirmDialog"

interface Props {
    getAllAuthors: () => void
    allAuthors: Author[]
    // Lets a paginated book feed (e.g. ComicsAdminPage) refresh itself,
    // since renaming/adding/deleting an author changes books' derived
    // author_names and that feed isn't driven by Redux.
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

const ManageAuthorsModalContent: React.FC<Props> = ({
    getAllAuthors,
    allAuthors,
    onDataChanged,
}) => {
    const [formData, setFormData] = useState({ name: "" })
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editingName, setEditingName] = useState("")
    const [deleteTarget, setDeleteTarget] = useState<Author | null>(null)
    const [search, setSearch] = useState("")

    useEffect(() => {
        if (!allAuthors.length) getAllAuthors()
    }, [])

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

    const resetForm = () => setFormData({ name: "" })

    const startEditing = (author: Author) => {
        setEditingId(author.id)
        setEditingName(author.name)
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditingName("")
    }

    const saveEditing = (id: number) =>
        updateAuthor(
            { id, name: editingName },
            cancelEditing,
            onDataChanged,
        )

    const sortedAuthors = [...allAuthors].sort((a, b) =>
        a.name.localeCompare(b.name),
    )
    const filteredAuthors = sortedAuthors.filter((author) =>
        author.name.toLowerCase().includes(search.toLowerCase()),
    )

    return (
        <div className="flex flex-col w-full">
            <h2 className="text-[2.4rem] font-semibold text-center py-4 border-b border-gray-100">
                Manage Authors
            </h2>
            <div className="pt-4">
                <input
                    className={inputClass}
                    type="text"
                    placeholder="Search authors..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex-1 py-4 space-y-2 max-h-[30rem] overflow-y-auto">
                {filteredAuthors.map((author) => (
                    <div
                        key={author.id}
                        className="flex items-center gap-2 border-b border-gray-100 pb-2"
                    >
                        {editingId === author.id ? (
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
                                    onClick={() => saveEditing(author.id)}
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
                                    {author.name}
                                </span>
                                <button
                                    className={editBtnClass}
                                    onClick={() => startEditing(author)}
                                >
                                    Edit
                                </button>
                                <button
                                    className={deleteBtnClass}
                                    onClick={() => setDeleteTarget(author)}
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
                            addAuthor(formData, resetForm, onDataChanged)
                        }
                    >
                        Add Author
                    </button>
                </div>
            </div>
            {deleteTarget && (
                <ConfirmDialog
                    message={`Delete author "${deleteTarget.name}"?`}
                    onConfirm={() => {
                        deleteAuthor(deleteTarget.id, onDataChanged)
                        setDeleteTarget(null)
                    }}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    allAuthors: state.comics.all_authors,
})
export default connect(mapStateToProps, { getAllAuthors })(
    ManageAuthorsModalContent,
)

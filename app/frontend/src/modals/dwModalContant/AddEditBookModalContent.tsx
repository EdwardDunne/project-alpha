import React, { useState } from "react"
import { connect } from "react-redux"
import PublishersSelector from "../../components/PublishersSelector"
import CharactersMultiSelector from "../../components/CharactersMultiSelector"
import AuthorsSelector from "../../components/AuthorsSelector"
import { addBook, updateBook } from "../../actions/comics"
import { Publisher, Character, Author, Book } from "../../types"

interface Props {
    setDwModalOpen: (open: boolean) => void
    book?: Book
}

interface AddEditBookFormData {
    publisher: string
    format: string
    title: string
    authors: string[]
    description: string
    thumbnail_url: string
    thumbnail: File | string
    page_count: number
    characters: string[]
    team: string
}

const inputClass =
    "w-full border border-gray-300 rounded px-3 py-2 text-[1.4rem] focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
const labelClass = "block text-[1.4rem] font-medium text-gray-700 mb-1"

const AddEditBookModalContent: React.FC<Props> = ({ setDwModalOpen, book }) => {
    const isEditMode = Boolean(book?.id)

    const [formData, setFormData] = useState<AddEditBookFormData>({
        publisher: "",
        format: "",
        title: book?.title ?? "",
        authors: [],
        description: book?.description ?? "",
        thumbnail_url: book?.thumbnail_url ?? "",
        thumbnail: "",
        page_count: book?.page_count ?? 0,
        characters: [],
        team: book?.team ?? "",
    })

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const setPublisher = (publisher: Publisher | null) => {
        if (publisher) setFormData(prev => ({ ...prev, publisher: String(publisher["id"]) }))
    }
    const setCharacters = (characters: Character[]) => {
        setFormData(prev => ({ ...prev, characters: characters.map(c => String(c["id"])) }))
    }
    const setAuthors = (authors: Author[]) => {
        setFormData(prev => ({ ...prev, authors: authors.map(a => String(a["id"])) }))
    }

    const submit = () => {
        if (isEditMode) {
            updateBook({ ...formData, id: book!.id }, setDwModalOpen)
        } else {
            addBook(formData, setDwModalOpen)
        }
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        submit()
    }

    return (
        <div className="flex flex-col w-full">
            <h2 className="text-[2.4rem] font-semibold text-center py-4 border-b border-gray-100">
                {isEditMode ? "Edit Book" : "Add Book"}
            </h2>
            <div className="flex-1 overflow-y-auto max-h-[60vh] px-1 py-3 space-y-3">
                {[
                    { name: "title" as const, label: "Title", type: "text" },
                ].map(({ name, label, type }) => (
                    <div key={name}>
                        <label
                            className={labelClass}
                            htmlFor={name}
                        >
                            {label}
                        </label>
                        <input
                            className={inputClass}
                            type={type}
                            name={name}
                            placeholder={label}
                            defaultValue={formData[name]}
                            onChange={onChange}
                        />
                    </div>
                ))}
                <div>
                    <label
                        className={labelClass}
                        htmlFor="description"
                    >
                        Description
                    </label>
                    <textarea
                        className={inputClass}
                        name="description"
                        placeholder="Description"
                        rows={4}
                        defaultValue={formData.description}
                        onChange={onChange}
                    />
                </div>
                {[
                    { name: "page_count" as const, label: "Page Count", type: "number" },
                ].map(({ name, label, type }) => (
                    <div key={name}>
                        <label
                            className={labelClass}
                            htmlFor={name}
                        >
                            {label}
                        </label>
                        <input
                            className={inputClass}
                            type={type}
                            name={name}
                            placeholder={label}
                            defaultValue={formData[name]}
                            onChange={onChange}
                        />
                    </div>
                ))}
                <div>
                    <label
                        className={labelClass}
                        htmlFor="thumbnail"
                    >
                        {isEditMode ? "Replace Thumbnail (optional)" : "Thumbnail"}
                    </label>
                    <input
                        className={inputClass}
                        type="file"
                        name="thumbnail"
                        onChange={(e) => {
                            if (e.target.files)
                                setFormData(prev => ({
                                    ...prev,
                                    thumbnail: e.target.files![0],
                                }))
                        }}
                    />
                </div>
                <PublishersSelector setPublisher={setPublisher} initialPublisherId={book?.publisher} />
                <CharactersMultiSelector setCharacters={setCharacters} initialCharacterIds={book?.characters} />
                <AuthorsSelector setAuthors={setAuthors} initialAuthorIds={book?.authors} />
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                    className="px-5 py-2 bg-brand text-white rounded hover:bg-brand-dark transition-colors font-semibold"
                    onClick={(e) => {
                        e.preventDefault()
                        submit()
                    }}
                >
                    {isEditMode ? "Save Changes" : "Add Book"}
                </button>
            </div>
        </div>
    )
}

const mapStateToProps = () => ({})
export default connect(mapStateToProps, {})(AddEditBookModalContent)

import React, { useState } from "react"
import { connect } from "react-redux"
import PublishersSelector from "../../components/PublishersSelector"
import CharactersSelector from "../../components/CharactersSelector"
import { addBook } from "../../actions/comics"
import { Publisher, Character } from "../../types"

interface Props {
    setDwModalOpen: (open: boolean) => void
}

interface AddBookFormData {
    publisher: string
    format: string
    title: string
    author: string
    description: string
    thumbnail_url: string
    thumbnail: File | string
    page_count: number
    character: string
    team: string
}

const inputClass =
    "w-full border border-gray-300 rounded px-3 py-2 text-[1.4rem] focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
const labelClass = "block text-[1.4rem] font-medium text-gray-700 mb-1"

const AddBookModalContent: React.FC<Props> = ({ setDwModalOpen }) => {
    const [formData, setFormData] = useState<AddBookFormData>({
        publisher: "",
        format: "",
        title: "",
        author: "",
        description: "",
        thumbnail_url: "",
        thumbnail: "",
        page_count: 0,
        character: "",
        team: "",
    })

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value })

    const setPublisher = (publisher: Publisher | null) => {
        if (publisher) setFormData({ ...formData, publisher: publisher["key"] })
    }
    const setCharacter = (character: Character | null) => {
        if (character)
            setFormData({ ...formData, character: String(character["id"]) })
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        addBook(formData, setDwModalOpen)
    }

    return (
        <div className="flex flex-col w-full">
            <h2 className="text-[2.4rem] font-semibold text-center py-4 border-b border-gray-100">
                Add Book
            </h2>
            <div className="flex-1 overflow-y-auto max-h-[60vh] px-1 py-3 space-y-3">
                {[
                    { name: "title", label: "Title", type: "text" },
                    { name: "author", label: "Author", type: "text" },
                    { name: "description", label: "Description", type: "text" },
                    { name: "page_count", label: "Page Count", type: "number" },
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
                            onChange={onChange}
                        />
                    </div>
                ))}
                <div>
                    <label
                        className={labelClass}
                        htmlFor="thumbnail"
                    >
                        Thumbnail
                    </label>
                    <input
                        className={inputClass}
                        type="file"
                        name="thumbnail"
                        onChange={(e) => {
                            if (e.target.files)
                                setFormData({
                                    ...formData,
                                    thumbnail: e.target.files[0],
                                })
                        }}
                    />
                </div>
                <PublishersSelector setPublisher={setPublisher} />
                <CharactersSelector setCharacter={setCharacter} />
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                    className="px-5 py-2 bg-brand text-white rounded hover:bg-brand-dark transition-colors font-semibold"
                    form="add-book-form"
                    onClick={(e) => {
                        e.preventDefault()
                        addBook(formData, setDwModalOpen)
                    }}
                >
                    Add Book
                </button>
            </div>
        </div>
    )
}

const mapStateToProps = () => ({})
export default connect(mapStateToProps, {})(AddBookModalContent)

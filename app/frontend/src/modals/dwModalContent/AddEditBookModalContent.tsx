import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import PublishersSelector from "../../components/PublishersSelector"
import CharactersMultiSelector from "../../components/CharactersMultiSelector"
import AuthorsSelector from "../../components/AuthorsSelector"
import ArtistsSelector from "../../components/ArtistsSelector"
import FormatSelector from "../../components/FormatSelector"
import SubCategorySelector from "../../components/SubCategorySelector"
import TeamSelector from "../../components/TeamSelector"
import {
    addBook,
    updateBook,
    deleteBook,
    getAllFormats,
} from "../../actions/comics"
import {
    Publisher,
    Character,
    Author,
    Artist,
    Format,
    SubCategory,
    Team,
    Book,
} from "../../types"
import { RootState } from "../../reducers"
import ConfirmDialog from "../../components/ConfirmDialog"

const DEFAULT_FORMAT_ABBREVIATION = "OMNI"

interface Props {
    setDwModalOpen: (open: boolean) => void
    book?: Book
    allFormats: Format[]
    getAllFormats: () => void
    // Called after a successful add/update/delete to refresh books.
    onBookChanged?: () => void
}

interface AddEditBookFormData {
    publisher: string
    format: string
    sub_category: string
    title: string
    authors: string[]
    artists: string[]
    description: string
    thumbnail_url: string
    thumbnail: File | string
    page_count: number
    volume_number: number
    characters: string[]
    team: string
}

const inputClass =
    "w-full border border-gray-300 rounded px-3 py-2 text-[1.4rem] focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
const labelClass = "block text-[1.4rem] font-medium text-gray-700 mb-1"

const AddEditBookModalContent: React.FC<Props> = ({
    setDwModalOpen,
    book,
    allFormats,
    getAllFormats,
    onBookChanged,
}) => {
    const isEditMode = Boolean(book?.id)

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    useEffect(() => {
        if (!isEditMode && !allFormats.length) getAllFormats()
    }, [])

    const defaultFormatId = isEditMode
        ? undefined
        : allFormats.find((f) => f.abbreviation === DEFAULT_FORMAT_ABBREVIATION)
              ?.id

    const [formData, setFormData] = useState<AddEditBookFormData>({
        publisher: "",
        format: "",
        sub_category: "",
        title: book?.title ?? "",
        authors: [],
        artists: [],
        description: book?.description ?? "",
        thumbnail_url: book?.thumbnail_url ?? "",
        thumbnail: "",
        page_count: book?.page_count ?? 0,
        volume_number: book?.volume_number ?? 0,
        characters: [],
        team: book?.team ? String(book.team) : "",
    })

    const onChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

    const setPublisher = (publisher: Publisher | null) => {
        if (publisher)
            setFormData((prev) => ({
                ...prev,
                publisher: String(publisher["id"]),
            }))
    }
    const setCharacters = (characters: Character[]) => {
        setFormData((prev) => ({
            ...prev,
            characters: characters.map((c) => String(c["id"])),
        }))
    }
    const setAuthors = (authors: Author[]) => {
        setFormData((prev) => ({
            ...prev,
            authors: authors.map((a) => String(a["id"])),
        }))
    }
    const setArtists = (artists: Artist[]) => {
        setFormData((prev) => ({
            ...prev,
            artists: artists.map((a) => String(a["id"])),
        }))
    }
    const setFormat = (format: Format | null) => {
        if (format)
            setFormData((prev) => ({ ...prev, format: String(format["id"]) }))
    }
    const setSubCategory = (subCategory: SubCategory | null) => {
        setFormData((prev) => ({
            ...prev,
            sub_category: subCategory ? String(subCategory["id"]) : "",
        }))
    }
    const setTeam = (team: Team | null) => {
        setFormData((prev) => ({
            ...prev,
            team: team ? String(team["id"]) : "",
        }))
    }

    const submit = () => {
        if (isEditMode) {
            updateBook(
                { ...formData, id: book!.id },
                setDwModalOpen,
                onBookChanged,
            )
        } else {
            addBook(formData, setDwModalOpen, onBookChanged)
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
                {[{ name: "title" as const, label: "Title", type: "text" }].map(
                    ({ name, label, type }) => (
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
                    ),
                )}
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
                    {
                        name: "page_count" as const,
                        label: "Page Count",
                        type: "number",
                    },
                    {
                        name: "volume_number" as const,
                        label: "Volume Number",
                        type: "number",
                    },
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
                        {isEditMode
                            ? "Replace Thumbnail (optional)"
                            : "Thumbnail"}
                    </label>
                    <input
                        className={inputClass}
                        type="file"
                        name="thumbnail"
                        onChange={(e) => {
                            if (e.target.files)
                                setFormData((prev) => ({
                                    ...prev,
                                    thumbnail: e.target.files![0],
                                }))
                        }}
                    />
                </div>
                <CharactersMultiSelector
                    setCharacters={setCharacters}
                    initialCharacterIds={book?.characters}
                />
                <TeamSelector
                    setTeam={setTeam}
                    initialTeamId={book?.team}
                />
                <AuthorsSelector
                    setAuthors={setAuthors}
                    initialAuthorIds={book?.authors}
                />
                <ArtistsSelector
                    setArtists={setArtists}
                    initialArtistIds={book?.artists}
                />
                <PublishersSelector
                    setPublisher={setPublisher}
                    initialPublisherId={book?.publisher}
                />
                <FormatSelector
                    setFormat={setFormat}
                    initialFormatId={
                        isEditMode ? book?.format : defaultFormatId
                    }
                />
                <SubCategorySelector
                    setSubCategory={setSubCategory}
                    initialSubCategoryId={book?.sub_category}
                />
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                {isEditMode ? (
                    <button
                        className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-semibold"
                        onClick={(e) => {
                            e.preventDefault()
                            setShowDeleteConfirm(true)
                        }}
                    >
                        Delete Book
                    </button>
                ) : (
                    <span />
                )}
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
            {showDeleteConfirm && (
                <ConfirmDialog
                    message={`Delete book "${book?.title}"?`}
                    onConfirm={() => {
                        deleteBook(book!.id, setDwModalOpen, onBookChanged)
                        setShowDeleteConfirm(false)
                    }}
                    onCancel={() => setShowDeleteConfirm(false)}
                />
            )}
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    allFormats: state.comics.all_formats,
})
export default connect(mapStateToProps, { getAllFormats })(
    AddEditBookModalContent,
)

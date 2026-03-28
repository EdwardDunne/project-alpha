import React from "react"
import { connect } from "react-redux"
import { Book as BookType } from "../../types"

interface Props {
    setDwModalOpen: (open: boolean) => void
    book: BookType
}

const BookModalContent: React.FC<Props> = ({ book }) => {
    const thumbnail_url = book.thumbnail
        ? `${window.location.origin}${book.thumbnail}`
        : book.thumbnail_url

    return (
        <div className="flex flex-col md:flex-row justify-around items-center gap-6">
            <div className="flex-none">
                <img
                    className="w-32 md:w-48 rounded-[1rem]"
                    src={`${thumbnail_url}`}
                    alt={book.title}
                />
            </div>
            <div className="flex flex-col items-center">
                <div className="text-[1.8rem] font-bold text-center mb-4">
                    {book.title}
                </div>
                <div className="flex flex-col gap-1.5 text-[1.4rem]">
                    <span>
                        <b>Publisher</b>: {book.publisher_name}
                    </span>
                    <span>
                        <b>Character</b>: {book.character_name}
                    </span>
                    <span>
                        <b>Author</b>: {book.author}
                    </span>
                    <span className="max-h-28 overflow-y-scroll">
                        <b>Description</b>: {book.description}
                    </span>
                    <span>
                        <b>Page Count</b>: {book.page_count}
                    </span>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = () => ({})
export default connect(mapStateToProps, {})(BookModalContent)

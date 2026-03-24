import React from 'react';
import { connect } from 'react-redux';
import { Book as BookType } from '../../types';

interface Props {
    setDwModalOpen: (open: boolean) => void;
    book: BookType;
}

const Book: React.FC<Props> = ({ book }) => {
    return (
        <div className='flex justify-around items-center flex-row gap-6'>
            <div className='flex-none'>
                <img
                    className='w-48 rounded-[10px]'
                    src={`${window.location.origin}${book.thumbnail}`}
                    alt={book.title}
                />
            </div>
            <div className='flex flex-col items-center'>
                <div className='text-lg font-bold text-center mb-4'>{book.title}</div>
                <div className='flex flex-col gap-1.5 text-sm'>
                    <span><b>Publisher</b>: {book.publisher_name}</span>
                    <span><b>Character</b>: {book.character_name}</span>
                    <span><b>Author</b>: {book.author}</span>
                    <span className='max-h-28 overflow-y-scroll'><b>Description</b>: {book.description}</span>
                    <span><b>Page Count</b>: {book.page_count}</span>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = () => ({})
export default connect(mapStateToProps, {})(Book)

import React from 'react';
import { connect } from 'react-redux';
import { Book as BookType } from '../../types';

interface Props {
    setDwModalOpen: (open: boolean) => void;
    book: BookType;
}

const Book: React.FC<Props> = ({ setDwModalOpen, book }) => {

    const imgStyles: React.CSSProperties = {
        width: '12rem',
        borderRadius: '10px',
    }

    const containerStyles: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
    }

    const titleStyles: React.CSSProperties = {
        fontSize: '1.3rem',
        fontWeight: 'bold',
        textAlign: 'center',
    }

    const contentContainerStyles: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        margin: '2rem',
    }

    const bookDetailsContainer: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexDirection: 'column',
        marginTop: '0.9rem',
    }

    const descriptionStyles: React.CSSProperties = {
        maxHeight: '7rem',
        overflowY: 'scroll',
    }

    return (
        <>
        <div style={containerStyles}>
            <div>
                <img style={imgStyles} src={`${window.location.origin}${book.thumbnail}`}/>
            </div>

            <div style={contentContainerStyles}>
                <div style={titleStyles}>{book.title}</div>
                <div style={bookDetailsContainer}>
                    <span><b>Publisher</b>: {book.publisher_name}</span>
                    <span><b>Character</b>: {book.character_name}</span>
                    <span><b>Author</b>: {book.author}</span>
                    <span style={descriptionStyles}><b>Description</b>: {book.description}</span>
                    <span><b>Page Count</b>: {book.page_count}</span>
                </div>
            </div>
        </div>
        </>
    )
}

const mapStateToProps = () => ({})
export default connect(mapStateToProps, {})(Book)

import React from 'react';
import { connect } from 'react-redux';


const OmniDetailsModal = ({ setDwModalOpen, book}) => {

    const imgStyles = {
        width: '12rem',
        borderRadius: '10px',
    }

    const containerStyles = {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
    }

    const titleStyles = {
        fontSize: '1.3rem',
        fontWeight: 'bold',
        textAlign: 'center',
    }

    const contentContainerStyles = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        margin: '2rem',
    }

    const bookDetailsContainer = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexDirection: 'column',
        marginTop: '0.9rem',
    }

    const descriptionStyles = {
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

const mapStateToProps = state => ({})
export default connect(mapStateToProps, {})(OmniDetailsModal)

import React, { useEffect, useState } from "react";
import OmniDetailsModal from "../modals/OmniDetailsModal";
import { getAllCharacters, getAllOmnis, getAllPublishers } from '../actions/comics';
import { connect } from 'react-redux';
import { Autocomplete, TextField, ThemeProvider } from "@mui/material";
import { darkTheme } from "../App";
import PublishersSelector from "../components/PublishersSelector";
import CharactersSelector from "../components/CharactersSelector";

const ComicsPage = () => {

    const [omnis, setOmnis] = useState([])
    const [characterFilter, setCharacterFilter] = useState(undefined)
    const [publisherFilter, setPublisherFilter] = useState(undefined)

    useEffect(() => {
        _getAllOmnis()
    }, [])

    const _getAllOmnis = async () => {
        const res = await getAllOmnis()
        if (res['data'] && res['data']['success']) 
            setOmnis(res['data']['omnis'])
    }

    const omniListContainerStyles = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    } 
    
    const omniCardStyles = {
        margin: '5px',
        width: '200px',
    }

    const imageContainerStyles = {
        flex: '0 0 auto',
    }

    const omniTitleStyles = {
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }

    const leftPanelStyles = {
        width: '300px',
        display: 'flex',
        height: '410px',
        position: 'fixed',
        padding: "0px",
    }

    function getDisplayedBooks(book, i) {
        const bookPublisher = book['publisher']
        const bookCharacter = book['character']

        if (
            (!publisherFilter || bookPublisher === publisherFilter['id']) && 
            (!characterFilter || bookCharacter === characterFilter['id'])
        ) {
            return (
                <div 
                style={omniCardStyles}
                key={i}
                // onClick={() => omniClicked(omniListType, book)}
                >
                    <div style={imageContainerStyles}>
                        <img src={`${window.location.origin}${book.thumbnail}`} className="card-img" alt="..."/>
                    </div>
                    <div style={omniTitleStyles}>{book.title}</div>
                </div>
            )
        }
    }

    return (
        <>
        <div id="admin-main-container">
            <div style={leftPanelStyles}>
                <ThemeProvider theme={darkTheme}>
                    <div className="side-nav" style={{width: '300px'}}>
                        <span style={{textAlign: 'center'}}>Filter Books</span>
                        <ul className="side-nav-list">
                            <PublishersSelector setPublisher={setPublisherFilter}/>
                            <CharactersSelector setCharacter={setCharacterFilter}/>
                        </ul>
                        <div className="clearfix"></div>
                    </div>
                </ThemeProvider>
            </div>

            <div className="admin-main-content">
                    <div className="page-title-box">
                        <h4 className="page-title">Comics</h4>
                    </div>
                    <div style={omniListContainerStyles}>
                        {omnis.map((book, i) => { 
                            return getDisplayedBooks(book, i) 
                        })}
                    </div>
            </div> 
        </div>
        </>
    );
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps, {})(ComicsPage)

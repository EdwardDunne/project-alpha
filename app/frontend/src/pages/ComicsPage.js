import React, { useEffect, useState } from "react";
import OmniDetailsModal from "../modals/OmniDetailsModal";
import { getAllOmnis } from '../actions/comics';
import { connect } from 'react-redux';


const ComicsPage = () => {

    const [omnis, setOmnis] = useState([])

    useEffect(() => {
        _getAllOmnis()
    }, [])

    const _getAllOmnis = async () => {
        const res = await getAllOmnis()
        console.log(res)
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

    function displayOmni(omni) {
        return (
            <div 
            style={omniCardStyles}
            // onClick={() => omniClicked(omniListType, book)}
            >
                <div style={imageContainerStyles}>
                    <img src={`${window.location.origin}${omni.thumbnail}`} className="card-img" alt="..."/>
                </div>
                <div style={omniTitleStyles}>{omni.title}</div>
            </div>
        )
    }


    return (
        <>
        <div id="admin-main-container">
            <div className="admin-leftside-content" style={{"padding": "0px"}}>
                <div className="side-nav">
                    <ul className="side-nav-list">
                        FILTERS GO HERE
                    </ul>
                    <div className="clearfix"></div>
                </div>
            </div>

            <div className="admin-main-content">
                    <div className="page-title-box">
                        <h4 className="page-title">Comics</h4>
                    </div>
                    <div style={omniListContainerStyles}>
                        {omnis.map((book, i) => { 
                            return displayOmni(book) 
                        })}
                    </div>
            </div> 
        </div>
        </>
    );
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps, {})(ComicsPage)

import React, { Component, useState } from "react";
import HomePageModal from "../modals/HomePageModal";
import ReactDom from 'react-dom';

import { 
    matrix_hex_img, resume_hex_img, 
    linkedin_hex_img, contact_hex_img,
    art_hex_img, fb_hex_img,
    ig_hex_img, comics_hex_img
} from '../images'


export default function HexMenu() {

    const [isOpen, setIsOpen] = useState(false);
    const [modalType, setModalType] = useState(null);

    function hexClicked(type) {
        setIsOpen(true);
        setModalType(type);
    }

    return (
        <>
        <HomePageModal 
            open={isOpen} 
            onClose={() => setIsOpen(false)} 
            modalType={modalType}>
        </HomePageModal>

        <ul className="honeycomb">
            <li className="honeycomb-cell buffer"></li>
            <li className="honeycomb-cell" onClick={e => hexClicked('resume')}>
                <img className="honeycomb-cell__image" src={resume_hex_img} />
                <div className="honeycomb-cell__title">Resume</div>
            </li>
            <li className="honeycomb-cell" onClick={e => hexClicked('linkedIn')}>
                <img className="honeycomb-cell__image" src={linkedin_hex_img} />
                <div className="honeycomb-cell__title">LinkedIn</div>
            </li>
            <li className="honeycomb-cell buffer"></li>
            <li className="honeycomb-cell mid-first" onClick={e => hexClicked('github')}>
                <img className="honeycomb-cell__image" src={matrix_hex_img} />
                <div className="honeycomb-cell__title">Github</div>
            </li>
            <li className="honeycomb-cell" onClick={e => hexClicked('contact')}>
                <img className="honeycomb-cell__image" style={{objectPosition: '87%'}} src={contact_hex_img} />
                <div className="honeycomb-cell__title">Contact</div>
            </li>
            <li className="honeycomb-cell mid-last" onClick={e => hexClicked('art')}>
                <img className="honeycomb-cell__image" src={art_hex_img} />
                <div className="honeycomb-cell__title">Art</div>
            </li>
            <li className="honeycomb-cell" onClick={e => hexClicked('facebook')}>
                <img className="honeycomb-cell__image" src={fb_hex_img} />
                <div className="honeycomb-cell__title">Facebook</div>
            </li>
            <li className="honeycomb-cell" onClick={e => hexClicked('instagram')}>
                <img className="honeycomb-cell__image" src={ig_hex_img} />
                <div className="honeycomb-cell__title">Instagram</div>
            </li>
            <li className="honeycomb-cell honeycomb__placeholder"></li>
        </ul>

        <li className="honeycomb-cell comics-hex" onClick={e => hexClicked('instagram')}>
            <img className="honeycomb-cell__image" src={comics_hex_img} />
            <div className="honeycomb-cell__title">Comics</div>
        </li>
        </>
    );
}

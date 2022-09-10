import React, { Component, useState } from "react";
import HomePageModal from "./homePageModal";
import ApiService from "../services/ApiService.js";
import Auth from "../services/Auth.js";

import { 
    matrix_hex_img, 
    resume_hex_img, 
    linkedin_hex_img, 
    contact_hex_img,
    art_hex_img,
    fb_hex_img,
    ig_hex_img,
    comics_hex_img
} from '../images'


export default function HexMenu() {

    const LOGIN_BTN_STYLES = {
        // position: 'fixed',
        // top: '10px',
        // right: '60px',
        background: '#4848d2',
        padding: '11px',
        zIndex: 1000,
        borderRadius: '10px',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '30px',
        cursor: 'pointer',
        position: 'relative'
    }

    const [isOpen, setIsOpen] = useState(false);
    const [modalType, setModalType] = useState(null);

    function hexClicked(type) {
        setIsOpen(true);
        setModalType(type);
        console.log(ApiService.dunneweb_is_logged_in);
    }

    function checkAuth(event) {
        alert(Auth.isAuthenticated());
    }

    return (
        <>
        <HomePageModal 
            open={isOpen} 
            onClose={() => setIsOpen(false)} 
            modalType={modalType}>
        </HomePageModal>

        <button style={LOGIN_BTN_STYLES} onClick={e => checkAuth(e)}>Check Auth</button>

        <ul class="honeycomb">
            <li class="honeycomb-cell buffer"></li>
            <li class="honeycomb-cell" onClick={e => hexClicked('resume')}>
                <img class="honeycomb-cell__image" src={resume_hex_img} />
                <div class="honeycomb-cell__title">Resume</div>
            </li>
            <li class="honeycomb-cell" onClick={e => hexClicked('linkedIn')}>
                <img class="honeycomb-cell__image" src={linkedin_hex_img} />
                <div class="honeycomb-cell__title">LinkedIn</div>
            </li>
            <li class="honeycomb-cell buffer"></li>
            <li class="honeycomb-cell mid-first" onClick={e => hexClicked('github')}>
                <img class="honeycomb-cell__image" src={matrix_hex_img} />
                <div class="honeycomb-cell__title">Github</div>
            </li>
            <li class="honeycomb-cell" onClick={e => hexClicked('contact')}>
                <img class="honeycomb-cell__image" style={{objectPosition: '87%'}} src={contact_hex_img} />
                <div class="honeycomb-cell__title">Contact</div>
            </li>
            <li class="honeycomb-cell mid-last" onClick={e => hexClicked('art')}>
                <img class="honeycomb-cell__image" src={art_hex_img} />
                <div class="honeycomb-cell__title">Art</div>
            </li>
            <li class="honeycomb-cell" onClick={e => hexClicked('facebook')}>
                <img class="honeycomb-cell__image" src={fb_hex_img} />
                <div class="honeycomb-cell__title">Facebook</div>
            </li>
            <li class="honeycomb-cell" onClick={e => hexClicked('instagram')}>
                <img class="honeycomb-cell__image" src={ig_hex_img} />
                <div class="honeycomb-cell__title">Instagram</div>
            </li>
            <li class="honeycomb-cell honeycomb__placeholder"></li>
        </ul>

        <li class="honeycomb-cell comics-hex" onClick={e => hexClicked('instagram')}>
            <img class="honeycomb-cell__image" src={comics_hex_img} />
            <div class="honeycomb-cell__title">Comics</div>
        </li>
        </>
    );
}

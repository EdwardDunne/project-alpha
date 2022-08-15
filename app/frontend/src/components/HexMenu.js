import React, { Component, useState } from "react";
import matrixImage from '../images/matrix.jpeg'
import HomePageModal from "./homePageModal";

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
        
        <ul class="honeycomb">
            <li class="honeycomb-cell buffer"></li>
            <li class="honeycomb-cell" onClick={e => hexClicked('resume')}>
                <img class="honeycomb-cell__image" src="https://source.unsplash.com/random/1" />
                <div class="honeycomb-cell__title">Resume</div>
            </li>
            <li class="honeycomb-cell" onClick={e => hexClicked('linkedIn')}>
                <img class="honeycomb-cell__image" src="https://source.unsplash.com/random/2" />
                <div class="honeycomb-cell__title">LinkedIn</div>
            </li>
            <li class="honeycomb-cell buffer"></li>
            <li class="honeycomb-cell mid-first" onClick={e => hexClicked('github')}>
                <img class="honeycomb-cell__image" src={matrixImage} />
                <div class="honeycomb-cell__title">Github</div>
            </li>
            <li class="honeycomb-cell" onClick={e => hexClicked('contact')}>
                <img class="honeycomb-cell__image" src="https://source.unsplash.com/random/4" />
                <div class="honeycomb-cell__title">Contact</div>
            </li>
            <li class="honeycomb-cell mid-last" onClick={e => hexClicked('art')}>
                <img class="honeycomb-cell__image" src="https://source.unsplash.com/random/5" />
                <div class="honeycomb-cell__title">Art</div>
            </li>
            <li class="honeycomb-cell" onClick={e => hexClicked('facebook')}>
                <img class="honeycomb-cell__image" src="https://source.unsplash.com/random/6" />
                <div class="honeycomb-cell__title">Facebook</div>
            </li>
            <li class="honeycomb-cell" onClick={e => hexClicked('instagram')}>
                <img class="honeycomb-cell__image" src="https://source.unsplash.com/random/7" />
                <div class="honeycomb-cell__title">Instagram</div>
            </li>
            <li class="honeycomb-cell honeycomb__placeholder"></li>
        </ul>
        </>
    );
}

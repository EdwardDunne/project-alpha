import React, { Component } from "react";

export default class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ul class="honeycomb">
                <li class="honeycomb-cell buffer"></li>
                <li class="honeycomb-cell">
                    <img class="honeycomb-cell__image" src="https://source.unsplash.com/random/1" />
                    <div class="honeycomb-cell__title">Resume</div>
                </li>
                <li class="honeycomb-cell">
                    <img class="honeycomb-cell__image" src="https://source.unsplash.com/random/2" />
                    <div class="honeycomb-cell__title">linkedIn</div>
                </li>
                <li class="honeycomb-cell buffer"></li>
                <li class="honeycomb-cell mid-first">
                    <img class="honeycomb-cell__image" src="https://source.unsplash.com/random/3" />
                    <div class="honeycomb-cell__title">Github</div>
                </li>
                <li class="honeycomb-cell">
                    <img class="honeycomb-cell__image" src="https://source.unsplash.com/random/4" />
                    <div class="honeycomb-cell__title">Contact</div>
                </li>
                <li class="honeycomb-cell mid-last">
                    <img class="honeycomb-cell__image" src="https://source.unsplash.com/random/5" />
                    <div class="honeycomb-cell__title">Art</div>
                </li>
                <li class="honeycomb-cell">
                    <img class="honeycomb-cell__image" src="https://source.unsplash.com/random/6" />
                    <div class="honeycomb-cell__title">Facebook</div>
                </li>
                <li class="honeycomb-cell">
                    <img class="honeycomb-cell__image" src="https://source.unsplash.com/random/7" />
                    <div class="honeycomb-cell__title">Instagram</div>
                </li>
                <li class="honeycomb-cell honeycomb__placeholder"></li>
            </ul>
        );
    }
}

(function() {
    // Add event listener
    // document.addEventListener("mousemove", parallax); TEMPORARILY REMOVED
    const $main_background = $(".parallax");
    function parallax(e) {
        let _w = window.innerWidth/2;
        let _h = window.innerHeight/2;
        let _mouseX = e.clientX;
        let _mouseY = e.clientY;
        let _depth1 = `${50 - (_mouseX - _w) * -0.01}% ${50 - (_mouseY - _h) * 0.01}%`;
        let _depth2 = `${50 - (_mouseX - _w) * 0.02}% ${50 - (_mouseY - _h) * 0.02}%`;
        let _depth3 = `${50 - (_mouseX - _w) * 0.06}% ${50 - (_mouseY - _h) * 0.06}%`;
        let x = `${_depth1}`;
        $main_background.css('background-position', x);
    }

})();
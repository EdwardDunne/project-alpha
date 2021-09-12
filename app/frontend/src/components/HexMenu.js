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
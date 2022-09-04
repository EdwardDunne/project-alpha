import React, { Component } from "react";
import HomePage from "./HomePage";
import Header from "./Header";
import ReactDOM from "react-dom/client";
import { Routes, BrowserRouter } from "react-router-dom";

export default class App extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <div>
                <Header></Header>
                <HomePage />
            </div>
        );
    }
}

const root = ReactDOM.createRoot(
    document.getElementById("app")
);
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
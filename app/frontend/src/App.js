import React, { Component } from "react";
import HomePageRouter from "./components/HomePageRouter";
import Header from "./components/Header";
import ReactDOM from "react-dom/client";
import NavBar from "./components/NavBar";
import { BrowserRouter } from "react-router-dom";

import { Provider } from 'react-redux';
import store from './store';

export default function App() {
    return (
        <>
            <Provider store={store}>
                {/* <Header /> */}
                <NavBar />
                <HomePageRouter />
            </Provider>
        </>
    )
}

const root = ReactDOM.createRoot(
    document.getElementById("app")
);
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
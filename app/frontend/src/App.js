import React from "react";
import HomePageRouter from "./components/HomePageRouter";
import ReactDOM from "react-dom/client";
import NavBar from "./components/NavBar";
import { BrowserRouter } from "react-router-dom";

import { Provider } from 'react-redux';
import store from './store';

const App = () => {

    return (
        <Provider store={store}>
            <NavBar />
            <HomePageRouter />
        </Provider>
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

export default App;
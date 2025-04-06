import React from "react";
import HomePageRouter from "./hoc/HomePageRouter";
import ReactDOM from "react-dom/client";
import NavBar from "./components/NavBar";
import { BrowserRouter } from "react-router-dom";

import { Provider } from 'react-redux';
import store from './store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const App = () => {

    const appStyles = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    }

    return (
        <Provider store={store}>
            <div style={appStyles}>
                <NavBar />
                <HomePageRouter />
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />
            </div>
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
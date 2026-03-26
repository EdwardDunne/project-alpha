import React from "react";
import HomePageRouter from "./hoc/HomePageRouter";
import NavBar from "./components/NavBar";

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

const App: React.FC = () => {

    return (
        <Provider store={store}>
            <div className='flex flex-col w-full min-h-[100dvh]'>
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

export default App;

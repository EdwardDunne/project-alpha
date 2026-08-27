import React from "react"
import HomePageRouter from "./hoc/HomePageRouter"
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"

import { Provider } from "react-redux"
import store from "./store"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { createTheme, ThemeProvider } from "@mui/material"

// Brand Purple
const brandPrimary = {
    main: "#536de6",
    dark: "#4558c2",
}

export const theme = createTheme({
    palette: {
        primary: brandPrimary,
    },
})

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: brandPrimary,
    },
})

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <div className="flex flex-col w-full min-h-[100dvh]">
                    <NavBar />
                    <main className="flex-1 flex flex-col">
                        <HomePageRouter />
                    </main>
                    <Footer />
                    <ToastContainer
                        position="top-right"
                        autoClose={1500}
                        hideProgressBar={true}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"
                    />
                </div>
            </ThemeProvider>
        </Provider>
    )
}

export default App

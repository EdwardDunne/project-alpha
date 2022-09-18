import React, { Component } from "react";
import HexMenu from "./HexMenu";
import AdminTest from "./AdminTest";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import {
    Routes,
    Route,
} from "react-router-dom";

export default function HomePageRouter() {
    return (
        <Routes>
            <Route exact path="/" element={<HexMenu />}/>
            <Route path="/admin-test" element={<AdminTest />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
        </Routes>
    )
}
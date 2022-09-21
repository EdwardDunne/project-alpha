import React, { Component, useEffect } from "react";
import HexMenu from "./HexMenu";
import AdminTest from "./AdminTest";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import DashboardPage from "./DashboardPage";
import { checkAuthenticated } from "../actions/auth";
import { load_user } from "../actions/profile";
import { connect } from 'react-redux';
import {
    Routes,
    Route,
} from "react-router-dom";

const HomePageRouter = ({ checkAuthenticated, load_user }) => {
    useEffect(() => {
        checkAuthenticated();
        load_user();
    }, []);

    return (
        <Routes>
            <Route exact path="/" element={<HexMenu />}/>
            <Route path="/admin-test" element={<AdminTest />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
    )
}

export default connect(null, { checkAuthenticated, load_user })(HomePageRouter);
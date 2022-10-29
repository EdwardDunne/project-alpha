import React, { Component, useEffect } from "react";
import HexMenu from "./HexMenu";
import AdminTest from "./AdminTest";
import ComicsAdmin from "./ComicsAdmin";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import DashboardPage from "./DashboardPage";
import { checkAuthenticated } from "../actions/auth";
import { load_user } from "../actions/profile";
import { connect } from 'react-redux';
import {
    Routes,
    Route
} from "react-router-dom";
import PrivateRoute from "../hoc/PrivateRoute";

const HomePageRouter = ({ checkAuthenticated, load_user, isAuthenticated }) => {
    useEffect(() => {
        checkAuthenticated();
        load_user();
    }, []);

    return (
        <Routes>
            <Route exact path="/" element={<HexMenu />}/>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-test" element={
                <PrivateRoute>
                    <AdminTest />
                </PrivateRoute>} />
            <Route path="/comics-admin" element={
                <PrivateRoute>
                    <ComicsAdmin />
                </PrivateRoute>} />
            <Route path="/dashboard" element={
                <PrivateRoute>
                    <DashboardPage />
                </PrivateRoute>} />
        </Routes>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { checkAuthenticated, load_user })(HomePageRouter);
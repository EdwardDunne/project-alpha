import React, { Component, useEffect } from "react";
import HexMenu from "../pages/HexMenu";
import AdminTest from "../pages/AdminTest";
import ComicsAdmin from "../pages/ComicsAdmin";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import ComicsPage from "../pages/ComicsPage";
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
            <Route path="/comics" element={<ComicsPage />} />
            <Route path="/admin-test" element={
                <PrivateRoute staffOnly={true}>
                    <AdminTest />
                </PrivateRoute>} />
            <Route path="/comics-admin" element={
                <PrivateRoute staffOnly={true}>
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
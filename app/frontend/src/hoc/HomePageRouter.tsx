import React, { useEffect } from "react";
import HexMenu from "../pages/HexMenuPage";
import ComicsAdmin from "../pages/ComicsAdminPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import DashboardPage from "../pages/DashboardPage";
import ComicsPage from "../pages/ComicsPage";
import ChangelogPage from "../pages/ChangelogPage";
import { checkAuthenticated } from "../actions/auth";
import { load_user } from "../actions/profile";
import { connect } from 'react-redux';
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../hoc/PrivateRoute";

interface Props {
    checkAuthenticated: () => void;
    load_user: () => void;
}

const HomePageRouter: React.FC<Props> = ({ checkAuthenticated, load_user }) => {
    useEffect(() => {
        checkAuthenticated();
        load_user();
    }, []);

    return (
        <Routes>
            <Route path="/" element={<ComicsPage />}/>
            <Route path="/comics" element={<ComicsPage />}/>
            <Route path="/about" element={<HexMenu />}/>
            <Route path="/changelog" element={<ChangelogPage />}/>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:uidb64/:token" element={<ResetPasswordPage />} />
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

export default connect(null, { checkAuthenticated, load_user })(HomePageRouter);

import React, { useEffect } from "react";
import HexMenu from "../pages/HexMenuPage";
import ComicsAdmin from "../pages/ComicsAdminPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import ComicsPage from "../pages/ComicsPage";
import { checkAuthenticated } from "../actions/auth";
import { load_user } from "../actions/profile";
import { connect } from 'react-redux';
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../hoc/PrivateRoute";
import { RootState } from "../reducers";

interface Props {
    checkAuthenticated: () => void;
    load_user: () => void;
    isAuthenticated: boolean | null;
}

const HomePageRouter: React.FC<Props> = ({ checkAuthenticated, load_user, isAuthenticated }) => {
    useEffect(() => {
        checkAuthenticated();
        load_user();
    }, []);

    return (
        <Routes>
            <Route path="/" element={<ComicsPage />}/>
            <Route path="/comics" element={<ComicsPage />}/>
            <Route path="/about" element={<HexMenu />}/>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
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

const mapStateToProps = (state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { checkAuthenticated, load_user })(HomePageRouter);

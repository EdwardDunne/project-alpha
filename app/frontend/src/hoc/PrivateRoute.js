import React, { Component } from "react";
import { Navigate } from 'react-router-dom'
import { connect } from 'react-redux';

const PrivateRoute = ({ children, isAuthenticated }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {})(PrivateRoute);
import React, { Component, useEffect, useState } from "react";
import { Navigate } from 'react-router-dom'
import { connect } from 'react-redux';
import httpUtil from '../utils/httpUtil';
import axios from 'axios';
import { useLocation } from "react-router-dom";


const PrivateRoute = ({ children, isAuthenticated }) => {
    const location = useLocation();
    const [route, setRoute] = useState(null);
    useEffect(() => {
        async function getRoute() {
            if (isAuthenticated) {
                setRoute(children);
            } else {
                const config = {
                    headers: httpUtil.get_headers('GET')
                };
                const res = await axios.get(`${window.location.origin}/api/authenticated`, config);

                if (res && res.data.isAuthenticated === 'success')
                    setRoute(children);
                if (res && res.data.isAuthenticated === 'error')
                    setRoute(<Navigate to="/login" />);
            }
        }
        getRoute();
    }, [location, isAuthenticated]);
   
    return (route)
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {})(PrivateRoute);
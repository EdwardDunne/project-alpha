import React, { useEffect, useState } from "react";
import { Navigate } from 'react-router-dom'
import { connect } from 'react-redux';
import httpUtil from '../utils/httpUtil';
import axios from 'axios';
import { useLocation } from "react-router-dom";


const PrivateRoute = ({ staffOnly = false, is_staff, children, isAuthenticated }) => {
    const location = useLocation();
    const [route, setRoute] = useState(null);

    function evaluateRoute(staffOnly, is_staff, children) {
        staffOnly ? 
        is_staff ? setRoute(children)
        : setRoute(<Navigate to="/" />)
        : setRoute(children)
    }

    useEffect(() => {
        async function getRoute() {
            if (isAuthenticated) {
                evaluateRoute(staffOnly, is_staff, children)
            } else {
                const config = {
                    headers: httpUtil.get_headers('GET')
                };
                const res = await axios.get(`${window.location.origin}/api/authenticated`, config);

                if (res && res.data.isAuthenticated === 'success')
                    evaluateRoute(staffOnly, res.data.is_staff, children)
                if (res && res.data.isAuthenticated === 'error')
                    setRoute(<Navigate to="/login" />);
            }
        }
        getRoute();
    }, [location, isAuthenticated]);
   
    return (route)
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    is_staff: state.profile.is_staff
})

export default connect(mapStateToProps, {})(PrivateRoute);
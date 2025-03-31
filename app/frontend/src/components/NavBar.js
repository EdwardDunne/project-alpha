import React, { Fragment } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { connect } from 'react-redux';
import { logout } from '../actions/auth';

const NavBar = ({ isAuthenticated, is_staff, logout }) => {
    
    const adminTestLink = (
        <>
            <li className="nav-item">
                <NavLink className="nav-link" to="/admin-test">AdminTest</NavLink>
            </li>
        </>
    )

    const comicAdminLink = (
        <>
            <li className="nav-item">
                <NavLink className="nav-link" to="/comics-admin">Comics Admin</NavLink>
            </li>
        </>
    )
    
    const authLinks = (
        <>
            { is_staff ? comicAdminLink : ''}
            <li className="nav-item">
                <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
            </li>
            <li className="nav-item">
                <a className="nav-link" onClick={logout} href='#!'>Logout</a>
            </li>
        </>
    );

    const guestLinks = (
        <>
            <li className="nav-item">
                <NavLink className="nav-link" to="/login">Login</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/register">Register</NavLink>
            </li>
        </>
    );

    return (
    <nav className="navbar-container">
        <Link className="nav-item brand" to="/">Dunne Web</Link>
        <li className="nav-item">
            <NavLink className="nav-link" to="/">Home</NavLink>
        </li>
        <li className="nav-item">
            <NavLink className="nav-link" to="/comics">Comics</NavLink>
        </li>
        { isAuthenticated ? authLinks : guestLinks }
    </nav>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    is_staff: state.profile.is_staff
})

export default connect(mapStateToProps, { logout })(NavBar)

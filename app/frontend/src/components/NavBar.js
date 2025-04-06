import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { connect } from 'react-redux';
import { logout } from '../actions/auth';

const NavBar = ({ isAuthenticated, is_staff, logout }) => {
    
    const adminTestLink = (
        <>
            <li style={navItemStyles}>
                <NavLink style={navLinkStyles} to="/admin-test">AdminTest</NavLink>
            </li>
        </>
    )

    const comicAdminLink = (
        <>
            <li style={navItemStyles}>
                <NavLink style={navLinkStyles} to="/comics-admin">Comics Admin</NavLink>
            </li>
        </>
    )
    
    const authLinks = (
        <>
            { is_staff ? comicAdminLink : ''}
            <li style={navItemStyles}>
                <NavLink style={navLinkStyles} to="/dashboard">Dashboard</NavLink>
            </li>
            <li style={navItemStyles}>
                <a style={navLinkStyles} onClick={logout} href='#!'>Logout</a>
            </li>
        </>
    );

    const guestLinks = (
        <>
            <li style={navItemStyles}>
                <NavLink style={navLinkStyles} to="/login">Login</NavLink>
            </li>
            <li style={navItemStyles}>
                <NavLink style={navLinkStyles} to="/register">Register</NavLink>
            </li>
        </>
    );

    return (
    <span style={navContainerStyles}>
        <Link style={{...navItemStyles, ...brandStyles}} to="/">Dunne Web</Link>
        <li style={navItemStyles}>
            <NavLink style={navLinkStyles} to="/">Home</NavLink>
        </li>
        <li style={navItemStyles}>
            <NavLink style={navLinkStyles} to="/comics">Comics</NavLink>
        </li>
        { isAuthenticated ? authLinks : guestLinks }
    </span>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    is_staff: state.profile.is_staff
})

export default connect(mapStateToProps, { logout })(NavBar)

const navLinkStyles = {
    textDecoration: 'none',
    color: '#6c757d',
}

const navItemStyles = {
    listStyle: 'none',
    padding: '10px',
}

const brandStyles = {
    color: 'rgba(0, 0, 0, 0.9)',
    textDecoration: 'none',
    fontSize: '20px',
}

const navContainerStyles = {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // position: 'fixed',
    top: '0px',
    left: '0px',
    width: '100%',
    padding: '10px',
    background: '#dbdbdb',
    // background: rgb(238, 242, 247),
    height: '60px',
}
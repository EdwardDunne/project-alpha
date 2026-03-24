import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import { RootState } from '../reducers';

interface Props {
    isAuthenticated: boolean | null;
    is_staff: boolean;
    logout: () => void;
}

const NavBar: React.FC<Props> = ({ isAuthenticated, is_staff, logout }) => {

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

const mapStateToProps = (state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    is_staff: state.profile.is_staff
})

export default connect(mapStateToProps, { logout })(NavBar)

const navLinkStyles: React.CSSProperties = {
    textDecoration: 'none',
    color: '#6c757d',
}

const navItemStyles: React.CSSProperties = {
    listStyle: 'none',
    padding: '10px',
}

const brandStyles: React.CSSProperties = {
    color: 'rgba(0, 0, 0, 0.9)',
    textDecoration: 'none',
    fontSize: '20px',
}

const navContainerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    top: '0px',
    left: '0px',
    width: '100%',
    padding: '10px',
    background: '#dbdbdb',
    height: '60px',
}

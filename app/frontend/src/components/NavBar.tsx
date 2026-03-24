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

    const linkClass = 'no-underline text-gray-500 hover:text-gray-700 transition-colors'

    const comicAdminLink = (
        <li className='list-none px-2.5 py-2'>
            <NavLink className={linkClass} to="/comics-admin">Comics Admin</NavLink>
        </li>
    )

    const authLinks = (
        <>
            {is_staff ? comicAdminLink : ''}
            <li className='list-none px-2.5 py-2'>
                <NavLink className={linkClass} to="/dashboard">Dashboard</NavLink>
            </li>
            <li className='list-none px-2.5 py-2'>
                <NavLink className={linkClass} to="/about">About Me</NavLink>
            </li>
            <li className='list-none px-2.5 py-2'>
                <a className={linkClass + ' cursor-pointer'} onClick={logout} href='#!'>Logout</a>
            </li>
        </>
    );

    const guestLinks = (
        <>
            <li className='list-none px-2.5 py-2'>
                <NavLink className={linkClass} to="/about">About Me</NavLink>
            </li>
            <li className='list-none px-2.5 py-2'>
                <NavLink className={linkClass} to="/login">Login</NavLink>
            </li>
            <li className='list-none px-2.5 py-2'>
                <NavLink className={linkClass} to="/register">Register</NavLink>
            </li>
        </>
    );

    return (
        <span className='flex justify-start items-center w-full px-2.5 bg-[#dbdbdb] h-[60px]'>
            <Link className='list-none px-2.5 py-2 text-black/90 no-underline text-xl font-bold' to="/">Omni Trackers</Link>
            <li className='list-none px-2.5 py-2'>
                <NavLink className={linkClass} to="/">Comics</NavLink>
            </li>
            {isAuthenticated ? authLinks : guestLinks}
        </span>
    )
}

const mapStateToProps = (state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    is_staff: state.profile.is_staff
})

export default connect(mapStateToProps, { logout })(NavBar)

import React, { useState } from 'react'
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

    const [menuOpen, setMenuOpen] = useState(false);
    const close = () => setMenuOpen(false);

    const linkClass = 'no-underline text-gray-500 hover:text-gray-700 transition-colors whitespace-nowrap'
    const mobileLinkClass = 'no-underline text-gray-700 hover:text-brand transition-colors text-[1.6rem] py-3 px-4 block border-b border-gray-100'

    const comicAdminLink = (
        <li className='list-none px-2.5 py-2'>
            <NavLink className={linkClass} to="/comics-admin">Comics Admin</NavLink>
        </li>
    )
    const mobileComicAdminLink = (
        <li className='list-none'>
            <NavLink className={mobileLinkClass} to="/comics-admin" onClick={close}>Comics Admin</NavLink>
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
                <NavLink className={linkClass} to="/changelog">Changelog</NavLink>
            </li>
            <li className='list-none px-2.5 py-2'>
                <a className={linkClass + ' cursor-pointer'} onClick={logout} href='#!'>Logout</a>
            </li>
        </>
    );

    const mobileAuthLinks = (
        <>
            {is_staff ? mobileComicAdminLink : ''}
            <li className='list-none'>
                <NavLink className={mobileLinkClass} to="/dashboard" onClick={close}>Dashboard</NavLink>
            </li>
            <li className='list-none'>
                <NavLink className={mobileLinkClass} to="/about" onClick={close}>About Me</NavLink>
            </li>
            <li className='list-none'>
                <NavLink className={mobileLinkClass} to="/changelog" onClick={close}>Changelog</NavLink>
            </li>
            <li className='list-none'>
                <a className={mobileLinkClass + ' cursor-pointer'} onClick={() => { logout(); close(); }} href='#!'>Logout</a>
            </li>
        </>
    );

    const guestLinks = (
        <>
            <li className='list-none px-2.5 py-2'>
                <NavLink className={linkClass} to="/about">About Me</NavLink>
            </li>
            <li className='list-none px-2.5 py-2'>
                <NavLink className={linkClass} to="/changelog">Changelog</NavLink>
            </li>
            <li className='list-none px-2.5 py-2'>
                <NavLink className={linkClass} to="/login">Login</NavLink>
            </li>
            <li className='list-none px-2.5 py-2'>
                <NavLink className={linkClass} to="/register">Register</NavLink>
            </li>
        </>
    );

    const mobileGuestLinks = (
        <>
            <li className='list-none'>
                <NavLink className={mobileLinkClass} to="/about" onClick={close}>About Me</NavLink>
            </li>
            <li className='list-none'>
                <NavLink className={mobileLinkClass} to="/changelog" onClick={close}>Changelog</NavLink>
            </li>
            <li className='list-none'>
                <NavLink className={mobileLinkClass} to="/login" onClick={close}>Login</NavLink>
            </li>
            <li className='list-none'>
                <NavLink className={mobileLinkClass} to="/register" onClick={close}>Register</NavLink>
            </li>
        </>
    );

    return (
        <>
        {/* Nav bar */}
        <nav className='flex justify-between items-center w-full px-4 bg-[#dbdbdb] h-[6rem] shrink-0'>
            <Link className='text-black/90 no-underline text-[2rem] font-bold whitespace-nowrap' to="/">Omni Trackers</Link>

            {/* Desktop links — hidden on mobile */}
            <ul className='hidden md:flex items-center list-none m-0 p-0'>
                <li className='px-2.5 py-2'>
                    <NavLink className={linkClass} to="/">Comics</NavLink>
                </li>
                {isAuthenticated ? authLinks : guestLinks}
            </ul>

            {/* Hamburger button — hidden on desktop */}
            <button
                className='md:hidden flex items-center justify-center w-10 h-10 text-[2.4rem] text-gray-600'
                onClick={() => setMenuOpen(o => !o)}
                aria-label="Toggle menu"
            >
                {menuOpen ? '✕' : '☰'}
            </button>
        </nav>

        {/* Mobile dropdown menu */}
        {menuOpen && (
            <>
                <div className='fixed inset-0 z-40' onClick={close} />
                <ul className='md:hidden fixed top-[6rem] left-0 right-0 bg-white z-50 list-none m-0 p-0 shadow-lg'>
                    <li className='list-none'>
                        <NavLink className={mobileLinkClass} to="/" onClick={close}>Comics</NavLink>
                    </li>
                    {isAuthenticated ? mobileAuthLinks : mobileGuestLinks}
                </ul>
            </>
        )}
        </>
    )
}

const mapStateToProps = (state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    is_staff: state.profile.is_staff
})

export default connect(mapStateToProps, { logout })(NavBar)

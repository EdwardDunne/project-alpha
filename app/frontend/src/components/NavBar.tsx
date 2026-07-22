import React, { useState, useRef, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import { RootState } from '../reducers';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface Props {
    isAuthenticated: boolean | null;
    is_staff: boolean;
    logout: () => void;
}

const INFO_TEXT = "Omni Trackers is built to make finding and collecting comic book omnibuses easier than ever, with plans to expand to all collected editions. Browse and filter by character, publisher, and more, follow dynamic reading orders, and build out your collection without missing a single volume. Every entry is backed by cover art, not just text, and all data is stored in a dedicated, carefully curated database so the information you need is always easy to find.";

const NavBar: React.FC<Props> = ({ isAuthenticated, is_staff, logout }) => {

    const [menuOpen, setMenuOpen] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);
    const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const infoRef = useRef<HTMLDivElement>(null);
    const close = () => setMenuOpen(false);

    const handleInfoEnter = (e: React.PointerEvent) => {
        if (e.pointerType === 'touch') return;
        if (closeTimeout.current) clearTimeout(closeTimeout.current);
        setInfoOpen(true);
    };
    const handleInfoLeave = (e: React.PointerEvent) => {
        if (e.pointerType === 'touch') return;
        closeTimeout.current = setTimeout(() => setInfoOpen(false), 150);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (infoRef.current && !infoRef.current.contains(e.target as Node)) {
                setInfoOpen(false);
            }
        };
        if (infoOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [infoOpen]);

    const linkClass = 'no-underline text-gray-500 hover:text-gray-700 transition-colors whitespace-nowrap'
    const mobileLinkClass = 'no-underline text-gray-700 hover:text-brand transition-colors text-[1.6rem] py-3 px-4 block border-b border-gray-100'

    const iconProps = { sx: { fontSize: '2.4rem' } }

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
                <a className={linkClass + ' cursor-pointer inline-flex items-center gap-1'} onClick={logout} href='#!'>
                    <LogoutIcon {...iconProps} /> Logout
                </a>
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
                <a className={mobileLinkClass + ' cursor-pointer flex items-center gap-2'} onClick={() => { logout(); close(); }} href='#!'>
                    <LogoutIcon {...iconProps} /> Logout
                </a>
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
                <NavLink className={linkClass} to="/register">Register</NavLink>
            </li>
            <li className='list-none px-2.5 py-2'>
                <NavLink className={linkClass + ' inline-flex items-center gap-1'} to="/login">
                    <LoginIcon {...iconProps} /> Login
                </NavLink>
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
                <NavLink className={mobileLinkClass} to="/register" onClick={close}>Register</NavLink>
            </li>
            <li className='list-none'>
                <NavLink className={mobileLinkClass + ' flex items-center gap-2'} to="/login" onClick={close}>
                    <LoginIcon {...iconProps} /> Login
                </NavLink>
            </li>
        </>
    );

    return (
        <>
        {/* Nav bar */}
        <nav className='flex justify-between items-center w-full px-4 bg-[#dbdbdb] h-[6rem] shrink-0'>
            <div className='flex items-center gap-2'>
                <Link className='text-black/90 no-underline text-[2rem] font-bold whitespace-nowrap' to="/">Omni Trackers</Link>
                <div className='relative flex items-center' ref={infoRef}>
                    <button
                        className='w-[2.6rem] h-[2.6rem] rounded-full bg-gray-400 hover:bg-gray-500 text-white flex items-center justify-center transition-colors'
                        onPointerEnter={handleInfoEnter}
                        onPointerLeave={handleInfoLeave}
                        onClick={() => setInfoOpen(o => !o)}
                        aria-label="About Omni Trackers"
                    >
                        <InfoOutlinedIcon sx={{ fontSize: '1.8rem' }} />
                    </button>
                    {infoOpen && (
                        <div
                            className='fixed top-[7rem] left-4 z-[60] w-[32rem] max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-[1.4rem] text-gray-700 leading-relaxed'
                            onMouseEnter={handleInfoEnter}
                            onMouseLeave={handleInfoLeave}
                        >
                            {INFO_TEXT}
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop links — hidden on mobile */}
            <ul className='hidden md:flex items-center list-none m-0 p-0'>
                <li className='px-2.5 py-2'>
                    <NavLink className={linkClass} to="/">Comics</NavLink>
                </li>
                {isAuthenticated ? authLinks : guestLinks}
            </ul>

            {/* Hamburger button — hidden on desktop */}
            <button
                className='md:hidden flex items-center justify-center w-10 h-10'
                onClick={() => setMenuOpen(o => !o)}
                aria-label="Toggle menu"
            >
                <span className='relative w-6 h-6 flex items-center justify-center'>
                    {menuOpen ? (
                        <>
                            <span className='absolute w-6 h-[3px] bg-gray-600 rounded-full rotate-45' />
                            <span className='absolute w-6 h-[3px] bg-gray-600 rounded-full -rotate-45' />
                        </>
                    ) : (
                        <span className='flex flex-col items-center justify-center gap-[5px]'>
                            <span className='block w-6 h-[3px] bg-gray-600 rounded-full' />
                            <span className='block w-6 h-[3px] bg-gray-600 rounded-full' />
                            <span className='block w-6 h-[3px] bg-gray-600 rounded-full' />
                        </span>
                    )}
                </span>
            </button>
        </nav>

        {/* Mobile dropdown menu */}
        {menuOpen && (
            <>
                <div className='fixed inset-0 z-[55]' onClick={close} />
                <ul className='md:hidden fixed top-[6rem] left-0 right-0 bg-white z-[60] list-none m-0 p-0 shadow-lg'>
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

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HomePageModal from '../modals/HomePageModal';

const linkClass = 'no-underline text-gray-600 hover:text-brand transition-colors';

const Footer: React.FC = () => {
    const year = new Date().getFullYear();
    const [contactOpen, setContactOpen] = useState(false);

    return (
        <footer className='w-full bg-[#dbdbdb] px-4 py-6 mt-auto shrink-0'>
            <HomePageModal
                open={contactOpen}
                onClose={() => setContactOpen(false)}
                modalType='contact'
            />
            <div className='max-w-[120rem] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-[1.3rem] text-gray-600'>
                <p className='m-0'>&copy; {year} Omni Trackers. All rights reserved.</p>
                <div className='flex items-center gap-4'>
                    <Link className={linkClass} to='/about'>About</Link>
                    <a className={linkClass} href='https://github.com/EdwardDunne' target='_blank' rel='noopener noreferrer'>GitHub</a>
                    <a className={linkClass} href='https://www.linkedin.com/in/edward-dunne-jr-67831276/' target='_blank' rel='noopener noreferrer'>LinkedIn</a>
                    <button className={linkClass + ' cursor-pointer bg-transparent border-0 p-0'} onClick={() => setContactOpen(true)}>Contact</button>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return (
        <div className='w-full flex-1 flex flex-col items-center justify-center px-4 text-center'>
            <h1 className='text-[6rem] font-bold text-brand m-0'>404</h1>
            <p className='text-[1.8rem] text-gray-600 mt-2 mb-6'>This page doesn't exist.</p>
            <Link
                className='px-5 py-2.5 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors font-semibold no-underline'
                to='/'
            >
                Back to Comics
            </Link>
        </div>
    );
}

export default NotFoundPage;

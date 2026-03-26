import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../actions/auth';
import CSRFToken from '../components/CSRFToken';
import { RootState } from '../reducers';

interface Props {
    login: (username: string, password: string) => void;
    isAuthenticated: boolean | null;
}

const inputClass = 'w-full border border-gray-300 rounded px-3 py-2 text-[1.4rem] focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent'
const labelClass = 'block text-[1.4rem] font-medium text-gray-700 mb-1'

const LoginPage: React.FC<Props> = ({ login, isAuthenticated }) => {

    const [formData, setFormData] = useState({ username: '', password: '' });
    const { username, password } = formData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login(username, password);
    }

    if (isAuthenticated)
        return <Navigate to='/dashboard' />;

    return (
        <div className='w-full max-w-sm mx-auto mt-20 px-4'>
            <form onSubmit={onSubmit} className='bg-white p-8 rounded-lg shadow-md'>
                <CSRFToken />
                <h1 className='text-[2.4rem] font-semibold text-center mb-6'>Sign in to Omni Trackers</h1>

                <div className='mb-4'>
                    <label className={labelClass} htmlFor='username'>Username</label>
                    <input
                        className={inputClass}
                        id='username'
                        type='text'
                        placeholder='Username'
                        name='username'
                        onChange={onChange}
                        value={username}
                        required
                    />
                </div>

                <div className='mb-4'>
                    <label className={labelClass} htmlFor='password'>Password</label>
                    <input
                        className={inputClass}
                        id='password'
                        type='password'
                        placeholder='Password'
                        name='password'
                        onChange={onChange}
                        value={password}
                        minLength={6}
                        required
                    />
                </div>

                <div className='mb-4'>
                    <label className='flex items-center gap-2 text-[1.4rem] text-gray-600 cursor-pointer'>
                        <input type='checkbox' value='remember-me' className='rounded' />
                        Remember me
                    </label>
                </div>

                <button
                    className='w-full py-2.5 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors font-semibold'
                    type='submit'
                >
                    Sign in
                </button>
            </form>
            <p className='mt-4 text-center text-[1.4rem] text-gray-600'>
                Don't have an account? <Link className='text-brand hover:underline' to='/register'>Sign Up</Link>
            </p>
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(LoginPage);

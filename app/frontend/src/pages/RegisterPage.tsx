import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { register } from '../actions/auth';
import CSRFToken from '../components/CSRFToken';
import { RootState } from '../reducers';

interface Props {
    register: (username: string, password: string, re_password: string) => void;
    isAuthenticated: boolean | null;
}

const inputClass = 'w-full border border-gray-300 rounded px-3 py-2 text-[1.4rem] focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent'
const labelClass = 'block text-[1.4rem] font-medium text-gray-700 mb-1'

const RegisterPage: React.FC<Props> = ({ register, isAuthenticated }) => {

    const [formData, setFormData] = useState({ username: '', password: '', re_password: '' });
    const [accountCreated, setAccountCreated] = useState(false);
    const { username, password, re_password } = formData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password === re_password) {
            register(username, password, re_password);
            setAccountCreated(true);
        }
    }

    if (isAuthenticated) return <Navigate to='/dashboard' />;
    if (accountCreated)  return <Navigate to='/login' />;

    return (
        <div className='w-full md:max-w-[48rem] mx-auto mt-12 px-4'>
            <div className='bg-white p-8 rounded-lg shadow-md'>
                <h1 className='text-[2.4rem] font-semibold mb-1'>Register for an Account</h1>
                <p className='text-gray-500 text-[1.4rem] mb-6'>Create an account for Omni Trackers</p>
                <form onSubmit={onSubmit}>
                    <CSRFToken />
                    <div className='mb-4'>
                        <label className={labelClass}>Username</label>
                        <input
                            className={inputClass}
                            type='text'
                            placeholder='Username*'
                            name='username'
                            onChange={onChange}
                            value={username}
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className={labelClass}>Password</label>
                        <input
                            className={inputClass}
                            type='password'
                            placeholder='Password*'
                            name='password'
                            onChange={onChange}
                            value={password}
                            minLength={6}
                            required
                        />
                    </div>
                    <div className='mb-6'>
                        <label className={labelClass}>Confirm Password</label>
                        <input
                            className={inputClass}
                            type='password'
                            placeholder='Confirm Password*'
                            name='re_password'
                            onChange={onChange}
                            value={re_password}
                            minLength={6}
                            required
                        />
                    </div>
                    <button
                        className='w-full py-2.5 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors font-semibold'
                        type='submit'
                    >
                        Register
                    </button>
                </form>
                <p className='mt-4 text-center text-[1.4rem] text-gray-600'>
                    Already have an account? <Link className='text-brand hover:underline' to='/login'>Sign In</Link>
                </p>
            </div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { register })(RegisterPage)

import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword } from '../actions/auth';
import CSRFToken from '../components/CSRFToken';

const inputClass = 'w-full border border-gray-300 rounded px-3 py-2 text-[1.4rem] focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent'
const labelClass = 'block text-[1.4rem] font-medium text-gray-700 mb-1'

const ResetPasswordPage: React.FC = () => {

    const { uidb64, token } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ password: '', re_password: '' });
    const { password, re_password } = formData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== re_password) {
            toast.error('Passwords do not match.');
            return;
        }

        if (!uidb64 || !token) {
            toast.error('This password reset link is invalid.');
            return;
        }

        const success = await resetPassword(uidb64, token, password, re_password);
        if (success) navigate('/login');
    }

    return (
        <div className='w-full md:max-w-[48rem] mx-auto mt-20 px-4'>
            <div className='bg-white p-8 rounded-lg shadow-md'>
                <h1 className='text-[2.4rem] font-semibold text-center mb-6'>Reset Password</h1>
                <form onSubmit={onSubmit}>
                    <CSRFToken />
                    <div className='mb-4'>
                        <label className={labelClass} htmlFor='password'>New Password</label>
                        <input
                            className={inputClass}
                            id='password'
                            type='password'
                            placeholder='New Password'
                            name='password'
                            onChange={onChange}
                            value={password}
                            minLength={6}
                            required
                        />
                    </div>
                    <div className='mb-6'>
                        <label className={labelClass} htmlFor='re_password'>Confirm New Password</label>
                        <input
                            className={inputClass}
                            id='re_password'
                            type='password'
                            placeholder='Confirm New Password'
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
                        Reset Password
                    </button>
                </form>
                <p className='mt-4 text-center text-[1.4rem] text-gray-600'>
                    <Link className='text-brand hover:underline' to='/login'>Back to Sign In</Link>
                </p>
            </div>
        </div>
    )
}

export default ResetPasswordPage;

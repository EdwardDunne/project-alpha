import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { update_profile } from '../actions/profile';
import { delete_account } from '../actions/auth';
import { RootState } from '../reducers';

interface Props {
    delete_account: () => void;
    update_profile: (first_name: string, last_name: string, email: string) => void;
    first_name_global: string;
    last_name_global: string;
    email_global: string;
}

const inputClass = 'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

const DashboardPage: React.FC<Props> = ({
    delete_account,
    update_profile,
    first_name_global,
    last_name_global,
    email_global
}) => {
    const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '' });

    useEffect(() => {
        setFormData({
            first_name: first_name_global,
            last_name: last_name_global,
            email: email_global
        });
    }, [first_name_global]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        update_profile(formData.first_name, formData.last_name, formData.email);
    }

    return (
        <div className='container mx-auto max-w-lg px-4 py-8'>
            <h1 className='text-2xl font-semibold mb-2'>User Dashboard</h1>
            <p className='text-gray-500 text-sm mb-6'>Update your profile below</p>

            <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
                <form onSubmit={onSubmit}>
                    <div className='mb-4'>
                        <label className={labelClass} htmlFor='first_name'>First Name</label>
                        <input
                            className={inputClass}
                            type='text'
                            name='first_name'
                            placeholder='First Name'
                            onChange={onChange}
                            value={formData.first_name}
                        />
                    </div>
                    <div className='mb-4'>
                        <label className={labelClass} htmlFor='last_name'>Last Name</label>
                        <input
                            className={inputClass}
                            type='text'
                            name='last_name'
                            placeholder='Last Name'
                            onChange={onChange}
                            value={formData.last_name}
                        />
                    </div>
                    <div className='mb-6'>
                        <label className={labelClass} htmlFor='email'>Email</label>
                        <input
                            className={inputClass}
                            type='text'
                            name='email'
                            placeholder='Email'
                            onChange={onChange}
                            value={formData.email}
                        />
                    </div>
                    <button
                        className='px-5 py-2 bg-brand text-white rounded hover:bg-brand-dark transition-colors font-semibold'
                        type='submit'
                    >
                        Update Profile
                    </button>
                </form>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-md border border-red-100'>
                <p className='text-gray-600 text-sm mb-3'>Click the button below to permanently delete your account.</p>
                <button
                    className='px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-semibold'
                    onClick={() => delete_account()}
                >
                    Delete Account
                </button>
            </div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    first_name_global: state.profile.first_name,
    last_name_global: state.profile.last_name,
    email_global: state.profile.email,
})

export default connect(mapStateToProps, {
    delete_account,
    update_profile
})(DashboardPage)

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { update_profile } from '../actions/profile';
import CSRFToken from './CSRFToken';

const DashboardPage = ({
    update_profile,
    first_name_global,
    last_name_global,
    email_global
}) => {
    const [profileUpdated, setProfileUpdated] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: ''
    });

    const { first_name, last_name, email } = formData;

    useEffect(() => {
        setFormData({
            first_name: first_name_global,
            last_name: last_name_global,
            email: email_global
        });
    }, [first_name_global]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();

        const updateProfile = async () => {
            await update_profile(first_name, last_name, email);
            setProfileUpdated(!profileUpdated);
        };
        updateProfile();
    }

    return (
        <div className='container'>
            <h1 className='mt-3'>Welcome to your User Dashboard</h1>
            <p className='mt-3 mb-3'>Update your user profile below:</p>
            <form onSubmit={e => onSubmit(e)}>
                <CSRFToken />
                <div className='form-group'>
                    <label className='form-label' htmlFor='first_name'>First Name</label>
                    <input
                        className='form-control'
                        type='text'
                        name='first_name'
                        placeholder={`${first_name_global}`}
                        onChange={e => onChange(e)}
                        value={first_name}
                    />
                </div>
                <div className='form-group mt-3'>
                    <label className='form-label' htmlFor='last_name'>Last Name</label>
                    <input
                        className='form-control'
                        type='text'
                        name='last_name'
                        placeholder={`${last_name_global}`}
                        onChange={e => onChange(e)}
                        value={last_name}
                    />
                </div>
                <div className='form-group mt-3'>
                    <label className='form-label' htmlFor='email'>Email</label>
                    <input
                        className='form-control'
                        type='text'
                        name='email'
                        placeholder={`${email_global}`}
                        onChange={e => onChange(e)}
                        value={email}
                    />
                </div>
                <button className='btn btn-primary mt-3' type='submit'>Update Profile</button>
            </form>
        </div>
    );
}

const mapStateToProps = state => ({
    first_name_global: state.profile.first_name,
    last_name_global: state.profile.last_name,
    email_global: state.profile.email,
})

export default connect(mapStateToProps, { update_profile })(DashboardPage)

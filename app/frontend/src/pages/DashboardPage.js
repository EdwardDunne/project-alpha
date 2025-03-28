import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { update_profile } from '../actions/profile';
import { delete_account } from '../actions/auth';

const DashboardPage = ({
    delete_account,
    update_profile,
    first_name_global,
    last_name_global,
    email_global
}) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: ''
    });

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
        update_profile(formData.first_name, formData.last_name, formData.email);
    }

    return (
        <div className='container dashboard'>
            <h1 className='mt-3'>Welcome to your User Dashboard</h1>
            <p className='mt-3 mb-3'>Update your user profile below:</p>
            <form onSubmit={e => onSubmit(e)}>
                <div className='form-group'>
                    <label className='form-label' htmlFor='first_name'>First Name</label>
                    <input
                        className='form-control'
                        type='text'
                        name='first_name'
                        placeholder={`First Name`}
                        onChange={e => onChange(e)}
                        value={formData.first_name}
                    />
                </div>
                <div className='form-group mt-3'>
                    <label className='form-label' htmlFor='last_name'>Last Name</label>
                    <input
                        className='form-control'
                        type='text'
                        name='last_name'
                        placeholder={`Last Name`}
                        onChange={e => onChange(e)}
                        value={formData.last_name}
                    />
                </div>
                <div className='form-group mt-3'>
                    <label className='form-label' htmlFor='email'>Email</label>
                    <input
                        className='form-control'
                        type='text'
                        name='email'
                        placeholder={`Email`}
                        onChange={e => onChange(e)}
                        value={formData.email}
                    />
                </div>
                <button className='btn btn-primary update-btn' type='submit'>Update Profile</button>
            </form>
            <p className="delete-account-txt">Click the button below to delete your user account: </p>
            <a 
                className='btn btn-danger delete-btn'
                href='#!'
                onClick={e => delete_account()}
            >
                Delete Account
            </a>
        </div>
    );
}

const mapStateToProps = state => ({
    first_name_global: state.profile.first_name,
    last_name_global: state.profile.last_name,
    email_global: state.profile.email,
})

export default connect(mapStateToProps, { 
    delete_account, 
    update_profile 
})(DashboardPage)

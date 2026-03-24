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

const RegisterPage: React.FC<Props> = ({ register, isAuthenticated }) => {

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        re_password: ''
    });

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

    if (isAuthenticated)
        return <Navigate to='/dashboard' />;
    else if (accountCreated)
        return <Navigate to='/login' />;

    return (
        <div className='container mt-5'>
            <h1>Register for an Account</h1>
            <p>Create and account form Dunne Web</p>
            <form onSubmit={onSubmit}>
                <CSRFToken />
                <div className='form-group'>
                    <label className='form-label'>Username: </label>
                    <input
                        className='form-control'
                        type='text'
                        placeholder='Username*'
                        name='username'
                        onChange={onChange}
                        value={username}
                        required
                    />
                </div>
                <div className='form-group mt-3'>
                    <label className='form-label'>Password: </label>
                    <input
                        className='form-control'
                        type='password'
                        placeholder='Password*'
                        name='password'
                        onChange={onChange}
                        value={password}
                        minLength={6}
                        required
                    />
                </div>
                <div className='form-group'>
                    <label className='form-label mt-3'>Confirm Password: </label>
                    <input
                        className='form-control'
                        type='password'
                        placeholder='Confirm Password*'
                        name='re_password'
                        onChange={onChange}
                        value={re_password}
                        minLength={6}
                        required
                    />
                </div>
                <button className='btn btn-primary mt-3' type='submit'>Register</button>
            </form>
            <p className='mt-3'>
                Already have an Account? <Link to='/login'>Sign In</Link>
            </p>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { register })(RegisterPage)

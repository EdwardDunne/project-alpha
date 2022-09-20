import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../actions/auth';
import CSRFToken from './CSRFToken';

const LoginPage = ({ login, isAuthenticated}) => {

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const { username, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        login(username, password);
    }

    if (isAuthenticated)
        return <Navigate to='/dashboard' />;

    return (
        <div className="form-signin w-100 m-auto">
            <form onSubmit={e => onSubmit(e)}>
                <CSRFToken />
                <h1 className="h3 mb-3 fw-normal">Sign in to DunneWeb</h1>

                <div className="form-floating">
                    <input 
                        className="form-control username"
                        id="floatingInput"
                        type='text'
                        placeholder='Username*'
                        name='username'
                        onChange={e => onChange(e)}
                        value={username}
                        required
                    />
                    <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating">
                    <input 
                        className="form-control" 
                        id="floatingPassword" 
                        type="password" 
                        placeholder="Password"
                        name='password'
                        onChange={e => onChange(e)}
                        value={password}
                        minLength='6'
                        required
                    />
                    <label htmlFor="floatingPassword">Password</label>
                </div>

                <div className="checkbox mb-3">
                    <label>
                        <input type="checkbox" value="remember-me" /> Remember me
                    </label>
                </div>
                <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
            </form>
            <p className='mt-3'>
                Don't have an Account? <Link to='/register'>Sign Up</Link>
            </p>
        </div>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(LoginPage);

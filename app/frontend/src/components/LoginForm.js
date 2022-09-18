import React, { Component, useState } from 'react';

export default function LoginForm() {

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    return (
    <>
        <form className="sign-in-form" onSubmit={e => loginClicked(e)}>
            <span className="form-title">Login to DunneWeb</span>
            <span className="form-fields-row">
                <input type="text" name="username" placeholder="Username" onChange={e => setUsername(e.target.value)}></input>
                <input type="password" name="password" placeholder="Password" onChange={e => setPassword(e.target.value)}></input>
            </span>
            <span className="form-fields-row">
                <input type="submit" value="Login" className="admin-page-btn"/>
                <input type="button" value="Sign up" className="admin-page-btn"/>
            </span>
        </form>
    </>
    )
}

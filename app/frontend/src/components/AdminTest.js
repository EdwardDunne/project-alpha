import React, { Component, useState } from "react";
import ApiService from "../services/ApiService.js";
import Auth from "../services/Auth.js";
import { useNavigate } from 'react-router-dom';


const LOGIN_BTN_STYLES = {
    // position: 'fixed',
    // top: '10px',
    // right: '60px',
    background: '#4848d2',
    padding: '11px',
    zIndex: 1000,
    borderRadius: '10px',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '30px',
    cursor: 'pointer'
}

export default function AdminTest(props) {

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    let navigate = useNavigate();

    function loginClicked(event) {
        event.preventDefault();
        let base_url = `${window.location.origin}/api/login`;

        let data = {
            username: username,
            password: password,
        };

        ApiService.post(base_url, data).then(resp => {
            console.log(resp.success);
            if(resp.success)
                Auth.login();
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    function logoutClicked(event) {
        event.preventDefault();
        let base_url = `${window.location.origin}/api/logout`;

        console.log(base_url);

        let data = {
            username: username,
            password: password,
        };

        ApiService.post(base_url, data).then(resp => {
            console.log(resp.success);
            if(resp.success)
                Auth.logout();
        }).catch((error) => {
            console.error(error);
        });
    }

    function checkAuth(event) {
        alert(Auth.isAuthenticated());
    }

    function pageChange(event) {
        navigate('/');
    }

    return (
        <>
        <div>This is the admin test page</div>
        <form onSubmit={e => loginClicked(e)}>
            <input type="text" name="username" onChange={e => setUsername(e.target.value)}></input>
            <input type="password" name="username" onChange={e => setPassword(e.target.value)}></input>
            <input type="submit" value="Login" style={LOGIN_BTN_STYLES}/>
        </form>
        <button style={LOGIN_BTN_STYLES} onClick={e => logoutClicked(e)}>Logout</button>

        <button style={LOGIN_BTN_STYLES} onClick={e => checkAuth(e)}>Check Auth</button>

        <button style={LOGIN_BTN_STYLES} onClick={e => pageChange(e)}>Test Page Change</button>
        </>
    );
}

import React, { Component, useState } from "react";
import ApiService from "../services/ApiService.js";
import Auth from "../services/Auth.js";
import { useNavigate } from 'react-router-dom';

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

    function testMarvelApi(event) {
        event.preventDefault();
        let base_url = `${window.location.origin}/api/test-marvel`;

        ApiService.post(base_url).then(resp => {
            console.log(resp.success);
            console.log(resp.data);
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    function testView(event) {
        event.preventDefault();
        let base_url = `${window.location.origin}/api/test-view`;

        ApiService.post(base_url).then(resp => {
            console.log(resp.success);
            console.log(resp.data);
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    return (
        <>
        <div>This is the admin test page</div>
        <form onSubmit={e => loginClicked(e)}>
            <input type="text" name="username" onChange={e => setUsername(e.target.value)}></input>
            <input type="password" name="username" onChange={e => setPassword(e.target.value)}></input>
            <input type="submit" value="Login" className="admin-page-btn"/>
        </form>
        <button className="admin-page-btn" onClick={e => logoutClicked(e)}>Logout</button>
        <div className="admin-btn-panel">
            <button className="admin-page-btn" onClick={e => checkAuth(e)}>Check Auth</button>
            <button className="admin-page-btn" onClick={e => pageChange(e)}>Test Page Change</button>
            <button className="admin-page-btn" onClick={e => testView(e)}>Test View</button>
            <button className="admin-page-btn" onClick={e => testMarvelApi(e)}>Test Marvel Api</button>
        </div>
        </>
    );
}

import React, { Component, useState } from "react";
import HttpService from "../services/HttpService.js";
import Auth from "../services/Auth.js";
import { useNavigate } from 'react-router-dom';
import LoginForm from "./LoginForm.js";

export default function AdminTest(props) {

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    let navigate = useNavigate();

    function loginClicked(event) {
        event.preventDefault();
        let base_url = `${window.location.origin}/api/login-old`;

        let data = {
            username: username,
            password: password,
        };

        HttpService.post(base_url, data).then(resp => {
            console.log(resp.success);
            if(resp.success)
                Auth.login();
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    function logoutClicked(event) {
        event.preventDefault();
        let base_url = `${window.location.origin}/api/logout-old`;

        console.log(base_url);

        let data = {
            username: username,
            password: password,
        };

        HttpService.post(base_url, data).then(resp => {
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

        HttpService.post(base_url).then(resp => {
            console.log(resp.success);
            console.log(resp.data);
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    function getMarvelOmnis(event) {
        event.preventDefault();
        let base_url = `${window.location.origin}/api/get-marvel-omnis`;

        HttpService.post(base_url).then(resp => {
            console.log(resp.success);
            console.log(resp.data);
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    return (
        <>
        <LoginForm />
        <button className="admin-page-btn" onClick={e => logoutClicked(e)}>Logout</button>
        <div className="admin-btn-panel">
            <button className="admin-page-btn" onClick={e => checkAuth(e)}>Check Auth</button>
            <button className="admin-page-btn" onClick={e => pageChange(e)}>Test Page Change</button>
            <button className="admin-page-btn" onClick={e => getMarvelOmnis(e)}>Get Marvel Omnis</button>
            <button className="admin-page-btn" onClick={e => testMarvelApi(e)}>Test Marvel Api</button>
        </div>
        </>
    );
}

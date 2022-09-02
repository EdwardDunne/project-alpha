import React, { Component, useState } from "react";
import ApiService from "../services/ApiService.js";


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

export default function AdminTest() {

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    function loginClicked(event) {
        event.preventDefault();
        let base_url = `${window.location.origin}/api/login`

        let data = {
            username: username,
            password: password,
        };

        ApiService.post(base_url, data).then(resp => {
            alert(resp.resp);
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    function logoutClicked(event) {
        event.preventDefault();
        let base_url = `${window.location.origin}/api/logout`

        let data = {
            username: username,
            password: password,
        };

        ApiService.post(base_url, data).then(resp => {
            alert(resp.resp);
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
            <input type="submit" value="Login" style={LOGIN_BTN_STYLES}/>
        </form>
        <button style={LOGIN_BTN_STYLES} onClick={e => logoutClicked(e)}>Logout</button>
        </>
    );
}

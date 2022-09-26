import React, { Component, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import httpUtil from '../utils/httpUtil';

export default function AdminTest(props) {

    let navigate = useNavigate();

    function pageChange(event) {
        navigate('/');
    }

    const testMarvelApi = async (event) => {
        event.preventDefault();
        const config = {
            headers: httpUtil.get_headers('GET')
        };

        const res = await axios.get(`${window.location.origin}/api/test-marvel`, config);
        console.log(res);
    }

    const getMarvelOmnis = async (event) => {
        event.preventDefault();
        const config = {
            headers: httpUtil.get_headers('GET')
        };

        const res = await axios.get(`${window.location.origin}/api/get-marvel-omnis`, config);
        console.log(res);
    }

    return (
        <>
        <div className="admin-btn-panel">
            <button className="admin-page-btn" onClick={e => pageChange(e)}>Test Page Change</button>
            <button className="admin-page-btn" onClick={e => getMarvelOmnis(e)}>Get Marvel Omnis</button>
            <button className="admin-page-btn" onClick={e => testMarvelApi(e)}>Test Marvel Api</button>
        </div>
        </>
    );
}

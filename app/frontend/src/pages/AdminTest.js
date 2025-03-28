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
        {/* <div className="leftside-menu menuitem-active" style={{"padding": "0px"}}>
            <ul className="side-nav">
                <li className="side-nav-title side-nav-item">Navigation</li>
            </ul>   
        </div> */}
        <div className="admin-btn-panel">
            <button className="btn btn-primary m-3" onClick={e => pageChange(e)}>Test Page Change</button>
            <button className="btn btn-primary m-3" onClick={e => getMarvelOmnis(e)}>Get Marvel Omnis</button>
            <button className="btn btn-primary m-3" onClick={e => testMarvelApi(e)}>Test Marvel Api</button>
        </div>
        <div className="card" style={{"width": "18rem"}}>
            <img src="http://i.annihil.us/u/prod/marvel/i/mg/b/c0/5bae4da3e1237.jpg" className="card-img-top" alt="..." />
            <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" className="btn btn-primary">Go somewhere</a>
            </div>
        </div>
        <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Primary</button>
        <div className="dropdown-menu">
            <li><a className="dropdown-item" href="#">Action</a></li>
            <li><a className="dropdown-item" href="#">Another action</a></li>
            <li><a className="dropdown-item" href="#">Something else here</a></li>
        </div>
        <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Dropdown button
            </button>
            <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Action</a></li>
                <li><a className="dropdown-item" href="#">Another action</a></li>
                <li><a className="dropdown-item" href="#">Something else here</a></li>
            </ul>
        </div>
        <div className="card widget-flat">
            <div className="card-body">
                <div className="float-end">
                    <i className="mdi mdi-pulse widget-icon"></i>
                </div>
                <h5 className="text-muted fw-normal mt-0" title="Growth">Growth</h5>
                <h3 className="mt-3 mb-3">+ 30.56%</h3>
                <p className="mb-0 text-muted">
                    <span className="text-success me-2">
                        <i className="mdi mdi-arrow-up-bold"></i> 4.87%</span>
                    <span className="text-nowrap">Since last month</span>
                </p>
            </div>
        </div>

        <div className="card text-white bg-info overflow-hidden">
            <div className="card-body">
                <div className="toll-free-box text-center">
                    <h4> <i className="mdi mdi-deskphone"></i> Toll Free : 1-234-567-8901</h4>
                </div>
            </div> 
        </div>
        </>
    );
}

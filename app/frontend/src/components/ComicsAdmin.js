import React, { Component, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import httpUtil from '../utils/httpUtil';

export default function ComicsAdmin(props) {

    let navigate = useNavigate();

    const [marvelOmnis, setMarvelOmnis] = useState([]);

    useEffect(() => {
      console.log(marvelOmnis);
    }, [marvelOmnis])
    

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
        setMarvelOmnis(res.data.books);
    }

    return (
        <>
        <div className="content-page">
            <div className="content">

                {/* Start Content */}
                <div className="container-fluid">

                    {/* start page title */}
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box">
                                <h4 className="page-title">Comics Admin</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="admin-btn-panel">
                            <button className="btn btn-primary m-3" onClick={e => pageChange(e)}>Test Page Change</button>
                            <button className="btn btn-primary m-3" onClick={e => getMarvelOmnis(e)}>Get Marvel Omnis</button>
                            <button className="btn btn-primary m-3" onClick={e => testMarvelApi(e)}>Test Marvel Api</button>
                        </div>
                    </div>
                    <div className="row">
                        {marvelOmnis.map((book, i) => {
                        const imgUrl = book.thumbnail.path + '.' + book.thumbnail.extension;
                        return (
                            <div className="card omni-list-card" key={i}>
                                <div className="row g-0 align-items-center">
                                    <div className="col-md-4">
                                        <img src={imgUrl} className="card-img" alt="..."/>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title">{book.title}</h5>
                                            <p className="card-text">{book.description}</p>
                                            {/* <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p> */}
                                        </div>
                                    </div>
                                </div>
                            </div>)
                        })}
                    </div>
                    {/* end page title */}
                    
                </div> 
                {/* container */}

            </div> 
            {/* content */}

            {/* Footer Start */}
            <footer className="footer">
                <div className="container-fluid">
                    <div className="row">
                    </div>
                </div>
            </footer>
            {/* end Footer */}

        </div>
        </>
    );
}

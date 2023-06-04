import React from 'react'
import { Link } from "react-router-dom";
import HttpService from "../services/HttpService.js";
import Auth from "../services/Auth.js";
import { useNavigate } from 'react-router-dom';

export default function Header() {

  let navigate = useNavigate();

  return (
    <>
    <div id="header">
      <div id="header-left">
        <div className="header-btn" onClick={e => navigate('/admin-test')}>Admin Test</div>
        <div className="header-btn" onClick={e => navigate('/')}>Hex Homepage</div>
        <div className="header-btn" onClick={e => navigate('/login')}>Login</div>
        <div className="header-btn" onClick={e => navigate('/register')}>Register</div>
      </div>
      <div id="header-right">
        <div id="sign-in-btn" className="header-btn">SIGN IN</div>
      </div>
    </div>
    </>
  )
}


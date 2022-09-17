import React from 'react'
import { Link } from "react-router-dom";
import HttpService from "../services/HttpService.js";
import Auth from "../services/Auth.js";
import { useNavigate } from 'react-router-dom';

export default function Header() {

  let navigate = useNavigate();

  // Check if this session is already authenticated
  let login_url = `${window.location.origin}/api/login`
  HttpService.post(login_url).then(resp => {
    console.log(resp.success);
    if(resp.success)
        Auth.login();
  }).catch((error) => {
      console.error('Error:', error);
  });

  function pageChange(page) {
    switch(page){
      case 'admin':
        navigate('/admin-test');
        break;
      case 'home':
        navigate('/');
        break;
    }
  }

  return (
    <>
    <div id="header">
      <div id="header-left">
        {/* <Link to="/admin-test">Admin Test</Link>
        <Link to="/">Hex Homepage</Link> */}
        <div className="header-btn" onClick={e => pageChange('admin')}>Admin Test</div>
        <div className="header-btn" onClick={e => pageChange('home')}>Hex Homepage</div>
      </div>
      <div id="header-right">
        <div id="sign-in-btn" className="header-btn">SIGN IN</div>
      </div>
    </div>
    </>
  )
}


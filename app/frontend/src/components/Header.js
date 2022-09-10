import React from 'react'
import { Link } from "react-router-dom";
import ApiService from "../services/ApiService.js";
import Auth from "../services/Auth.js";

export default function Header() {

  // Check if this session is already authenticated
  let login_url = `${window.location.origin}/api/login`
  ApiService.post(login_url).then(resp => {
    console.log(resp.success);
    if(resp.success)
        Auth.login();
  }).catch((error) => {
      console.error('Error:', error);
  });

  return (
    <>
    <div id="header">
      <div id="header-left">
        <Link to="/admin-test">Admin Test</Link>
        <Link to="/">Hex Homepage</Link>
      </div>
      <div id="header-right">
        <div id="sign-in-btn">SIGN IN</div>
      </div>
    </div>
    </>
  )
}


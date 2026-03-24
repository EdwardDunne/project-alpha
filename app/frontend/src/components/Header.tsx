import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function Header() {

  let navigate = useNavigate();

  return (
    <>
    <div id="header">
      <div id="header-left">
        <div className="header-btn" onClick={() => navigate('/admin-test')}>Admin Test</div>
        <div className="header-btn" onClick={() => navigate('/')}>Hex Homepage</div>
        <div className="header-btn" onClick={() => navigate('/login')}>Login</div>
        <div className="header-btn" onClick={() => navigate('/register')}>Register</div>
      </div>
      <div id="header-right">
        <div id="sign-in-btn" className="header-btn">SIGN IN</div>
      </div>
    </div>
    </>
  )
}

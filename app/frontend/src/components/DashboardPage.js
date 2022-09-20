import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { register } from '../actions/auth';
import CSRFToken from './CSRFToken';

const DashboardPage = () => {

    return (
        <div className='container mt-5'>
            Dashboard
        </div>
    );
}

export default DashboardPage

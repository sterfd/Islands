import React from 'react';
import { Link } from 'react-router-dom';

export default function User() {

    return (
        <div className='sub-menu'>
            <p>User Auth Page</p>
            <Link className='main' style={{ textDecoration: 'none' }} to='/'>Main Menu
            </Link>
        </div>
    );

}
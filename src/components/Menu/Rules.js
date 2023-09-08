import React from 'react';
import { Link } from 'react-router-dom';

export default function Rules() {
    return (
        <div className='main-menu'>
            <p>These are the Rules</p>
            <Link className='main' style={{ textDecoration: 'none' }} to='/'>Main Menu
            </Link>
        </div>
    );

}
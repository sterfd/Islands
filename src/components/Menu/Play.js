import React from 'react';
import { Link } from 'react-router-dom';

export default function Play() {
    return (
        <div className='main-menu'>
            <h2>Choose a board size:</h2>
            <div className='flexbox'>
                <Link className='main size' style={{ textDecoration: 'none' }} to='/Game' state={{ size: 5 }}>
                    5
                </Link>
                <Link className='main size' style={{ textDecoration: 'none' }} to='/Game' state={{ size: 7 }}>
                    7
                </Link>
                <Link className='main size' style={{ textDecoration: 'none' }} to='/Game' state={{ size: 9 }}>
                    9
                </Link>
            </div>
            <Link className='main' style={{ textDecoration: 'none' }} to='/'>Main Menu
            </Link>
        </div>
    );

} 
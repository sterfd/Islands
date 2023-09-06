import React from 'react';
import { Link } from 'react-router-dom';

export default function Play() {
    return (
        <div className='main-menu'>
            <div className='flexbox'>
                <Link className='main size' style={{ textDecoration: 'none' }} to='/Game'>
                    5
                </Link>
                <Link className='main size' style={{ textDecoration: 'none' }} to='/Game'>
                    7
                </Link>
                <Link className='main size' style={{ textDecoration: 'none' }} to='/Game'>
                    9
                </Link>
            </div>
        </div>
    );

}
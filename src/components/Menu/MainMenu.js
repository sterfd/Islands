import React from 'react';
import logo from '../../images/logo-o.png';
import { Link } from 'react-router-dom';

export default function MainMenu() {
    return (
        <div className='homepage'>
            <div className='main-menu'>
                <img className='logo' src={logo} alt=''></img>
                <Link className='main play' style={{ textDecoration: 'none' }} to='/Play'>
                    Play
                </Link>
                <Link className='main rule' style={{ textDecoration: 'none' }} to='/Tutorial'>
                    Rules
                </Link>
                <Link className='main user' style={{ textDecoration: 'none' }} to='/User'>
                    User
                </Link>
                <Link className='main about' style={{ textDecoration: 'none' }} to='/About'>
                    About
                </Link>
            </div>
        </div>
    );

}
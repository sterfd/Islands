import React from 'react';
import { Link } from 'react-router-dom';


export default function About() {
    return (
        <div className='sub-menu'>
            <p>This game is based on Nurikabe by the publisher Nikoli!</p>
            <p>A fun project made in React by sterfd.</p>
            <Link className='main' style={{ textDecoration: 'none' }} to='/'>Main Menu
            </Link>
        </div>
    );

}
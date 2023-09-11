import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

export function Overlay({ isOpen, time, id, currentSize, playAgain }) {
    return (
        <Fragment>
            {isOpen && (
                <div className='overlay'>
                    <div className='overlay-background' />
                    <div className='overlay-container'>
                        <button className='overlay-close' />
                        <p className='status'>Congratulations on solving the puzzle #{id} in {time} seconds!</p>
                        <p className='status'>The average solve time is: </p>
                        <div className='overlay-box'>
                            <Link className='main winning' style={{ textDecoration: 'none' }} to='/'>Main Menu
                            </Link>
                            <button className='main winning' onClick={() => playAgain(currentSize)}>
                                Play Again
                            </button>
                        </div>
                    </div>
                </div>
            )};
        </Fragment>
    );
}
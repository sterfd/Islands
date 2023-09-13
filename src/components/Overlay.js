import React from 'react';
import { Link } from 'react-router-dom';

export function Overlay({ isOpen, time, id, currentSize, playAgain }) {
    const hours = Math.floor((time / 3600));
    const minutes = Math.floor((time / 60));
    const modSeconds = time % 60;

    let timeMessage;
    if (hours > 0) {
        timeMessage = hours + ' hours, ' + minutes + ' minutes, and ' + modSeconds + ' seconds!'
    } else if (minutes > 0) {
        timeMessage = minutes + ' minutes and ' + modSeconds + ' seconds!'
    } else {
        timeMessage = time + ' seconds!'
    }

    return (
        <div>
            {isOpen && (
                <div className='overlay'>
                    <div className='overlay-background' />
                    <div className='overlay-container'>
                        <button className='overlay-close' />
                        <p className='status'>Congratulations on solving the puzzle #{id} in {timeMessage}</p>
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
        </div>
    );
}
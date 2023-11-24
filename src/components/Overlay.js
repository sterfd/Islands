import React from 'react';
import { Link } from 'react-router-dom';

export function Overlay({ isOpen, time, currentSize, playAgain, averageTime }) {
    if (!isOpen) {
        return null;
    }

    function convertTime(seconds) {
        let timeMessage;
        if (seconds < 60) {
            timeMessage = Math.floor(seconds) + ' seconds';
        } else if (seconds < 3600) {
            timeMessage = Math.floor(seconds / 60) + ' minutes and ' + Math.floor(seconds % 60) + ' seconds';
        } else {
            timeMessage = Math.floor(seconds / 3600) + ' hours, ' + Math.floor(seconds / 60) + ' minutes and ' + Math.floor(seconds % 60) + ' seconds';
        }
        return timeMessage

    }

    let avgTimeMessage;
    if (averageTime === 0) {
        avgTimeMessage = 'You are the first one to solve this puzzle!';
    } else {
        avgTimeMessage = 'The average solve time is: ' + convertTime(averageTime) + '!'
    }

    return (
        <div>
            {isOpen && (
                <div>
                    <div className='overlay-background' />
                    <div className='overlay-container'>
                        <p className='status'>Congratulations on solving the puzzle in {convertTime(time)}</p>
                        <p className='status'>{avgTimeMessage}</p>
                        <div className='overlay-button-box'>
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

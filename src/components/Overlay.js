import React from 'react';
import { Link } from 'react-router-dom';

export function Overlay({ isOpen, time, currentSize, playAgain, averageTime }) {
    if (!isOpen) {
        return null;
    }

    const avgTime = averageTime;
    const hours = Math.floor((time / 3600));
    const minutes = Math.floor((time / 60));
    const modSeconds = time % 60;

    let timeMessage;
    if (hours > 0) {
        timeMessage = hours + ' hours, ' + minutes + ' minutes, and ' + modSeconds + ' seconds!';
    } else if (minutes > 0) {
        timeMessage = minutes + ' minutes and ' + modSeconds + ' seconds!';
    } else {
        timeMessage = time + ' seconds!';
    }

    let avgTimeMessage;
    if (avgTime === 0) {
        avgTimeMessage = 'You are the first one to solve this puzzle!';
    } else if (Math.floor((avgTime / 3600)) > 0) {
        avgTimeMessage = 'The average solve time is: ' + Math.floor((avgTime / 3600)) + ' hours, ' + Math.floor((avgTime / 60)) + ' minutes, and ' + avgTime % 60 + ' seconds!';
    } else if (Math.floor((avgTime / 60)) > 0) {
        avgTimeMessage = 'The average solve time is: ' + Math.floor((avgTime / 60)) + ' minutes, and ' + avgTime % 60 + ' seconds!';
    } else {
        avgTimeMessage = 'The average solve time is: ' + avgTime + ' seconds!'
    }

    return (
        <div>
            {isOpen && (
                <div>
                    <div className='overlay-background' />
                    <div className='overlay-container'>
                        <p className='status'>Congratulations on solving the puzzle in {timeMessage}</p>
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

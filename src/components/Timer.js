import React, { useState, useEffect } from 'react';

// keep timer in status bar
// timer starts when first square is clicked
// timer restarts if restart or new game button is clicked
// timer stops when game is solved

export function Timer(isRunning, isReset) {
    const [time, setTime] = useState(0);
    // console.log('timer change', isRunning, isReset);
    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else if (!isRunning) {
            clearInterval(interval);
            if (isReset) {
                setTime(0);
            }
        }
        return () => clearInterval(interval);
    }, [isRunning, isReset]);

    //isTiming - running true
    //resetTimer - running false setTime 0


    const hours = Math.floor((time / 3600) % 60);
    const minutes = Math.floor((time / 60) % 60);
    const seconds = Math.floor(time % 60);

    return (
        <div>
            <div className='timer'>
                <span>{('0' + hours).slice(-2)}:</span>
                <span>{('0' + minutes).slice(-2)}:</span>
                <span>{('0' + seconds).slice(-2)}</span>
            </div>
            {/* <div>
                <button onClick={() => setRunning(true)}>Start</button>
                <button onClick={() => setRunning(false)}>Stop</button>
                <button onClick={() => setTime(0)}>Reset</button>
            </div> */}
        </div>
    );
};

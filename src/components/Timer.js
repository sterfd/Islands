import React from 'react';

export function Timer({ seconds }) {
    const hours = Math.floor((seconds / 3600));
    const minutes = Math.floor((seconds / 60));
    const modSeconds = seconds % 60;

    return (
        <div>
            <div className='status'>
                <span>{('0' + hours).slice(-2)}:</span>
                <span>{('0' + minutes).slice(-2)}:</span>
                <span>{('0' + modSeconds).slice(-2)}</span>
            </div>
        </div>
    );
};

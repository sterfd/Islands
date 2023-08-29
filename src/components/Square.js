import React from 'react';

export function Square({ value, onSquareClick }) {
    if (value === 0) {
        return <button
            className='water square' onClick={onSquareClick} onContextMenu={onSquareClick}></button>;
    } else if (value === -1) {
        return <button
            className='land square' onClick={onSquareClick} onContextMenu={onSquareClick}></button>;
    } else if (value === -2) {
        return <button
            className='tile square' onClick={onSquareClick} onContextMenu={onSquareClick}></button >;
    } else {
        return <button
            className='land square' onClick={onSquareClick} onContextMenu={onSquareClick}>{value}</button>;
    }
}

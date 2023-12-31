import React from 'react';

export function Square({ value, onSquareClick }) {
    let squareClass = 'land square';

    if (value === 0) {
        squareClass = 'water square';
    } else if (value === -2) {
        squareClass = 'tile square';
    }
    return (
        <button className={squareClass} onClick={onSquareClick} onContextMenu={onSquareClick}>
            {(value > 0) ? value : null}</button>
    )
}

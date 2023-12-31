import React from 'react';
import _ from 'lodash'; // deep copying arrays
import { Square } from './Square';

export function Board({ squares, onPlay, isComplete }) {
    function handleClick(event, row, col) {
        event.preventDefault();
        if (isComplete || squares[row][col] > 0) {
            return;
        }

        const nextSquares = _.cloneDeep(squares);
        const clickMapping = { 0: [-2, 0, -1], '-1': [0, 0, -2], '-2': [-1, 0, 0] };
        const nextState = clickMapping[squares[row][col]];

        if (event.button === 0 || event.button === 2) {
            const nextSquareValue = nextState[event.button];
            nextSquares[row][col] = nextSquareValue;
            onPlay(nextSquares);
        }
    }

    return (
        <div className='board-area'>
            <div>
                {squares.map((row, rowIndex) => (
                    <div className='board-row' key={rowIndex}>
                        {row.map((value, colIndex) => (
                            <Square key={colIndex} value={value} onSquareClick={(event) => handleClick(event, rowIndex, colIndex)} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

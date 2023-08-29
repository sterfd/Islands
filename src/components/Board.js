import React from 'react';
import { Square } from './Square';

export function Board({ squares, onPlay, solution }) {
    function checkWinner(squares, solution) {
        const squaresString = JSON.stringify(squares);
        const solutionString = JSON.stringify(solution);
        if (squaresString === solutionString) {
            return true;
        } else {
            return false;
        }
    }

    function handleClick(event, row, col) {
        event.preventDefault();
        if (winning || squares[row][col] > 0) {
            return;
        }

        const nextSquares = [...squares];
        const clickMapping = { 0: [-2, 0, -1], '-1': [0, 0, -2], '-2': [-1, 0, 0] };
        const nextState = clickMapping[squares[row][col]];

        if (event.button === 0 || event.button === 2) {
            const nextSquareValue = nextState[event.button];
            nextSquares[row][col] = nextSquareValue;
            onPlay(nextSquares);
        }
    }

    const winning = checkWinner(squares, solution);
    let status;
    if (winning) {
        status = 'WINNER';
    }

    return (
        <div className='board-area'>
            <div className='status'>{status}</div>
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

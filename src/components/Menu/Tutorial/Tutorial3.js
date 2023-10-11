import React from 'react';
import { useState } from 'react';
import './Tutorial.css';
import _ from 'lodash';
import { TutSquare } from './TutSquare';

export function Tutorial3({ isVisible, toggleIndex }) {
    const start = [[[1, -2, -2], [-2, -2, 2]], [[1, 0, -1], [0, 0, 2]]];
    const [squares, setSquares] = useState(start[0]);
    const [isComplete, setIsComplete] = useState(false);

    function handleClick(event, rowIndex, colIndex) {
        event.preventDefault();
        if (isComplete) {
            return;
        }

        const nextSquares = _.cloneDeep(squares);
        const clickMapping = { 0: [-2, 0, -1], '-1': [0, 0, -2], '-2': [-1, 0, 0], '-4': [0, 0, -2] };
        const nextState = clickMapping[squares[rowIndex][colIndex]];

        if (event.button === 0 || event.button === 2) {
            const nextSquareValue = nextState[event.button];
            nextSquares[rowIndex][colIndex] = nextSquareValue;
            setSquares(nextSquares);
            checkComplete(nextSquares);
            checkStatus();
            setTimeout(() => {
                checkError(nextSquares);
            }, 1000);
        }
    }

    function checkComplete(nextSquares) {
        const squareString = JSON.stringify(nextSquares);
        const complete = JSON.stringify(start[1]);
        if (squareString === complete) {
            setIsComplete(true);
            const command = document.getElementById('command');
            command.className = 'fadeout';
            setTimeout(() => {
                command.className = 'fade1'
                command.textContent = 'Nice!';
            }, 1000);
            setTimeout(() => {
                toggleIndex();
            }, 2500);
        }
    }

    function checkStatus() {
        const status = document.getElementById('status');
        if (status.className === 'fade1') {
            status.className = 'fadeout';
        }
    }

    function checkError(nextSquares) {
        if ((nextSquares[1][1] === -1) && (nextSquares[1][0] === 0)) {
            const status = document.getElementById('status');
            status.className = 'fade1';
            status.textContent = 'Water is not connected';
            const nextNext = _.cloneDeep(nextSquares);
            nextNext[1][1] = -4;
            setSquares(nextNext);
        }
    }

    return (isVisible === 2) ? (
        <div className='tut-exp'>
            <h1 className='fade1' id='i1'>The entire body of water must be connected</h1>
            <h1 className='fade2' id='command'>Solve the following!</h1>
            <h1 id='status'><br></br></h1>
            <div className='tut-board fade2'>
                {squares.map((row, rowIndex) => (
                    <div className='tut-board-row' key={rowIndex}>
                        {row.map((value, colIndex) => (
                            <TutSquare key={colIndex} value={value} onSquareClick={(event) => handleClick(event, rowIndex, colIndex)} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    ) : null;
}

import React, { useState, useEffect } from 'react';
import _ from 'lodash'; // deep copying arrays
import { NewGame } from './NewGame';
import { Square } from './Square';

function Board({ squares, onPlay, isComplete }) {
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
            {/* <div className='status'>{status}</div> */}
            <div>
                {squares.map((row, rowIndex) => (
                    <div className='board-row' key={rowIndex}>
                        {row.map((cellValue, colIndex) => (
                            <Square key={colIndex} value={cellValue} onSquareClick={(event) => handleClick(event, rowIndex, colIndex)} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function Game() {
    const [startingBoard, setStartingBoard] = useState([]);
    const [solutionBoard, setSolutionBoard] = useState([]);
    const [isComplete, setIsComplete] = useState(false);
    const [history, setHistory] = useState([[]]);
    const [currentMove, setCurrentMove] = useState(0);
    const [currentSquares, setCurrentSquares] = useState(history[currentMove]);

    function handlePlay(nextSquares) {
        const historyCopy = _.cloneDeep(history);
        const nextHistory = [...historyCopy, nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(lastMove) {
        if (lastMove > -1) {
            setCurrentMove(lastMove);
            const historyCopy = _.cloneDeep(history);
            const nextHistory = [...historyCopy.slice(0, lastMove + 1)];
            setHistory(nextHistory);
        }
    }

    function restartGame() {
        setCurrentMove(0);
        setHistory(_.cloneDeep([startingBoard]));
    }

    async function getNewGame() {
        const { starting, solution } = await NewGame();
        const startingCopy = _.cloneDeep(starting);
        setStartingBoard(starting);
        setSolutionBoard(solution);
        setHistory([startingCopy]);
        setCurrentMove(0);
    }

    function checkWinner() {
        const squaresString = JSON.stringify(currentSquares);
        const solutionString = JSON.stringify(solutionBoard);
        if (squaresString === solutionString) {
            setIsComplete(true);
        } else {
            setIsComplete(false);
        }
    }

    useEffect(() => {
        getNewGame();
    }, []);

    useEffect(() => {
        checkWinner();
    }, [currentSquares]);

    useEffect(() => {
        setCurrentSquares(history[currentMove]);
    }, [currentMove, history]);

    return (
        <div className='game'>
            <div className='game-board'>
                <Board squares={currentSquares} onPlay={handlePlay} isComplete={isComplete} />
            </div>
            <div className='game-menu'>
                <button className='menu restart' onClick={() => restartGame()}>Restart</button>
                <button className='menu new-game' onClick={() => getNewGame()}>New Game</button>
                <button className='menu undo' onClick={() => jumpTo(currentMove - 1)}>Undo</button>
                <button className='menu check'>Check</button>
                <button className='menu rules'>Rules</button>
                <button className='menu home'>Home</button>
            </div>
            <p>{currentMove}</p>
        </div>
    );
}

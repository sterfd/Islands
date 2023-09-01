import React, { useState, useEffect } from 'react';
import _ from 'lodash'; // deep copying arrays
import { Board } from './Board';
import { NewGame } from './NewGame';
import { Timer } from './Timer';

export function Game() {
    const [squares, setSquares] = useState([]);
    const [startingBoard, setStartingBoard] = useState([]);
    const [solutionBoard, setSolutionBoard] = useState([]);
    const [isTimerRunning, setTimerRunning] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    function handlePlay(nextSquares) {
        setSquares(nextSquares);
        if (!isTimerRunning) {
            setTimerRunning(true);
        }
    }

    function restartGame(startingBoard) {
        const startingCopy = _.cloneDeep(startingBoard);
        setSquares(startingCopy);
        setTimerRunning(false);
        setSeconds(0);
    }

    async function getNewGame() {
        const { starting, solution } = await NewGame();
        setStartingBoard(starting);
        setSolutionBoard(solution);
        setSquares(_.cloneDeep(starting));
        setTimerRunning(false);
        setSeconds(0);
    }

    function checkWinner() {
        const squaresString = JSON.stringify(squares);
        const solutionString = JSON.stringify(solutionBoard);
        if (squaresString === solutionString) {
            setIsComplete(true);
            setTimerRunning(false);
        } else {
            setIsComplete(false);
        }
    }

    useEffect(() => {
        getNewGame()
    }, []);

    useEffect(() => {
        let interval;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds + 1);
            }, 1000);
        } else if (!isTimerRunning) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    useEffect(() => {
        checkWinner();
    }, [squares]);

    return (
        <div className='game'>
            <div className='status'>
                <Timer seconds={seconds} />
            </div>
            <div className='game-board'>
                <Board squares={squares} onPlay={handlePlay} isComplete={isComplete} />
            </div>
            <div className='game-menu'>
                <button className='menu restart' onClick={() => restartGame(startingBoard)}>Restart</button>
                <button className='menu new-game' onClick={() => getNewGame()}>New Game</button>
                <button className='menu undo'>Undo</button>
                <button className='menu check'>Check</button>
                <button className='menu rules'>Rules</button>
                <button className='menu home'>Home</button>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import _ from 'lodash'; // deep copying arrays
import { Board } from './Board';
import { NewGame } from './NewGame';
import { Timer } from './Timer';

export function Game() {
    // const [squares, setSquares] = useState([]);
    const [startingBoard, setStartingBoard] = useState([]);
    const [solutionBoard, setSolutionBoard] = useState([]);
    const [isTimerRunning, setTimerRunning] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [history, setHistory] = useState([[]]);
    const [currentMove, setCurrentMove] = useState(0);
    const [currentSquares, setCurrentSquares] = useState(history[currentMove]);

    function handlePlay(nextSquares) {
        const historyCopy = _.cloneDeep(history);
        const nextHistory = [...historyCopy, nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        if (!isTimerRunning) {
            setTimerRunning(true);
        }
    }

    function jumpTo(lastMove) {
        if (lastMove > -1 && !isComplete) {
            setCurrentMove(lastMove);
            const historyCopy = _.cloneDeep(history);
            const nextHistory = [...historyCopy.slice(0, lastMove + 1)];
            setHistory(nextHistory);
        }
    }

    function restartGame(startingBoard) {
        setCurrentMove(0);
        setHistory(_.cloneDeep([startingBoard]));
        setTimerRunning(false);
        setSeconds(0);
    }

    async function getNewGame() {
        const { starting, solution } = await NewGame();
        const startingCopy = _.cloneDeep(starting);
        setStartingBoard(starting);
        setSolutionBoard(solution);
        setHistory([startingCopy]);
        setCurrentMove(0);
        setTimerRunning(false);
        setSeconds(0);
    }

    function checkWinner() {
        const squaresString = JSON.stringify(currentSquares);
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
    }, [currentSquares]);

    useEffect(() => {
        setCurrentSquares(history[currentMove]);
    }, [currentMove, history]);

    return (
        <div className='game'>
            <div className='status'>
                <Timer seconds={seconds} />
            </div>
            <div className='game-board'>
                <Board squares={currentSquares} onPlay={handlePlay} isComplete={isComplete} />
            </div>
            <div className='game-menu'>
                <button className='menu restart' onClick={() => restartGame(startingBoard)}>Restart</button>
                <button className='menu new-game' onClick={() => getNewGame()}>New Game</button>
                <button className='menu undo' onClick={() => jumpTo(currentMove - 1)}>Undo</button>
                <button className='menu check'>Check</button>
                <button className='menu rules'>Rules</button>
                <button className='menu home'>Home</button>
            </div>
        </div>
    );
}

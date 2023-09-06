import React, { useState, useEffect } from 'react';
import _ from 'lodash'; // deep copying arrays
import { Board } from './Board';
import { NewGame } from './NewGame';
import { Timer } from './Timer';
import { Link } from 'react-router-dom';
import home from '../images/home-button.png';
import restart from '../images/restart-button.png';
import newGameButton from '../images/new-button.png';
import undoButton from '../images/undo-button.png';
import checkButton from '../images/check-button.png';
import rules from '../images/rules-button.png';


export default function Game() {
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

    // function checkWinner() {
    //     const squaresString = JSON.stringify(currentSquares);
    //     const solutionString = JSON.stringify(solutionBoard);
    //     if (squaresString === solutionString) {
    //         setIsComplete(true);
    //         setTimerRunning(false);
    //     } else {
    //         setIsComplete(false);
    //     }
    // }

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
        const squaresString = JSON.stringify(currentSquares);
        const solutionString = JSON.stringify(solutionBoard);
        if (squaresString === solutionString) {
            setIsComplete(true);
            setTimerRunning(false);
        } else {
            setIsComplete(false);
        }
    }, [currentSquares, solutionBoard]);

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
                <Link style={{ textDecoration: 'none' }} to='/MainMenu'>
                    <button className='bar'>
                        <img className='home' src={home} alt=''></img>
                    </button>
                </Link>
                <button className='bar' onClick={() => restartGame(startingBoard)}>
                    <img className='restart' src={restart} alt=''></img>
                </button>
                <button className='bar' onClick={() => getNewGame()}>
                    <img className='new' src={newGameButton} alt=''></img>
                </button>
                <button className='bar' onClick={() => jumpTo(currentMove - 1)}>
                    <img className='undo' src={undoButton} alt=''></img>
                </button>
                <button className='bar'>
                    <img className='check' src={checkButton} alt=''></img>
                </button>
                <button className='bar'>
                    <img className='rules' src={rules} alt=''></img>
                </button>
            </div>
        </div>
    );
}

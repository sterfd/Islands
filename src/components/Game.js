import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import _ from 'lodash'; // deep copying arrays
import { Board } from './Board';
import { NewGame } from './NewGame';
import { Timer } from './Timer';
import { PostGame } from './PostGame';
import home from '../images/home-button.png';
import restart from '../images/restart-button.png';
import undoButton from '../images/undo-button.png';
import checkButton from '../images/check-button.png';
import rules from '../images/rules-button.png';


export default function Game() {
    const [puzzleID, setPuzzleID] = useState(0)
    const [startingBoard, setStartingBoard] = useState([]);
    const [solutionBoard, setSolutionBoard] = useState([]);
    const [isTimerRunning, setTimerRunning] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [history, setHistory] = useState([[]]);
    const [currentMove, setCurrentMove] = useState(0);
    const [currentSquares, setCurrentSquares] = useState(history[currentMove]);
    const { state } = useLocation();
    const boardSize = state.size;

    function handlePlay(nextSquares) {
        const historyCopy = _.cloneDeep(history);
        const nextHistory = [...historyCopy, nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        if (!isTimerRunning) {
            setTimerRunning(true);
        }
        checkWinner(nextSquares);
    }

    function checkWinner(nextSquares) {
        const squaresString = JSON.stringify(nextSquares);
        const solutionString = JSON.stringify(solutionBoard);
        if (squaresString === solutionString && seconds !== 0) {
            setIsComplete(true);
            setTimerRunning(false);
            PostGame(puzzleID, seconds);
        } else {
            setIsComplete(false);
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

    async function getNewGame(size) {
        const { gameID, starting, solution } = await NewGame(size);
        const startingCopy = _.cloneDeep(starting);
        setPuzzleID(gameID);
        setStartingBoard(starting);
        setSolutionBoard(solution);
        setHistory([startingCopy]);
        setCurrentMove(0);
        setTimerRunning(false);
        setSeconds(0);
    }

    useEffect(() => {
        getNewGame(boardSize)
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
                <Link style={{ textDecoration: 'none' }} to='/'>
                    <button className='bar'>
                        <img className='home' src={home} alt=''></img>
                    </button>
                </Link>
                <button className='bar' onClick={() => restartGame(startingBoard)}>
                    <img className='restart' src={restart} alt=''></img>
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

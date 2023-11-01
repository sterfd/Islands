import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import _ from 'lodash'; // deep copying arrays
import { Board } from './Board';
import { NewGame } from './NewGame';
import { Timer } from './Timer';
import { PostGame } from './PostGame';
import { Overlay } from './Overlay';
import { GameMenu } from './GameMenu';
import { Rules } from './Rules';

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
    const [averageTime, setAverageTime] = useState(0);
    const [isRulesOpen, setIsRulesOpen] = useState(false);
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

    function handleJumpTo(lastMove) {
        if (lastMove > -1 && !isComplete) {
            setCurrentMove(lastMove);
            const historyCopy = _.cloneDeep(history);
            const nextHistory = [...historyCopy.slice(0, lastMove + 1)];
            setHistory(nextHistory);
        }
    }

    function handleRestartGame() {
        setCurrentMove(0);
        setHistory(_.cloneDeep([startingBoard]));
        setTimerRunning(false);
        setSeconds(0);
    }

    function handleNewGame(puzzleID, starting, solution, averageSolveTime) {
        const startingCopy = _.cloneDeep(starting);
        setPuzzleID(puzzleID);
        setStartingBoard(starting);
        setSolutionBoard(solution);
        setHistory([startingCopy]);
        setCurrentMove(0);
        setTimerRunning(false);
        setSeconds(0);
        setIsComplete(false);
        setAverageTime(averageSolveTime);
    }

    const toggleRules = () => {
        setIsRulesOpen(!isRulesOpen);
    }

    async function getNewGame() {
        await NewGame(boardSize, handleNewGame);
    }

    useEffect(() => {
        getNewGame();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        let interval;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds + 1);
            }, 1000);
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
            <GameMenu onRestartGame={handleRestartGame} onJumpTo={handleJumpTo} currentMove={currentMove} toggleRules={toggleRules} />
            <Overlay isOpen={isComplete} time={seconds} currentSize={boardSize} playAgain={getNewGame} averageTime={averageTime}></Overlay>
            <Rules isRulesOpen={isRulesOpen} toggleRules={toggleRules} />
        </div>
    );
}